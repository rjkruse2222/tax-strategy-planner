/* ============================================================================
 * SCENARIO ENGINE — composes strategies over a multi-year projection.
 * A scenario = a list of {strategyId, params}. Strategies are applied in
 * their declared applyOrder, each receiving the profile produced by the
 * previous one. No strategy-specific logic lives here.
 * ==========================================================================*/
window.TSIQ = window.TSIQ || {};

(function () {
  // Income fields that grow with the client's assumed growth rate.
  var GROWTH_FIELDS = ['wages', 'scheduleCNet', 'passthroughK1', 'rentalNet',
    'ltcg', 'qualDiv', 'interest', 'otherIncome',
    'propertyTax', 'mortgageInterest', 'charitable', 'otherItemized'];

  function grownProfile(base, growthRate, yearIndex) {
    var p = Object.assign({}, base);
    var factor = Math.pow(1 + growthRate, yearIndex);
    GROWTH_FIELDS.forEach(function (k) {
      if (typeof p[k] === 'number') p[k] = p[k] * factor;
    });
    // A one-time sale must not recur (grown!) in every projection year —
    // that would distort later-year brackets, NIIT, and 0/15/20% stacking
    // in both baseline and scenarios.
    if (yearIndex > 0 && base.ltcgOneTime) p.ltcg = 0;
    // Withholding/estimates are year-to-date payments for the CURRENT year —
    // they don't apply to projection years 2+.
    if (yearIndex > 0) {
      p.fedWithholding = 0; p.fedEstimates = 0;
      p.stateWithholding = 0; p.stateEstimates = 0;
    }
    return p;
  }

  /**
   * Run one scenario across `years` years.
   * selections: [{ strategy, params }] — strategy is the library object.
   * Returns { years: [yearResult...], totals: {...}, notes: [...] }.
   */
  TSIQ.computeScenario = function (baseProfile, selections, years, growthRate) {
    var ordered = selections.slice().sort(function (a, b) {
      return a.strategy.applyOrder - b.strategy.applyOrder;
    });
    var state = {};           // multi-year memory shared by engine + strategies
    var allNotes = [];
    var yearResults = [];

    for (var y = 0; y < years; y++) {
      var profile = grownProfile(baseProfile, growthRate, y);
      profile.ptetPaid = 0;
      profile.stateAddback = 0;
      profile.ownerWages = profile.ownerWages || 0;
      profile.entityW2Wages = profile.entityW2Wages || 0;

      ordered.forEach(function (sel) {
        var out = sel.strategy.apply(profile, sel.params, y, state);
        profile = out.profile;
        (out.notes || []).forEach(function (n) {
          var tagged = '[' + sel.strategy.name + '] ' + n;
          if (allNotes.indexOf(tagged) === -1) allNotes.push(tagged);
        });
      });

      var result = TSIQ.computeYear(profile, state);
      result.yearIndex = y;
      result.taxYear = TSIQ.TABLES_2026.taxYear + y;
      yearResults.push(result);
    }

    var totals = { totalFederal: 0, totalState: 0, totalBurden: 0 };
    yearResults.forEach(function (r) {
      totals.totalFederal += r.totalFederal;
      totals.totalState += r.totalState;
      totals.totalBurden += r.totalBurden;
    });

    return { years: yearResults, totals: totals, notes: allNotes };
  };

  /** Convenience: baseline is a scenario with no strategies. */
  TSIQ.computeBaseline = function (baseProfile, years, growthRate) {
    return TSIQ.computeScenario(baseProfile, [], years, growthRate);
  };
})();
