/* ============================================================================
 * PLN PARSER — reads a CCH ProSystem fx Planning ("AccuPlnr") .pln plan file
 * directly in the browser with NO dependencies and NO AI involved. A .pln is a
 * ZIP archive holding three members: FileInfo (plan metadata), FileData (the
 * binary plan database) and <clientid>.log (a text audit log we ignore).
 *
 * The format was reverse-engineered from a real 2025.02000 plan; the record
 * layout, numeric encoding (IEEE-754 float64 LE) and the summary-grid slot
 * offsets are documented in docs/pln-format-notes.md. Everything decoded is a
 * data-entry accelerator for the advisor to CONFIRM on a review screen — never
 * an authority. The plan's own computed rows (total income, AGI, taxable
 * income, total tax) are returned as reference rows so the advisor can tie the
 * parse to CCH in seconds; the parser itself checks those rows tie out
 * (AGI = total income - adjustments; taxable = AGI - deduction - QBI) and drops
 * any case whose grid does not reconcile rather than emit a guessed number.
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

  var SUMMARY_SCREEN_ID = 3;   // the plan-summary grid screen
  var GRID_BASE = 0x63;        // first double of the summary grid, within payload
  // Validated float64 slot indices within the summary grid (see doc).
  var SLOT = {
    wages: 0, totalIncome: 19, adjustments: 23, agi: 29,
    ordinaryIncome: 195, preferentialIncome: 210,
    taxableBeforeQbi: 108, deduction: 140, taxableIncome: 141, qbiDeduction: 143,
    totalTax: 281
  };

  function slot(bytes, payload, idx) {
    var o = payload + GRID_BASE + idx * 8;
    if (o + 8 > bytes.length) return NaN;
    return f64(bytes, o);
  }

  function round2(x) { return Math.round(x * 100) / 100; }
  function near(a, b, tol) { return Math.abs(a - b) <= tol; }

  // Guess filing status from the free-text status caption stored per case
  // (e.g. "MFJ, 2 Exempt"). Returns one of the app's ids or null.
  function filingStatusFromChunk(bytes, startPayload, endByte) {
    // Scan record payloads in [startPayload, endByte) for a status caption.
    var limit = Math.min(endByte, bytes.length);
    for (var o = startPayload; o < limit; o++) {
      // Cheap prefilter: 'M' 'S' 'H' 'Q' start bytes of the tokens we match.
      var c = bytes[o];
      if (c !== 0x4d && c !== 0x53 && c !== 0x48 && c !== 0x51) continue;
      var s = asciiAt(bytes, o, 40);
      if (!s) continue;
      if (/\bExempt/.test(s)) {
        if (/^MFJ|Married Filing Joint|Married filing joint/.test(s)) return 'mfj';
        if (/^MFS|Married Filing Sep|Married filing sep/.test(s)) return 'mfs';
        if (/^HOH|Head of Household|Head of household/.test(s)) return 'hoh';
        if (/^Single/.test(s)) return 'single';
        if (/^QW|Qualifying/.test(s)) return 'mfj';
      }
    }
    return null;
  }

  // Detect the plan tax year: mode of plausible year u32s across FileData.
  function detectTaxYear(bytes) {
    var counts = {};
    for (var o = 0; o + 4 <= bytes.length; o++) {
      var v = u32(bytes, o);
      if (v >= 2018 && v <= 2035) counts[v] = (counts[v] || 0) + 1;
    }
    var best = null, bestN = 0;
    for (var y in counts) if (counts[y] > bestN) { bestN = counts[y]; best = +y; }
    // Require a meaningful number of hits to avoid picking up stray ints.
    return bestN >= 4 ? best : null;
  }

  function decodeCases(bytes, recs, warnings) {
    // Group 0x0e records by case tag (caseGroup, caseNum).
    var chunks = {};     // key "g:n" -> { group, num, recs:[], first, last }
    for (var i = 0; i < recs.length; i++) {
      var r = recs[i];
      if (r.type !== 0x0e || r.size < 0x28) continue;
      var group = bytes[r.payload + 0x20], num = bytes[r.payload + 0x21];
      var key = group + ':' + num;
      if (!chunks[key]) chunks[key] = { group: group, num: num, recs: [], first: r.payload, last: r.payload + r.size };
      var ch = chunks[key];
      ch.recs.push(r);
      if (r.payload < ch.first) ch.first = r.payload;
      if (r.payload + r.size > ch.last) ch.last = r.payload + r.size;
    }

    var taxYear = detectTaxYear(bytes);
    var cases = [];
    var keys = [];
    for (var k in chunks) if (chunks[k].group === 2) keys.push(k);
    keys.sort(function (a, b) { return chunks[a].num - chunks[b].num; });

    if (!keys.length) warnings.push('No case data chunks (caseGroup 2) were found in FileData.');

    for (var ki = 0; ki < keys.length; ki++) {
      var chunk = chunks[keys[ki]];
      // Find the summary grid (screen id 3, the largest such record).
      var summary = null;
      for (var s = 0; s < chunk.recs.length; s++) {
        var rec = chunk.recs[s];
        if (u16(bytes, rec.payload + 0x24) === SUMMARY_SCREEN_ID) {
          if (!summary || rec.size > summary.size) summary = rec;
        }
      }

      var caseObj = { name: 'Case ' + chunk.num, description: '', years: [] };
      var fields = {};
      var reference = {};

      var fs = filingStatusFromChunk(bytes, chunk.first, chunk.last);
      if (fs) fields.filingStatus = fs;

      if (summary) {
        var totalIncome = slot(bytes, summary.payload, SLOT.totalIncome);
        var adjustments = slot(bytes, summary.payload, SLOT.adjustments);
        var agi = slot(bytes, summary.payload, SLOT.agi);
        var deduction = slot(bytes, summary.payload, SLOT.deduction);
        var qbi = slot(bytes, summary.payload, SLOT.qbiDeduction);
        var taxable = slot(bytes, summary.payload, SLOT.taxableIncome);
        var totalTax = slot(bytes, summary.payload, SLOT.totalTax);
        var wages = slot(bytes, summary.payload, SLOT.wages);
        var ordinary = slot(bytes, summary.payload, SLOT.ordinaryIncome);
        var preferential = slot(bytes, summary.payload, SLOT.preferentialIncome);

        // Reconcile the grid before trusting any of it.
        var okAgi = isFinite(totalIncome) && isFinite(agi) && isFinite(adjustments) &&
          near(agi, totalIncome - adjustments, 1);
        var okTaxable = isFinite(agi) && isFinite(taxable) && isFinite(deduction) &&
          isFinite(qbi) && near(taxable, agi - deduction - qbi, 1);
        var okSplit = isFinite(ordinary) && isFinite(preferential) && isFinite(agi) &&
          near(ordinary + preferential, agi, 1);

        if (okAgi && okTaxable) {
          reference.totalIncome = round2(totalIncome);
          reference.agi = round2(agi);
          reference.deduction = round2(deduction);
          if (Math.abs(qbi) > 0.005) reference.qbiDeduction = round2(qbi);
          reference.taxableIncome = round2(taxable);
          if (isFinite(totalTax) && totalTax >= 0) reference.totalTax = round2(totalTax);

          // Wages: the grid's line-1 figure. It is not covered by the AGI
          // arithmetic, so cross-check it against the W-2 Box-1 sum and only
          // emit when they agree; otherwise leave it out.
          if (isFinite(wages) && wages >= 0 && wages <= totalIncome + 1) {
            var w2 = sumW2Wages(bytes, chunk);
            if (w2.count > 0 && near(w2.total, wages, Math.max(100, Math.abs(wages) * 0.02))) {
              fields.wages = round2(wages);
            } else if (w2.count === 0 && wages === 0) {
              fields.wages = 0;
            }
          }

          if (okSplit && preferential > 0) {
            warnings.push('Case ' + chunk.num + ': net long-term capital gain and qualified dividends are ' +
              'stored combined as one preferential-income figure and are not split into ltcg/qualDiv.');
          }
        } else {
          warnings.push('Case ' + chunk.num + ': summary grid did not reconcile (AGI/taxable tie-out failed); ' +
            'reference figures omitted for safety.');
        }
      } else {
        warnings.push('Case ' + chunk.num + ': no summary grid (screen id ' + SUMMARY_SCREEN_ID + ') found.');
      }

      caseObj.years.push({
        year: taxYear || (ki + 1),
        fields: fields,
        reference: reference
      });
      cases.push(caseObj);
    }

    return cases;
  }

  // Cross-validate the grid wages line by summing W-2 Box-1 (taxable) wages.
  // Two passes: (1) find the W-2 screen id — the screen id shared by records
  // carrying a FICA signature (a value at +0x83 equal to 6.2% of a wage base
  // in the record, capped or not); (2) sum Box-1 (+0x73) across every record
  // of that screen. Used only to gate the emitted wages; never emitted itself.
  function sumW2Wages(bytes, chunk) {
    var votes = {};
    for (var i = 0; i < chunk.recs.length; i++) {
      var r = chunk.recs[i];
      if (r.size < 0x100) continue;
      var box1 = f64safe(bytes, r.payload + 0x73);
      var ss = f64safe(bytes, r.payload + 0x83);
      var base = f64safe(bytes, r.payload + 0x93) || f64safe(bytes, r.payload + 0x9b) || box1;
      if (box1 > 0 && ss > 0 && base > 0) {
        // SS is 6.2% of the wage base up to some annual maximum; accept either
        // the uncapped value or a plausible capped value (base 140k–200k).
        var uncapped = Math.round(0.062 * base);
        var capOk = false;
        for (var capBase = 140000; capBase <= 200000; capBase += 100) {
          if (base > capBase && near(ss, Math.round(0.062 * capBase), 2)) { capOk = true; break; }
        }
        if (near(ss, uncapped, 2) || capOk) {
          var sid = u16(bytes, r.payload + 0x24);
          votes[sid] = (votes[sid] || 0) + 1;
        }
      }
    }
    var w2Id = null, best = 0;
    for (var id in votes) if (votes[id] > best) { best = votes[id]; w2Id = +id; }
    if (w2Id === null) return { total: 0, count: 0 };
    var total = 0, count = 0;
    for (var j = 0; j < chunk.recs.length; j++) {
      var rj = chunk.recs[j];
      if (u16(bytes, rj.payload + 0x24) !== w2Id) continue;
      var b1 = f64safe(bytes, rj.payload + 0x73);
      if (isFinite(b1) && b1 >= 0 && b1 < 1e8) { total += b1; count++; }
    }
    return { total: total, count: count };
  }

  function f64safe(bytes, o) {
    if (o + 8 > bytes.length) return NaN;
    var v = f64(bytes, o);
    return isFinite(v) ? v : NaN;
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
