/* Serve the repository over HTTP, then run: node outils/tests/reprise_ipad.js [URL]. */
const assert = require('node:assert/strict');
const { chromium, webkit } = require('playwright');

const url = process.argv[2] || 'http://127.0.0.1:8765/index.html';
const playStory = require('./parcours_recit');
const storageKey = 'sarlande-acte1-v1';

async function withSession(browser, checkpoint, viewport, test) {
  const context = await browser.newContext({viewport, hasTouch: true, isMobile: true});
  const page = await context.newPage();
  page.setDefaultTimeout(45000);
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  try {
    if (checkpoint) {
      await page.goto(new URL('README.md', url).href);
      await page.evaluate(([key, data]) => localStorage.setItem(key, JSON.stringify(data)),
        [storageKey, {started: true, mute: true, lite: true, ...checkpoint}]);
    }
    await page.goto(url, {waitUntil: 'domcontentloaded'});
    const entry = checkpoint ? 'Reprendre le chemin' : 'Entrer dans la ville';
    await page.getByRole('button', {name: entry}).waitFor();
    await test(page, context);
    assert.deepEqual(errors, [], 'Erreurs JavaScript dans le jeu');
  } catch (error) {
    console.error('Écran au moment de l’échec', await page.evaluate(() => ({
      objectif: document.querySelector('#obj')?.textContent,
      dialogue: document.querySelector('#dlg .txt')?.textContent,
      mode: typeof mode === 'string' ? mode : null,
      toast: typeof T2 === 'object' ? {actif: T2.on, attente: T2.bwait, temps: T2.t} : null
    })).catch(() => null), errors);
    throw error;
  } finally {
    await context.close();
  }
}

async function testOpening(browser) {
  await withSession(browser, null, {width: 1080, height: 810}, async page => {
    await page.getByRole('button', {name: /Affichage allégé/}).tap();
    await page.getByRole('button', {name: 'Entrer dans la ville'}).tap();
    const skip = page.getByRole('button', {name: 'Passer la scène'});
    await skip.tap();
    const speak = page.getByRole('button', {name: 'Parler à Anselme'});
    await page.keyboard.down('ArrowLeft');
    try { await speak.waitFor(); } finally { await page.keyboard.up('ArrowLeft'); }
    await speak.tap();
    await skip.tap();
    const dialogue = page.locator('#dlg');
    await dialogue.getByText(/Te voilà, Aliénor/).tap();
    await skip.tap();
    await dialogue.getByText(/C’est le matin du tribut/).tap();
    await dialogue.getByRole('button', {name: /Un tiers/}).tap();
    await dialogue.getByText(/Rien que tu verras/).tap();
    await dialogue.getByText(/dans la doublure/).tap();
    await dialogue.getByText(/Feuillet retrouvé/).tap();
    await dialogue.getByText(/J’ai défait ce livre/).tap();
    assert.match(await page.locator('#obj').textContent(), /Portez le sac du tribut/);
    await page.locator('#carnetBtn').tap();
    assert.ok(await page.locator('#n-F1').isVisible());
    const saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), storageKey);
    assert.deepEqual([saved.stage, saved.f], [1, ['F1']]);
  });
  console.log('Partie vierge : déplacement vers Anselme, premier dialogue et remise du feuillet F1.');
}

async function testGate(browser) {
  const pos = [23.5, -2];
  await withSession(browser, {act: 1, stage: 3, pos, f: ['F1', 'F2']},
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
      const citation = page.locator('#ov').getByRole('button', {name: /Page de citation/});
      await citation.tap();
      await page.locator('#plate .quote .go').tap();
      await citation.waitFor();
      const archives = page.locator('#ov').getByRole('button', {name: /Les archives du palais/});
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

async function touchJoystick(context, page) {
  const cdp = await context.newCDPSession(page);
  return async gesture => {
    if (!gesture) return cdp.send('Input.dispatchTouchEvent', {type: 'touchEnd', touchPoints: []});
    const {x,y,dx,dy} = gesture;
    await cdp.send('Input.dispatchTouchEvent', {type: 'touchStart', touchPoints: [{x,y}]});
    await cdp.send('Input.dispatchTouchEvent', {type: 'touchMove', touchPoints: [{x:x+dx,y:y+dy}]});
  };
}

async function testNotebook(browser) {
  const checkpoint = {act: 2, stage: 14, pos: [-20, 6.6], flags: {tribut: 'refus'},
    f: ['F1', 'F2', 'F3', 'F6'], notes: {F1: 'Page 12'}};
  await withSession(browser, checkpoint, {width: 1080, height: 810}, async (page, context) => {
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

    let releasePointer;
    if (browser.browserType() === chromium) {
      const touch = await touchJoystick(context, page);
      await touch({x:400,y:400,dx:48,dy:0});
      releasePointer = () => touch(null);
    } else {
      // Playwright's WebKit driver supports taps; use a mouse pointer for the held drag.
      await page.mouse.move(400, 400);
      await page.mouse.down();
      await page.mouse.move(448, 400);
      releasePointer = () => page.mouse.up();
    }
    await page.waitForFunction(() => joy.on && joy.x > .8 && player.position.x > -19.95);
    assert.equal(await page.locator('#joy i').evaluate(el => el.style.transform), 'translate(48px, 0px)');
    await page.keyboard.down('ArrowRight');
    await page.evaluate(() => window.dispatchEvent(new Event('blur')));
    await page.waitForFunction(() => !joy.on && !keys.arrowright);
    await releasePointer();
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
  await withSession(browser, {act: 2, stage: 13, pos: [0, 7.3], allies: {maelle: true, garin: true}},
    {width: 1080, height: 810}, async page => {
      await page.getByRole('button', {name: 'Reprendre le chemin'}).tap();
      const dialogue = page.locator('#dlg');
      await dialogue.getByText(/Les gardes tiennent la rue/).waitFor();
      await dialogue.tap();
      await dialogue.getByText(/on attend que Sarlande/).waitFor();
      await dialogue.tap();
      await dialogue.getByText(/Le crieur monte/).waitFor();
      await dialogue.tap();
      // Le rendu logiciel de la fête peut demander plusieurs secondes par trame.
      await page.waitForFunction(() => T2.on && T2.big && T2.t > 0, null, {timeout: 120000});
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

async function testGuardCapture(browser) {
  // Le point injecté est sur la première patrouille. L’alerte et le renvoi se déclenchent en jeu.
  const checkpoint = {stage: 3, pos: [38,-7.25], f: ['F1','F2'], flags: {tribut: 'refus'}};
  await withSession(browser, checkpoint, {width: 1080, height: 810}, async page => {
    const resume = () => page.getByRole('button', {name: 'Reprendre le chemin'}).tap();
    const dialogue = page.locator('#dlg');
    await resume();
    await dialogue.getByText(/Halte ! Rien à faire ici/).waitFor();
    await page.waitForFunction(() => player.position.x === 26 && player.position.z === -2);
    await page.reload({waitUntil: 'domcontentloaded'});
    await resume();
    await dialogue.getByText(/Halte ! Rien à faire ici/).waitFor();
    assert.deepEqual(await page.evaluate(() => player.position.toArray()), [26,0,-2]);
    await dialogue.tap();
    await dialogue.tap();
    await dialogue.getByText(/Le garde qui vous raccompagne/).waitFor();
    await dialogue.tap();
    await dialogue.tap();
    await dialogue.getByRole('button', {name: /Je cherchais un chat/}).tap();
    await dialogue.tap();
    await dialogue.tap();
    await page.waitForFunction(() => mode === 'play');
    const saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), storageKey);
    assert.deepEqual(saved.pos, [26,-2]);
    assert.deepEqual(saved.f, ['F1','F2']);
    assert.equal(saved.stage, 3);
    assert.equal(saved.bastien.b3, true);
    assert.equal(saved.renvoiCour, undefined);
  });
  console.log('Sauvegarde injectée devant la patrouille : alerte, renvoi, rechargement à la poterne et dialogue de Bastien.');
}

async function testStoneInterruption(browser) {
  // Sauvegarde injectée avant Garin. Aucune victoire ni cinématique dans cet état.
  await withSession(browser, {stage: 4, f: ['F1','F2','F3'], flags: {tribut: 'paye'}, pos: [-10,-1.4]},
    {width: 1080, height: 810}, async page => {
      const resume = () => page.getByRole('button', {name: 'Reprendre le chemin'}).tap();
      await resume();
      await page.getByRole('button', {name: 'Parler à Garin'}).tap();
      const dialogue = page.locator('#dlg');
      const answers = await page.evaluate(() => ['F1','F2','F3'].map(id => FEU[id].cit));
      for (let line = 0; line < 3; line++) await dialogue.tap();
      for (const answer of answers) {
        await dialogue.getByRole('button', {name: answer, exact: true}).tap();
        await dialogue.tap();
      }
      await dialogue.tap();
      await dialogue.tap();
      const plate = page.locator('#plate');
      await plate.getByText('Touchez pour tourner la page').waitFor();
      await page.reload({waitUntil: 'domcontentloaded'});
      await resume();
      await plate.getByText('Touchez pour tourner la page').tap();
      await page.getByRole('button', {name: 'Passer la scène'}).tap();
      await dialogue.getByText(/une pierre gît hors du socle/).waitFor();
      const saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), storageKey);
      assert.equal(saved.stage, 5);
      assert.equal(saved.pierreEnAttente, undefined);
    });
  console.log('Sauvegarde injectée avant Garin : trois réponses jouées, reprise sur la pierre après la joute.');
}

async function testDeniedConfession(browser) {
  // La partie complète avec dénonciation couvre l’aveu. Cette sauvegarde permet de jouer le mensonge.
  const checkpoint = {act: 2, stage: 12, pos: [2.6,-1.5], flags: {tribut: 'denonce'},
    f: ['F1','F2','F3','F6','F7','F8'], allies: {maelle: true}};
  await withSession(browser, checkpoint, {width: 810, height: 1080}, async page => {
    const resume = () => page.getByRole('button', {name: 'Reprendre le chemin'}).tap();
    await resume();
    await page.getByRole('button', {name: 'Parler à Garin'}).tap();
    const dialogue = page.locator('#dlg');
    await dialogue.tap();
    await dialogue.getByRole('button', {name: '« Non. »', exact: true}).tap();
    await page.reload({waitUntil: 'domcontentloaded'});
    await resume();
    await dialogue.getByText('« Hm. »', {exact: true}).waitFor();
    const answers = await page.evaluate(() => ['F6','F7','F8'].map(id => FEU[id].cit));
    for (let line = 0; line < 3; line++) await dialogue.tap();
    for (const answer of answers) {
      await dialogue.getByRole('button', {name: answer, exact: true}).tap();
      await dialogue.tap();
    }
    for (let line = 0; line < 3; line++) await dialogue.tap();
    const saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), storageKey);
    assert.equal(saved.stage, 13);
    assert.equal(saved.flags.aveu, false);
    assert.equal(saved.aveuEnCours, undefined);
    assert.equal(saved.allies.garin, true);
  });
  console.log('Sauvegarde injectée avant la joute du soir : mensonge, fermeture, réponse de Garin et ralliement.');
}

async function testPrintInterruption(browser) {
  // Sauvegarde injectée de l’ancien format. Tous les mots et tirages sont ensuite joués.
  await withSession(browser, {act: 2, stage: 14, pos: [-20, 6.6]},
    {width: 844, height: 390}, async page => {
      const resume = () => page.getByRole('button', {name: 'Reprendre le chemin'}).tap();
      async function reload() {
        await page.reload({waitUntil: 'domcontentloaded'});
        await resume();
      }
      const dialogue = page.locator('#dlg');
      const pick = name => dialogue.getByRole('button', {name, exact: true}).tap();
      await resume();
      await page.getByRole('button', {name: 'Parler à Anselme'}).tap();
      await dialogue.tap();
      await dialogue.tap();
      await pick('Composer la page');
      // Sur téléphone en paysage, cette dernière option demande de faire défiler les mots.
      await pick('en votre mal');
      const hint = dialogue.getByText(/La page commence par/);
      assert.ok(await hint.evaluate(el => {
        const box = document.getElementById('dlg').getBoundingClientRect();
        const text = el.getBoundingClientRect();
        return text.top >= box.top && text.bottom <= box.bottom;
      }), 'L’indice de composition est lisible après un choix en bas de liste');
      for (const word of ['« Pauvres','et misérables','peuples insensés,']) await pick(word);
      await pick('et aveugles');
      await dialogue.getByText(/Ce mot ne vient pas là/).waitFor();
      await reload();
      assert.equal(await dialogue.locator('.txt').textContent(), '« Pauvres et misérables peuples insensés,');
      for (const word of ['nations opiniâtres','en votre mal','et aveugles','à votre bien ! »']) await pick(word);
      await pick('Tirer la barre');
      await reload();
      await dialogue.getByText('Une feuille. Maëlle l’étend sur la corde.', {exact: true}).waitFor();
      await pick('Tirer la barre');
      await pick('Tirer la barre');
      await reload();
      await dialogue.getByText('Cent feuilles sèchent au-dessus de vos têtes.', {exact: true}).waitFor();
      await dialogue.tap();
      await dialogue.tap();
      await pick('« Et s’ils ne veulent pas lire ? »');
      await dialogue.tap();
      await dialogue.tap();
      await page.getByRole('button', {name: 'Passer la scène'}).tap();
      await dialogue.tap();
      await dialogue.tap();
      await pick('Rester debout, dans l’ombre');
      await reload();
      await dialogue.getByText('Vous restez debout. Personne ne le saura. Sauf vous.', {exact: true}).waitFor();
    });
  console.log('Sauvegarde injectée à l’atelier : reprise après trois mots, un puis trois tirages et le choix devant la litière.');
}

async function testStory(browser) {
  for (const tribute of ['paye', 'denonce', 'refus']) {
    const joystick = tribute === 'paye' && browser.browserType() === chromium;
    await withSession(browser, null, {width: 810, height: 1080}, async (page, context) => {
      if (joystick) await page.exposeFunction('testJoystick', await touchJoystick(context, page));
      // Une vraie interruption au premier dialogue de l’aube, avec la sauvegarde produite en jeu.
      const interruptDawn = tribute === 'denonce';
      const interruptTribute = tribute === 'refus';
      let result = await page.evaluate(playStory, {tribute, joystick, interruptDawn, interruptTribute});
      if (interruptTribute) {
        assert.ok(result.reply);
        await page.reload({waitUntil: 'domcontentloaded'});
        await page.getByRole('button', {name: 'Reprendre le chemin'}).waitFor();
        result = await page.evaluate(playStory, {tribute, tributeReply: result.reply});
      }
      if (interruptDawn) {
        assert.equal(result, 'aube');
        await page.reload({waitUntil: 'domcontentloaded'});
        await page.getByRole('button', {name: 'Reprendre le chemin'}).waitFor();
        result = await page.evaluate(playStory, {tribute, resumeDawn: true});
      }
      if (joystick) assert.ok(result.gestures > 0, 'Parcours avec le joystick tactile');
      assert.equal(result.stage, 16);
      assert.equal(result.tribute, tribute);
      assert.equal(result.bow, tribute === 'paye');
      assert.equal(result.confession, tribute === 'denonce' ? true : undefined);
      const expectedSheets = tribute === 'paye' ? ['F1','F2','F3','F4','F5','F6','F7','F8'] : ['F1','F2','F3','F6','F7','F8'];
      assert.deepEqual(result.sheets, expectedSheets);
    });
    console.log('Partie neuve, tribut ' + tribute + ' : chapelle, pierre, acte II, presse et affiche.'
      + (joystick ? ' Déplacements au joystick avec gestes tactiles Chromium.' : '')
      + (tribute === 'denonce' ? ' Partie rechargée à l’aube.' : '')
      + (tribute === 'refus' ? ' Partie rechargée à la réponse du percepteur. F7 et F8 retrouvés après les indices des joutes.' : ''));
  }
}

(async () => {
  const engine = process.env.TEST_BROWSER || 'chromium';
  assert.ok(['chromium', 'webkit'].includes(engine), 'Navigateur de test inconnu');
  const browser = engine === 'webkit' ? await webkit.launch() : await chromium.launch({
    executablePath: process.env.CHROME_BIN || undefined,
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader']
  });
  console.log(engine, browser.version());
  try {
    await testOpening(browser);
    await testGate(browser);
    await testNotebook(browser);
    await testToast(browser);
    await testStory(browser);
    await testPrintInterruption(browser);
    await testGuardCapture(browser);
    await testStoneInterruption(browser);
    await testDeniedConfession(browser);
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
