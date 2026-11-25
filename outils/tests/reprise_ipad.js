/* Serve the repository over HTTP, then run: node outils/tests/reprise_ipad.js [URL]. */
const assert = require('node:assert/strict');
const { chromium } = require('playwright');

const url = process.argv[2] || 'http://127.0.0.1:8765/index.html';
const storageKey = 'sarlande-acte1-v1';

async function savedSession(browser, checkpoint, viewport, test) {
  const context = await browser.newContext({viewport, hasTouch: true, isMobile: true});
  const page = await context.newPage();
  page.setDefaultTimeout(45000);
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  try {
    await page.goto(new URL('README.md', url).href);
    await page.evaluate(([key, data]) => localStorage.setItem(key, JSON.stringify(data)),
      [storageKey, {started: true, mute: true, lite: true, ...checkpoint}]);
    await page.goto(url, {waitUntil: 'domcontentloaded'});
    await page.getByRole('button', {name: 'Reprendre le chemin'}).waitFor();
    await test(page, context);
    assert.deepEqual(errors, [], 'Erreurs JavaScript dans le jeu');
  } finally {
    await context.close();
  }
}

async function testGate(browser) {
  const pos = [23.5, -2];
  await savedSession(browser, {act: 1, stage: 3, pos, f: ['F1', 'F2']},
    {width: 810, height: 1080}, async page => {
      await page.getByRole('button', {name: 'Reprendre le chemin'}).tap();
      const actual = await page.evaluate(() => [player.position.x, player.position.z]);
      assert.deepEqual(actual, pos, 'La poterne ouverte doit accepter la position sauvegardée');
      assert.match(await page.locator('#obj').textContent(), /fouillez la chapelle/i);
      const textures = await page.evaluate(() => [rt.texture.uuid, rt.depthTexture.uuid, sun.shadow.map.uuid]);
      await page.setViewportSize({width: 1080, height: 810});
      await page.waitForFunction(() => !portrait && rt.width === canvas.width && rt.height === canvas.height && rt.depthTexture.image.width === rt.width);
      const rotated = await page.evaluate(() => ({
        textures: [rt.texture.uuid, rt.depthTexture.uuid, sun.shadow.map.uuid],
        depthWidth: rt.depthTexture.image.width, depthHeight: rt.depthTexture.image.height,
        width: rt.width, height: rt.height
      }));
      assert.deepEqual(rotated.textures, textures, 'La rotation doit réutiliser les textures');
      assert.equal(rotated.depthWidth, rotated.width);
      assert.equal(rotated.depthHeight, rotated.height);

      await page.locator('#carnetBtn').tap();
      const citation = page.getByRole('button', {name: /Page de citation/});
      await citation.tap();
      await page.locator('#plate .quote .go').tap();
      await citation.waitFor();
      const archives = page.getByRole('button', {name: /Les archives du palais/});
      for (const visit of ['première visite', 'deuxième visite']) {
        await archives.tap();
        const next = page.locator('#plate .go');
        await next.waitFor();
        assert.equal(await next.textContent(), 'Touchez pour tourner la page', visit);
        assert.equal(await page.evaluate(() => dioBuilt.archives), true);
        await next.tap();
        await archives.waitFor();
      }
      await page.getByRole('button', {name: 'Retour au jeu'}).tap();
      assert.match(await page.locator('#obj').textContent(), /fouillez la chapelle/i);
    });
  console.log('Acte I : poterne, rotation, page de citation et deux visites aux archives depuis le carnet.');
}

async function testNotebook(browser) {
  const checkpoint = {act: 2, stage: 14, pos: [-20, 6.6], flags: {tribut: 'refus'},
    f: ['F1', 'F2', 'F3', 'F6'], notes: {F1: 'Page 12'}};
  await savedSession(browser, checkpoint, {width: 1080, height: 810}, async (page, context) => {
    await page.getByRole('button', {name: 'Recommencer', exact: true}).tap();
    await page.getByRole('button', {name: 'Garder ma partie'}).press('Enter');
    assert.equal(await page.evaluate(key => JSON.parse(localStorage.getItem(key)).stage, storageKey), 14);
    await page.getByRole('button', {name: 'Reprendre le chemin'}).tap();
    assert.match(await page.locator('#obj').textContent(), /rejoignez maître Anselme/i);
    const action = page.getByRole('button', {name: 'Parler à Anselme'});
    await action.waitFor();
    await page.locator('#carnetBtn').tap();
    const note = page.locator('#n-F1');
    assert.equal(await note.inputValue(), 'Page 12');
    await note.fill('Page 14, la multitude');
    await page.getByRole('button', {name: 'Retour au jeu'}).tap();
    await action.waitFor();

    const cdp = await context.newCDPSession(page);
    await cdp.send('Input.dispatchTouchEvent', {type: 'touchStart', touchPoints: [{x: 400, y: 400}]});
    await cdp.send('Input.dispatchTouchEvent', {type: 'touchMove', touchPoints: [{x: 448, y: 400}]});
    await page.waitForFunction(() => joy.on && joy.x > .8 && player.position.x > -19.95);
    assert.equal(await page.locator('#joy i').evaluate(el => el.style.transform), 'translate(48px, 0px)');
    await page.keyboard.down('ArrowRight');
    await page.evaluate(() => window.dispatchEvent(new Event('blur')));
    await page.waitForFunction(() => !joy.on && !keys.arrowright);
    await cdp.send('Input.dispatchTouchEvent', {type: 'touchEnd', touchPoints: []});
    await page.keyboard.up('ArrowRight');
    const pos = await page.evaluate(() =>
      [player.position.x, player.position.z].map(value => Number(value.toFixed(2))));
    await page.reload({waitUntil: 'domcontentloaded'});
    await page.getByRole('button', {name: 'Reprendre le chemin'}).tap();
    const result = await page.evaluate(() => ({pos: S.pos, note: S.notes.F1, tribut: S.flags.tribut, stage: S.stage}));
    assert.deepEqual(result, {pos, note: 'Page 14, la multitude', tribut: 'refus', stage: 14});

    await page.reload({waitUntil: 'domcontentloaded'});
    await page.getByRole('button', {name: 'Recommencer', exact: true}).tap();
    await page.getByRole('button', {name: 'Recommencer depuis le début'}).tap();
    await page.locator('#cutSkip').tap();
    const fresh = await page.evaluate(() => ({stage: S.stage, f: S.f, notes: S.notes, mute: S.mute, lite: S.lite}));
    assert.deepEqual(fresh, {stage: 0, f: [], notes: {}, mute: true, lite: true});
  });
  console.log('Acte II : carnet, action à proximité, joystick, interruption, reprise et nouvelle partie.');
}

async function testToast(browser) {
  // Une sauvegarde de l'ancienne version, avant la première annonce à la fontaine.
  await savedSession(browser, {act: 2, stage: 13, pos: [0, 7.3], allies: {maelle: true, garin: true}},
    {width: 1080, height: 810}, async page => {
      await page.getByRole('button', {name: 'Reprendre le chemin'}).tap();
      const dialogue = page.locator('#dlg');
      await dialogue.getByText(/Les gardes tiennent la rue/).waitFor();
      await dialogue.tap();
      await dialogue.getByText(/on attend que Sarlande/).waitFor();
      await dialogue.tap();
      await dialogue.getByText(/Le crieur monte/).waitFor();
      await dialogue.tap();
      await page.waitForFunction(() => T2.on && T2.big && T2.t > 0);
      await page.locator('#carnetBtn').tap();
      const paused = await page.evaluate(() => ({clock: time, toast: T2.t}));
      await page.waitForFunction(t => time > t + .1, paused.clock);
      assert.equal(await page.evaluate(() => T2.t), paused.toast, 'Le carnet suspend le grand toast');
      await page.reload({waitUntil: 'domcontentloaded'});
      await page.getByRole('button', {name: 'Reprendre le chemin'}).tap();
      const resumed = await page.evaluate(() => ({
        active: T2.on && T2.big, elapsed: T2.t, saved: S.toastEcoule,
        escort: S.maelleSuit, warned: S.toastExplique,
        guards: fete.ng.every(guard => guard.blind)
      }));
      assert.deepEqual([resumed.active, resumed.escort, resumed.warned, resumed.guards], [true, true, true, true]);
      assert.equal(resumed.saved, paused.toast);
      assert.ok(resumed.elapsed >= paused.toast);
      assert.match(await page.locator('#obj').textContent(), /Traversez maintenant/);
    });
  console.log('Acte II : le carnet suspend le grand toast, la reprise conserve le temps et les alliés.');
}

(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROME_BIN || undefined,
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader']
  });
  try {
    await testGate(browser);
    await testNotebook(browser);
    await testToast(browser);
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
