/* ============================================================================
 * BINDER PLAN RENDERER — the premium portrait deliverable ("the binder").
 * Part I: client-facing narrative (plain English, dollar attribution, ROI,
 * roadmap) in the firm memo theme, portrait letter.
 * Part II: technical annex auto-generated from the advisor-side strategy
 * library — methodology & dated assumptions, per-strategy technical sheets
 * (mechanics, authority citations, requirements, risk factors,
 * implementation), projection detail, and monitoring cadence. The annex is
 * where the depth lives; it flows naturally across pages rather than
 * clipping to fixed sheets.
 *
 * Investment illustration: raw cumulative savings and an "if invested"
 * curve are shown as SEPARATE numbers; the assumed return is a labeled,
 * adjustable input (never blended into the ROI-on-fee multiple).
 * ==========================================================================*/
window.TSIQ = window.TSIQ || {};
TSIQ.render = TSIQ.render || {};

(function () {
  var esc = function (s) { return TSIQ.esc(s); };
  var usd = function (n) { return TSIQ.fmt.usd(n); };
  var RED = '#a3372b', HAIR = '#d9dde3', INKMUTE = '#6b7684', GRID = '#e6e9ed';

  function anchor() { return (TSIQ.brand && TSIQ.brand.color) || '#12365c'; }
  function tint(hex, t) {
    var h = hex.replace('#', '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    var r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
    function m(c) { return Math.round(c + (255 - c) * t); }
    return '#' + [m(r), m(g), m(b)].map(function (c) {
      return ('0' + c.toString(16)).slice(-2);
    }).join('');
  }
  function AL() { return tint(anchor(), 0.55); }
  function PB() { return tint(anchor(), 0.94); }

  function usdK(n) {
    var a = Math.abs(n);
    if (a >= 1e6) return (n < 0 ? '-' : '') + '$' + (a / 1e6).toFixed(2).replace(/0$/, '') + 'M';
    return (n < 0 ? '-' : '') + '$' + Math.round(a / 1e3) + 'K';
  }

  var SERIF = "'Playfair Display','Palatino Linotype','Book Antiqua',Georgia,serif";
  var SANS = "'Segoe UI',Arial,Helvetica,sans-serif";

  function css() {
    var A = anchor(), al = AL(), pb = PB();
    return '' +
    '*{box-sizing:border-box;margin:0;padding:0}' +
    '@page{size:8.5in 11in;margin:0}' +
    'body{font-family:Georgia,serif;color:#22303f;font-size:10pt;line-height:1.52;' +
    '-webkit-print-color-adjust:exact;print-color-adjust:exact;background:#fff}' +

    /* Part I: fixed portrait sheets */
    '.page{width:8.5in;height:11in;padding:0.62in 0.7in 0.7in;position:relative;' +
    'page-break-after:always;overflow:hidden;display:flex;flex-direction:column}' +
    /* Annex: flowing sheets that may span pages */
    '.sheet{width:8.5in;padding:0.62in 0.7in;page-break-before:always}' +

    '.micro{font-family:' + SANS + ';font-size:7pt;letter-spacing:2.2px;text-transform:uppercase}' +
    '.eyebrow{font-family:' + SANS + ';font-size:7.4pt;letter-spacing:2.4px;text-transform:uppercase;' +
    'color:' + A + ';font-weight:600;margin-bottom:5px}' +
    '.rh{display:flex;justify-content:space-between;color:' + INKMUTE + ';margin-bottom:26px}' +
    '.rf{position:absolute;bottom:0.4in;left:0.7in;right:0.7in;display:flex;' +
    'justify-content:space-between;color:#9aa5b1}' +

    '.page-head{display:flex;gap:20px;align-items:flex-start;margin-bottom:8px}' +
    '.hnum{font-family:' + SERIF + ';font-size:26pt;color:' + A + ';line-height:0.9;' +
    'padding-top:3px;min-width:0.62in}' +
    '.hnum .hlbl{font-family:' + SANS + ';font-size:6.2pt;letter-spacing:1.5px;' +
    'text-transform:uppercase;color:' + tint(A, 0.35) + ';margin-top:4px;line-height:1.5;max-width:0.85in}' +
    '.htext{flex:1;min-width:0}' +
    'h1.disp{font-family:' + SERIF + ';font-weight:400;font-size:20.5pt;letter-spacing:1px;' +
    'text-transform:uppercase;color:' + A + ';line-height:1.14;margin-bottom:7px}' +
    'h1.disp em{font-style:italic;color:' + al + ';text-transform:uppercase}' +
    '.orn{display:flex;align-items:center;gap:8px;margin:8px 0 12px}' +
    '.orn .d{width:6px;height:6px;background:' + al + ';transform:rotate(45deg)}' +
    '.orn .l{height:1px;background:' + HAIR + ';width:1.9in}' +
    '.lede{font-size:10.5pt;color:#33404e;margin-bottom:12px}' +
    '.lede strong,.callout strong,p strong{color:' + A + '}' +
    '.page-body{flex:1;display:flex;flex-direction:column;justify-content:space-between}' +
    '.page-body > .cols:only-child{flex:1}' +

    '.statrow{display:flex;border-top:1px solid ' + HAIR + ';border-bottom:1px solid ' + HAIR + ';' +
    'margin:12px 0}' +
    '.stat{flex:1;padding:11px 13px 12px;border-left:1px solid ' + HAIR + '}' +
    '.stat:first-child{border-left:none;padding-left:0}' +
    '.stat .l{font-family:' + SANS + ';font-size:6.6pt;letter-spacing:1.6px;text-transform:uppercase;' +
    'color:' + INKMUTE + ';margin-bottom:3px}' +
    '.stat .v{font-family:' + SERIF + ';font-size:14.5pt;color:' + A + '}' +
    '.stat .v.neg{color:' + RED + '}' +
    '.stat .s{font-family:' + SANS + ';font-size:7.2pt;color:' + INKMUTE + ';margin-left:5px}' +

    '.hero{background:' + A + ';color:#fff;border-left:5px solid ' + al + ';' +
    'padding:22px 26px 24px;margin:14px 0}' +
    '.hero .ht{font-family:' + SANS + ';font-size:7pt;letter-spacing:2.2px;text-transform:uppercase;' +
    'color:' + al + ';margin-bottom:9px}' +
    '.hero p{color:#e8edf3;font-size:10pt}' +
    '.hero .grid{display:flex;border-top:1px solid rgba(255,255,255,0.25);margin-top:12px;padding-top:11px}' +
    '.hero .cell{flex:1;padding-right:16px}' +
    '.hero .cell .l{font-family:' + SANS + ';font-size:6.6pt;letter-spacing:1.6px;text-transform:uppercase;' +
    'color:#9db4cc;margin-bottom:4px}' +
    '.hero .cell .v{font-family:' + SERIF + ';font-size:18pt;color:#fff}' +
    '.hero .cell .v.big{font-size:27pt}' +
    '.hero .cell .s{font-family:' + SANS + ';font-size:7.2pt;color:#9db4cc;margin-top:2px}' +

    'table{width:100%;border-collapse:collapse;margin:9px 0;font-size:9pt;font-family:' + SANS + '}' +
    'th,td{padding:6.5px 9px;border-bottom:1px solid ' + HAIR + ';text-align:right}' +
    'th:first-child,td:first-child{text-align:left}' +
    'thead th{font-size:6.6pt;letter-spacing:1.5px;text-transform:uppercase;color:' + INKMUTE + ';' +
    'border-bottom:2px solid ' + A + ';font-weight:600}' +
    '.total-row td{border-top:2px solid ' + A + ';border-bottom:none;font-weight:700;color:' + A + '}' +
    'td.acc{color:' + A + ';font-weight:700}' +
    'td.neg,.neg{color:' + RED + '}' +
    'table.dense{font-size:8.4pt}table.dense th,table.dense td{padding:4.5px 8px}' +

    '.callout{background:' + pb + ';border-left:4px solid ' + al + ';padding:12px 15px;' +
    'margin:11px 0;font-size:9.5pt;font-family:' + SANS + ';color:#33404e}' +
    '.cols{display:flex;gap:0.32in}.col{flex:1;min-width:0}' +
    '.sub-serif{font-family:' + SERIF + ';font-size:12pt;color:' + A + ';margin:9px 0 5px}' +
    '.analogy{background:' + pb + ';border-left:4px solid ' + al + ';padding:9px 12px;margin:9px 0;' +
    'font-style:italic;font-size:9.3pt}' +
    'ul{margin:3px 0 8px 15px}li{margin-bottom:2.5px;font-size:9pt;line-height:1.45}' +
    'p{margin-bottom:7px;font-size:9.7pt}' +
    '.your-numbers{font-family:' + SANS + ';font-size:7.8pt;color:' + INKMUTE + ';margin-bottom:8px}' +
    '.cb{display:inline-block;width:9px;height:9px;border:1.5px solid ' + A + ';border-radius:1px;' +
    'margin-right:6px;vertical-align:-1px}' +
    '.chart-title{font-family:' + SANS + ';font-size:7pt;letter-spacing:1.8px;text-transform:uppercase;' +
    'color:' + A + ';font-weight:600;margin:8px 0 3px}' +
    '.legend{font-family:' + SANS + ';font-size:7.4pt;color:' + INKMUTE + ';margin-bottom:2px}' +
    '.legend .sw{display:inline-block;width:9px;height:9px;border-radius:2px;vertical-align:-1px;' +
    'margin:0 5px 0 12px}.legend .sw:first-child{margin-left:0}' +

    /* covers & dividers */
    '.cover{background:' + A + ';color:#fff;display:flex;flex-direction:column;padding:0.7in 0.75in 0.85in}' +
    '.cover .grid-bg{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,0.035) 1px,transparent 1px),' +
    'linear-gradient(90deg,rgba(255,255,255,0.035) 1px,transparent 1px);background-size:0.5in 0.5in}' +
    '.cover .top{display:flex;justify-content:space-between;align-items:flex-start;position:relative}' +
    '.cover .firmmark{font-family:' + SERIF + ';font-size:14pt;letter-spacing:1px;color:#fff;text-transform:uppercase}' +
    '.cover .doctype{text-align:right;color:' + al + '}' +
    '.cover .rule-top{height:1px;background:rgba(255,255,255,0.3);margin:20px 0 0;position:relative}' +
    '.cover .mid{flex:1;display:flex;flex-direction:column;justify-content:center;position:relative}' +
    '.cover .conf{color:' + al + ';margin-bottom:14px}' +
    '.cover h1{font-family:' + SERIF + ';font-weight:400;font-size:31pt;line-height:1.12;' +
    'letter-spacing:2px;text-transform:uppercase}' +
    '.cover h1 em{color:' + al + '}' +
    '.cover .sub{font-size:11pt;color:#c9d4e0;margin-top:14px;max-width:5.6in}' +
    '.cover .bottom{position:relative;border-top:1px solid rgba(255,255,255,0.3);padding-top:14px;' +
    'display:flex;flex-wrap:wrap;gap:0.35in}' +
    '.cover .b-cell{min-width:1.5in}' +
    '.cover .b-cell .l{font-family:' + SANS + ';font-size:6.6pt;letter-spacing:1.8px;text-transform:uppercase;' +
    'color:' + al + ';margin-bottom:4px}' +
    '.cover .b-cell .v{font-size:10pt;color:#fff}' +
    '.cover .b-cell .s{font-family:' + SANS + ';font-size:7.2pt;color:#9db4cc;margin-top:2px}' +
    '.cover img{max-height:50px;max-width:190px;display:block}' +
    '.divider{background:' + A + ';color:#fff;display:flex;flex-direction:column;justify-content:center;' +
    'padding:0.9in}' +
    '.divider .eyebrow{color:' + al + '}' +
    '.divider h1{font-family:' + SERIF + ';font-weight:400;font-size:26pt;letter-spacing:2px;' +
    'text-transform:uppercase;line-height:1.15;color:#fff}' +
    '.divider h1 em{font-style:italic;color:' + al + '}' +
    '.divider p{color:#c9d4e0;font-size:10.5pt;max-width:5.4in;margin-top:14px}' +
    '.divider ul{color:#c9d4e0;margin-top:10px;font-size:9.5pt}' +

    /* annex */
    '.sheet .rh{margin-bottom:18px}' +
    '.tech-head{border-bottom:2px solid ' + A + ';padding-bottom:8px;margin-bottom:12px}' +
    '.tech-head .cat{font-family:' + SANS + ';font-size:6.8pt;letter-spacing:2px;text-transform:uppercase;' +
    'color:' + INKMUTE + '}' +
    '.tech-head h2{font-family:' + SERIF + ';font-size:15.5pt;font-weight:400;color:' + A + ';margin-top:2px}' +
    '.tech-block{page-break-inside:avoid;margin-bottom:11px}' +
    '.tech-block h3{font-family:' + SANS + ';font-size:7.4pt;letter-spacing:1.8px;text-transform:uppercase;' +
    'color:' + A + ';font-weight:700;margin-bottom:4px}' +
    '.auth-table td{text-align:left;vertical-align:top;font-size:8.6pt}' +
    '.auth-table td:first-child{white-space:nowrap;font-weight:600;color:' + A + '}' +
    '.toc-line{display:flex;align-items:baseline;font-family:' + SANS + ';font-size:9.5pt;margin-bottom:7px}' +
    '.toc-line .t{white-space:nowrap}' +
    '.toc-line .dots{flex:1;border-bottom:1px dotted #b9c0c8;margin:0 8px}' +
    '.toc-line .n{color:' + INKMUTE + '}' +
    '.disclaimer{font-family:' + SANS + ';font-size:7.4pt;color:#8792a0;border-top:1px solid ' + HAIR + ';' +
    'padding-top:8px;margin-top:14px;line-height:1.5}';
  }

  /* ------------------------------ charts ---------------------------------- */
  function burdenBarChart(baseline, best, years, W, H) {
    var L = 48, R = 40, T = 12, B = 22;
    var plotW = W - L - R, plotH = H - T - B;
    var vals = [];
    for (var y = 0; y < years; y++) {
      vals.push(baseline.years[y].totalBurden, best.result.years[y].totalBurden);
    }
    var yMax = Math.max.apply(null, vals) * 1.1 || 1;
    var groupW = plotW / years;
    var barW = Math.min(18, groupW * 0.32);
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
        '" rx="2" fill="' + AL() + '"/>';
      if (years <= 12) {
        svg += '<text x="' + cx + '" y="' + (T + plotH + 13) + '" text-anchor="middle" fill="' +
          INKMUTE + '">' + baseline.years[i].taxYear + '</text>';
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

  // Raw cumulative savings + "if invested" curve. Two series, one axis,
  // legend + direct end labels; the invested line is the accent, raw is ink.
  function savingsGrowthChart(baseline, best, years, rate, W, H) {
    var L = 48, R = 66, T = 14, B = 22;
    var plotW = W - L - R, plotH = H - T - B;
    var raw = [], inv = [], run = 0, val = 0;
    for (var y = 0; y < years; y++) {
      var s = baseline.years[y].totalBurden - best.result.years[y].totalBurden;
      run += s;
      val = val * (1 + rate) + s;
      raw.push(run);
      inv.push(val);
    }
    var yMax = Math.max.apply(null, inv.concat(raw).concat([1])) * 1.1;
    function X(i) { return years === 1 ? L + plotW : L + plotW * i / (years - 1); }
    function Y(v) { return T + plotH - Math.max(0, v) / yMax * plotH; }
    function path(arr) {
      return arr.map(function (v, i) {
        return (i ? 'L' : 'M') + X(i).toFixed(1) + ' ' + Y(v).toFixed(1);
      }).join(' ');
    }
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
      '<path d="' + path(inv) + ' L' + X(years - 1).toFixed(1) + ' ' + (T + plotH) + ' L' + L + ' ' +
      (T + plotH) + ' Z" fill="' + AL() + '" fill-opacity="0.16"/>' +
      '<path d="' + path(raw) + '" fill="none" stroke="#5b6673" stroke-width="2"/>' +
      '<path d="' + path(inv) + '" fill="none" stroke="' + anchor() + '" stroke-width="2"/>' +
      '<circle cx="' + X(years - 1) + '" cy="' + Y(inv[years - 1]) + '" r="3.5" fill="' + anchor() + '"/>' +
      '<text x="' + (X(years - 1) + 7) + '" y="' + (Y(inv[years - 1]) + 3) + '" fill="#22303f" ' +
      'font-weight="bold">' + usdK(inv[years - 1]) + '</text>' +
      '<circle cx="' + X(years - 1) + '" cy="' + Y(raw[years - 1]) + '" r="3" fill="#5b6673"/>' +
      '<text x="' + (X(years - 1) + 7) + '" y="' + (Y(raw[years - 1]) + 3) + '" fill="' + INKMUTE + '">' +
      usdK(raw[years - 1]) + '</text>' +
      '<text x="' + L + '" y="' + (T + plotH + 13) + '" fill="' + INKMUTE + '">' +
      baseline.years[0].taxYear + '</text>' +
      '<text x="' + X(years - 1) + '" y="' + (T + plotH + 13) + '" text-anchor="end" fill="' + INKMUTE + '">' +
      baseline.years[years - 1].taxYear + '</text>';
    return svg + '</svg>';
  }

  /* ------------------------------ shared ----------------------------------- */
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

  function statRow(cells) {
    return '<div class="statrow">' + cells.map(function (c) {
      return '<div class="stat"><div class="l">' + c[0] + '</div>' +
        '<div class="v' + (c[2] === 'neg' ? ' neg' : '') + '">' + c[1] +
        (c[3] ? '<span class="s">' + c[3] + '</span>' : '') + '</div></div>';
    }).join('') + '</div>';
  }

  function accentHeadline(name) {
    var words = esc(name).split(' ');
    if (words.length < 2) return '<em>' + words.join(' ') + '</em>';
    var last = words.pop();
    return words.join(' ') + ' <em>' + last + '</em>';
  }

  function paramsLine(st) {
    var parts = (st.strategy.inputs || []).map(function (inp) {
      var v = st.params[inp.key];
      if (v === undefined || v === null || v === '' || v === 0) return null;
      var shown = (inp.type === 'currency') ? usd(v) :
        (inp.type === 'percent') ? v + '%' : String(v);
      return esc(inp.label) + ': ' + esc(shown);
    }).filter(Boolean);
    return parts.length ? parts.join(' &nbsp;&middot;&nbsp; ') : '';
  }

  /**
   * data: lastRun shape (clientName, firmName, fees, profile, baseline,
   * scenarios, years, growthRate) + optional investRate (decimal).
   */
  TSIQ.render.binderReport = function (data) {
    var best = data.scenarios.reduce(function (a, b) {
      return b.result.totals.totalBurden < a.result.totals.totalBurden ? b : a;
    }, data.scenarios[0]);
    var baseYr1 = data.baseline.years[0];
    var bestYr1 = best.result.years[0];
    var yr1Savings = baseYr1.totalBurden - bestYr1.totalBurden;
    var cumSavings = data.baseline.totals.totalBurden - best.result.totals.totalBurden;
    var steps = attributionSteps(data, best);
    var modeled = steps.filter(function (st) { return st.yr1 >= 500 || st.cum >= 500; }).length;
    var foundations = steps.length - modeled;

    var effBase = baseYr1.totalIncome > 0 ? baseYr1.totalBurden / baseYr1.totalIncome : 0;
    var effPlan = bestYr1.totalIncome > 0 ? bestYr1.totalBurden / bestYr1.totalIncome : 0;

    var fees = data.fees || { planning: 0, annual: 0 };
    var yr1Cost = (fees.planning || 0) + (fees.annual || 0);
    var totalFees = (fees.planning || 0) + (fees.annual || 0) * data.years;
    var netBenefit = cumSavings - totalFees;
    var roi = yr1Cost > 0 ? yr1Savings / yr1Cost : 0;

    var rate = (typeof data.investRate === 'number' && isFinite(data.investRate))
      ? Math.max(0, Math.min(0.15, data.investRate)) : 0.08;
    var invested = 0;
    for (var y = 0; y < data.years; y++) {
      invested = invested * (1 + rate) +
        (data.baseline.years[y].totalBurden - best.result.years[y].totalBurden);
    }

    var today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    var C = { firm: data.firmName, client: data.clientName };
    var n = 0;
    var pages = [];

    function page(railLabel, eyebrow, headline, context, body) {
      n++;
      return '<div class="page">' +
        '<div class="rh micro"><span>' + esc(C.firm) + ' &middot; Tax Strategy Plan</span>' +
        '<span>' + esc(context || '') + '</span></div>' +
        '<div class="page-head">' +
        '<div class="hnum">' + ('0' + n).slice(-2) +
        '<div class="hlbl">' + esc(railLabel) + '</div></div>' +
        '<div class="htext">' +
        '<div class="eyebrow">' + eyebrow + '</div>' +
        '<h1 class="disp">' + headline + '</h1>' +
        '<div class="orn"><div class="d"></div><div class="l"></div></div>' +
        '</div></div>' +
        '<div class="page-body">' + body + '</div>' +
        '<div class="rf micro"><span>Private &amp; Confidential &middot; Prepared for ' +
        esc(C.client) + '</span><span>Part I &middot; __PG__</span></div>' +
        '</div>';
    }

    /* ================= COVER ================= */
    var logo = TSIQ.brand && TSIQ.brand.logo;
    pages.push('<div class="page cover"><div class="grid-bg"></div>' +
      '<div class="top">' +
      '<div>' + (logo ? '<img src="' + logo + '" alt="">' :
        '<div class="firmmark">' + esc(data.firmName) + '</div>') + '</div>' +
      '<div class="doctype micro">Tax Strategy Plan<br>Prepared ' + esc(today) + '</div>' +
      '</div><div class="rule-top"></div>' +
      '<div class="mid">' +
      '<div class="conf micro">Confidential &middot; Prepared exclusively for ' + esc(data.clientName) + '</div>' +
      '<h1>Your Complete<br>Tax Strategy <em>Plan.</em></h1>' +
      '<div class="sub">The full analysis: where you stand, the ' + steps.length +
      ' strategies we recommend, what each is worth in dollars, the law behind every one of them, ' +
      'and how we keep it working all year.</div>' +
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
      '<span>&nbsp;</span></div>' +
      '</div>');

    /* ================= CONTENTS ================= */
    var tocEntries = [
      ['Part I — Your Plan', ''],
      ['The Bottom Line', 'what the plan is worth'],
      ['Where You Stand', 'your current position'],
      ['The Plan at a Glance', 'every strategy, its dollar value'],
      ['What the Savings Become', 'raw and invested'],
      (yr1Cost > 0 ? ['Value vs. Investment', 'the fee and what it returns'] : null),
      ['The Strategies', steps.length + ' strategies in plain English'],
      ['How It Gets Done', 'implementation roadmap'],
      ['How We Keep It Working', 'monitoring & maintenance'],
      ['Part II — Technical Annex', ''],
      ['Methodology &amp; Assumptions', 'dated; the basis of every number'],
      ['Strategy Technical Sheets', 'mechanics, authority, requirements, risks'],
      ['Projection Detail', 'year-by-year, both scenarios'],
      ['Scope &amp; Limitations', 'what this plan does not model']
    ].filter(Boolean);
    pages.push(page('Contents', 'What Is In This Document',
      'The Complete <em>Picture.</em>', 'Contents',
      '<div>' + tocEntries.map(function (t) {
        return t[1] === ''
          ? '<div class="sub-serif" style="margin-top:14px">' + t[0] + '</div>'
          : '<div class="toc-line"><span class="t">' + t[0] + '</span><span class="dots"></span>' +
            '<span class="n">' + t[1] + '</span></div>';
      }).join('') + '</div>' +
      '<div class="callout">Part I is written for you — plain English, your numbers. Part II is the ' +
      'technical record behind it: the mechanics, the legal authority, the assumptions, and the ' +
      'math for every strategy. Your other advisors are welcome to test the plan against it.</div>'));

    /* ================= 0x · BOTTOM LINE ================= */
    pages.push(page('The Bottom Line', 'Executive Summary &middot; Tax Year ' + TSIQ.TABLES_2026.taxYear,
      'What This Plan Is <em>Worth.</em>', 'The Bottom Line',
      '<p class="lede">We analyzed your complete tax picture — every income source, entity, ' +
      'deduction, and payment — against current federal law and your state’s rules. Without ' +
      'changes, your ' + TSIQ.TABLES_2026.taxYear + ' tax is projected at <strong>' +
      usd(baseYr1.totalBurden) + '</strong>; over ' + data.years + ' years, <strong>' +
      usd(data.baseline.totals.totalBurden) + '</strong> would go to the government.</p>' +
      '<div class="hero"><div class="ht">Estimated Savings &middot; Your Complete Plan</div>' +
      '<p>Every strategy is credited only with the savings it adds on top of the ones before it — ' +
      'no double counting, and deferral give-backs are modeled, not hidden.</p>' +
      '<div class="grid">' +
      '<div class="cell"><div class="l">First year &middot; ' + TSIQ.TABLES_2026.taxYear + '</div>' +
      '<div class="v big">' + usd(yr1Savings) + '</div></div>' +
      '<div class="cell"><div class="l">Over ' + data.years + ' years</div>' +
      '<div class="v">' + usd(cumSavings) + '</div></div>' +
      '<div class="cell"><div class="l">Effective rate</div>' +
      '<div class="v">' + (effBase * 100).toFixed(1) + '% &rarr; ' + (effPlan * 100).toFixed(1) + '%</div>' +
      '</div></div></div>' +
      statRow([
        ['Baseline ' + TSIQ.TABLES_2026.taxYear + ' tax', usd(baseYr1.totalBurden), 'neg'],
        ['With the plan', usd(bestYr1.totalBurden)],
        [data.years + '-yr savings, if invested', usd(invested), '', 'at ' + (rate * 100).toFixed(1) + '% assumed']
      ]) +
      '<p style="font-size:9.3pt;color:#556270">Nothing here is aggressive for its own sake: every ' +
      'strategy stands on statute, regulation, or case law — documented, strategy by strategy, in ' +
      'the Technical Annex (Part II). We implement the plan with you, maintain it, and adjust it as ' +
      'the law and your business change.</p>'));

    /* ================= 0x · WHERE YOU STAND ================= */
    var p0 = baseYr1.profile;
    var incomeRows = [
      ['W-2 wages', (p0.wages || 0) + (p0.ownerWages || 0)],
      ['Business profit (Schedule C)', p0.scheduleCNet || 0],
      ['S-corp / partnership income', p0.passthroughK1 || 0],
      ['Rental real estate', p0.rentalNet || 0],
      ['Capital gains &amp; dividends', (p0.ltcg || 0) + (p0.qualDiv || 0)],
      ['Interest &amp; other income', (p0.interest || 0) + (p0.otherIncome || 0)]
    ].filter(function (r) { return Math.abs(r[1]) > 0.5; });
    var marginal = 0;
    try {
      var m0 = TSIQ.computeYear(Object.assign({}, data.profile));
      var m1 = TSIQ.computeYear(Object.assign({}, data.profile,
        { wages: (data.profile.wages || 0) + 1000 }));
      marginal = Math.max(0, Math.min(0.65, (m1.totalBurden - m0.totalBurden) / 1000));
    } catch (e) { marginal = 0; }
    var compRows = [
      ['Federal income tax', function (r) { return r.incomeTax; }],
      ['Self-employment / payroll tax', function (r) { return r.seTax + r.ownerPayrollTax + r.addlMedicare + r.otherTaxes; }],
      ['Net investment income tax', function (r) { return r.niit; }],
      ['Entity-level federal tax', function (r) { return r.corpTaxPaid; }],
      ['State tax (incl. entity-level)', function (r) { return r.totalState; }]
    ];
    var compCols = [{ label: 'Baseline', r: baseYr1 }].concat(data.scenarios.map(function (sc) {
      return { label: esc(sc.label), r: sc.result.years[0] };
    }));
    var compTable = '<table><thead><tr><th>First-Year Tax &middot; ' + TSIQ.TABLES_2026.taxYear + '</th>' +
      compCols.map(function (c) { return '<th>' + c.label + '</th>'; }).join('') + '</tr></thead><tbody>' +
      compRows.map(function (row) {
        var vals = compCols.map(function (c) { return row[1](c.r); });
        if (!vals.some(function (v) { return Math.abs(v) > 0.5; })) return '';
        return '<tr><td>' + row[0] + '</td>' + vals.map(function (v) {
          return '<td' + (v < 0 ? ' class="neg"' : '') + '>' + usd(v) + '</td>';
        }).join('') + '</tr>';
      }).join('') +
      '<tr class="total-row"><td>Total tax</td>' + compCols.map(function (c) {
        return '<td>' + usd(c.r.totalBurden) + '</td>';
      }).join('') + '</tr>' +
      '<tr><td>Savings vs. baseline</td>' + compCols.map(function (c, i) {
        return '<td class="acc">' + (i === 0 ? '&mdash;' : usd(baseYr1.totalBurden - c.r.totalBurden)) + '</td>';
      }).join('') + '</tr></tbody></table>';
    pages.push(page('Where You Stand', 'Your Current Position &middot; Before Planning',
      'Where You Stand <em>Today.</em>', 'Current Position',
      '<table><thead><tr><th>Where your income comes from</th><th>Amount</th></tr></thead><tbody>' +
      incomeRows.map(function (r) {
        return '<tr><td>' + r[0] + '</td><td' + (r[1] < 0 ? ' class="neg"' : '') + '>' + usd(r[1]) + '</td></tr>';
      }).join('') +
      '<tr class="total-row"><td>Total income</td><td>' + usd(baseYr1.totalIncome) + '</td></tr>' +
      '</tbody></table>' +
      compTable +
      '<div class="callout">Your projected tax is <strong>' + usd(baseYr1.totalBurden) +
      '</strong> — an effective rate of <strong>' + (effBase * 100).toFixed(1) + '%</strong>' +
      (marginal > 0.2
        ? '. At the margin it is worse: of the <em>next</em> $1,000 you earn, about <strong>' +
          usd(1000 - marginal * 1000) + '</strong> stays with you.'
        : '.') + '</div>'));

    /* ================= 0x · PLAN AT A GLANCE ================= */
    var totY = 0, totC = 0;
    var attrTable = '<table' + (steps.length >= 6 ? ' class="dense"' : '') +
      '><thead><tr><th style="width:30%">Strategy</th><th style="text-align:left">What it does</th>' +
      '<th>First-year</th><th>' + data.years + '-year</th></tr></thead><tbody>' +
      steps.map(function (st) {
        totY += st.yr1; totC += st.cum;
        var foundation = st.yr1 < 500 && st.cum < 500;
        return '<tr><td style="font-weight:600">' + esc(st.strategy.name) + '</td>' +
          '<td style="text-align:left;color:#556270">' + esc(st.strategy.client.teaser || '') + '</td>' +
          (foundation
            ? '<td colspan="2" style="text-align:center;color:' + INKMUTE + '">Foundation</td>'
            : '<td class="acc">' + usd(st.yr1) + '</td><td class="acc">' + usd(st.cum) + '</td>') +
          '</tr>';
      }).join('') +
      '<tr class="total-row"><td colspan="2">Your complete plan</td>' +
      '<td>' + usd(totY) + '</td><td>' + usd(totC) + '</td></tr></tbody></table>';
    pages.push(page('The Plan', 'Every Strategy &middot; Its Dollar Value',
      'The Plan at a <em>Glance.</em>', 'Strategy Attribution',
      '<p class="lede">Each strategy is credited only with the savings it adds on top of the ones ' +
      'before it — no double counting, no inflated totals. Full mechanics and legal authority for ' +
      'every line: Part II.</p>' + attrTable +
      '<div class="chart-title">Your tax bill &middot; with and without the plan</div>' +
      '<div class="legend"><span class="sw" style="background:' + anchor() + '"></span>Without plan' +
      '<span class="sw" style="background:' + AL() + '"></span>With plan</div>' +
      burdenBarChart(data.baseline, best, data.years, 640, 240)));

    /* ================= 0x · WHAT THE SAVINGS BECOME ================= */
    pages.push(page('The Growth', 'Raw Savings &middot; And What They Can Become',
      'What the Savings <em>Become.</em>', 'Savings Growth',
      '<p class="lede">Two views of the same plan. The gray line is your cumulative tax savings — ' +
      'money that simply does not leave. The ' + 'colored line assumes each year’s savings is ' +
      'invested and grows at <strong>' + (rate * 100).toFixed(1) + '% annually</strong> — a stated ' +
      'assumption you can change, shown separately from the savings themselves and from any ' +
      'fee-return figure.</p>' +
      '<div class="legend"><span class="sw" style="background:#5b6673"></span>Cumulative savings (no assumption)' +
      '<span class="sw" style="background:' + anchor() + '"></span>Invested at ' + (rate * 100).toFixed(1) + '% (assumed)</div>' +
      savingsGrowthChart(data.baseline, best, data.years, rate, 640, 300) +
      statRow([
        [data.years + '-year savings (raw)', usd(cumSavings)],
        ['If invested at ' + (rate * 100).toFixed(1) + '%', usd(invested)],
        ['Growth assumption', (rate * 100).toFixed(1) + '%', '', 'adjustable; before tax on growth']
      ]) +
      '<p style="font-size:8.8pt;color:' + INKMUTE + '">The invested figure is an illustration, not a ' +
      'projection of investment results: it assumes a constant pre-tax return, reinvestment of every ' +
      'dollar saved, and no tax on the growth itself. Markets vary; the assumption is shown so you ' +
      'can judge it.</p>'));

    /* ================= 0x · VALUE VS INVESTMENT ================= */
    if (yr1Cost > 0) {
      pages.push(page('Your Investment', 'The Fee &middot; And What It Returns',
        'Value vs. <em>Investment.</em>', 'Engagement Value',
        '<table><tbody>' +
        '<tr><td>Tax strategy plan (one-time)</td><td>' + usd(fees.planning) + '</td></tr>' +
        (fees.annual > 0
          ? '<tr><td>Annual implementation &amp; maintenance</td><td>' + usd(fees.annual) + '/yr</td></tr>'
          : '') +
        '<tr><td>Estimated first-year savings</td><td class="acc">' + usd(yr1Savings) + '</td></tr>' +
        '<tr><td>Estimated ' + data.years + '-year savings (raw)</td><td class="acc">' + usd(cumSavings) + '</td></tr>' +
        '<tr class="total-row"><td>' + data.years + '-year net benefit, after all fees</td>' +
        '<td>' + usd(netBenefit) + '</td></tr>' +
        '</tbody></table>' +
        (roi >= 1.2
          ? '<div class="hero"><div class="ht">Return on Plan Investment &middot; No Market Assumption</div>' +
            '<div class="grid" style="border-top:none;margin-top:0;padding-top:0">' +
            '<div class="cell"><div class="l">First year alone</div><div class="v big">' +
            roi.toFixed(1) + '&times;</div>' +
            '<div class="s">' + usd(yr1Savings) + ' savings vs. ' + usd(yr1Cost) + ' fee — raw tax ' +
            'savings only; the investment illustration on the previous page is shown separately</div></div>' +
            '</div></div>'
          : '') +
        statRow([
          ['Payback period', Math.max(1, Math.ceil(yr1Cost / Math.max(1, yr1Savings / 12))) + ' months'],
          ['Monthly savings equivalent', usd(yr1Savings / 12) + '/mo'],
          [data.years + '-year return on fees', (totalFees > 0 ? (cumSavings / totalFees).toFixed(1) : '&mdash;') + '&times;']
        ]) +
        '<div class="callout">The fee buys the analysis in this document, the implementation of ' +
        'every strategy in it — elections, filings, plan documents, payroll setup, documentation ' +
        'standards — and the maintenance that keeps the numbers true: monitoring, limit updates, ' +
        'law-change reviews, and the annual re-run of this plan against your actual results.</div>'));
    }

    /* ================= strategy pages (client) ================= */
    steps.forEach(function (st) {
      var c = st.strategy.client;
      var foundation = st.yr1 < 500 && st.cum < 500;
      var stat = statRow(foundation
        ? [['Role in the plan', 'Foundation'], ['Why it matters', 'Structural'],
           ['Full detail', 'Part II']]
        : [['First-year value', usd(st.yr1)], [data.years + '-year value', usd(st.cum)],
           ['Full detail', 'Part II']]);
      var pl = paramsLine(st);
      pages.push(page(st.strategy.category,
        esc(st.strategy.category) + ' &middot; Strategy ' + ('0' + (n)).slice(-2),
        accentHeadline(st.strategy.name), esc(st.strategy.name),
        '<p class="lede">' + esc(c.headline) + '</p>' + stat +
        (pl ? '<div class="your-numbers">Modeled with your numbers &mdash; ' + pl + '</div>' : '') +
        c.plainEnglish.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('') +
        (c.analogy ? '<div class="analogy">' + esc(c.analogy) + '</div>' : '') +
        '<div class="cols"><div class="col">' +
        '<div class="sub-serif">What this means for you</div><ul>' +
        c.benefits.slice(0, 4).map(function (b) { return '<li>' + esc(b) + '</li>'; }).join('') + '</ul>' +
        '<div class="sub-serif">How we make it happen</div><ul>' +
        c.steps.slice(0, 4).map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul>' +
        '</div><div class="col">' +
        '<div class="sub-serif">Things to know</div><ul>' +
        c.considerations.slice(0, 3).map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul>' +
        '</div></div>'));
    });

    /* ================= roadmap ================= */
    pages.push(page('Roadmap', 'From Paper to Practice',
      'How It Gets <em>Done.</em>', 'Implementation',
      '<p class="lede">We lead every step; the checkboxes are for our working sessions together.</p>' +
      '<table' + (steps.length >= 6 ? ' class="dense"' : '') +
      '><thead><tr><th style="width:32%">Strategy</th><th style="text-align:left">First actions</th>' +
      '</tr></thead><tbody>' +
      steps.map(function (st) {
        var first = (st.strategy.client.steps || []).slice(0, steps.length > 6 ? 1 : 2);
        return '<tr><td style="font-weight:600">' + esc(st.strategy.name) + '</td>' +
          '<td style="text-align:left">' +
          first.map(function (s) { return '<span class="cb"></span>' + esc(s); }).join('<br>') +
          '</td></tr>';
      }).join('') + '</tbody></table>' +
      '<div class="sub-serif">What happens next</div><ul>' +
      '<li>We walk through this plan together and answer every question.</li>' +
      '<li>You approve the strategies; we execute the elections, documents, and payroll changes.</li>' +
      '<li>We check the numbers against the plan at year-end and update it as law and life change.</li>' +
      '</ul>'));

    /* ================= monitoring / maintenance ================= */
    pages.push(page('Maintenance', 'Why a Plan Is Never Finished',
      'How We Keep It <em>Working.</em>', 'Monitoring',
      '<p class="lede">Every number in this plan rests on the dated assumptions in Part II. ' +
      'Businesses do not hold still — profit moves, law changes, limits index, and a plan left ' +
      'alone quietly drifts away from reality. Maintenance is what keeps the savings real.</p>' +
      '<table><thead><tr><th style="width:22%">Cadence</th><th style="text-align:left">What we do</th>' +
      '</tr></thead><tbody>' +
      '<tr><td style="font-weight:600">Quarterly</td><td style="text-align:left">Profit check against plan ' +
      'assumptions; estimated-payment true-up; flag any strategy drifting off its numbers.</td></tr>' +
      '<tr><td style="font-weight:600">Mid-year</td><td style="text-align:left">Full re-run of this plan ' +
      'against actuals; salary/contribution recalibration; law-change review.</td></tr>' +
      '<tr><td style="font-weight:600">Year-end</td><td style="text-align:left">Deadline sweep — elections, ' +
      'payments, contributions, documentation — before the year closes the window.</td></tr>' +
      '<tr><td style="font-weight:600">Annually</td><td style="text-align:left">This document is reissued ' +
      'with the new year’s limits and your actual results, so the plan never goes stale.</td></tr>' +
      '</tbody></table>' +
      '<div class="callout">A tax plan that is written once and never touched becomes a list of ' +
      'missed deadlines. The maintenance engagement is not an add-on to this plan — it is how the ' +
      'plan stays true.</div>'));

    /* number Part I pages */
    var partOne = pages.map(function (pg, i) {
      return pg.split('__PG__').join('Page ' + (i + 1));
    }).join('');

    /* ================= PART II — TECHNICAL ANNEX ================= */
    var annex = '';
    annex += '<div class="page divider"><div>' +
      '<div class="eyebrow micro">Part II</div>' +
      '<h1>Technical <em>Annex.</em></h1>' +
      '<p>The record behind every number in Part I: methodology, dated assumptions, and a ' +
      'technical sheet for each strategy — mechanics, legal authority, requirements, risk factors, ' +
      'and implementation detail. Written for your advisors as much as for you.</p>' +
      '<ul><li>A1 &middot; Methodology &amp; Assumptions</li>' +
      '<li>A2 &middot; Strategy Technical Sheets (' + steps.length + ')</li>' +
      '<li>A3 &middot; Projection Detail</li>' +
      '<li>A4 &middot; Scope &amp; Limitations</li></ul>' +
      '</div></div>';

    function sheetHead(context) {
      return '<div class="rh micro"><span>' + esc(C.firm) + ' &middot; Technical Annex</span>' +
        '<span>' + esc(context) + '</span></div>';
    }

    /* ---- A1 · methodology & assumptions ---- */
    var pr = data.profile;
    var assumptionRows = [
      ['Tax year modeled', String(TSIQ.TABLES_2026.taxYear)],
      ['Filing status', TSIQ.FILING_STATUS_LABELS[pr.filingStatus] || ''],
      ['Projection horizon', data.years + ' years'],
      ['Annual income growth', (data.growthRate * 100).toFixed(1) + '%'],
      ['State effective rate', ((pr.stateRate || 0) * 100).toFixed(1) + '% (flat; no state brackets)'],
      ['Invested-savings return (illustration only)', (rate * 100).toFixed(1) + '% pre-tax, reinvested'],
      ['Baseline income inputs', 'Per Section 1 of the planning file as of ' + today]
    ];
    annex += '<div class="sheet">' + sheetHead('A1 · Methodology & Assumptions') +
      '<div class="tech-head"><div class="cat">A1</div><h2>Methodology &amp; Assumptions</h2></div>' +
      '<div class="tech-block"><h3>Dated assumptions — the basis of every number</h3>' +
      '<table class="auth-table"><tbody>' +
      assumptionRows.map(function (r) {
        return '<tr><td style="width:36%">' + esc(r[0]) + '</td><td>' + esc(r[1]) + '</td></tr>';
      }).join('') + '</tbody></table>' +
      '<p style="font-size:8.8pt;color:' + INKMUTE + '">Assumptions dated ' + esc(today) + '. When your ' +
      'actual results diverge from these inputs, the plan is re-run (see the maintenance cadence in ' +
      'Part I) — the figures in this document are estimates as of this date, not guarantees.</p></div>' +
      '<div class="tech-block"><h3>How the numbers are computed</h3><ul>' +
      '<li>Federal figures follow ' + TSIQ.TABLES_2026.taxYear + ' law: Rev. Proc. 2025-32 as amended ' +
      'by the One Big Beautiful Bill Act (P.L. 119-21), including the OBBBA SALT cap phase-down, ' +
      '§199A thresholds, and current retirement/fringe limits (Notice 2025-67, Rev. Proc. 2025-19).</li>' +
      '<li>Each strategy is applied in a defined order to a copy of your profile; the engine then ' +
      'computes the full year — brackets, SE/payroll tax, QBI with the W-2 wage limit, NIIT, ' +
      'additional Medicare, child tax credit, SALT-capped itemizing — from the modified profile.</li>' +
      '<li>Attribution: strategies are credited marginally, in order — each with only the savings it ' +
      'adds beyond the strategies before it. The per-strategy values sum exactly to the plan total.</li>' +
      '<li>Timing honesty: acceleration and deferral strategies model the later-year give-back ' +
      '(depreciation reversals, suspended losses); real costs a strategy creates (payroll taxes on ' +
      'new wages, entity-level taxes) are charged inside the burden, not footnoted.</li>' +
      '<li>Projection years reuse ' + TSIQ.TABLES_2026.taxYear + ' law and limits without inflation ' +
      'indexing — a conservative convention for deduction-driven strategies.</li>' +
      '</ul></div></div>';

    /* ---- A2 · per-strategy technical sheets ---- */
    steps.forEach(function (st, i) {
      var a = st.strategy.advisor;
      var pl = paramsLine(st);
      var foundation = st.yr1 < 500 && st.cum < 500;
      annex += '<div class="sheet">' + sheetHead('A2 · Strategy ' + (i + 1) + ' of ' + steps.length) +
        '<div class="tech-head"><div class="cat">' + esc(st.strategy.category) +
        ' &middot; Technical Sheet</div><h2>' + esc(st.strategy.name) + '</h2></div>' +
        statRow(foundation
          ? [['Role', 'Foundation'], ['Modeled value', 'Structural'], ['Applied order', String(st.strategy.applyOrder)]]
          : [['First-year value', usd(st.yr1)], [data.years + '-year value', usd(st.cum)],
             ['Applied order', String(st.strategy.applyOrder)]]) +
        (pl ? '<div class="your-numbers">Parameters &mdash; ' + pl + '</div>' : '') +
        '<div class="tech-block"><h3>Summary</h3><p style="font-size:9.2pt">' + esc(a.summary) + '</p></div>' +
        '<div class="tech-block"><h3>Mechanics</h3><ul>' +
        (a.mechanics || []).map(function (m) { return '<li>' + esc(m) + '</li>'; }).join('') + '</ul></div>' +
        '<div class="tech-block"><h3>Authority</h3>' +
        '<table class="auth-table"><tbody>' +
        (a.authority || []).map(function (au) {
          return '<tr><td style="width:26%">' + esc(au.cite) + '</td><td>' + esc(au.note) + '</td></tr>';
        }).join('') + '</tbody></table></div>' +
        '<div class="tech-block"><h3>Requirements</h3><ul>' +
        (a.requirements || []).map(function (r) { return '<li>' + esc(r) + '</li>'; }).join('') + '</ul></div>' +
        '<div class="tech-block"><h3>Risk factors</h3><ul>' +
        (a.risks || []).map(function (r) { return '<li>' + esc(r) + '</li>'; }).join('') + '</ul></div>' +
        '<div class="tech-block"><h3>Implementation</h3><ul>' +
        (a.implementation || []).map(function (r) { return '<li>' + esc(r) + '</li>'; }).join('') + '</ul></div>' +
        '</div>';
    });

    /* ---- A3 · projection detail ---- */
    var projHead = '<tr><th>Year</th><th>Baseline</th>' + data.scenarios.map(function (sc) {
      return '<th>' + esc(sc.label) + '</th><th>Savings</th>';
    }).join('') + '</tr>';
    var projBody = '';
    var cums = data.scenarios.map(function () { return 0; });
    for (var yy = 0; yy < data.years; yy++) {
      var bb = data.baseline.years[yy].totalBurden;
      projBody += '<tr><td>' + data.baseline.years[yy].taxYear + '</td><td>' + usd(bb) + '</td>';
      data.scenarios.forEach(function (sc, ii) {
        var v = sc.result.years[yy].totalBurden;
        cums[ii] += bb - v;
        projBody += '<td>' + usd(v) + '</td><td class="acc">' + usd(bb - v) + '</td>';
      });
      projBody += '</tr>';
    }
    projBody += '<tr class="total-row"><td>Cumulative</td><td>' + usd(data.baseline.totals.totalBurden) + '</td>';
    data.scenarios.forEach(function (sc, ii) {
      projBody += '<td>' + usd(sc.result.totals.totalBurden) + '</td><td>' + usd(cums[ii]) + '</td>';
    });
    projBody += '</tr>';
    var fedStateRows = '';
    for (var yz = 0; yz < data.years; yz++) {
      var by = data.baseline.years[yz], sy = best.result.years[yz];
      fedStateRows += '<tr><td>' + by.taxYear + '</td>' +
        '<td>' + usd(by.totalFederal) + '</td><td>' + usd(by.totalState) + '</td>' +
        '<td>' + usd(sy.totalFederal) + '</td><td>' + usd(sy.totalState) + '</td></tr>';
    }
    annex += '<div class="sheet">' + sheetHead('A3 · Projection Detail') +
      '<div class="tech-head"><div class="cat">A3</div><h2>Projection Detail</h2></div>' +
      '<div class="tech-block"><h3>Total burden, year by year — all modeled scenarios</h3>' +
      '<table class="dense"><thead>' + projHead + '</thead><tbody>' + projBody + '</tbody></table></div>' +
      '<div class="tech-block"><h3>Federal / state split — baseline vs. recommended (' + esc(best.label) + ')</h3>' +
      '<table class="dense"><thead><tr><th>Year</th><th>Baseline federal</th><th>Baseline state</th>' +
      '<th>Plan federal</th><th>Plan state</th></tr></thead><tbody>' + fedStateRows + '</tbody></table></div>' +
      '</div>';

    /* ---- A4 · scope & limitations ---- */
    annex += '<div class="sheet">' + sheetHead('A4 · Scope & Limitations') +
      '<div class="tech-head"><div class="cat">A4</div><h2>Scope &amp; Limitations</h2></div>' +
      '<div class="tech-block"><h3>Not modeled in these projections</h3><ul>' +
      '<li>Alternative minimum tax (AMT).</li>' +
      '<li>Depreciation recapture on a future sale, and §461(l) excess business loss limits.</li>' +
      '<li>The refundable (ACTC) portion of the child tax credit.</li>' +
      '<li>State tax beyond a flat effective rate — no state brackets or conformity differences; ' +
      'entity-level state tax (PTET) is modeled with a state-base addback.</li>' +
      '<li>Inflation indexing in projection years beyond ' + TSIQ.TABLES_2026.taxYear + '.</li>' +
      '<li>Tax on the growth of invested savings in the investment illustration.</li>' +
      '</ul><p style="font-size:8.8pt;color:' + INKMUTE + '">Where a strategy is sensitive to one of ' +
      'these items, its technical sheet says so. We model conservatively and flag rather than ' +
      'assume.</p></div>' +
      '<div class="disclaimer">These projections are planning estimates based on the information ' +
      'provided and the dated assumptions in A1 — not a guarantee of results, not investment advice, ' +
      'and not a substitute for the engagement itself. Strategies require proper implementation and ' +
      'documentation to deliver the benefits shown. ' + esc(data.firmName) + ' confirms final figures ' +
      'on filed returns. Prepared ' + esc(today) + ' exclusively for ' + esc(data.clientName) + '. ' +
      'Private &amp; confidential.</div>' +
      '</div>';

    var html = '<!DOCTYPE html><html><head><meta charset="utf-8">' +
      '<title>Tax Strategy Plan — ' + esc(data.clientName) + '</title>' +
      '<style>' + css() + '</style></head><body>' +
      partOne + annex + '</body></html>';

    var w = window.open('', '_blank');
    if (!w) { alert('Pop-up blocked — please allow pop-ups for this page.'); return; }
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(function () { w.print(); }, 600);
  };
})();
