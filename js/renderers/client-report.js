/* ============================================================================
 * CLIENT REPORT RENDERER — the paid deliverable. A premium landscape plan
 * document in an editorial memo theme: full-bleed brand-navy cover, serif
 * display headlines with an italic accent phrase, left rail with section
 * numbers, hairline stat rows, a navy hero panel for the headline number,
 * per-strategy dollar attribution, print-safe SVG charts, implementation
 * roadmap, and a projection/assumptions page. Opens a print-optimized
 * window; the user saves it as PDF (landscape) from the print dialog.
 *
 * White-label: TSIQ.brand.color is the dark anchor; light tints are derived
 * from it in JS, so any firm color re-themes every page. No web fonts —
 * everything renders offline off file://.
 *
 * Attribution: strategies are added one at a time in applyOrder and each is
 * credited with the additional savings it contributes on top of the ones
 * before it (same convention as the pitch deck, so numbers always tie).
 * ==========================================================================*/
window.TSIQ = window.TSIQ || {};
TSIQ.render = TSIQ.render || {};

(function () {
  var esc = function (s) { return TSIQ.esc(s); };
  var usd = function (n) { return TSIQ.fmt.usd(n); };
  var RED = '#a3372b', HAIR = '#d9dde3', INKMUTE = '#6b7684';

  /* ------------------------------ theme ---------------------------------- */
  function anchor() { return (TSIQ.brand && TSIQ.brand.color) || '#12365c'; }

  // Mix a hex color toward white (t in 0..1). Tints derive from the anchor so
  // one brand color re-themes the whole document.
  function tint(hex, t) {
    var h = hex.replace('#', '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    var r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
    function m(c) { return Math.round(c + (255 - c) * t); }
    return '#' + [m(r), m(g), m(b)].map(function (c) {
      return ('0' + c.toString(16)).slice(-2);
    }).join('');
  }
  function accentLight() { return tint(anchor(), 0.55); }  // italic accent, chart highlight
  function paleBg() { return tint(anchor(), 0.94); }        // callout backgrounds
  function railGray() { return tint(anchor(), 0.35); }

  function usdK(n) {
    var a = Math.abs(n);
    if (a >= 1e6) return (n < 0 ? '-' : '') + '$' + (a / 1e6).toFixed(2).replace(/0$/, '') + 'M';
    return (n < 0 ? '-' : '') + '$' + Math.round(a / 1e3) + 'K';
  }

  var SERIF = "'Playfair Display','Palatino Linotype','Book Antiqua',Georgia,serif";
  var SANS = "'Segoe UI',Arial,Helvetica,sans-serif";

  function css() {
    var A = anchor(), AL = accentLight(), PB = paleBg();
    return '' +
    '*{box-sizing:border-box;margin:0;padding:0}' +
    '@page{size:11in 8.5in;margin:0}' +
    'body{font-family:Georgia,serif;color:#22303f;font-size:10pt;line-height:1.5;' +
    '-webkit-print-color-adjust:exact;print-color-adjust:exact;background:#fff}' +
    '.page{width:11in;height:8.5in;padding:0.55in 0.7in 0.65in;position:relative;' +
    'page-break-after:always;overflow:hidden;display:flex;flex-direction:column}' +
    '.page:last-child{page-break-after:auto}' +

    /* micro type */
    '.micro{font-family:' + SANS + ';font-size:7.2pt;letter-spacing:2.2px;text-transform:uppercase}' +
    '.eyebrow{font-family:' + SANS + ';font-size:7.6pt;letter-spacing:2.4px;text-transform:uppercase;' +
    'color:' + A + ';font-weight:600;margin-bottom:5px}' +

    /* running header / footer */
    '.rh{display:flex;justify-content:space-between;color:' + INKMUTE + ';margin-bottom:34px}' +
    '.rf{position:absolute;bottom:0.42in;left:0.7in;right:0.7in;display:flex;' +
    'justify-content:space-between;color:#9aa5b1}' +

    /* left rail + content grid */
    '.body-grid{display:flex;gap:0.35in;flex:1;min-height:0}' +
    '.rail{width:1.35in;flex:none}' +
    '.rail .num{font-family:' + SERIF + ';font-size:26pt;color:' + A + ';line-height:1}' +
    '.rail .lbl{font-family:' + SANS + ';font-size:7pt;letter-spacing:2px;text-transform:uppercase;' +
    'color:' + railGray() + ';margin-top:6px;line-height:1.6}' +
    '.content{flex:1;min-width:0;display:flex;flex-direction:column}' +
    '.page-head{display:flex;gap:26px;align-items:flex-start;margin-bottom:8px}' +
    '.hnum{font-family:' + SERIF + ';font-size:30pt;color:' + A + ';line-height:0.9;' +
    'padding-top:4px;min-width:0.75in}' +
    '.hnum .hlbl{font-family:' + SANS + ';font-size:6.5pt;letter-spacing:1.6px;' +
    'text-transform:uppercase;color:' + railGray() + ';margin-top:5px;line-height:1.5;max-width:0.95in}' +
    '.htext{flex:1;min-width:0}' +
    '.page-body{flex:1;display:flex;flex-direction:column;justify-content:space-between}' +
    '.page-body > .cols:only-child{flex:1}' +

    /* display headline with italic accent */
    'h1.disp{font-family:' + SERIF + ';font-weight:400;font-size:25pt;letter-spacing:1px;' +
    'text-transform:uppercase;color:' + A + ';line-height:1.12;margin-bottom:8px}' +
    'h1.disp em{font-style:italic;color:' + AL + ';text-transform:uppercase}' +
    '.orn{display:flex;align-items:center;gap:8px;margin:10px 0 14px}' +
    '.orn .d{width:7px;height:7px;background:' + AL + ';transform:rotate(45deg)}' +
    '.orn .l{height:1px;background:' + HAIR + ';width:2.2in}' +
    '.lede{font-size:11pt;color:#33404e;max-width:7.6in;margin-bottom:14px}' +
    '.lede strong,.callout strong,p strong{color:' + A + '}' +

    /* stat rows: tiny label over serif value, hairline-separated columns */
    '.statrow{display:flex;border-top:1px solid ' + HAIR + ';border-bottom:1px solid ' + HAIR + ';' +
    'margin:14px 0}' +
    '.stat{flex:1;padding:13px 16px 14px;border-left:1px solid ' + HAIR + '}' +
    '.stat:first-child{border-left:none;padding-left:0}' +
    '.stat .l{font-family:' + SANS + ';font-size:6.8pt;letter-spacing:1.8px;text-transform:uppercase;' +
    'color:' + INKMUTE + ';margin-bottom:3px}' +
    '.stat .v{font-family:' + SERIF + ';font-size:17pt;color:' + A + '}' +
    '.stat .v.neg{color:' + RED + '}' +
    '.stat .s{font-family:' + SANS + ';font-size:7.5pt;color:' + INKMUTE + ';margin-left:6px}' +

    /* navy hero panel */
    '.hero{background:' + A + ';color:#fff;border-left:5px solid ' + AL + ';' +
    'padding:26px 30px 28px;margin:16px 0}' +
    '.hero .ht{font-family:' + SANS + ';font-size:7.2pt;letter-spacing:2.2px;text-transform:uppercase;' +
    'color:' + AL + ';margin-bottom:10px}' +
    '.hero p{color:#e8edf3;font-size:10.5pt;max-width:8in}' +
    '.hero .grid{display:flex;border-top:1px solid rgba(255,255,255,0.25);margin-top:14px;padding-top:12px}' +
    '.hero .cell{flex:1;padding-right:20px}' +
    '.hero .cell .l{font-family:' + SANS + ';font-size:6.8pt;letter-spacing:1.8px;text-transform:uppercase;' +
    'color:#9db4cc;margin-bottom:4px}' +
    '.hero .cell .v{font-family:' + SERIF + ';font-size:23pt;color:#fff}' +
    '.hero .cell .v.big{font-size:34pt}' +
    '.hero .cell .s{font-family:' + SANS + ';font-size:7.5pt;color:#9db4cc;margin-top:2px}' +

    /* tables */
    'table{width:100%;border-collapse:collapse;margin:10px 0;font-size:9.5pt;font-family:' + SANS + '}' +
    'th,td{padding:8px 10px;border-bottom:1px solid ' + HAIR + ';text-align:right}' +
    'th:first-child,td:first-child{text-align:left}' +
    'thead th{font-size:6.8pt;letter-spacing:1.6px;text-transform:uppercase;color:' + INKMUTE + ';' +
    'border-bottom:2px solid ' + A + ';font-weight:600}' +
    '.total-row td{border-top:2px solid ' + A + ';border-bottom:none;font-weight:700;color:' + A + '}' +
    'td.acc{color:' + A + ';font-weight:700}' +
    'td.neg,.neg{color:' + RED + '}' +
    'tbody tr.hl td{background:' + PB + '}' +
    'table.dense{font-size:8.8pt}table.dense th,table.dense td{padding:5px 9px}' +

    /* callout note with left accent bar */
    '.callout{background:' + PB + ';border-left:4px solid ' + AL + ';padding:14px 17px;' +
    'margin:12px 0;font-size:10pt;font-family:' + SANS + ';color:#33404e}' +

    /* two-column layout on landscape pages */
    '.cols{display:flex;gap:0.4in}.col{flex:1;min-width:0}' +
    '.cols.fill .col{display:flex;flex-direction:column;justify-content:space-between}' +

    /* strategy pages */
    '.sub-serif{font-family:' + SERIF + ';font-size:12.5pt;color:' + A + ';margin:10px 0 6px}' +
    '.analogy{background:' + PB + ';border-left:4px solid ' + AL + ';padding:9px 13px;margin:10px 0;' +
    'font-style:italic;font-size:9.5pt}' +
    'ul{margin:3px 0 8px 15px}li{margin-bottom:2.5px;font-size:8.8pt;line-height:1.42}' +
    'p{margin-bottom:7px;font-size:9.4pt}' +
    '.your-numbers{font-family:' + SANS + ';font-size:8pt;color:' + INKMUTE + ';margin-bottom:8px}' +
    '.cb{display:inline-block;width:9px;height:9px;border:1.5px solid ' + A + ';border-radius:1px;' +
    'margin-right:6px;vertical-align:-1px}' +

    /* charts */
    '.chart-title{font-family:' + SANS + ';font-size:7.2pt;letter-spacing:2px;text-transform:uppercase;' +
    'color:' + A + ';font-weight:600;margin:6px 0 4px}' +
    '.legend{font-family:' + SANS + ';font-size:7.5pt;color:' + INKMUTE + ';margin-bottom:2px}' +
    '.legend .sw{display:inline-block;width:9px;height:9px;border-radius:2px;vertical-align:-1px;' +
    'margin:0 5px 0 14px}.legend .sw:first-child{margin-left:0}' +

    /* cover */
    '.cover{background:' + A + ';color:#fff;display:flex;flex-direction:column;padding:0.55in 0.8in 0.85in}' +
    '.cover .grid-bg{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,0.035) 1px,transparent 1px),' +
    'linear-gradient(90deg,rgba(255,255,255,0.035) 1px,transparent 1px);background-size:0.5in 0.5in}' +
    '.cover .top{display:flex;justify-content:space-between;align-items:flex-start;position:relative}' +
    '.cover .firmmark{font-family:' + SERIF + ';font-size:15pt;letter-spacing:1px;color:#fff;text-transform:uppercase}' +
    '.cover .doctype{text-align:right;color:' + AL + '}' +
    '.cover .rule-top{height:1px;background:rgba(255,255,255,0.3);margin:22px 0 0;position:relative}' +
    '.cover .mid{flex:1;display:flex;flex-direction:column;justify-content:center;position:relative}' +
    '.cover .conf{color:' + AL + ';margin-bottom:16px}' +
    '.cover h1{font-family:' + SERIF + ';font-weight:400;font-size:41pt;line-height:1.08;' +
    'letter-spacing:2px;text-transform:uppercase;max-width:8.6in}' +
    '.cover h1 em{color:' + AL + '}' +
    '.cover .sub{font-size:11.5pt;color:#c9d4e0;margin-top:16px;max-width:7in}' +
    '.cover .bottom{position:relative;border-top:1px solid rgba(255,255,255,0.3);padding-top:16px;' +
    'display:flex;gap:0.55in}' +
    '.cover .b-cell .l{font-family:' + SANS + ';font-size:6.8pt;letter-spacing:2px;text-transform:uppercase;' +
    'color:' + AL + ';margin-bottom:5px}' +
    '.cover .b-cell .v{font-size:10.5pt;color:#fff}' +
    '.cover .b-cell .s{font-family:' + SANS + ';font-size:7.5pt;color:#9db4cc;margin-top:2px}' +
    '.cover .rf{color:rgba(255,255,255,0.45)}' +
    '.cover img{max-height:52px;max-width:200px;display:block}' +

    '.disclaimer{font-family:' + SANS + ';font-size:7.5pt;color:#8792a0;border-top:1px solid ' + HAIR + ';' +
    'padding-top:8px;margin-top:14px;line-height:1.5}';
  }

  /* -------------------------- page scaffolding ---------------------------- */
  // Every content page: running header, left rail (number + label), content.
  function contentPage(opts) {
    return '<div class="page">' +
      '<div class="rh micro"><span>' + esc(opts.firm) + ' &middot; Tax Strategy Plan</span>' +
      '<span>' + esc(opts.context || '') + '</span></div>' +
      '<div class="page-head">' +
      '<div class="hnum">' + opts.num +
      '<div class="hlbl">' + esc(opts.railLabel) + '</div></div>' +
      '<div class="htext">' +
      '<div class="eyebrow">' + opts.eyebrow + '</div>' +
      '<h1 class="disp">' + opts.headline + '</h1>' +
      '<div class="orn"><div class="d"></div><div class="l"></div></div>' +
      '</div></div>' +
      '<div class="page-body">' + opts.body + '</div>' +
      '<div class="rf micro"><span>Private &amp; Confidential &middot; Prepared for ' +
      esc(opts.client) + '</span><span>Page __PG__ of __PGTOT__</span></div>' +
      '</div>';
  }

  function statRow(cells) {
    return '<div class="statrow">' + cells.map(function (c) {
      return '<div class="stat"><div class="l">' + c[0] + '</div>' +
        '<div class="v' + (c[2] === 'neg' ? ' neg' : '') + '">' + c[1] +
        (c[3] ? '<span class="s">' + c[3] + '</span>' : '') + '</div></div>';
    }).join('') + '</div>';
  }

  /* --------------------------- charts (SVG) ------------------------------- */
  var GRID = '#e6e9ed';
  function burdenBarChart(baseline, best, years, W, H) {
    W = W || 640; H = H || 235;
    var L = 50, R = 42, T = 14, B = 24;
    var plotW = W - L - R, plotH = H - T - B;
    var vals = [];
    for (var y = 0; y < years; y++) {
      vals.push(baseline.years[y].totalBurden, best.result.years[y].totalBurden);
    }
    var yMax = Math.max.apply(null, vals) * 1.1 || 1;
    var groupW = plotW / years;
    var barW = Math.min(20, groupW * 0.32);
    var svg = '<svg width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H +
      '" font-family="Arial,sans-serif" font-size="8.5">';
    for (var g = 1; g <= 3; g++) {
      var gy = T + plotH - (plotH * g / 3);
      svg += '<line x1="' + L + '" y1="' + gy + '" x2="' + (W - R) + '" y2="' + gy +
        '" stroke="' + GRID + '"/>' +
        '<text x="' + (L - 6) + '" y="' + (gy + 3) + '" text-anchor="end" fill="' + INKMUTE + '">' +
        usdK(yMax * g / 3) + '</text>';
    }
    svg += '<line x1="' + L + '" y1="' + (T + plotH) + '" x2="' + (W - R) + '" y2="' + (T + plotH) +
      '" stroke="' + anchor() + '"/>';
    for (var i = 0; i < years; i++) {
      var cx = L + groupW * i + groupW / 2;
      var bh = baseline.years[i].totalBurden / yMax * plotH;
      var ph = best.result.years[i].totalBurden / yMax * plotH;
      var bx = cx - barW - 1, px = cx + 1;
      svg += '<rect x="' + bx + '" y="' + (T + plotH - bh) + '" width="' + barW + '" height="' + bh +
        '" rx="2" fill="' + anchor() + '"/>' +
        '<rect x="' + px + '" y="' + (T + plotH - ph) + '" width="' + barW + '" height="' + ph +
        '" rx="2" fill="' + accentLight() + '"/>';
      if (years <= 12) {
        svg += '<text x="' + cx + '" y="' + (T + plotH + 13) + '" text-anchor="middle" fill="' +
          INKMUTE + '" letter-spacing="1">' + baseline.years[i].taxYear + '</text>';
      }
      if (i === years - 1) {
        svg += '<text x="' + (bx - 3) + '" y="' + (T + plotH - bh - 4) +
          '" text-anchor="end" fill="#22303f">' + usdK(baseline.years[i].totalBurden) + '</text>' +
          '<text x="' + (px + barW + 3) + '" y="' + (T + plotH - ph - 4) +
          '" text-anchor="start" fill="#22303f">' + usdK(best.result.years[i].totalBurden) + '</text>';
      }
    }
    return svg + '</svg>';
  }

  function cumSavingsChart(baseline, best, years, W, H) {
    W = W || 640; H = H || 235;
    var L = 50, R = 56, T = 14, B = 24;
    var plotW = W - L - R, plotH = H - T - B;
    var cum = [], run = 0;
    for (var y = 0; y < years; y++) {
      run += baseline.years[y].totalBurden - best.result.years[y].totalBurden;
      cum.push(run);
    }
    var yMax = Math.max.apply(null, cum.concat([1])) * 1.12;
    function X(i) { return years === 1 ? L + plotW : L + plotW * i / (years - 1); }
    function Y(v) { return T + plotH - Math.max(0, v) / yMax * plotH; }
    var line = cum.map(function (v, i) { return (i ? 'L' : 'M') + X(i).toFixed(1) + ' ' + Y(v).toFixed(1); }).join(' ');
    var area = line + ' L' + X(years - 1).toFixed(1) + ' ' + (T + plotH) + ' L' + L + ' ' + (T + plotH) + ' Z';
    var svg = '<svg width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H +
      '" font-family="Arial,sans-serif" font-size="8.5">';
    for (var g = 1; g <= 2; g++) {
      var gy = T + plotH - (plotH * g / 2);
      svg += '<line x1="' + L + '" y1="' + gy + '" x2="' + (W - R) + '" y2="' + gy +
        '" stroke="' + GRID + '"/>' +
        '<text x="' + (L - 6) + '" y="' + (gy + 3) + '" text-anchor="end" fill="' + INKMUTE + '">' +
        usdK(yMax * g / 2) + '</text>';
    }
    svg += '<line x1="' + L + '" y1="' + (T + plotH) + '" x2="' + (W - R) + '" y2="' + (T + plotH) +
      '" stroke="' + anchor() + '"/>' +
      '<path d="' + area + '" fill="' + accentLight() + '" fill-opacity="0.22"/>' +
      '<path d="' + line + '" fill="none" stroke="' + anchor() + '" stroke-width="2"/>' +
      '<circle cx="' + X(years - 1) + '" cy="' + Y(cum[years - 1]) + '" r="3.5" fill="' + anchor() + '"/>' +
      '<text x="' + (X(years - 1) + 7) + '" y="' + (Y(cum[years - 1]) + 3) + '" fill="#22303f" ' +
      'font-weight="bold">' + usdK(cum[years - 1]) + '</text>' +
      '<text x="' + L + '" y="' + (T + plotH + 13) + '" fill="' + INKMUTE + '" letter-spacing="1">' +
      baseline.years[0].taxYear + '</text>' +
      '<text x="' + X(years - 1) + '" y="' + (T + plotH + 13) + '" text-anchor="end" fill="' + INKMUTE +
      '" letter-spacing="1">' + baseline.years[years - 1].taxYear + '</text>';
    return svg + '</svg>';
  }

  /* ------------------------------ tables ---------------------------------- */
  function comparisonTable(baseline, scenarios) {
    var cols = [{ label: 'Baseline &middot; No Plan', r: baseline.years[0] }]
      .concat(scenarios.map(function (sc) { return { label: esc(sc.label), r: sc.result.years[0] }; }));
    var rows = [
      ['Federal income tax', 'incomeTax'],
      ['Self-employment / payroll tax', function (r) { return r.seTax + r.ownerPayrollTax + r.addlMedicare + r.otherTaxes; }],
      ['Net investment income tax', 'niit'],
      ['Entity-level federal tax', 'corpTaxPaid'],
      ['State tax (incl. entity-level)', 'totalState']
    ];
    var html = '<table><thead><tr><th>First-Year Tax &middot; ' + TSIQ.TABLES_2026.taxYear + '</th>' +
      cols.map(function (c) { return '<th>' + c.label + '</th>'; }).join('') +
      '</tr></thead><tbody>';
    rows.forEach(function (row) {
      var vals = cols.map(function (c) {
        return typeof row[1] === 'function' ? row[1](c.r) : c.r[row[1]];
      });
      if (!vals.some(function (v) { return Math.abs(v) > 0.5; })) return;
      html += '<tr><td>' + row[0] + '</td>' +
        vals.map(function (v) { return '<td' + (v < 0 ? ' class="neg"' : '') + '>' + usd(v) + '</td>'; }).join('') + '</tr>';
    });
    html += '<tr class="total-row"><td>Total tax</td>' + cols.map(function (c) {
      return '<td>' + usd(c.r.totalBurden) + '</td>';
    }).join('') + '</tr>';
    html += '<tr><td>Savings vs. baseline</td>' + cols.map(function (c, i) {
      return '<td class="acc">' + (i === 0 ? '&mdash;' : usd(baseline.years[0].totalBurden - c.r.totalBurden)) + '</td>';
    }).join('') + '</tr>';
    var anyPayments = cols.some(function (c) { return c.r.totalPayments > 0; });
    if (anyPayments) {
      html += '<tr><td>Payments already made</td>' + cols.map(function (c) {
        return '<td>' + usd(-c.r.totalPayments) + '</td>';
      }).join('') + '</tr>' +
      '<tr><td>Estimated remaining to pay</td>' + cols.map(function (c) {
        return '<td class="neg">' + usd(c.r.totalBalanceDue) + '</td>';
      }).join('') + '</tr>';
    }
    return html + '</tbody></table>';
  }

  function projectionTable(baseline, scenarios, years) {
    var html = '<table><thead><tr><th>Year</th><th>Baseline</th>' +
      scenarios.map(function (sc) {
        return '<th>' + esc(sc.label) + '</th><th>Savings</th>';
      }).join('') + '</tr></thead><tbody>';
    var cum = scenarios.map(function () { return 0; });
    for (var y = 0; y < years; y++) {
      var b = baseline.years[y].totalBurden;
      html += '<tr><td>' + baseline.years[y].taxYear + '</td><td>' + usd(b) + '</td>';
      scenarios.forEach(function (sc, i) {
        var v = sc.result.years[y].totalBurden;
        cum[i] += (b - v);
        html += '<td>' + usd(v) + '</td><td class="acc">' + usd(b - v) + '</td>';
      });
      html += '</tr>';
    }
    html += '<tr class="total-row"><td>Cumulative</td><td>' + usd(baseline.totals.totalBurden) + '</td>';
    scenarios.forEach(function (sc, i) {
      html += '<td>' + usd(sc.result.totals.totalBurden) + '</td><td>' + usd(cum[i]) + '</td>';
    });
    return html + '</tr></tbody></table>';
  }

  function incomeCompositionTable(r) {
    var p = r.profile;
    var rows = [
      ['W-2 wages', (p.wages || 0) + (p.ownerWages || 0)],
      ['Business profit (Schedule C)', p.scheduleCNet || 0],
      ['S-corp / partnership income', p.passthroughK1 || 0],
      ['Rental real estate', p.rentalNet || 0],
      ['Capital gains &amp; dividends', (p.ltcg || 0) + (p.qualDiv || 0)],
      ['Interest &amp; other income', (p.interest || 0) + (p.otherIncome || 0)]
    ].filter(function (row) { return Math.abs(row[1]) > 0.5; });
    return '<table><thead><tr><th>Where your income comes from</th><th>Amount</th></tr></thead><tbody>' +
      rows.map(function (row) {
        return '<tr><td>' + row[0] + '</td><td' + (row[1] < 0 ? ' class="neg"' : '') + '>' +
          usd(row[1]) + '</td></tr>';
      }).join('') +
      '<tr class="total-row"><td>Total income</td><td>' + usd(r.totalIncome) + '</td></tr>' +
      '</tbody></table>';
  }

  /* ----------------------- per-strategy attribution ----------------------- */
  function attributionSteps(data, best) {
    var ordered = best.selections ? best.selections.slice().sort(function (a, b) {
      return a.strategy.applyOrder - b.strategy.applyOrder;
    }) : [];
    var steps = [], running = [];
    var prevYr1 = data.baseline.years[0].totalBurden;
    var prevCum = data.baseline.totals.totalBurden;
    ordered.forEach(function (sel) {
      running.push(sel);
      var r = TSIQ.computeScenario(data.profile, running, data.years, data.growthRate);
      steps.push({
        strategy: sel.strategy, params: sel.params,
        yr1: prevYr1 - r.years[0].totalBurden,
        cum: prevCum - r.totals.totalBurden
      });
      prevYr1 = r.years[0].totalBurden;
      prevCum = r.totals.totalBurden;
    });
    return steps;
  }

  function attributionTable(steps, years) {
    var totY = 0, totC = 0;
    var html = '<table' + (steps.length >= 6 ? ' class="dense"' : '') + '><thead><tr><th style="width:26%">Strategy</th><th style="text-align:left">What it does</th>' +
      '<th style="width:14%">First-year value</th><th style="width:14%">' + years + '-year value</th>' +
      '</tr></thead><tbody>';
    steps.forEach(function (st) {
      totY += st.yr1; totC += st.cum;
      var foundation = st.yr1 < 500 && st.cum < 500;
      html += '<tr><td style="font-weight:600">' + esc(st.strategy.name) + '</td>' +
        '<td style="text-align:left;color:#556270">' + esc(st.strategy.client.teaser || '') + '</td>' +
        (foundation
          ? '<td colspan="2" style="text-align:center;color:' + INKMUTE + '">Foundation &mdash; powers the strategies below</td>'
          : '<td class="acc">' + usd(st.yr1) + '</td><td class="acc">' + usd(st.cum) + '</td>') +
        '</tr>';
    });
    html += '<tr class="total-row"><td colspan="2">Your complete plan</td>' +
      '<td>' + usd(totY) + '</td><td>' + usd(totC) + '</td></tr>';
    return html + '</tbody></table>';
  }

  /* --------------------------- strategy pages ----------------------------- */
  function yourNumbersLine(step) {
    if (!step || !step.params) return '';
    var parts = (step.strategy.inputs || []).map(function (inp) {
      var v = step.params[inp.key];
      if (v === undefined || v === null || v === '' || v === 0) return null;
      var shown = (inp.type === 'currency') ? usd(v) :
        (inp.type === 'percent') ? v + '%' : String(v);
      return esc(inp.label) + ': ' + esc(shown);
    }).filter(Boolean);
    return parts.length
      ? '<div class="your-numbers">Modeled with your numbers &mdash; ' + parts.join(' &nbsp;&middot;&nbsp; ') + '</div>'
      : '';
  }

  // Headline: last word italicized in the light accent, per the theme.
  function accentHeadline(name) {
    var words = esc(name).split(' ');
    if (words.length < 2) return '<em>' + words.join(' ') + '</em>';
    var last = words.pop();
    return words.join(' ') + ' <em>' + last + '</em>';
  }

  function strategyBody(strategy, step, years) {
    var c = strategy.client;
    var foundation = step && step.yr1 < 500 && step.cum < 500;
    var stat = step
      ? statRow(foundation
          ? [['Role in the plan', 'Foundation'], ['Why it matters', 'Structural', '', 'powers the plan'],
             ['Authority', 'Established law']]
          : [['First-year value', usd(step.yr1)], [years + '-year value', usd(step.cum)],
             ['Authority', 'Established law']])
      : '';
    return stat +
      (step ? yourNumbersLine(step) : '') +
      '<div class="cols"><div class="col">' +
      c.plainEnglish.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('') +
      (c.analogy ? '<div class="analogy">' + esc(c.analogy) + '</div>' : '') +
      '</div><div class="col">' +
      '<div class="sub-serif">What this means for you</div><ul>' +
      c.benefits.slice(0, 4).map(function (b) { return '<li>' + esc(b) + '</li>'; }).join('') + '</ul>' +
      '<div class="sub-serif">How we make it happen</div><ul>' +
      c.steps.slice(0, 4).map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul>' +
      '<div class="sub-serif">Things to know</div><ul>' +
      c.considerations.slice(0, 3).map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul>' +
      '</div></div>';
  }

  /**
   * Single-strategy client handout — opened from a library card. Same content
   * as a plan strategy page, standalone, in the same theme.
   */
  TSIQ.render.strategyHandout = function (strategy, firmName) {
    var html = '<!DOCTYPE html><html><head><meta charset="utf-8">' +
      '<title>' + esc(strategy.name) + ' — Client Handout</title>' +
      '<style>' + css() + '</style></head><body>' +
      '<div class="page">' +
      '<div class="rh micro"><span>' + esc(firmName) + '</span><span>Strategy Overview</span></div>' +
      '<div class="page-head">' +
      '<div class="hnum">&#9670;</div>' +
      '<div class="htext">' +
      '<div class="eyebrow">' + esc(strategy.category) + '</div>' +
      '<h1 class="disp">' + accentHeadline(strategy.name) + '</h1>' +
      '<div class="orn"><div class="d"></div><div class="l"></div></div>' +
      '</div></div>' +
      '<p class="lede">' + esc(strategy.client.headline) + '</p>' +
      strategyBody(strategy, null) +
      '<div class="disclaimer">This overview is educational and describes a strategy in general ' +
      'terms. Whether it fits your situation — and what it is worth — depends on your full tax ' +
      'picture, which we evaluate as part of your plan. ' + esc(firmName) + ' handles eligibility, ' +
      'implementation, and documentation requirements with you.</div>' +
      '</div></body></html>';

    var w = window.open('', '_blank');
    if (!w) { alert('Pop-up blocked — please allow pop-ups for this page.'); return; }
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(function () { w.print(); }, 400);
  };

  /**
   * data: { clientName, firmName, fees, profile, baseline,
   *         scenarios: [{label, selections, strategies, result}], years, growthRate }
   */
  TSIQ.render.clientReport = function (data) {
    var best = data.scenarios.reduce(function (a, b) {
      return b.result.totals.totalBurden < a.result.totals.totalBurden ? b : a;
    }, data.scenarios[0]);
    var baseYr1 = data.baseline.years[0];
    var bestYr1 = best.result.years[0];
    var yr1Savings = baseYr1.totalBurden - bestYr1.totalBurden;
    var cumSavings = data.baseline.totals.totalBurden - best.result.totals.totalBurden;
    var steps = attributionSteps(data, best);

    var effBase = baseYr1.totalIncome > 0 ? baseYr1.totalBurden / baseYr1.totalIncome : 0;
    var effPlan = bestYr1.totalIncome > 0 ? bestYr1.totalBurden / bestYr1.totalIncome : 0;
    var marginal = 0;
    try {
      var m0 = TSIQ.computeYear(Object.assign({}, data.profile));
      var m1 = TSIQ.computeYear(Object.assign({}, data.profile,
        { wages: (data.profile.wages || 0) + 1000 }));
      marginal = Math.max(0, Math.min(0.65, (m1.totalBurden - m0.totalBurden) / 1000));
    } catch (e) { marginal = 0; }

    var fees = data.fees || { planning: 0, annual: 0 };
    var yr1Cost = (fees.planning || 0) + (fees.annual || 0);
    var totalFees = (fees.planning || 0) + (fees.annual || 0) * data.years;
    var netBenefit = cumSavings - totalFees;
    var roi = yr1Cost > 0 ? yr1Savings / yr1Cost : 0;
    var modeled = steps.filter(function (st) { return st.yr1 >= 500 || st.cum >= 500; }).length;
    var foundations = steps.length - modeled;

    var today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    var C = { firm: data.firmName, client: data.clientName };
    function page(num, railLabel, eyebrow, headline, context, body) {
      return contentPage({
        firm: C.firm, client: C.client, num: ('0' + num).slice(-2),
        railLabel: railLabel, eyebrow: eyebrow, headline: headline,
        context: context, body: body
      });
    }
    var n = 0;
    var pages = [];

    /* ---- Cover ---- */
    var logo = TSIQ.brand && TSIQ.brand.logo;
    pages.push('<div class="page cover"><div class="grid-bg"></div>' +
      '<div class="top">' +
      '<div>' + (logo ? '<img src="' + logo + '" alt="">' :
        '<div class="firmmark">' + esc(data.firmName) + '</div>') + '</div>' +
      '<div class="doctype micro">Tax Strategy Plan<br>Prepared ' + esc(today) + '</div>' +
      '</div><div class="rule-top"></div>' +
      '<div class="mid">' +
      '<div class="conf micro">Confidential &middot; Prepared exclusively for ' + esc(data.clientName) + '</div>' +
      '<h1>Projections, Strategies,<br>&amp; <em>Tax Savings.</em></h1>' +
      '<div class="sub">Where you stand for ' + TSIQ.TABLES_2026.taxYear + ', the ' + steps.length +
      ' strategies we recommend, what each is worth to you in dollars, and exactly how we put the ' +
      'plan to work.</div>' +
      '</div>' +
      '<div class="bottom">' +
      '<div class="b-cell"><div class="l">Prepared for</div><div class="v">' + esc(data.clientName) + '</div>' +
      '<div class="s">' + esc(TSIQ.FILING_STATUS_LABELS[data.profile.filingStatus] || '') + '</div></div>' +
      '<div class="b-cell"><div class="l">Tax year</div><div class="v">' + TSIQ.TABLES_2026.taxYear + '</div>' +
      '<div class="s">' + data.years + '-year projection</div></div>' +
      '<div class="b-cell"><div class="l">Strategies</div><div class="v">' + steps.length + '</div>' +
      '<div class="s">' + modeled + ' modeled' + (foundations ? ' · ' + foundations + ' structural' : '') + '</div></div>' +
      '<div class="b-cell"><div class="l">Prepared by</div><div class="v">' + esc(data.firmName) + '</div></div>' +
      '</div>' +
      '<div class="rf micro" style="position:absolute"><span>Private &amp; Confidential</span>' +
      '<span>Page __PG__ of __PGTOT__</span></div>' +
      '</div>');

    /* ---- 01 · Bottom line ---- */
    n++;
    pages.push(page(n, 'The Bottom Line', 'Executive Summary &middot; Tax Year ' + TSIQ.TABLES_2026.taxYear,
      'What This Plan Is <em>Worth.</em>', 'The Bottom Line',
      '<p class="lede">We analyzed your complete tax picture — every income source, entity, ' +
      'deduction, and payment — against current federal law and your state’s rules. Without ' +
      'changes, your ' + TSIQ.TABLES_2026.taxYear + ' tax is projected at <strong>' +
      usd(baseYr1.totalBurden) + '</strong>; over ' + data.years + ' years, <strong>' +
      usd(data.baseline.totals.totalBurden) + '</strong> would go to the government. This plan — ' +
      steps.length + ' strategies, each grounded in statute, regulation, or case law — changes that.</p>' +
      '<div class="hero"><div class="ht">Estimated Savings &middot; Your Complete Plan</div>' +
      '<p>Every strategy in this document is credited only with the savings it adds on top of the ' +
      'ones before it — no double counting. Together they are worth:</p>' +
      '<div class="grid">' +
      '<div class="cell"><div class="l">First year &middot; ' + TSIQ.TABLES_2026.taxYear + '</div>' +
      '<div class="v big">' + usd(yr1Savings) + '</div></div>' +
      '<div class="cell"><div class="l">Over ' + data.years + ' years</div>' +
      '<div class="v">' + usd(cumSavings) + '</div></div>' +
      '<div class="cell"><div class="l">Effective rate</div>' +
      '<div class="v">' + (effBase * 100).toFixed(1) + '% &rarr; ' + (effPlan * 100).toFixed(1) + '%</div>' +
      '<div class="s">of total income</div></div>' +
      '</div></div>' +
      statRow([
        ['Baseline ' + TSIQ.TABLES_2026.taxYear + ' tax', usd(baseYr1.totalBurden), 'neg'],
        ['With the plan', usd(bestYr1.totalBurden)],
        [data.years + '-year baseline', usd(data.baseline.totals.totalBurden), 'neg'],
        [data.years + '-year with plan', usd(best.result.totals.totalBurden)]
      ]) +
      '<p style="font-size:9.5pt;color:#556270">Nothing here is aggressive for its own sake: every ' +
      'strategy carries its authority and the documentation standard that lets it hold up under ' +
      'review. We implement it with you, maintain it, and adjust it as law and life change. ' +
      'Details, dollar by dollar, follow.</p>'));

    /* ---- 02 · Where you stand ---- */
    n++;
    pages.push(page(n, 'Where You Stand', 'Your Current Position &middot; Before Planning',
      'Where You Stand <em>Today.</em>', 'Current Position',
      '<div class="cols"><div class="col">' +
      incomeCompositionTable(baseYr1) +
      '</div>' +
      '<div class="col">' + comparisonTable(data.baseline, data.scenarios) + '</div></div>' +
      '<div class="callout">Your projected tax is <strong>' + usd(baseYr1.totalBurden) +
      '</strong> — an effective rate of <strong>' + (effBase * 100).toFixed(1) + '%</strong>' +
      (marginal > 0.2
        ? '. At the margin it is worse: of the <em>next</em> $1,000 you earn, about <strong>' +
          usd(1000 - marginal * 1000) + '</strong> stays with you.'
        : '.') +
      '</div>' +
      '<p style="font-size:8.5pt;color:' + INKMUTE + '">' +
      (data.scenarios.length > 1
        ? 'Both modeled combinations shown; the pages that follow walk through the recommended one (' +
          esc(best.label) + ') strategy by strategy.'
        : 'The pages that follow walk through the plan strategy by strategy.') +
      '</p>'));

    /* ---- 03 · Plan at a glance ---- */
    n++;
    pages.push(page(n, 'The Plan', 'Every Strategy &middot; Its Dollar Value',
      'The Plan at a <em>Glance.</em>', 'Strategy Attribution',
      '<p class="lede">Each strategy is credited only with the savings it adds on top of the ones ' +
      'before it. These are estimates from your actual numbers — not brochure figures.</p>' +
      attributionTable(steps, data.years)));

    /* ---- 04 · The picture ---- */
    n++;
    pages.push(page(n, 'The Picture', 'Ten Years &middot; Side by Side',
      'What Stays in <em>Your Pocket.</em>', 'Projection',
      '<div class="cols"><div class="col">' +
      '<div class="chart-title">Your tax bill &middot; with and without the plan</div>' +
      '<div class="legend"><span class="sw" style="background:' + anchor() + '"></span>Without plan' +
      '<span class="sw" style="background:' + accentLight() + '"></span>With plan</div>' +
      burdenBarChart(data.baseline, best, data.years, 440, 380) +
      '</div><div class="col">' +
      '<div class="chart-title">Cumulative savings &middot; ' + data.years + ' years</div>' +
      cumSavingsChart(data.baseline, best, data.years, 440, 392) +
      '</div></div>' +
      '<p style="font-size:9.5pt;color:#556270;margin-top:8px">Savings compound: every dollar that ' +
      'does not leave in April keeps working in your business and your investments. The projection ' +
      'assumes ' + (data.growthRate * 100).toFixed(1) + '% annual income growth and current law ' +
      'throughout; assumptions are detailed on the final page.</p>'));

    /* ---- 05 · Value vs investment ---- */
    if (yr1Cost > 0) {
      n++;
      pages.push(page(n, 'Your Investment', 'The Fee &middot; And What It Returns',
        'Value vs. <em>Investment.</em>', 'Engagement Value',
        '<div class="cols"><div class="col">' +
        '<table><tbody>' +
        '<tr><td>Tax strategy plan (one-time)</td><td>' + usd(fees.planning) + '</td></tr>' +
        (fees.annual > 0
          ? '<tr><td>Annual implementation &amp; maintenance</td><td>' + usd(fees.annual) + '/yr</td></tr>'
          : '') +
        '<tr><td>Estimated first-year savings</td><td class="acc">' + usd(yr1Savings) + '</td></tr>' +
        '<tr><td>Estimated ' + data.years + '-year savings</td><td class="acc">' + usd(cumSavings) + '</td></tr>' +
        '<tr class="total-row"><td>' + data.years + '-year net benefit, after all fees</td>' +
        '<td>' + usd(netBenefit) + '</td></tr>' +
        '</tbody></table>' +
        '</div><div class="col">' +
        (roi >= 1.2
          ? '<div class="hero" style="margin-top:0"><div class="ht">Return on Plan Investment</div>' +
            '<div class="grid" style="border-top:none;margin-top:0;padding-top:0">' +
            '<div class="cell"><div class="l">First year alone</div><div class="v big">' +
            roi.toFixed(1) + '&times;</div>' +
            '<div class="s">' + usd(yr1Savings) + ' savings vs. ' + usd(yr1Cost) + ' fee</div></div>' +
            '</div></div>'
          : '') +
        '</div></div>' +
        statRow([
          ['Payback period', Math.max(1, Math.ceil(yr1Cost / Math.max(1, yr1Savings / 12))) + ' months'],
          ['Monthly savings equivalent', usd(yr1Savings / 12) + '/mo'],
          [data.years + '-year return on fees', (totalFees > 0 ? (cumSavings / totalFees).toFixed(1) : '—') + '&times;']
        ]) +
        '<div class="callout">The fee buys the analysis in this document, the implementation of ' +
        'every strategy in it — elections, filings, plan documents, payroll setup, documentation ' +
        'standards — and ongoing maintenance: annual limit updates, law-change reviews, and the ' +
        'numbers check we run with you every year.</div>'));
    }

    /* ---- Strategy pages ---- */
    steps.forEach(function (st) {
      n++;
      pages.push(page(n, st.strategy.category,
        esc(st.strategy.category) + ' &middot; Strategy ' + ('0' + n).slice(-2),
        accentHeadline(st.strategy.name), esc(st.strategy.name),
        '<p class="lede">' + esc(st.strategy.client.headline) + '</p>' +
        strategyBody(st.strategy, st, data.years)));
    });

    /* ---- Roadmap ---- */
    n++;
    pages.push(page(n, 'Roadmap', 'From Paper to Practice',
      'How It Gets <em>Done.</em>', 'Implementation',
      '<p class="lede">We lead every step; the checkboxes are for our working sessions together.</p>' +
      '<table><thead><tr><th style="width:26%">Strategy</th><th style="text-align:left">First actions</th>' +
      '</tr></thead><tbody>' +
      steps.map(function (st) {
        var first = (st.strategy.client.steps || []).slice(0, steps.length > 6 ? 1 : 2);
        return '<tr><td style="font-weight:600">' + esc(st.strategy.name) + '</td>' +
          '<td style="text-align:left">' +
          first.map(function (s) { return '<span class="cb"></span>' + esc(s); }).join('<br>') +
          '</td></tr>';
      }).join('') +
      '</tbody></table>' +
      '<div class="cols"><div class="col"><div class="sub-serif">What happens next</div><ul>' +
      '<li>We walk through this plan together and answer every question.</li>' +
      '<li>You approve the strategies; we execute the elections, documents, and payroll changes.</li>' +
      '<li>We check the numbers against the plan at year-end and update it as law and life change.</li>' +
      '</ul></div><div class="col"></div></div>'));

    /* ---- Outlook + assumptions ---- */
    n++;
    pages.push(page(n, 'The Outlook', 'The Full Projection &middot; And Our Assumptions',
      'The ' + data.years + '-Year <em>Outlook.</em>', 'Projection Detail',
      '<div class="cols fill"><div class="col" style="flex:1.4">' +
      projectionTable(data.baseline, data.scenarios, data.years) +
      '</div><div class="col">' +
      '<div class="sub-serif">Assumptions behind these numbers</div>' +
      '<ul style="font-size:8.5pt;color:#556270">' +
      '<li>' + TSIQ.TABLES_2026.taxYear + ' federal law (Rev. Proc. 2025-32 as amended by OBBBA) ' +
      'applied to all projection years; income grows at ' + (data.growthRate * 100).toFixed(1) + '% annually.</li>' +
      '<li>State tax modeled at a flat effective rate' +
      (data.profile.stateRate ? ' of ' + (data.profile.stateRate * 100).toFixed(1) + '%' : '') + '.</li>' +
      '<li>AMT, depreciation recapture on sale, and certain loss limitations are not modeled; ' +
      'strategies sensitive to them are flagged on their pages.</li>' +
      '<li>Estimates assume timely implementation and the documentation standards we set together.</li>' +
      '</ul>' +
      '<div class="disclaimer">These projections are planning estimates based on the information ' +
      'you provided and stated assumptions — not a guarantee of results, and not a substitute for ' +
      'the engagement itself. Strategies require proper implementation and documentation to deliver ' +
      'the benefits shown. ' + esc(data.firmName) + ' confirms final figures on your filed returns.' +
      '</div></div></div>'));

    /* ---- assemble with page numbers ---- */
    var total = pages.length;
    var html = '<!DOCTYPE html><html><head><meta charset="utf-8">' +
      '<title>Tax Strategy Plan — ' + esc(data.clientName) + '</title>' +
      '<style>' + css() + '</style></head><body>' +
      pages.map(function (pg, i) {
        return pg.split('__PG__').join(String(i + 1)).split('__PGTOT__').join(String(total));
      }).join('') +
      '</body></html>';

    var w = window.open('', '_blank');
    if (!w) { alert('Pop-up blocked — please allow pop-ups for this page.'); return; }
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(function () { w.print(); }, 600);
  };
})();
