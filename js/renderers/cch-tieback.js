/* ============================================================================
 * CCH PLANNER TIE-BACK RENDERER — a working document for the advisor, not a
 * client deliverable. For the baseline and each scenario it lists the
 * post-strategy INPUT values per projection year, labeled with CCH ProSystem
 * fx Planning row names, so the plan can be keyed into a Planner case
 * (Baseline → Case 1, Scenario 2 → Case 2, …) and verified there. CCH then
 * recomputes AGI/tax with its full engine — small differences from this
 * tool's simplified model (AMT, SS phase-ins, state detail) are expected;
 * large ones mean a keying or modeling issue worth chasing.
 * ==========================================================================*/
window.TSIQ = window.TSIQ || {};
TSIQ.render = TSIQ.render || {};

(function () {
  var esc = function (s) { return TSIQ.esc(s); };
  var usd = function (n) { return TSIQ.fmt.usd(n); };

  // [TSP meaning, CCH Planning row to key it into, profile accessor]
  var ROWS = [
    ['Outside W-2 wages', 'Wages → Taxable Wages (outside W-2 activity)', function (p) { return p.wages; }],
    ['Owner W-2 wages (own entity)', 'Wages → Taxable Wages (owner W-2 activity)', function (p) { return p.ownerWages; }],
    ['Schedule C net profit', 'Business → Net Profit', function (p) { return p.scheduleCNet; }],
    ['S-corp / partnership ordinary income', 'Passthrough → Ordinary Income (Sch E p2)', function (p) { return p.passthroughK1; }],
    ['Entity W-2 wages (§199A wage limit)', 'Passthrough / Business → Qualified Wages', function (p) { return p.entityW2Wages; }],
    ['Rental net income / (loss)', 'Rent & Royalty → Net Income', function (p) { return p.rentalNet; }],
    ['Long-term capital gain', 'Capital Gains → Long-term Gain', function (p) { return p.ltcg; }],
    ['Qualified dividends', 'Dividends → Qualified Dividends', function (p) { return p.qualDiv; }],
    ['Interest / ordinary dividends', 'Interest Income', function (p) { return p.interest; }],
    ['Other income', 'Other Income', function (p) { return p.otherIncome; }],
    ['Above-the-line adjustments (retirement, SEHI, HSA…)', 'Adjustments to Income', function (p) { return p.adjustments; }],
    ['Property tax', 'Itemized → Taxes — Real Estate', function (p) { return p.propertyTax; }],
    ['Mortgage interest', 'Itemized → Interest — Home Mortgage', function (p) { return p.mortgageInterest; }],
    ['Charitable contributions', 'Itemized → Contributions', function (p) { return p.charitable; }],
    ['Other itemized deductions', 'Itemized → Other Deductions', function (p) { return p.otherItemized; }]
  ];

  // Amounts that do NOT key directly into a Planner input row — surfaced as
  // notes so the advisor handles them deliberately in CCH.
  function specialRows(years) {
    var notes = [];
    function sum(fn) {
      var t = 0;
      years.forEach(function (y) { t += fn(y.profile) || 0; });
      return t;
    }
    var ptet = sum(function (p) { return p.ptetPaid; });
    if (ptet > 0.5) {
      notes.push('PTET: the K-1 row above is already NET of the entity-level state tax (' +
        usd(years[0].profile.ptetPaid) + ' in year 1). In CCH, reduce the passthrough income ' +
        'by the PTET and enter the owner\'s state credit per your state\'s mechanics.');
    }
    var corp = sum(function (p) { return p.corpTaxPaid; });
    if (corp > 0.5) {
      notes.push('Entity-level C-corp tax (' + usd(years[0].profile.corpTaxPaid) + ' in year 1) is ' +
        'outside the 1040 — model the corporate side separately in CCH; the income rows above ' +
        'already exclude amounts retained in the corporation.');
    }
    var other = sum(function (p) { return p.otherTaxes; });
    if (other > 0.5) {
      notes.push('Additional payroll taxes created by strategies (family/spouse wages FICA — ' +
        usd(years[0].profile.otherTaxes) + ' in year 1) have no 1040 input row; CCH picks up ' +
        'the wage-side FICA through the W-2 activities if you key the family wages there.');
    }
    var qbiRed = sum(function (p) { return p.qbiReduction; });
    if (qbiRed > 0.5) {
      notes.push('Do not key the QBI reduction separately — CCH computes §199A itself from the ' +
        'wage/SEHI/retirement entries above.');
    }
    return notes;
  }

  function sectionTable(title, cchCase, result) {
    var years = result.years;
    var html = '<h2>' + esc(title) + ' <span class="case-tag">key into ' + esc(cchCase) + '</span></h2>';
    html += '<table><thead><tr><th>Row (CCH Planning)</th>' +
      years.map(function (y) { return '<th>' + y.taxYear + '</th>'; }).join('') +
      '</tr></thead><tbody>';
    ROWS.forEach(function (row) {
      var vals = years.map(function (y) { return row[2](y.profile) || 0; });
      var any = vals.some(function (v) { return Math.abs(v) > 0.5; });
      if (!any) return;
      html += '<tr><td><div class="tsp">' + esc(row[0]) + '</div>' +
        '<div class="cch">' + esc(row[1]) + '</div></td>' +
        vals.map(function (v) { return '<td>' + usd(v) + '</td>'; }).join('') + '</tr>';
    });
    html += '</tbody></table>';
    var notes = specialRows(years);
    if (notes.length) {
      html += '<ul class="notes">' + notes.map(function (n) {
        return '<li>' + esc(n) + '</li>';
      }).join('') + '</ul>';
    }
    return html;
  }

  function strategyList(sc) {
    if (!sc.selections || !sc.selections.length) return '';
    return '<p class="strategies"><strong>Strategies in this scenario:</strong> ' +
      sc.selections.map(function (sel) {
        var params = (sel.strategy.inputs || []).map(function (inp) {
          var v = sel.params[inp.key];
          if (v === undefined || v === '' || v === null) return null;
          return esc(inp.label) + ': ' + (inp.type === 'select' ? esc(String(v)) : esc(String(v)));
        }).filter(Boolean).join(', ');
        return esc(sel.strategy.name) + (params ? ' (' + params + ')' : '');
      }).join('; ') + '</p>';
  }

  var CSS = '' +
    '*{box-sizing:border-box;margin:0;padding:0}' +
    'body{font-family:Arial,Helvetica,sans-serif;color:#1a2332;font-size:10.5pt;line-height:1.45;padding:28px}' +
    'h1{font-size:17pt;font-weight:600;margin-bottom:2px}' +
    '.sub{color:#667;margin-bottom:6px}' +
    '.warn{background:#fdf6e3;border-left:4px solid #b58900;padding:10px 14px;margin:14px 0;font-size:9.5pt}' +
    'h2{font-size:13pt;font-weight:600;margin:22px 0 8px}' +
    '.case-tag{font-size:9pt;font-weight:400;color:#8a6d3b;border:1px solid #8a6d3b;border-radius:3px;padding:1px 7px;vertical-align:middle}' +
    'table{width:100%;border-collapse:collapse;margin:8px 0 4px;font-size:9pt}' +
    'th,td{padding:5px 8px;border-bottom:1px solid #ddd;text-align:right;white-space:nowrap}' +
    'th:first-child,td:first-child{text-align:left;white-space:normal}' +
    'thead th{border-bottom:2px solid #1a2332}' +
    '.tsp{font-weight:600}.cch{color:#8a6d3b;font-size:8pt}' +
    '.notes{margin:8px 0 0 18px;font-size:9pt;color:#445}.notes li{margin-bottom:4px}' +
    '.strategies{font-size:9.5pt;color:#445;margin-top:4px}' +
    '.print-btn{position:fixed;top:14px;right:16px;padding:8px 18px;font-size:10pt;cursor:pointer;background:#1a2332;color:#fff;border:none;border-radius:4px}' +
    '@media print{.print-btn{display:none}body{padding:0}}' +
    '@page{size:landscape;margin:0.5in}';

  /**
   * run: the lastRun object from app.js (clientName, baseline, scenarios,
   * years, growthRate). Values come from each year's post-strategy profile.
   */
  TSIQ.render.cchTieback = function (run) {
    var color = (TSIQ.brand && TSIQ.brand.color) || '#8a6d3b';
    var html = '<!DOCTYPE html><html><head><meta charset="utf-8">' +
      '<title>CCH Planner Tie-Back — ' + esc(run.clientName) + '</title>' +
      '<style>' + CSS.split('#8a6d3b').join(color) + '</style></head><body>' +
      '<button class="print-btn" onclick="window.print()">Print</button>' +
      '<h1>CCH Planner Tie-Back Sheet</h1>' +
      '<div class="sub">' + esc(run.clientName) + ' &middot; Tax Year ' +
      TSIQ.TABLES_2026.taxYear + ' &middot; ' + run.years + '-year projection &middot; ' +
      (run.growthRate * 100).toFixed(1) + '% growth &middot; internal working document</div>' +
      '<div class="warn">Key each section into the matching CCH Planning case and let CCH ' +
      'recompute. Small differences from this tool are expected (AMT, Social Security ' +
      'phase-ins, state detail, rounding); large ones indicate a keying or modeling gap. ' +
      'Do not send this sheet to the client.</div>';

    html += sectionTable('Baseline (no strategies)', 'Case 1', run.baseline);
    run.scenarios.forEach(function (sc, i) {
      html += sectionTable(sc.label, 'Case ' + (i + 2), sc.result);
      html += strategyList(sc);
    });

    html += '</body></html>';

    var w = window.open('', '_blank');
    if (!w) { alert('Pop-up blocked — please allow pop-ups for this page.'); return; }
    w.document.write(html);
    w.document.close();
    w.focus();
  };
})();
