/* Serve the repository over HTTP, then run: node outils/tests/reprise_ipad.js [URL]. */
const assert = require('node:assert/strict');
const { chromium, webkit } = require('playwright');

const url = process.argv[2] || 'http://127.0.0.1:8765/index.html';
const playStory = require('./parcours_recit');
const storageKey = 'sarlande-acte1-v1';

async function withSession(browser, checkpoint, viewport, test) {
  const context = await browser.newContext({viewport, hasTouch: true, isMobile: true});
  context.setDefaultTimeout(45000);
  const errors = [];
  context.on('page', p=>p.on('pageerror', error=>errors.push(error.message)));
  let page = await context.newPage();
  async function reopenTab() {
    await page.close();
    page = await context.newPage();
    await page.goto(url, {waitUntil:'domcontentloaded'});
    return page;
  }
  try {
    if (checkpoint) {
      await page.goto(new URL('README.md', url).href);
      await page.evaluate(([key, data]) => localStorage.setItem(key, JSON.stringify(data)),
        [storageKey, {started: true, mute: true, lite: true, ...checkpoint}]);
    }
    await page.goto(url, {waitUntil: 'domcontentloaded'});
    const entry = checkpoint ? 'Reprendre le chemin' : 'Entrer dans la ville';
    await page.getByRole('button', {name: entry}).waitFor();
    await test(page, context, reopenTab);
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

async function rouvrirPartie(reopenTab) {
  const page = await reopenTab();
  await page.getByRole('button', {name:'Reprendre le chemin'}).tap();
  return page;
}

async function reprendreFeuillet(page, reopenTab, id, attendus) {
  const citation = await page.evaluate(id => FEU[id].cit, id);
  assert.equal(await page.locator('#dlg .feu .cit').innerText(), citation);
  page = await rouvrirPartie(reopenTab);
  assert.equal(await page.locator('#dlg .feu .cit').innerText(), citation);
  const carnet = await page.evaluate(key => JSON.parse(localStorage.getItem(key)).f, storageKey);
  assert.deepEqual(carnet, attendus);
  await page.locator('#dlg .feu').tap();
  return page;
}

async function testSheets(browser) {
  const cas = [
    {id:'F2', stage:2, pos:[10,-2.6], action:'Parler à Maëlle', avant:['F1'], suite:3, objectif:/fouillez la chapelle/},
    {id:'F3', stage:3, pos:[51,-2], action:'Fouiller la chapelle', avant:['F1','F2'], suite:4, objectif:/Garin le tanneur/},
    {id:'F4', stage:5, pos:[17.5,17.6], action:'Ramasser le feuillet', avant:['F1','F2','F3'], suite:5, objectif:/Racontez à maître Anselme/},
    {id:'F5', stage:4, pos:[51.9,-8.5], action:'Ramasser le feuillet', avant:['F1','F2','F3'], suite:4, objectif:/Garin le tanneur/},
    {id:'F6', stage:10, pos:[-20,6.6], action:'Parler à Anselme', avant:['F1','F2','F3'], suite:11, objectif:/Maëlle à la loterie/},
    {id:'F7', stage:11, pos:[5.7,-11.7], action:'Ramasser le feuillet', avant:['F1','F2','F3','F6'], suite:11, objectif:/Maëlle à la loterie/},
    {id:'F8', stage:11, pos:[-17.9,12.4], action:'Parler à Ysabeau', avant:['F1','F2','F3','F6'], suite:11, objectif:/Maëlle à la loterie/}
  ];
  for (const {id,stage,pos,action,avant,suite,objectif} of cas) {
    const checkpoint = {act:stage<10?1:2,stage,pos,f:avant,notes:{F1:'p. 16'},flags:{tribut:'refus'}};
    await withSession(browser, checkpoint, {width:810,height:1080}, async (page,context,reopenTab) => {
      await page.getByRole('button',{name:'Reprendre le chemin'}).tap();
      await page.getByRole('button',{name:action,exact:true}).tap();
      const attendus = [...avant,id];
      // Les entrées précèdent toujours la remise. On avance avec les commandes du dialogue.
      await page.evaluate(() => {
        for (let i=0; i<8 && mode==='dialog' && !dlg.querySelector('.feu'); i++)
          (dlg.querySelector('button') || dlg).click();
      });
      page = await reprendreFeuillet(page,reopenTab,id,attendus);
      if (id==='F2') {
        await page.getByRole('button',{name:/Ton père sait/}).tap();
        page = await rouvrirPartie(reopenTab);
        await page.locator('#dlg').getByText(/Il la relisait chaque soir/).tap();
        await page.locator('#dlg').getByText(/chapelle du vieux cloître/).tap();
        await page.locator('#dlg').getByText(/Reste hors du rouge/).tap();
      } else {
        const repliques = {F3:[/Il faut que quelqu’un entende/],F6:[/Cyrus/,/Maëlle, à la loterie/,/lumières dorées/],F8:[/Le bord de la page est roussi/]};
        for (const replique of repliques[id] || []) await page.locator('#dlg').getByText(replique).tap();
      }
      const saved = await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),storageKey);
      assert.deepEqual([saved.stage,saved.f,saved.notes.F1,saved.flags.tribut],[suite,attendus,'p. 16','refus']);
      assert.match(await page.locator('#obj').innerText(),objectif);
      await page.locator('#carnetBtn').tap();
      assert.equal(await page.locator('#cit-'+id).count(),1);
    });
    console.log('Sauvegarde injectée avant '+id+' : remise jouée, onglet fermé sur la citation, répliques et quête vérifiées.');
  }
}

async function testActTransition(browser) {
  const f = ['F1','F2','F3'];
  const checkpoint = {act:1,stage:5,pos:[-20,6.6],f,notes:{F2:'p. 20'},flags:{tribut:'denonce'}};
  await withSession(browser, checkpoint, {width:810,height:1080}, async (page,context,reopenTab) => {
    await page.getByRole('button',{name:'Reprendre le chemin'}).tap();
    await page.getByRole('button',{name:'Parler à Anselme'}).tap();
    await page.locator('#dlg').tap();
    await page.getByRole('button',{name:/J’ai eu peur pour lui/}).tap();
    for (let i=0; i<3; i++) await page.locator('#dlg').tap();
    const bilan = await page.locator('#ov .box').innerText();
    assert.match(bilan,/Vous avez livré le nom de Garin/);
    page = await rouvrirPartie(reopenTab);
    assert.equal(await page.locator('#ov .box').innerText(),bilan);
    await page.getByRole('button',{name:'Ouvrir le carnet'}).tap();
    assert.equal(await page.locator('#n-F2').inputValue(),'p. 20');
    await page.getByRole('button',{name:'Retour au bilan'}).tap();
    await page.getByRole('button',{name:'Commencer l’acte II'}).tap();
    const titre = await page.locator('#plate h2').innerText();
    page = await rouvrirPartie(reopenTab);
    assert.equal(await page.locator('#plate h2').innerText(),titre);
    await page.locator('#plate .go').tap();
    for (const texte of [/Le soir est tombé sur Sarlande/,/Ce matin, ces mêmes gens portaient leurs sacs/]) {
      const phrase = await page.locator('#dlg').getByText(texte).innerText();
      page = await rouvrirPartie(reopenTab);
      await page.locator('#dlg').getByText(phrase,{exact:true}).tap();
    }
    assert.match(await page.locator('#obj').innerText(),/Le soir tombe. Parlez à maître Anselme/);
    page = await rouvrirPartie(reopenTab);
    const state = await page.evaluate(()=>[S.act,S.stage,S.f,S.flags.tribut,S.notes.F2,mode]);
    assert.deepEqual(state,[2,10,f,'denonce','p. 20','play']);
  });
  console.log('Sauvegarde injectée avant le bilan I : réponse à Anselme, bilan, planche puis deux répliques de la fête repris après fermeture.');
}

async function testOpening(browser) {
  await withSession(browser, null, {width: 1080, height: 810}, async (page,context,reopenTab) => {
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
    page = await reprendreFeuillet(page,reopenTab,'F1',['F1']);
    await page.locator('#dlg').getByText(/J’ai défait ce livre/).tap();
    assert.match(await page.locator('#obj').textContent(), /Portez le sac du tribut/);
    await page.locator('#carnetBtn').tap();
    assert.ok(await page.locator('#n-F1').isVisible());
    const saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), storageKey);
    assert.deepEqual([saved.stage, saved.f], [1, ['F1']]);
  });
  console.log('Partie vierge : déplacement vers Anselme, fermeture sur F1 et reprise de la dernière réplique avant le tribut.');
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

// Pour atteindre les toasts ordinaires sans plusieurs minutes d'attente réelle.
// Seuls le dessin et l'horloge sont remplacés ; la foule, les zones et les choix restent actifs.
async function avancerFete(page, repere) {
  await page.evaluate(rep => {
    if (!window.horlogeFeteTest) {
      const frame = window.requestAnimationFrame.bind(window);
      window.requestAnimationFrame = callback => callback===tick ? 0 : frame(callback);
      clock.getDelta = () => .05;
      renderFrame = () => {};
      window.horlogeFeteTest = true;
    }
    const atteint = {
      gobelet: () => current===RAISE,
      finToast: () => !T2.on,
      remarque: () => S.remarquee===true,
      sergent: () => mode==='dialog' && dlg.textContent.includes('On ne trinque pas'),
      attraction: () => daze>=.75,
      quai: () => mode==='dialog' && dlg.textContent.includes('assise au bord du quai'),
      retour: () => mode==='play'
    }[rep];
    for (let i=0; i<2800 && !atteint(); i++) tick();
    if (!atteint()) throw new Error('Repère de fête absent : '+rep+' · '+mode+' · '+dlg.textContent);
  }, repere);
}

async function testOrdinaryToast(browser) {
  const cp = {act:2,stage:12,pos:[-15,-9],flags:{tribut:'denonce'},allies:{maelle:true},f:['F1','F2','F3','F6','F7']};
  await withSession(browser, cp, {width:810,height:1080}, async (page,context,reopenTab) => {
    await page.getByRole('button',{name:'Reprendre le chemin'}).tap();
    await avancerFete(page,'gobelet');
    await page.getByRole('button',{name:'Lever le gobelet'}).tap();
    page = await rouvrirPartie(reopenTab);
    assert.deepEqual(await page.evaluate(()=>[T2.on,T2.raised,S.toasts]),[true,true,1]);
    assert.equal(await page.getByRole('button',{name:'Lever le gobelet'}).isVisible(),false);
    await avancerFete(page,'finToast');
    await avancerFete(page,'remarque');
    page = await rouvrirPartie(reopenTab);
    assert.deepEqual(await page.evaluate(()=>[T2.checked,S.remarquee,S.noted]),[true,true,0]);
    await avancerFete(page,'sergent');
    page = await rouvrirPartie(reopenTab);
    await page.locator('#dlg').getByText(/On ne trinque pas/).tap();
    await page.locator('#dlg').getByText(/jusqu’aux marches de l’imprimerie/).tap();
    page = await rouvrirPartie(reopenTab);
    await page.locator('#dlg').getByText(/Va dormir/).tap();
    await avancerFete(page,'retour');
    page = await rouvrirPartie(reopenTab);
    assert.deepEqual(await page.evaluate(()=>[S.stage,S.toasts,S.noted,S.pos,S.allies,S.flags.tribut]),
      [12,1,1,[-19.4,9.8],cp.allies,'denonce']);
  });
  console.log('Sauvegarde injectée dans la foule : gobelet levé une fois, deux toasts refusés, répliques du sergent et retour à l’imprimerie après fermeture.');
}

async function testOubli(browser) {
  const base = {act:2,stage:13,pos:[-14,-.9],allies:{maelle:true,garin:true},toastExplique:true,
    flags:{tribut:'denonce',aveu:true},f:['F1','F2','F3','F6','F7','F8']};
  for (const suit of [true,false]) {
    await withSession(browser, {...base,maelleSuit:suit}, {width:810,height:1080}, async (page,context,reopenTab) => {
      await page.getByRole('button',{name:'Reprendre le chemin'}).tap();
      await avancerFete(page,'attraction');
      page = await rouvrirPartie(reopenTab);
      assert.ok(await page.evaluate(()=>daze>.55 && S.oubli===0),'L’attraction déjà subie doit persister');
      await avancerFete(page,'quai');
      page = await rouvrirPartie(reopenTab);
      await page.locator('#dlg').getByText(/assise au bord du quai/).tap();
      page = await rouvrirPartie(reopenTab);
      await page.locator('#dlg').getByText(/presque oublié pourquoi/).tap();
      const retour = await page.evaluate(()=>{
        const distance = g => Math.hypot(g.position.x-player.position.x,g.position.z-player.position.z);
        return {position:S.pos,oubli:S.oubli,allies:S.allies,suit:S.maelleSuit,garin:distance(N.garin),maelle:distance(N.maelle),
          stage:S.stage,tribut:S.flags.tribut,aveu:S.flags.aveu,demande:objText()};
      });
      assert.deepEqual([retour.position,retour.oubli,retour.allies,retour.suit,retour.stage,retour.tribut,retour.aveu],
        [[-6,15.6],1,base.allies,suit,13,'denonce',true]);
      assert.ok(retour.garin<3 && (suit?retour.maelle<3:retour.maelle>5));
      assert.match(retour.demande,/Rejoignez la fontaine/);
    });
  }
  console.log('Sauvegardes injectées avant l’oubli : jauge jouée, quai et répliques retrouvés après fermeture ; Maëlle revient avec Garin seulement si elle suivait.');
}

async function testOldSheetSave(browser) {
  // Avant les répliques mémorisées, le bouton de son pouvait enregistrer F1 à l’étape 0.
  await withSession(browser,{act:1,stage:0,f:['F1'],pos:[-20,6.6]}, {width:810,height:1080}, async page => {
    await page.getByRole('button',{name:'Reprendre le chemin'}).tap();
    await page.locator('#dlg').getByText(/J’ai défait ce livre/).tap();
    assert.deepEqual(await page.evaluate(()=>[S.stage,S.f]),[1,['F1']]);
    assert.match(await page.locator('#obj').innerText(),/Portez le sac du tribut/);
  });
  console.log('Ancien format injecté : F1 déjà au carnet, dernière réplique d’Anselme puis quête du tribut.');
}

async function testRueFete(browser) {
  const cp = {act:2,stage:13,pos:[-18.4,7],allies:{maelle:true,garin:true},maelleSuit:true};
  await withSession(browser,cp,{width:810,height:1080},async (page,context,reopenTab) => {
    await page.getByRole('button',{name:'Reprendre le chemin'}).tap();
    await page.locator('#dlg').getByText(/Halte. Où allez-vous/).tap();
    const message = await page.locator('#dlg').getByText(/raccompagne jusqu’à la fontaine/).innerText();
    page = await rouvrirPartie(reopenTab);
    await page.locator('#dlg').getByText(message,{exact:true}).tap();
    await avancerFete(page,'retour');
    const retour = await page.evaluate(()=>[S.pos,S.stage,S.noted,S.oubli,S.maelleSuit,S.allies]);
    assert.deepEqual(retour,[[2.4,7.8],13,0,0,true,cp.allies]);
  });
  console.log('Sauvegarde injectée rue de l’imprimerie : garde, deuxième réplique et retour des compagnons à la fontaine.');
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
    const answer = dialogue.getByRole('button', {name: /Je cherchais un chat/});
    await answer.waitFor();
    await page.reload({waitUntil: 'domcontentloaded'});
    await resume();
    await dialogue.getByText(/Le garde qui vous raccompagne/).waitFor();
    await dialogue.tap();
    await dialogue.tap();
    await answer.tap();
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

async function testBastienReload(browser) {
  const meetings = [
    {act:1, stage:2, pos:[-4.6,-13.75], label:'Parler au jeune garde', question:/Comment tu t’appelles/, flag:'b2', result:'nom'},
    {act:1, stage:4, pos:[23.75,-.3], label:'Parler au garde', question:/Laisse-moi tranquille/, flag:'b3', result:'refus'},
    {act:2, stage:11, pos:[-8.9,-.85], label:'Parler au garde', question:/^Danser$/, flag:'b4', result:'danse'},
    {act:2, stage:16, pos:[-4.1,8.65], label:'Parler au garde', question:/Tu sais lire/, flag:'b6', result:'lit'}
  ];
  for (const {act,stage,pos,label,question,flag,result} of meetings) {
    const checkpoint = {act,stage,pos,flags:{tribut:'refus'},bastien:{vu:true,nom:false,conf:0,expo:0}};
    await withSession(browser, checkpoint, {width:810,height:1080}, async page => {
      const dialogue = page.locator('#dlg');
      const answer = dialogue.getByRole('button',{name:question});
      async function meet() {
        await page.getByRole('button',{name:'Reprendre le chemin'}).tap();
        await page.getByRole('button',{name:label,exact:true}).tap();
        await dialogue.tap();
        if (flag==='b3') await dialogue.tap();
        await answer.waitFor();
      }
      await meet();
      await page.reload({waitUntil:'domcontentloaded'});
      await meet();
      await answer.tap();
      const saved = await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).bastien,storageKey);
      assert.equal(saved[flag],true);
      assert.equal(saved[result],true);
      assert.equal(saved.conf,result==='refus'?0:1);
      assert.equal(saved.expo,0);
    });
  }
  console.log('Bastien : quatre sauvegardes injectées, fermeture avant réponse puis choix joué à la porte, à la poterne, au bal et devant l’affiche.');
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

async function testMask(browser) {
  const checkpoint = {act:2,stage:11,pos:[14.55,10.2],flags:{tribut:'paye'}};
  await withSession(browser, checkpoint, {width:810,height:1080}, async (page,context,reopenTab) => {
    const resume = () => page.getByRole('button',{name:'Reprendre le chemin'}).tap();
    await resume();
    for (const porte of [true,false]) {
      await page.getByRole('button',{name:'Parler au colporteur'}).tap();
      await page.locator('#dlg').tap();
      await page.getByRole('button',{name:porte?'Prendre un masque':'Rendre le masque'}).tap();
      page = await reopenTab();
      await resume();
      assert.deepEqual(await page.evaluate(()=>[S.mask,maskM.visible,act2Hint().startsWith('Masquée')]),[porte,porte,porte]);
    }
  });
  console.log('Sauvegarde injectée devant Bertin. Prendre puis rendre le masque persiste après fermeture de l’onglet pendant chacune de ses réponses.');
}

async function testPublicReading(browser) {
  const checkpoint = {act:2,stage:12,pos:[-3.4,-3.7],flags:{tribut:'refus'},f:['F1','F2','F3','F6','F7','F8']};
  await withSession(browser, checkpoint, {width:810,height:1080}, async (page,context,reopenTab) => {
    const resume = () => page.getByRole('button',{name:'Reprendre le chemin'}).tap();
    let dialogue = page.locator('#dlg');
    async function reopen() {
      page = await reopenTab();
      dialogue = page.locator('#dlg');
      await resume();
    }
    await resume();
    await page.getByRole('button',{name:'Monter sur les tréteaux'}).tap();
    await dialogue.tap();
    await dialogue.getByRole('button',{name:'Lire la page d’Ysabeau'}).tap();
    const citation = await dialogue.locator('.txt').innerText();
    await reopen();
    assert.equal(await dialogue.locator('.txt').innerText(),citation);
    assert.deepEqual(await page.evaluate(()=>player.position.toArray()),[-1.2,1,-7]);
    await dialogue.tap();
    const foule = await dialogue.locator('.txt').innerText();
    assert.match(foule,/applaudissements/);
    await reopen();
    assert.equal(await dialogue.locator('.txt').innerText(),foule);
    await page.evaluate(()=>{ for(let n=0;n<8 && mode==='dialog';n++) dlg.click(); });
    const saved = await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),storageKey);
    assert.equal(saved.flags.scene,true);
    assert.equal(saved.discrets,2);
    assert.equal(saved.lecturePublique,undefined);
    assert.deepEqual(saved.pos,[-3.3,-4.3]);
    assert.equal(saved.stage,12);
  });
  console.log('Lecture publique : sauvegarde injectée avant les tréteaux, citation choisie puis deux fermetures jouées jusqu’au retour sur la place.');
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

async function testJoustReload(browser) {
  const cases = [
    {act:1, stage:4, pos:[-10,-1.4], first:'F1', second:'F2'},
    {act:2, stage:11, pos:[12.6,2.4], first:'F6', second:'F7'},
    {act:2, stage:12, pos:[2.6,-1.5], first:'F6', second:'F7'}
  ];
  for (const {act,stage,pos,first,second} of cases) {
    const checkpoint = {act,stage,pos,flags:{tribut:'paye'},f:['F1','F2','F3','F6','F7','F8']};
    await withSession(browser, checkpoint, {width: 720,height: 540}, async (page,context,reopenTab) => {
      let dialogue = page.locator('#dlg');
      async function resume(reopen) {
        if (reopen) {
          page = await reopenTab();
          dialogue = page.locator('#dlg');
        }
        await page.getByRole('button',{name:'Reprendre le chemin'}).tap();
      }
      async function begin() {
        await page.getByRole('button',{name: stage===11?'Parler à Maëlle':'Parler à Garin'}).tap();
        await page.evaluate(() => {
          for (let n=0; n<8 && mode==='dialog' && !waitingChoice; n++) dlg.click();
        });
      }
      const choose = async id => {
        const name = await page.evaluate(id=>FEU[id].cit,id);
        await dialogue.getByRole('button',{name,exact:true}).tap();
      };
      await resume(false);
      await begin();
      await choose(first);
      const reply = await dialogue.locator('.txt').textContent();
      await resume(true);
      assert.equal(await dialogue.locator('.txt').textContent(),reply);
      await dialogue.tap();
      assert.equal(await dialogue.locator('.pips .on').count(),1);
      await choose(first); // Page du premier tour, incorrecte au deuxième.
      const hint = await dialogue.locator('.more').textContent();
      await resume(true);
      assert.equal(await dialogue.locator('.more').textContent(),hint);
      assert.equal(await dialogue.locator('.pips .on').count(),1);
      await choose(first);
      await dialogue.getByText(/Reviens quand/).waitFor();
      await resume(true);
      await begin();
      assert.equal(await dialogue.locator('.pips .on').count(),0);
      await choose(first);
      await dialogue.tap();
      await choose(second);
      await dialogue.tap();
      if (stage!==11) {
        await choose(stage===4?'F3':'F8');
        await dialogue.tap();
      }
      // Lire les dernières répliques, puis vérifier l’effet de la victoire dans la sauvegarde.
      await page.evaluate(()=>{ for(let n=0;n<4 && mode==='dialog';n++) dlg.click(); });
      const saved = await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),storageKey);
      assert.equal(saved.joute,undefined);
      if (stage===4) assert.equal(saved.pierreEnAttente,true);
      else {
        assert.equal(saved.stage,stage+1);
        assert.equal(saved.allies[stage===11?'maelle':'garin'],true);
      }
      if (stage===11) {
        await resume(true);
        await page.getByRole('button',{name:'Passer la scène'}).tap();
        const publicRit = dialogue.getByText(/Toute la place a ri/);
        await publicRit.waitFor();
        await resume(true);
        await dialogue.getByText(/Toute la place a ri/).waitFor();
        await dialogue.tap();
        await dialogue.getByText(/Le rire de Garin s’est arrêté net/).waitFor();
        await dialogue.tap();
        await dialogue.tap();
        assert.equal(await page.evaluate(()=>S.farce),undefined);
        assert.equal(await page.evaluate(()=>S.allies.maelle),true);
      }
      console.log('Joute à l’étape '+stage+' : réplique et première erreur rechargées, deux erreurs puis nouvelle tentative gagnée depuis une sauvegarde injectée.');
    });
  }
}

async function reviseWitnesses(page) {
  const panel = page.locator('#ov');
  await panel.getByText('8 témoignages sur 8', {exact:true}).waitFor();
  await panel.getByRole('button',{name:'Ouvrir le carnet'}).tap();
  const card = name => panel.locator('.temo').filter({has:page.getByText(name,{exact:true})});
  const jeanne = card('Jeanne, aux trois pièces');
  const wrong = jeanne.getByRole('button',{name:'La coutume'});
  await wrong.press('Enter');
  assert.ok(await wrong.evaluate(button=>button===document.activeElement), 'Le clavier reste dans la fiche après une erreur');
  await jeanne.getByText('Pas tout à fait.',{exact:false}).waitFor();
  await page.reload({waitUntil:'domcontentloaded'});
  await page.getByRole('button',{name:'Reprendre le chemin'}).tap();
  await page.locator('#carnetBtn').tap();
  await jeanne.getByText('Pas tout à fait.',{exact:false}).waitFor();
  const answers = [
    ['Mathurin, vieux vigneron','La coutume'],
    ['Jeanne, aux trois pièces','Les jeux et les largesses'],
    ['Thibaut, charretier','Le mystère du pouvoir'],
    ['Hugues, chef de la rue des Tanneurs','L’intérêt des complices'],
    ['Perrine, la mère qui crie','La peur d’être remarqué'],
    ['Les enfants de la fontaine','La coutume'],
    ['Margot, la veuve','La mémoire de la liberté'],
    ['Les mendiants du quai','Les jeux et les largesses']
  ];
  for (const [name,answer] of answers) {
    const witness = card(name);
    await witness.getByRole('button',{name:answer,exact:true}).tap();
    const feedback = witness.locator('.cause');
    assert.ok((await feedback.innerText()).startsWith(answer+'.'));
    assert.ok(await feedback.evaluate(p=>p===document.activeElement), 'Le clavier rejoint l’explication');
  }
  await page.reload({waitUntil:'domcontentloaded'});
  await page.getByRole('button',{name:'Reprendre le chemin'}).tap();
  await page.locator('#carnetBtn').tap();
  assert.equal(await panel.locator('.temo .cause').count(),8);
  assert.equal(await panel.locator('.temo button').count(),0);
  await panel.getByRole('button',{name:'Relire le bilan de l’acte II'}).tap();
  await panel.getByText('recueillis, 8 reliés à leur cause.',{exact:false}).waitFor();
  console.log('Partie neuve, refus : huit habitants écoutés le soir, erreur de classement retrouvée, huit causes classées après la fin et bilan relu après rechargement.');
}

async function testStory(browser) {
  for (const tribute of ['paye', 'denonce', 'refus']) {
    const joystick = tribute === 'paye' && browser.browserType() === chromium;
    await withSession(browser, null, {width: 810, height: 1080}, async (page, context, reopenTab) => {
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
      if (tribute === 'refus') await reviseWitnesses(page);
      if (tribute === 'paye') {
        const bilan = await page.locator('#ov .box').innerText();
        page = await reopenTab();
        await page.getByRole('button',{name:'Reprendre le chemin'}).tap();
        await page.getByRole('button',{name:'Ouvrir le carnet, 8 feuillets sur 8'}).tap();
        const note = page.getByRole('textbox',{name:'Feuillet 1 · Ma note, la page dans mon édition'});
        const citationId = await note.getAttribute('aria-describedby');
        assert.equal(await page.locator('#'+citationId).innerText(),await page.evaluate(()=>FEU.F1.cit));
        await note.fill('Révision en classe');
        await page.getByRole('button',{name:'Relire le bilan de l’acte II'}).tap();
        assert.equal(await page.locator('#ov .box').innerText(),bilan);
        await page.getByRole('button',{name:'Ouvrir le carnet'}).tap();
        assert.equal(await note.inputValue(),'Révision en classe');
      }
    });
    console.log('Partie neuve, tribut ' + tribute + ' : chapelle, pierre, acte II, presse et affiche.'
      + (joystick ? ' Déplacements au joystick avec gestes tactiles Chromium.' : '')
      + (tribute === 'denonce' ? ' Partie rechargée à l’aube. Bastien rencontré à la porte, à la poterne, au bal et devant l’affiche. Billet de Mahaut retrouvé dans le carnet.' : '')
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
    const groupes = {
      parcours: [testOpening, testGate, testNotebook, testToast, testStory, testPrintInterruption, testActTransition, testOrdinaryToast, testOubli],
      rencontres: [testMask, testPublicReading, testGuardCapture, testBastienReload, testStoneInterruption, testDeniedConfession, testJoustReload, testSheets, testOldSheetSave, testRueFete]
    };
    const groupe = process.env.TEST_GROUP;
    const tests = groupe ? groupes[groupe] : Object.values(groupes).flat();
    assert.ok(Array.isArray(tests), 'Groupe de tests inconnu : '+groupe);
    for (const test of tests) await test(browser);
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
