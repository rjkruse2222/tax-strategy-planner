/* ============================================================================
 * PLN PARSER — reads a CCH ProSystem fx Planning ("AccuPlnr") .pln plan file
 * directly in the browser with NO dependencies and NO AI involved. A .pln is a
 * ZIP archive holding three members: FileInfo (plan metadata), FileData (the
 * binary plan database) and <clientid>.log (a text audit log we ignore).
 *
 * The format was reverse-engineered from real 2025.02000 and 2026.01000 plans;
 * the record layout, numeric encoding (IEEE-754 float64 LE), the case/year
 * chunk structure and the summary-grid slot offsets are documented in
 * docs/pln-format-notes.md. A plan is a set of cases, each with one or more
 * year columns; every case-year column decodes to its own {fields, reference}
 * entry. Everything decoded is a data-entry accelerator for the advisor to
 * CONFIRM on a review screen — never an authority. The plan's own computed
 * rows (total income, AGI, taxable income, tax) are returned as reference rows
 * so the advisor can tie the parse to CCH in seconds; the parser checks those
 * rows tie out (AGI = total income - adjustments; taxable = AGI - deduction -
 * QBI; income lines sum to total income; each per-line field must match an
 * independent second location in the file) and omits, with a warning, anything
 * that does not reconcile rather than emit a guessed number.
 *
 * ZIP note: real plans deflate FileData with method 9 (Deflate64 / "Enhanced
 * Deflate"), which DecompressionStream cannot inflate. We therefore bundle a
 * tiny pure-JS INFLATE that handles classic DEFLATE (method 8) and Deflate64
 * (method 9); for method 8 we prefer the platform's DecompressionStream when
 * present and fall back to the bundled inflater otherwise. Stored (method 0)
 * entries are copied. See docs/pln-format-notes.md for the compression caveat.
 * ==========================================================================*/
window.TSIQ = window.TSIQ || {};

(function () {
  'use strict';

  /* -------------------------------------------------------------------------
   * Pure-JS INFLATE — RFC 1951 DEFLATE plus the Deflate64 extensions:
   *   length code 285 = base 3 + 16 extra bits (vs. fixed 258 in DEFLATE),
   *   distance codes 30 & 31 (base 32769 / 49153, 14 extra bits each),
   *   64 KB back-reference window. Output is written straight into a buffer of
   *   the known uncompressed size, so back-references index the output itself.
   * ---------------------------------------------------------------------- */
  function inflateRawJS(input, deflate64, expectedSize) {
    var LBASE = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43,
      51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258];
    var LEXT = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4,
      4, 4, 5, 5, 5, 5, 0];
    var DBASE = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257,
      385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385,
      24577, 32769, 49153];
    var DEXT = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9,
      10, 10, 11, 11, 12, 12, 13, 13, 14, 14];
    if (deflate64) { LBASE = LBASE.slice(); LEXT = LEXT.slice(); LBASE[28] = 3; LEXT[28] = 16; }
    var CLORDER = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];

    var out = expectedSize ? new Uint8Array(expectedSize) : new Uint8Array(1 << 16);
    var outLen = 0;
    function push(b) {
      if (outLen >= out.length) { var n = new Uint8Array(out.length * 2); n.set(out); out = n; }
      out[outLen++] = b;
    }

    var pos = 0, bitBuf = 0, bitCnt = 0;
    function getBit() {
      if (bitCnt === 0) { bitBuf = input[pos++]; bitCnt = 8; }
      var b = bitBuf & 1; bitBuf >>= 1; bitCnt--; return b;
    }
    function getBits(n) {
      var v = 0, i = 0;
      while (i < n) {
        if (bitCnt === 0) { bitBuf = input[pos++]; bitCnt = 8; }
        v |= (bitBuf & 1) << i; bitBuf >>= 1; bitCnt--; i++;
      }
      return v;
    }

    function buildHuff(lengths, n) {
      var MAXBITS = 15, count = new Array(MAXBITS + 1), i;
      for (i = 0; i <= MAXBITS; i++) count[i] = 0;
      for (i = 0; i < n; i++) count[lengths[i]]++;
      count[0] = 0;
      var offs = new Array(MAXBITS + 1); offs[1] = 0;
      for (i = 1; i < MAXBITS; i++) offs[i + 1] = offs[i] + count[i];
      var symbol = new Array(n);
      for (i = 0; i < n; i++) if (lengths[i] !== 0) symbol[offs[lengths[i]]++] = i;
      return { count: count, symbol: symbol };
    }
    function decodeSym(h) {
      var code = 0, first = 0, index = 0, len = 1;
      for (;;) {
        code |= getBit();
        var cnt = h.count[len];
        if (code - first < cnt) return h.symbol[index + (code - first)];
        index += cnt; first += cnt; first <<= 1; code <<= 1; len++;
        if (len > 15) throw new Error('bad huffman code');
      }
    }

    var fixedLit = null, fixedDist = null;
    function buildFixed() {
      var lengths = new Array(288), i;
      for (i = 0; i < 144; i++) lengths[i] = 8;
      for (; i < 256; i++) lengths[i] = 9;
      for (; i < 280; i++) lengths[i] = 7;
      for (; i < 288; i++) lengths[i] = 8;
      fixedLit = buildHuff(lengths, 288);
      var dl = new Array(deflate64 ? 32 : 30);
      for (i = 0; i < dl.length; i++) dl[i] = 5;
      fixedDist = buildHuff(dl, dl.length);
    }

    function inflateBlock(litH, distH) {
      for (;;) {
        var sym = decodeSym(litH);
        if (sym === 256) return;
        if (sym < 256) { push(sym); continue; }
        sym -= 257;
        if (sym >= LBASE.length) throw new Error('bad length symbol');
        var length = LBASE[sym] + getBits(LEXT[sym]);
        var dsym = decodeSym(distH);
        if (dsym >= DBASE.length) throw new Error('bad distance symbol');
        var dist = DBASE[dsym] + getBits(DEXT[dsym]);
        var from = outLen - dist;
        if (from < 0) throw new Error('distance too far back');
        for (var k = 0; k < length; k++) push(out[from + k]);
      }
    }

    var final = 0;
    do {
      final = getBit();
      var type = getBits(2);
      if (type === 0) {
        bitBuf = 0; bitCnt = 0;
        var len = input[pos] | (input[pos + 1] << 8); pos += 4;
        for (var i = 0; i < len; i++) push(input[pos++]);
      } else if (type === 1) {
        if (!fixedLit) buildFixed();
        inflateBlock(fixedLit, fixedDist);
      } else if (type === 2) {
        var hlit = getBits(5) + 257, hdist = getBits(5) + 1, hclen = getBits(4) + 4;
        var clLen = new Array(19), j;
        for (j = 0; j < 19; j++) clLen[j] = 0;
        for (j = 0; j < hclen; j++) clLen[CLORDER[j]] = getBits(3);
        var clH = buildHuff(clLen, 19);
        var lengths = new Array(hlit + hdist), n = 0;
        while (n < hlit + hdist) {
          var s = decodeSym(clH);
          if (s < 16) lengths[n++] = s;
          else if (s === 16) { var r = getBits(2) + 3, prev = lengths[n - 1]; while (r--) lengths[n++] = prev; }
          else if (s === 17) { var r2 = getBits(3) + 3; while (r2--) lengths[n++] = 0; }
          else { var r3 = getBits(7) + 11; while (r3--) lengths[n++] = 0; }
        }
        var litH = buildHuff(lengths.slice(0, hlit), hlit);
        var distH = buildHuff(lengths.slice(hlit, hlit + hdist), hdist);
        inflateBlock(litH, distH);
      } else {
        throw new Error('bad DEFLATE block type');
      }
    } while (!final);

    return outLen === out.length ? out : out.subarray(0, outLen);
  }

  /* -------------------------------------------------------------------------
   * ZIP central-directory reader (no data-descriptor dependence).
   * ---------------------------------------------------------------------- */
  var SIG_EOCD = 0x06054b50, SIG_CEN = 0x02014b50, SIG_LOC = 0x04034b50;

  function u16(b, o) { return b[o] | (b[o + 1] << 8); }
  function u32(b, o) { return (b[o] | (b[o + 1] << 8) | (b[o + 2] << 16) | (b[o + 3] << 24)) >>> 0; }

  function readCentralDirectory(bytes) {
    // EOCD lives in the last ~64KB; scan backwards for its signature.
    var eocd = -1;
    var minStart = Math.max(0, bytes.length - 65557);
    for (var i = bytes.length - 22; i >= minStart; i--) {
      if (u32(bytes, i) === SIG_EOCD) { eocd = i; break; }
    }
    if (eocd < 0) throw new Error('Not a .pln file: no ZIP end-of-central-directory record found.');
    var count = u16(bytes, eocd + 10);
    var cdOff = u32(bytes, eocd + 16);
    var entries = [];
    var p = cdOff;
    for (var e = 0; e < count; e++) {
      if (u32(bytes, p) !== SIG_CEN) break;
      var method = u16(bytes, p + 10);
      var csize = u32(bytes, p + 20);
      var usize = u32(bytes, p + 24);
      var nlen = u16(bytes, p + 28);
      var elen = u16(bytes, p + 30);
      var clen = u16(bytes, p + 32);
      var lho = u32(bytes, p + 42);
      var name = '';
      for (var c = 0; c < nlen; c++) name += String.fromCharCode(bytes[p + 46 + c]);
      entries.push({ name: name, method: method, csize: csize, usize: usize, lho: lho });
      p += 46 + nlen + elen + clen;
    }
    return entries;
  }

  function entryData(bytes, entry) {
    // Recompute the data offset from the LOCAL header (its name/extra lengths
    // can differ from the central directory's).
    var lho = entry.lho;
    if (u32(bytes, lho) !== SIG_LOC) throw new Error('Not a .pln file: bad local ZIP header.');
    var nlen = u16(bytes, lho + 26);
    var elen = u16(bytes, lho + 28);
    var start = lho + 30 + nlen + elen;
    return bytes.subarray(start, start + entry.csize);
  }

  // Inflate one entry -> Promise<Uint8Array>. Prefers DecompressionStream for
  // classic DEFLATE when available; always falls back to the bundled inflater
  // and uses it for Deflate64 (method 9), which DecompressionStream can't do.
  function inflateEntry(bytes, entry) {
    var comp = entryData(bytes, entry);
    if (entry.method === 0) return Promise.resolve(comp.slice());
    if (entry.method === 8 && typeof DecompressionStream !== 'undefined') {
      try {
        var ds = new DecompressionStream('deflate-raw');
        var writer = ds.writable.getWriter();
        writer.write(comp); writer.close();
        var reader = ds.readable.getReader();
        var chunks = [], total = 0;
        var pump = function () {
          return reader.read().then(function (res) {
            if (res.done) {
              var out = new Uint8Array(total), off = 0;
              for (var k = 0; k < chunks.length; k++) { out.set(chunks[k], off); off += chunks[k].length; }
              return out;
            }
            chunks.push(res.value); total += res.value.length; return pump();
          });
        };
        return pump()['catch'](function () { return inflateRawJS(comp, false, entry.usize); });
      } catch (e) { /* fall through to JS */ }
    }
    if (entry.method === 8) return Promise.resolve(inflateRawJS(comp, false, entry.usize));
    if (entry.method === 9) return Promise.resolve(inflateRawJS(comp, true, entry.usize));
    return Promise.reject(new Error('Unsupported ZIP compression method ' + entry.method + ' for ' + entry.name + '.'));
  }

  /* -------------------------------------------------------------------------
   * FileInfo — small metadata member. A short header, then at offset 16 a
   * CRLF-separated "Label:\t<value>" block, then at 0x400 the producer version.
   * ---------------------------------------------------------------------- */
  function parseFileInfo(bytes) {
    var meta = { planName: '', planDescription: '', preparedBy: '', clientId: '',
      taxpayerName: '', spouseName: '', version: '' };
    // Text block: from offset 16 up to the first NUL run.
    var end = 16;
    while (end < bytes.length && end < 0x400 && !(bytes[end] === 0 && bytes[end + 1] === 0)) end++;
    var text = '';
    for (var i = 16; i < end; i++) text += String.fromCharCode(bytes[i]);
    var lines = text.split('\r\n');
    var map = {
      'Plan Name': 'planName', 'Plan Description': 'planDescription',
      'Prepared By': 'preparedBy', 'Client ID': 'clientId',
      'Taxpayer Name': 'taxpayerName', 'Spouse Name': 'spouseName'
    };
    var sawLabel = false;
    for (var l = 0; l < lines.length; l++) {
      var line = lines[l];
      var colon = line.indexOf(':');
      if (colon < 0) continue;
      var label = line.slice(0, colon).replace(/\s+$/, '');
      if (!map.hasOwnProperty(label)) continue;
      sawLabel = true;
      var value = line.slice(colon + 1).replace(/^[\t ]+/, '').replace(/[\t ]+$/, '');
      meta[map[label]] = value;
    }
    if (!sawLabel) throw new Error('Not a .pln file: FileInfo has no recognizable plan header.');
    // Version string at 0x400 (NUL-terminated).
    if (bytes.length >= 0x40a) {
      var v = '';
      for (var o = 0x400; o < 0x400 + 32 && bytes[o] !== 0; o++) v += String.fromCharCode(bytes[o]);
      meta.version = v;
    }
    return meta;
  }

  /* -------------------------------------------------------------------------
   * FileData — a flat stream of records:
   *   [u8 type][u8 sub][u8 00][u32 size LE][payload(size)]
   * Record 0x0e carries screen data; its payload header holds, at +0x20/+0x21,
   * a (caseGroup, caseNum) tag (01,01 = shared template; 02,N = case N) and at
   * +0x24 a u16 screen id. Numbers are IEEE-754 float64 LE.
   * ---------------------------------------------------------------------- */
  function parseRecords(bytes, warnings) {
    var recs = [], off = 0, guard = 0;
    while (off + 7 <= bytes.length) {
      var type = bytes[off], sub = bytes[off + 1], zero = bytes[off + 2];
      var size = u32(bytes, off + 3);
      if (zero !== 0 || off + 7 + size > bytes.length) {
        warnings.push('FileData record stream ended early at byte ' + off + ' (recovered ' + recs.length + ' records).');
        break;
      }
      recs.push({ type: type, sub: sub, size: size, payload: off + 7 });
      off += 7 + size;
      if (++guard > 500000) { warnings.push('FileData record stream guard tripped.'); break; }
    }
    return recs;
  }

  function f64(bytes, o) {
    // DataView on the underlying buffer, honoring the subarray offset.
    return new DataView(bytes.buffer, bytes.byteOffset + o, 8).getFloat64(0, true);
  }

  // Read up to maxLen printable ASCII starting at o (for label sniffing).
  function asciiAt(bytes, o, maxLen) {
    var s = '';
    for (var i = o; i < bytes.length && i < o + maxLen; i++) {
      var c = bytes[i];
      if (c === 0) break;
      if (c < 0x20 || c >= 0x7f) return '';
      s += String.fromCharCode(c);
    }
    return s;
  }

  /* -------------------------------------------------------------------------
   * Plan structure. Every 0x0e record carries a (caseId, yearColumn) tag at
   * payload +0x20/+0x21: caseId 1 is the shared template (labels, activity
   * names, plan config — no values); caseId N>=2 is plan case N-1. yearColumn
   * is the 1-based year-column index the chunk's data occupies (a plan case
   * can have several year columns, each serialized as its own chunk). This
   * layout is IDENTICAL in 2025.02000 and 2026.01000 — a single-case plan
   * with three year columns tags them (2,1)(2,2)(2,3); a three-case plan
   * tags them (2,x)(3,x)(4,x). Verified against the per-chunk case/year
   * settings record (screen id 207), which carries the case caption, year
   * caption and the column's tax year.
   *
   * Within a chunk the records are partitioned into sections by 0x0a marker
   * records: section 0 is the federal plan (input screens + computed
   * worksheets), later sections hold tax-table data and the resident-state
   * plan (which REUSES the same screen ids, so always read section 0).
   * ---------------------------------------------------------------------- */
  var SUMMARY_SCREEN_ID = 3;   // the plan-summary grid screen
  var GRID_BASE = 0x63;        // first double of the summary grid, within payload
  // Validated float64 slot indices within the summary grid (see doc §5).
  // Income lines 0..18 sum (with the Schedule E line, slot 210, and excluding
  // slot 2 = tax-exempt interest) to total income — the identity the parser
  // checks before emitting any per-line income field.
  var SLOT = {
    wages: 0, interest: 1, exemptInterest: 2, dividends: 3, scheduleC: 6,
    capitalGain: 7, otherGains: 10, otherIncome: 17,
    totalIncome: 19, adjustmentsA: 23, agi: 29, adjustments: 34,
    taxableBeforeQbi: 108, deduction: 140, taxableIncome: 141, qbiDeduction: 143,
    ordinaryIncome: 195, scheduleE: 210,
    totalTax: 281
  };
  // Screen ids (federal section) with validated fixed offsets.
  var SCREEN = {
    caseSettings: 207,  // +0x83 u32 tax year; strings: +0x2c7 case caption, +0x2f3 year caption
    taxComputation: 29, // Schedule D tax worksheet: +0xab taxable, +0x10b qual div,
                        // +0x11b net LTCG, +0x123 preferential total, +0x163 ordinary
                        // portion, +0x293 income tax
    seWorksheet: 44,    // +0x193 total self-employment (Schedule C) income
    scheduleA: 35,      // +0x63 property-type taxes, +0x7b income taxes paid,
                        // +0x93 SALT deducted, +0x9b mortgage interest, +0xa3
                        // investment interest, +0xbb interest total, +0xd3
                        // charitable, +0x133 itemized total, +0x14b standard
    taxesPaidInput: 20, // +0x7b state/local income taxes paid, +0x93 mortgage interest
    k1Worksheet: 566,   // per instance: +0xbb activity net income (loss)
    intDivTotals: 675   // +0x63 taxable interest, +0x6b ordinary dividends
  };

  function slot(bytes, payload, idx) {
    var o = payload + GRID_BASE + idx * 8;
    if (o + 8 > bytes.length) return NaN;
    return f64(bytes, o);
  }

  function round2(x) { return Math.round(x * 100) / 100; }
  function near(a, b, tol) { return Math.abs(a - b) <= tol; }

  function f64safe(bytes, o) {
    if (o + 8 > bytes.length) return NaN;
    var v = f64(bytes, o);
    return isFinite(v) ? v : NaN;
  }
  // f64 field inside a record, NaN when out of range.
  function fieldAt(bytes, rec, off) {
    if (!rec || off + 8 > rec.size) return NaN;
    return f64safe(bytes, rec.payload + off);
  }
  // A "[len u8][00][00][text...NUL]" labelled string inside a record.
  function labelAt(bytes, rec, off) {
    if (!rec || off + 4 > rec.size) return '';
    return asciiAt(bytes, rec.payload + off + 3, 60).replace(/\s+$/, '');
  }

  // Group 0x0e records into (caseId, yearColumn) chunks, tracking the 0x0a
  // section markers so federal-section (section 0) records are separable from
  // the state sections that reuse the same screen ids.
  function collectChunks(bytes, recs) {
    var chunks = [], byKey = {}, curKey = null, section = 0;
    for (var i = 0; i < recs.length; i++) {
      var r = recs[i];
      if (r.type === 0x0a) { section++; continue; }
      if (r.type !== 0x0e || r.size < 0x28) continue;
      var caseId = bytes[r.payload + 0x20], yearCol = bytes[r.payload + 0x21];
      var key = caseId + ':' + yearCol;
      if (key !== curKey) { curKey = key; section = 0; }
      var ch = byKey[key];
      if (!ch) {
        ch = byKey[key] = { caseId: caseId, yearCol: yearCol, recs: [] };
        chunks.push(ch);
      }
      ch.recs.push({ rec: r, section: section,
        screenId: u16(bytes, r.payload + 0x24), inst: u16(bytes, r.payload + 0x26) });
    }
    return chunks;
  }

  // All federal-section records of a screen id, in instance order.
  function screens(chunk, id) {
    var out = [];
    for (var i = 0; i < chunk.recs.length; i++) {
      var e = chunk.recs[i];
      if (e.section === 0 && e.screenId === id) out.push(e.rec);
    }
    out.sort(function (a, b) { return a.inst - b.inst; });
    return out;
  }

  // Filing-status caption ("MFJ, 2 Exempt") stored per chunk. Returns the
  // app's filing-status id and the exemption count, or nulls.
  function filingStatusFromChunk(bytes, chunk) {
    for (var i = 0; i < chunk.recs.length; i++) {
      var r = chunk.recs[i].rec;
      var limit = r.payload + r.size;
      for (var o = r.payload; o < limit; o++) {
        var c = bytes[o];
        if (c !== 0x4d && c !== 0x53 && c !== 0x48 && c !== 0x51) continue;
        var s = asciiAt(bytes, o, 40);
        if (!s || !/\bExempt/.test(s)) continue;
        var status = null;
        if (/^MFJ|^Married Filing Joint|^Married filing joint/.test(s)) status = 'mfj';
        else if (/^MFS|^Married Filing Sep|^Married filing sep/.test(s)) status = 'mfs';
        else if (/^HOH|^Head of Household|^Head of household/.test(s)) status = 'hoh';
        else if (/^Single/.test(s)) status = 'single';
        else if (/^QW|^Qualifying/.test(s)) status = 'mfj';
        if (!status) continue;
        var m = /(\d+)\s+Exempt/.exec(s);
        return { status: status, exemptions: m ? parseInt(m[1], 10) : null };
      }
    }
    return { status: null, exemptions: null };
  }

  // Fallback plan-year detection: mode of plausible year u32s across FileData.
  function detectTaxYear(bytes) {
    var counts = {};
    for (var o = 0; o + 4 <= bytes.length; o++) {
      var v = u32(bytes, o);
      if (v >= 2018 && v <= 2035) counts[v] = (counts[v] || 0) + 1;
    }
    var best = null, bestN = 0;
    for (var y in counts) if (counts[y] > bestN) { bestN = counts[y]; best = +y; }
    return bestN >= 4 ? best : null;
  }

  // W-2 screen detection by FICA signature (6.2% of a wage base, capped or
  // not) — survives screen-id changes across producer versions. Several
  // screens can trip the signature by accident (rate-table worksheets), so
  // every candidate id is summed and the one whose Box-1 total matches the
  // grid's wages line wins. Returns Box-1 sum, federal-withholding sum and
  // record count, or count 0 when no candidate matches.
  function sumW2s(bytes, chunk, gridWages) {
    var votes = {};
    for (var i = 0; i < chunk.recs.length; i++) {
      var e = chunk.recs[i];
      if (e.section !== 0 || e.rec.size < 0x100) continue;
      var r = e.rec;
      var box1 = f64safe(bytes, r.payload + 0x73);
      var ss = f64safe(bytes, r.payload + 0x83);
      var base = f64safe(bytes, r.payload + 0x93) || f64safe(bytes, r.payload + 0x9b) || box1;
      if (box1 > 0 && ss > 0 && base > 0) {
        var uncapped = Math.round(0.062 * base);
        var capOk = false;
        for (var capBase = 140000; capBase <= 200000; capBase += 100) {
          if (base > capBase && near(ss, Math.round(0.062 * capBase), 2)) { capOk = true; break; }
        }
        if (near(ss, uncapped, 2) || capOk) votes[e.screenId] = (votes[e.screenId] || 0) + 1;
      }
    }
    var tol = Math.max(100, Math.abs(gridWages || 0) * 0.02);
    var found = null;
    for (var id in votes) {
      var total = 0, withheld = 0, count = 0;
      var w2recs = screens({ recs: chunk.recs }, +id);
      for (var j = 0; j < w2recs.length; j++) {
        var b1 = f64safe(bytes, w2recs[j].payload + 0x73);
        var wh = f64safe(bytes, w2recs[j].payload + 0x7b);
        if (isFinite(b1) && b1 >= 0 && b1 < 1e8) {
          total += b1; count++;
          if (isFinite(wh) && wh >= 0 && wh < b1) withheld += wh;
        }
      }
      if (count > 0 && isFinite(gridWages) && near(total, gridWages, tol)) {
        // Prefer the candidate with the most signature votes among matches.
        if (!found || votes[id] > found.votes) {
          found = { total: total, withheld: withheld, count: count, votes: votes[id] };
        }
      }
    }
    return found || { total: 0, withheld: 0, count: 0 };
  }

  function decodeChunk(bytes, chunk, fallbackYear, warnings) {
    var out = { yearCol: chunk.yearCol, year: null, name: '', yearCaption: '',
      fields: {}, reference: {} };
    var fields = out.fields, reference = out.reference;

    // --- case/year settings (screen 207): captions + the column's tax year --
    var settings = screens(chunk, SCREEN.caseSettings)[0] || null;
    if (settings) {
      out.name = labelAt(bytes, settings, 0x2c7);
      out.yearCaption = labelAt(bytes, settings, 0x2f3);
      if (settings.size >= 0x87) {
        var yr = u32(bytes, settings.payload + 0x83);
        if (yr >= 2018 && yr <= 2035) out.year = yr;
      }
    }
    if (out.year === null) out.year = fallbackYear;
    var who = (out.name || ('case ' + (chunk.caseId - 1))) +
      (out.yearCaption ? ' / ' + out.yearCaption : ' / year column ' + chunk.yearCol);

    // --- filing status + exemption count ------------------------------------
    var fs = filingStatusFromChunk(bytes, chunk);
    if (fs.status) fields.filingStatus = fs.status;

    // --- summary grid (screen 3, the largest record of that id) -------------
    var summary = null, sRecs = screens(chunk, SUMMARY_SCREEN_ID);
    for (var s = 0; s < sRecs.length; s++) {
      if (!summary || sRecs[s].size > summary.size) summary = sRecs[s];
    }
    if (!summary) {
      warnings.push(who + ': no summary grid (screen id ' + SUMMARY_SCREEN_ID + ') found.');
      return out;
    }
    var g = function (idx) { return slot(bytes, summary.payload, idx); };

    var totalIncome = g(SLOT.totalIncome);
    var agi = g(SLOT.agi);
    var deduction = g(SLOT.deduction);
    var qbi = g(SLOT.qbiDeduction);
    var taxable = g(SLOT.taxableIncome);
    var totalTax = g(SLOT.totalTax);
    var wages = g(SLOT.wages);
    var schE = g(SLOT.scheduleE);

    // Adjustments: slot 34 is the full adjustments-to-income line; slot 23 is
    // a subset that matched it in 2025.02000 plans (kept as fallback).
    var adjustments = g(SLOT.adjustments);
    var okAgi = isFinite(totalIncome) && isFinite(agi) && isFinite(adjustments) &&
      near(agi, totalIncome - adjustments, 1);
    if (!okAgi) {
      adjustments = g(SLOT.adjustmentsA);
      okAgi = isFinite(totalIncome) && isFinite(agi) && isFinite(adjustments) &&
        near(agi, totalIncome - adjustments, 1);
    }
    var okTaxable = isFinite(agi) && isFinite(taxable) && isFinite(deduction) &&
      isFinite(qbi) && near(taxable, agi - deduction - qbi, 1);

    if (!(okAgi && okTaxable)) {
      warnings.push(who + ': summary grid did not reconcile (AGI/taxable tie-out failed); ' +
        'figures omitted for safety.');
      return out;
    }

    reference.totalIncome = round2(totalIncome);
    reference.agi = round2(agi);
    reference.deduction = round2(deduction);
    if (Math.abs(qbi) > 0.005) reference.qbiDeduction = round2(qbi);
    reference.taxableIncome = round2(taxable);
    // Slot 281 held the plan's net-tax row in 2025.02000 plans but is written
    // as 0 in the 2026.01000 sample; a zero against positive taxable income is
    // clearly not the tax, so it is suppressed rather than shown.
    if (isFinite(totalTax) && (totalTax > 0 || (totalTax === 0 && taxable <= 0))) {
      reference.totalTax = round2(totalTax);
    }

    // --- income-line identity: sum of lines 0..18 (excluding slot 2 =
    // tax-exempt interest) plus the Schedule E line equals total income. -----
    var lineSum = 0, li;
    for (li = 0; li <= 18; li++) {
      if (li === SLOT.exemptInterest) continue;
      var lv = g(li);
      if (isFinite(lv)) lineSum += lv;
    }
    var okLines = isFinite(schE) && near(lineSum + schE, totalIncome, 1);

    // --- wages: grid line 0 cross-checked against the W-2 Box-1 sum ---------
    var w2 = sumW2s(bytes, chunk, wages);
    var okWages = false;
    if (isFinite(wages) && wages >= 0) {
      if (w2.count > 0 && near(w2.total, wages, Math.max(100, Math.abs(wages) * 0.02))) {
        fields.wages = round2(wages);
        okWages = true;
        if (w2.withheld > 0) {
          fields.fedWithholding = round2(w2.withheld);
          warnings.push(who + ': federal withholding is the W-2 total only; withholding ' +
            'entered on 1099 activities is not decoded.');
        }
      } else if (w2.count === 0 && wages === 0) {
        fields.wages = 0;
        okWages = true;
      } else {
        warnings.push(who + ': wages line did not match the W-2 Box-1 sum; wages omitted.');
      }
    }

    // --- Schedule D tax worksheet (screen 29): qualified dividends + LTCG ---
    var taxComp = screens(chunk, SCREEN.taxComputation)[0] || null;
    var qualDiv = fieldAt(bytes, taxComp, 0x10b);
    var netLtcg = fieldAt(bytes, taxComp, 0x11b);
    var prefTotal = fieldAt(bytes, taxComp, 0x123);
    var ordPortion = fieldAt(bytes, taxComp, 0x163);
    var taxableUsed = fieldAt(bytes, taxComp, 0xab);
    var incomeTax = fieldAt(bytes, taxComp, 0x293);
    var okSchD = taxComp !== null && isFinite(qualDiv) && isFinite(netLtcg) &&
      isFinite(prefTotal) && isFinite(ordPortion) && isFinite(taxableUsed) &&
      near(prefTotal, qualDiv + netLtcg, 1) && near(ordPortion, taxableUsed - prefTotal, 1);
    if (okSchD) {
      if (qualDiv !== 0) fields.qualDiv = round2(qualDiv);
      if (netLtcg !== 0) fields.ltcg = round2(netLtcg);
      // The plan's own regular income tax (before credits, SE and other
      // taxes) — the worksheet result its rate math produces.
      if (isFinite(incomeTax) && incomeTax > 0 && taxable > 0) {
        reference.incomeTax = round2(incomeTax);
      }
    } else if (taxComp) {
      warnings.push(who + ': tax-computation worksheet did not reconcile; qualified ' +
        'dividends / LTCG omitted.');
    }

    // --- interest + ordinary dividends (grid lines 1 and 3, cross-checked
    // against the interest/dividend totals worksheet, screen 675) ------------
    var intDiv = screens(chunk, SCREEN.intDivTotals)[0] || null;
    var gInt = g(SLOT.interest), gDiv = g(SLOT.dividends);
    var okIntDiv = intDiv !== null && isFinite(gInt) && isFinite(gDiv) &&
      near(fieldAt(bytes, intDiv, 0x63), gInt, 1) && near(fieldAt(bytes, intDiv, 0x6b), gDiv, 1);
    if (okIntDiv && okSchD && qualDiv >= 0 && qualDiv <= gDiv + 0.005) {
      // The app's field combines interest with the NON-qualified slice of
      // ordinary dividends (qualified dividends are their own field).
      var intField = gInt + gDiv - qualDiv;
      if (intField !== 0) fields.interest = round2(intField);
    }

    // --- Schedule C (grid line 6, cross-checked against the SE worksheet) ---
    var seWk = screens(chunk, SCREEN.seWorksheet)[0] || null;
    var gSchC = g(SLOT.scheduleC);
    var okSchC = seWk !== null && isFinite(gSchC) && near(fieldAt(bytes, seWk, 0x193), gSchC, 1);
    if (okSchC && gSchC !== 0) fields.scheduleCNet = round2(gSchC);

    // --- Schedule E passthrough (grid line 210, cross-checked against the
    // per-activity partnership/S-corp worksheets, screen 566) ----------------
    var k1s = screens(chunk, SCREEN.k1Worksheet);
    var k1Sum = 0;
    for (var k = 0; k < k1s.length; k++) {
      var kv = f64safe(bytes, k1s[k].payload + 0xbb);
      if (isFinite(kv)) k1Sum += kv;
    }
    var okSchE = isFinite(schE) && near(k1Sum, schE, 1);
    if (okSchE) {
      if (schE !== 0) fields.passthroughK1 = round2(schE);
    } else if (isFinite(schE) && schE !== 0) {
      warnings.push(who + ': the rents/royalties/partnership line (' + round2(schE) +
        ') does not equal the sum of the K-1 worksheets; it may include rental or ' +
        'estate/trust amounts the parser cannot split, so passthroughK1 was omitted.');
    }

    // --- other income: the residual of the validated total-income identity --
    if (okLines && okWages && okIntDiv && okSchC && okSchE && okSchD) {
      var mapped = wages + gInt + (gDiv - qualDiv) + qualDiv + gSchC + schE + netLtcg;
      var otherIncome = totalIncome - mapped;
      if (Math.abs(otherIncome) > 0.005) {
        fields.otherIncome = round2(otherIncome);
        warnings.push(who + ': Other income ' + round2(otherIncome) + ' is the remainder of ' +
          'the plan’s total income after the mapped lines (it can contain short-term ' +
          'gains, other gains, state refunds, retirement income and other-income items).');
      }
    } else if (okLines === false) {
      warnings.push(who + ': income lines did not sum to total income; per-line income ' +
        'fields beyond wages omitted.');
    }

    // --- Schedule A (screen 35): itemized components ------------------------
    var schedA = null, aRecs = screens(chunk, SCREEN.scheduleA);
    for (var a = 0; a < aRecs.length; a++) {
      // the federal Schedule A screen is ~1.1 KB; ignore the multi-KB payment
      // screens that share nothing but a coincidental id in other sections
      if (aRecs[a].size < 2000 && (!schedA || aRecs[a].size > schedA.size)) schedA = aRecs[a];
    }
    if (schedA) {
      var propTax = fieldAt(bytes, schedA, 0x63);
      var incomeTaxesPaid = fieldAt(bytes, schedA, 0x7b);
      var saltDeducted = fieldAt(bytes, schedA, 0x93);
      var mortgage = fieldAt(bytes, schedA, 0x9b);
      var interestTot = fieldAt(bytes, schedA, 0xbb);
      var charitable = fieldAt(bytes, schedA, 0xd3);
      var itemizedTotal = fieldAt(bytes, schedA, 0x133);
      var okSchedA = isFinite(saltDeducted) && isFinite(interestTot) && isFinite(charitable) &&
        isFinite(itemizedTotal) && near(saltDeducted + interestTot + charitable, itemizedTotal, 1);
      if (okSchedA && itemizedTotal !== 0) {
        if (isFinite(propTax) && propTax > 0) fields.propertyTax = round2(propTax);
        if (isFinite(mortgage) && mortgage > 0) fields.mortgageInterest = round2(mortgage);
        if (charitable > 0) fields.charitable = round2(charitable);
        var otherItemized = itemizedTotal - saltDeducted - (isFinite(mortgage) ? mortgage : 0) -
          charitable;
        if (otherItemized > 0.005) fields.otherItemized = round2(otherItemized);
      } else if (isFinite(itemizedTotal) && itemizedTotal !== 0) {
        warnings.push(who + ': Schedule A components did not sum to its total (medical or ' +
          'other lines the parser does not decode may be present); itemized fields omitted.');
      }

      // State/local income taxes paid (input screen 20). Its mortgage field
      // must mirror Schedule A's before the record is trusted.
      var taxesPaid = screens(chunk, SCREEN.taxesPaidInput)[0] || null;
      if (taxesPaid) {
        var statePaid = fieldAt(bytes, taxesPaid, 0x7b);
        var mortEntered = fieldAt(bytes, taxesPaid, 0x93);
        if (isFinite(statePaid) && statePaid > 0 && isFinite(mortEntered) &&
          isFinite(mortgage) && near(mortEntered, mortgage, 1)) {
          fields.stateWithholding = round2(statePaid);
          warnings.push(who + ': state/local taxes paid (' + round2(statePaid) + ') were ' +
            'imported as state withholding; the plan does not say how much of it is ' +
            'withholding vs. estimates — split it manually if needed.');
        }
      }
    }

    // --- dependents from the exemption caption ------------------------------
    if (fs.status && fs.exemptions !== null) {
      var selfCount = fs.status === 'mfj' ? 2 : 1;
      var deps = fs.exemptions - selfCount;
      if (deps > 0 && deps <= 15) {
        fields.otherDeps = deps;
        warnings.push(who + ': ' + deps + ' dependent(s) were imported as "other dependents" ' +
          'because the plan does not indicate which qualify for the child tax credit — ' +
          'move CTC-eligible children to that field manually.');
      }
    }

    return out;
  }

  function decodeCases(bytes, recs, warnings) {
    var chunks = collectChunks(bytes, recs);
    var fallbackYear = null;

    // Group data chunks (caseId >= 2) by case, keeping file order.
    var caseMap = {}, caseIds = [];
    for (var i = 0; i < chunks.length; i++) {
      var ch = chunks[i];
      if (ch.caseId < 2) continue;   // caseId 1 = template
      if (!caseMap[ch.caseId]) { caseMap[ch.caseId] = []; caseIds.push(ch.caseId); }
      caseMap[ch.caseId].push(ch);
    }
    caseIds.sort(function (a, b) { return a - b; });
    if (!caseIds.length) {
      warnings.push('No case data chunks were found in FileData.');
      return [];
    }

    var cases = [];
    for (var c = 0; c < caseIds.length; c++) {
      var yearChunks = caseMap[caseIds[c]];
      yearChunks.sort(function (a, b) { return a.yearCol - b.yearCol; });
      var caseObj = { name: '', description: '', years: [] };
      for (var y = 0; y < yearChunks.length; y++) {
        if (fallbackYear === null) fallbackYear = detectTaxYear(bytes) || 0;
        var col = decodeChunk(bytes, yearChunks[y], fallbackYear || null, warnings);
        if (!caseObj.name && col.name) caseObj.name = col.name;
        caseObj.years.push({
          year: col.year || col.yearCol,
          fields: col.fields,
          reference: col.reference
        });
      }
      if (!caseObj.name) caseObj.name = 'Case ' + (caseIds[c] - 1);
      cases.push(caseObj);
    }
    return cases;
  }

  /* -------------------------------------------------------------------------
   * Public API.
   * ---------------------------------------------------------------------- */
  TSIQ.parsePlnFile = function (uint8Array) {
    return new Promise(function (resolve, reject) {
      var bytes;
      try {
        bytes = uint8Array instanceof Uint8Array ? uint8Array : new Uint8Array(uint8Array);
      } catch (e) { reject(new Error('parsePlnFile expects a Uint8Array.')); return; }

      if (!bytes || bytes.length < 100 || bytes[0] !== 0x50 || bytes[1] !== 0x4b) {
        reject(new Error('Not a .pln file: missing ZIP (PK) signature.')); return;
      }

      var entries;
      try { entries = readCentralDirectory(bytes); }
      catch (e) { reject(e); return; }

      var byName = {};
      for (var i = 0; i < entries.length; i++) byName[entries[i].name] = entries[i];
      if (!byName.FileInfo || !byName.FileData) {
        reject(new Error('Not a .pln file: expected FileInfo and FileData members.')); return;
      }

      var warnings = [];
      var meta;
      inflateEntry(bytes, byName.FileInfo)
        .then(function (fileInfo) {
          meta = parseFileInfo(fileInfo);
          return inflateEntry(bytes, byName.FileData);
        })
        .then(function (fileData) {
          var cases = [];
          try {
            var recs = parseRecords(fileData, warnings);
            cases = decodeCases(fileData, recs, warnings);
          } catch (e) {
            warnings.push('FileData decode failed (' + e.message + '); returning metadata only.');
          }
          resolve({ meta: meta, cases: cases, warnings: warnings });
        })
        ['catch'](function (e) { reject(e); });
    });
  };
})();
