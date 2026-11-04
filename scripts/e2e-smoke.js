/* ============================================================================
 * END-TO-END SMOKE TEST — run with:
 *   NODE_PATH=$(npm root -g) node scripts/e2e-smoke.js        (global playwright)
 *   npx playwright install chromium   # once, if no browser is present
 * Drives the real app headlessly: fills a synthetic client, selects strategies
 * in both scenarios, runs the comparison, opens all five client outputs,
 * checks the pitch deck stays anonymized, and round-trips Export -> Import.
 * Exits 0 only if every check passes. Screenshots land in OUT_DIR
 * (default: ./e2e-out, gitignored). No real client data is used or written.
 * ==========================================================================*/
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const OUT = process.env.OUT_DIR || path.join(ROOT, 'e2e-out');
fs.mkdirSync(OUT, { recursive: true });
const INDEX = 'file://' + path.join(ROOT, 'index.html');
const R = [];
const ok = (name, cond, extra) => { R.push({ name, pass: !!cond, extra }); };
(async () => {
  const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const ctx = await browser.newContext({ acceptDownloads: true });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('CONSOLE: ' + m.text()); });
  await page.goto(INDEX);
  await page.waitForTimeout(800);

  // --- Section 1: realistic S-corp owner profile (synthetic) ---
  const fill = async (id, v) => {
    const found = await page.evaluate(([id, v]) => { const el = document.getElementById(id); if (!el) return false;
      el.value = String(v); el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); return true; }, [id, v]);
    if (!found) ok('field exists: ' + id, false);
  };
  // why are scenario checkboxes hidden? (collapsed category? hidden tab?)
  const vis = await page.evaluate(() => { const el = document.getElementById('sc2-augusta-rule'); let n = el, chain = [];
    while (n && n !== document.body) { const cs = getComputedStyle(n); if (cs.display === 'none' || cs.visibility === 'hidden' || n.hidden) chain.push((n.tagName + '#' + n.id + '.' + n.className).slice(0, 60)); n = n.parentElement; } return chain; });
  ok('scenario picker visibility (hidden ancestors listed)', true, vis.join(' > ') || 'none hidden');
  await page.selectOption('#filingStatus', 'mfj').catch(async () => ok('filingStatus select', false));
  await fill('clientName', 'Sample Client');
  await fill('wages', 120000); await fill('ownerWages', 90000); await fill('passthroughK1', 310000);
  await fill('entityW2Wages', 180000); await fill('scheduleCNet', 0); await fill('rentalNet', 18000);
  await fill('ltcg', 25000); await fill('qualDiv', 8000); await fill('interest', 4000);
  await fill('propertyTax', 9000); await fill('mortgageInterest', 14000); await fill('charitable', 12000);
  await fill('kidsCTC', 2); await fill('stateRatePct', 3.5); await fill('years', 10);

  // --- Section 3: pick strategies (sc2 broad mix incl. new ones; sc3 lighter) ---
  const check = async (id, params) => {
    const el = page.locator('#' + id);
    if (!(await el.count())) { ok('checkbox exists: ' + id, false); return; }
    const disabled = await el.isDisabled();
    if (disabled) { ok('checkbox enabled: ' + id, false, 'disabled (conflict lock?)'); return; }
    await page.evaluate((id) => { const el = document.getElementById(id); if (!el.checked) el.click(); }, id);
    await page.waitForTimeout(60);
    for (const [k, v] of Object.entries(params || {})) await fill(id + '-' + k, v);
  };
  await check('sc2-augusta-rule', { days: 12, dailyRate: 500 });
  await check('sc2-hire-children', { numChildren: 2, wagesPerChild: 12000 });
  await check('sc2-solo-401k');
  await check('sc2-ptet', { ptetRatePct: 3.5 });
  await check('sc2-ic-disc', { commission: 40000 });
  await check('sc2-fica-tip-credit-45b', { creditAmount: 6000 });
  await check('sc2-qcd-planning', { qcdAmount: 10000 });
  await check('sc2-section-754-election');   // advisory
  await check('sc3-augusta-rule', { days: 12, dailyRate: 500 });
  await check('sc3-s-corp-election', { salary: 90000 });

  // conflict lock check: SEP + Solo 401k should conflict
  const sepLockedAfterSolo = await page.locator('#sc2-sep-ira').isDisabled().catch(() => null);
  ok('conflict lock: SEP disabled while Solo 401k checked', sepLockedAfterSolo === true, String(sepLockedAfterSolo));

  // --- Run Comparison ---
  await page.click('#compute');
  await page.waitForTimeout(1500);
  const after = await page.evaluate(() => {
    const txt = document.body.innerText;
    const tables = document.querySelectorAll('table').length;
    const hasBaseline = /Baseline/.test(txt), hasScen2 = /Scenario 2/.test(txt), hasSavings = /[Ss]avings/.test(txt);
    const money = (txt.match(/\$[\d,]{5,}/g) || []).length;
    const notes = (txt.match(/Advisory strategy/g) || []).length;
    const lr = (window.TSIQ && TSIQ.lastRun) ? Object.keys(TSIQ.lastRun) : null;
    return { tables, hasBaseline, hasScen2, hasSavings, money, notes, lr };
  });
  ok('compute rendered tables', after.tables >= 2, after.tables + ' tables');
  ok('shows Baseline + Scenario 2', after.hasBaseline && after.hasScen2);
  ok('shows savings', after.hasSavings);
  ok('dollar figures rendered', after.money > 20, after.money + ' amounts');
  ok('advisory note surfaced (§754)', after.notes >= 1, after.notes);

  // fee inputs appear after compute; set them for pitch deck
  for (const [id, v] of [['feePlanning', 9500], ['feeAnnual', 2400]]) {
    const el = page.locator('#' + id); if (await el.count()) { await el.fill(String(v)); } else ok('fee field: ' + id, false);
  }

  // --- Output windows: PDF report, Binder, Slideshow, Pitch, Tie-back ---
  for (const [btn, label] of [['btn-pdf', 'Client PDF report'], ['btn-binder', 'Binder plan'], ['btn-slides', 'Slideshow'], ['btn-pitch', 'Pitch deck'], ['btn-tieback', 'CCH tie-back']]) {
    try {
      const [popup] = await Promise.all([ctx.waitForEvent('page', { timeout: 8000 }), page.click('#' + btn)]);
      await popup.waitForLoadState('domcontentloaded').catch(() => {});
      await popup.waitForTimeout(900);
      const perr = [];
      popup.on('pageerror', e => perr.push(e.message));
      // slides are display:none except the active one, so measure textContent (all), not innerText (visible only)
      const info = await popup.evaluate(() => ({ len: document.body.textContent.replace(/\s+/g,' ').length, pages: document.querySelectorAll('.page, .sheet, .slide, section').length, title: document.title, svgs: document.querySelectorAll('svg').length,
        visibleSlides: Array.from(document.querySelectorAll('.slide, section')).filter(e => getComputedStyle(e).display !== 'none').length }));
      ok(label + ' opens with content', info.len > 1500, `${info.len} chars, ${info.pages} pages/slides (${info.visibleSlides} visible), ${info.svgs} svg, title="${info.title}"`);
      await popup.screenshot({ path: path.join(OUT, 'shot-' + btn + '.png'), fullPage: btn === 'btn-tieback' });
      if (btn === 'btn-pitch') {
        const t = await popup.evaluate(() => document.body.textContent);
        ok('pitch deck anonymizes strategies', /Strategy #\d/.test(t) && !/Augusta|IC-DISC|Hire Your Child/i.test(t), (t.match(/Strategy #\d+/g)||[]).slice(0,3).join(',') + (/Augusta/.test(t)?' LEAK: Augusta':''));
        ok('pitch deck shows fee + net benefit', /9,500/.test(t) && /[Nn]et/.test(t));
      }
      if (btn === 'btn-slides') {
        const t = await popup.evaluate(() => document.body.textContent);
        ok('slideshow names strategies (post-engagement)', /Augusta/.test(t));
        // sc2 has 8 strategies, sc3 adds one more: every output must describe the same (best) plan
        const m = t.match(/(\d+) moves/); ok('slideshow count matches report (8, not union 9)', m && m[1] === '8', m ? m[0] : 'no count');
      }
      if (btn === 'btn-binder') {
        const b = await popup.evaluate(() => ({ annex: /Technical|Annex|Appendix/i.test(document.body.innerText), fee: /9,500/.test(document.body.innerText) }));
        ok('binder has technical annex', b.annex); ok('binder shows planning fee', b.fee);
      }
      await popup.close();
    } catch (e) { ok(label + ' opens', false, e.message.split('\n')[0]); }
  }

  // --- Export / re-import round trip ---
  try {
    const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 8000 }), page.click('#btn-export')]);
    const p = path.join(OUT, 'export.tsiq.json');
    await dl.saveAs(p);
    const j = JSON.parse(fs.readFileSync(p, 'utf8'));
    ok('export has plan block', !!j.plan, Object.keys(j).join(','));
    const keys = []; (function walk(o){ if (o && typeof o==='object') for (const k in o){ keys.push(k); walk(o[k]); } })(j);
    ok('export has no SSN/EIN/address keys', !keys.some(k => /^(ssn|ein|address|dob|taxId)$/i.test(k)), [...new Set(keys)].slice(0,30).join(','));
    // wipe and re-import
    await page.reload(); await page.waitForTimeout(600);
    await page.setInputFiles('#import-file', p);
    await page.waitForTimeout(1200);
    const ri = await page.evaluate(() => ({ k1: document.getElementById('passthroughK1').value, aug: document.getElementById('sc2-augusta-rule').checked, icd: document.getElementById('sc2-ic-disc-commission') && document.getElementById('sc2-ic-disc-commission').value, name: document.getElementById('clientName').value }));
    ok('re-import restores inputs', ri.k1 === '310000' && ri.name === 'Sample Client', JSON.stringify(ri));
    ok('re-import restores plan selections', ri.aug === true && ri.icd === '40000', JSON.stringify(ri));
  } catch (e) { ok('export/import round trip', false, e.message.split('\n')[0]); }


  // --- Brand Settings persist across reload (localStorage 'tsiq-brand') ---
  try {
    await page.click('#brand-settings-btn'); await page.waitForTimeout(300);
    const nameId = (await page.locator('#brand-name-input').count()) ? 'brand-name-input' : null;
    if (nameId) {
      await page.fill('#brand-name-input', 'Smoke Test CPAs'); await page.click('#brand-save'); await page.waitForTimeout(300);
      await page.reload(); await page.waitForTimeout(600);
      const persisted = await page.evaluate(() => (localStorage.getItem('tsiq-brand') || '').includes('Smoke Test CPAs') && document.title.includes('Smoke Test CPAs'));
      ok('brand settings persist across reload', persisted);
      await page.evaluate(() => localStorage.removeItem('tsiq-brand'));
    } else ok('brand settings modal has firm-name field', false);
  } catch (e) { ok('brand settings', false, e.message.split('\n')[0]); }

  ok('no console/page errors across flow', errors.length === 0, errors.slice(0, 5).join(' | '));
  await browser.close();
  const pass = R.filter(r => r.pass).length;
  for (const r of R) console.log((r.pass ? 'PASS ' : 'FAIL ') + r.name + (r.extra ? '  — ' + r.extra : ''));
  console.log(`\n${pass}/${R.length} checks passed`);
  process.exit(pass === R.length ? 0 : 2);
})().catch(e => { console.error('FATAL', e); process.exit(1); });
