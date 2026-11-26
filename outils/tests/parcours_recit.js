// Exécuté dans la page par Playwright. Le temps du jeu avance par pas de 50 ms.
// Les dialogues, transitions, patrouilles et collisions tournent normalement.
// Seul le dessin des images est omis pour accélérer ces longues traversées en CI.
async function playStory({tribute, joystick = false, resumeDawn = false, interruptDawn = false, interruptTribute = false, tributeReply}) {
  const dt = .05;
  const requestFrame = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = callback => callback === tick ? 0 : requestFrame(callback);
  clock.getDelta = () => dt;
  renderFrame = () => {};
  let sawStoneFall = false;

  function fail(message) {
    throw new Error(message + ' · ' + JSON.stringify({
      tribute, stage: S.stage, mode, position: player.position.toArray(),
      action: current?.label, dialogue: dlg.textContent.slice(0, 180),
      seen, daze, toast: {on: T2.on, big: T2.big, elapsed: T2.t}
    }));
  }

  function expectStage(stage) {
    if (S.stage !== stage) fail('Étape attendue ' + stage);
  }

  function click(selector) {
    const button = document.querySelector(selector);
    if (!button) fail('Élément absent ' + selector);
    button.click();
  }

  function advance(choices = [], pause) {
    const remaining = [...choices];
    for (let count = 0; count < 260; count++) {
      switch (mode) {
        case 'dialog': {
          if (pause?.()) {
            if (remaining.length) fail('Choix manquants avant l’interruption');
            return;
          }
          if (!waitingChoice) {
            dlg.click();
            break;
          }
          const buttons = [...dlg.querySelectorAll('button')];
          const rencontrePoterne = tribute === 'denonce' && buttons.some(b => b.textContent.includes('Pourquoi tu me laisses'));
          const wanted = rencontrePoterne ? 'Pourquoi tu me laisses' : remaining.shift();
          const button = wanted === undefined ? buttons[0] : buttons.find(b => b.textContent.includes(wanted));
          if (!button) fail('Choix absent ' + wanted);
          button.click();
          break;
        }
        case 'sequence':
          if (sceneRun.name === 'pierre') {
            for (let n = 0; n < 12 && mode === 'sequence'; n++) {
              tick();
              if (mode === 'sequence' && stone.rotation.x > .1) sawStoneFall = true;
            }
          } else click('#cutSkip');
          break;
        case 'farce':
        case 'cine2':
          click('#cutSkip');
          break;
        case 'turn':
          tick();
          break;
        case 'plate':
          if (plateReady) plateEl.click();
          tick();
          break;
        default:
          if (remaining.length) fail('Choix non atteints ' + remaining);
          return;
      }
    }
    fail('Transition inachevée');
  }

  const arrows = [[1,0,'ArrowRight'], [-1,0,'ArrowLeft'], [0,1,'ArrowDown'], [0,-1,'ArrowUp']];
  let gestures = 0;
  async function move(key, frames, keepWalking) {
    if (joystick) {
      const [dx,dz] = arrows.find(dir => dir[2] === key);
      const x = Math.floor(innerWidth*.28), y = Math.floor(innerHeight*.5);
      if (document.elementFromPoint(x,y) !== canvas) fail('Le point de départ du joystick est couvert');
      await window.testJoystick({x,y,dx:48*dx,dy:48*dz});
      if (!joy.on || Math.abs(joy.x-dx) > .01 || Math.abs(joy.y-dz) > .01) fail('Glissement non reconnu');
    } else document.body.dispatchEvent(new KeyboardEvent('keydown', {key, bubbles: true}));
    for (let i = 0; i < frames && mode === 'play' && keepWalking(); i++) tick();
    if (joystick) {
      await window.testJoystick(null);
      gestures++;
      if (joy.on) fail('Joystick actif après le lever du doigt');
    } else document.body.dispatchEvent(new KeyboardEvent('keyup', {key, bubbles: true}));
  }

  // Recherche en largeur sur une grille dont le pas correspond à deux images de marche.
  // Dans la cour, on évite les cônes visibles et on recalcule le trajet pendant la patrouille.
  function pathTo(tx, tz, radius, inCourt) {
    const {x: ox, z: oz} = player.position;
    const stride = 2.45 * dt * 2;
    function exposed(x, z) {
      if (!inCourt || Math.hypot(x-ox, z-oz) >= 7) return false;
      return guards.some(({g}) => {
        if (!g.visible) return false;
        const dx = x-g.position.x, dz = z-g.position.z, d = Math.hypot(dx,dz);
        if (d < 2.65) return true;
        const facing = (dx*Math.sin(g.rotation.y) + dz*Math.cos(g.rotation.y))/d;
        return d < CONE_R && facing > Math.cos(CONE_A+.1) && !segHits(g.position.x,g.position.z,x,z);
      });
    }

    const queue = [{x:0, z:0, parent:null}];
    const visited = new Set(['0,0']);
    for (let i = 0; i < queue.length; i++) {
      const point = queue[i];
      const x = ox + point.x*stride, z = oz + point.z*stride;
      if (i && Math.hypot(x-tx,z-tz) < radius) {
        const path = [];
        for (let p = point; p.parent; p = p.parent) path.push(p.key);
        return path.reverse();
      }
      for (const [dx,dz,key] of arrows) {
        const gx = point.x + dx, gz = point.z + dz, id = gx + ',' + gz;
        if (visited.has(id)) continue;
        const nx = ox + gx*stride, nz = oz + gz*stride;
        if (blocked(nx,nz) || blocked((x+nx)/2,(z+nz)/2) || exposed(nx,nz)) continue;
        visited.add(id);
        queue.push({x:gx, z:gz, parent:point, key});
      }
    }
    return null;
  }

  const bigToast = () => T2.on && T2.big;

  async function walk(tx, tz, radius, label, {untilStage, duringToast = false} = {}) {
    const p = player.position;
    const keepWalking = () => !duringToast || bigToast();
    for (let attempt = 0; attempt < 700; attempt++) {
      if (S.stage === untilStage || !keepWalking()) return;
      advance();
      tick();
      if (!keepWalking()) return;
      if (mode !== 'play') continue;
      if (Math.hypot(p.x-tx,p.z-tz) < radius) {
        if (!label || current?.label === label) return;
        // Le toast ordinaire prend temporairement la priorité sur la conversation.
        if (current === RAISE) { click('#act'); continue; }
      }
      const inCourt = S.act === 1 && (p.x > 26 || tx > 30);
      const path = pathTo(tx, tz, radius, inCourt);
      if (!path) {
        if (!inCourt) fail('Chemin introuvable vers '+[tx,tz,radius]);
        for (let t = 0; t < 8 && mode === 'play'; t++) tick();
        continue;
      }
      const directions = inCourt ? path.slice(0,4) : path;
      for (let i = 0; i < directions.length;) {
        const key = directions[i];
        const start = i++;
        while (i < directions.length && directions[i] === key) i++;
        await move(key, 2*(i-start), keepWalking);
        if (mode !== 'play' || !keepWalking()) break;
      }
      if (mode === 'play' && label && current !== RAISE && current?.label !== label && Math.hypot(p.x-tx,p.z-tz) < radius) {
        radius -= .15;
      }
    }
    fail('Trajet interrompu vers ' + [tx,tz,label]);
  }

  async function interact(label, x, z, radius, choices, pause) {
    await walk(x,z,radius,label);
    click('#act');
    advance(choices,pause);
  }
  async function person(name, key, choices) {
    const {x,z} = N[key].position;
    await interact('Parler à '+name,x,z,2,choices);
  }
  const quotes = (...ids) => ids.map(id => FEU[id].cit);
  const state = () => JSON.parse(localStorage.getItem('sarlande-acte1-v1'));

  if (resumeDawn) {
    click('[data-a="resume"]');
    expectStage(15);
    if (!dawn || player.position.x !== -19.4 || player.position.z !== 7.6)
      fail('Reprise hors de la sortie de l’atelier');
  } else {
    if (tributeReply) {
      click('[data-a="resume"]');
      if (mode !== 'dialog' || waitingChoice || dlg.querySelector('.txt')?.textContent !== tributeReply)
        fail('La réponse du percepteur n’a pas repris');
      advance();
    } else {
      click('[data-a="new"]');
      advance();
      // Réveil au clos des murailles : on traverse la maison et le clos jusqu’au chemin de l’atelier.
      if (S.vie.recit.etape !== 'reveil' || player.position.z < 1300) fail('La partie ne commence pas au clos');
      await interact('Entrer à l’atelier', O.clos[0]-142.5, O.clos[1], 2, ['Entrer à l’atelier']);
      if (S.vie.recit.etape !== 'ville' || player.position.z > 1300) fail('Départ du clos manqué');
      await person('Anselme','anselme');
      expectStage(1);
      const responses = {paye:'Payer la mesure', denonce:'Dire que le sac', refus:'Demander à quoi sert'};
      await interact('Parler au percepteur',0,-14.6,3.2,[responses[tribute]], () => interruptTribute && S.flags.tribut === tribute);
      if (interruptTribute) {
        expectStage(1);
        if (state().flags.tribut !== tribute) fail('Choix perdu dès la réponse du percepteur');
        return {reply:dlg.querySelector('.txt').textContent};
      }
    }
    expectStage(2);
    if (S.flags.tribut !== tribute) fail('Choix du tribut perdu');
    if (tribute === 'denonce') {
      await interact('Parler au jeune garde',-3.1,-14.5,2.35,['J’ai eu peur']);
      if (!S.bastien.b2 || S.bastien.conf !== 0) fail('Réponse à Bastien perdue après le tribut');
    }
    await person('Maëlle','maelle');
    expectStage(3);
    await interact('Fouiller la chapelle',52.7,-2,2.4);
    expectStage(4);
    if (tribute === 'denonce') {
      await walk(23.75,-.3,.65);
      if (!S.bastien.b3) await interact('Parler au garde',24.5,1.2,2);
      if (!S.bastien.nom || S.bastien.conf !== 1) fail('Nom de Bastien absent à la poterne');
    }
    if (tribute === 'paye') {
      await interact('Ramasser le feuillet',51.9,-8.5,1.8);
      if (!S.f.includes('F5')) fail('Feuillet de la cour absent');
      await interact('Ramasser le feuillet',17.5,17.6,2.15);
      if (!S.f.includes('F4')) fail('Feuillet du quai absent');
    }
    if (tribute === 'refus') {
      await person('Garin','garin',quotes('F2','F2'));
      expectStage(4);
    }
    await person('Garin','garin',quotes('F1','F2','F3'));
    expectStage(5);
    if (!sawStoneFall) fail('Chute de la pierre absente pendant la scène');
    await person('Anselme','anselme');
    expectStage(6);
    click('[data-a="act2"]');
    advance();
    expectStage(10);
    await person('Anselme','anselme');
    expectStage(11);
    if (tribute === 'denonce') {
      await interact('Parler à Bastien',-7.4,-1.6,2,['Danser']);
      await interact('S’approcher de la femme masquée',-6.6,10.4,2.3);
      if (!S.bastien.danse || !S.mahaut.billet || S.bastien.conf !== 2) fail('Branle ou billet absent');
    }
    if (tribute === 'refus') {
      for (const witness of WIT) {
        await interact(witness.label,witness.night[0],witness.night[1],2);
        if (!state().temo?.includes(witness.id)) fail('Témoignage absent : '+witness.nom);
      }
      await person('Maëlle','maelle',quotes('F6'));
      expectStage(11);
      if (!dlg.textContent.includes('derrière les tréteaux')) fail('Indice de Maëlle absent pour F7');
    } else await person('Ysabeau','ysabeau');
    await interact('Ramasser le feuillet',5.7,-11.7,1.8);
    await person('Maëlle','maelle',quotes('F6','F7'));
    expectStage(12);
    if (tribute === 'refus') {
      await person('Garin','garin',quotes('F6','F7'));
      expectStage(12);
      if (!dlg.textContent.includes('Ysabeau')) fail('Indice de Garin absent pour F8');
      await person('Ysabeau','ysabeau');
    }
    if (tribute !== 'paye') {
      const choix = tribute === 'refus' ? 'Lire la page d’Ysabeau' : 'Redescendre sans rien dire';
      await interact('Monter sur les tréteaux',-3.3,-4.8,1.65,[choix]);
      if ((S.discrets || 0) !== (tribute === 'refus' ? 2 : 0)) fail('Conséquence de la lecture publique incorrecte');
    }
    const replies = quotes('F6','F7','F8');
    if (tribute === 'denonce') replies.unshift('C’était moi');
    await person('Garin','garin',replies);
    expectStage(13);
    for (let crossing = 0; crossing < 5 && S.stage === 13; crossing++) {
      await walk(0,7.3,1);
      // Si la fête la ramène au quai, regagner la fontaine et attendre le toast suivant.
      for (let n = 0; n < 1200 && !bigToast(); n++) {
        advance();
        if (Math.hypot(player.position.x,player.position.z-3) >= 5.8) await walk(0,7.3,1);
        tick();
      }
      if (!bigToast() || !S.maelleSuit || !S.allies.garin) fail('Escorte absente au grand toast');
      await walk(ATELIER.x,ATELIER.z,3,undefined,{untilStage:14,duringToast:true});
    }
    expectStage(14);
    const press = ['Tirer la barre','Tirer la barre','Tirer la barre'];
    const litter = tribute === 'paye' ? 'S’incliner' : 'Rester debout';
    advance(['Composer la page',...LINE,...press,'Et s’ils',litter], () => S.stage === 15);
    expectStage(15);
    const dawnSave = state();
    if (dawnSave.impression !== undefined) fail('Travail d’imprimerie encore actif à l’aube');
    if (dawnSave.stage !== 15 || dawnSave.pos[0] !== player.position.x || dawnSave.pos[1] !== player.position.z)
      fail('Position sauvegardée avant la sortie de l’atelier : '+JSON.stringify(dawnSave.pos));
    if (interruptDawn) return 'aube';
    advance();
  }
  await interact('Coller l’affiche',0,6.1,2.1);
  expectStage(16);
  if (!fete.poster.visible || !ov.textContent.includes('Cent feuilles avant l’aube'))
    fail('Affiche ou bilan absent');
  if (ov.textContent.includes('Vous êtes montée sur les tréteaux') !== (tribute === 'refus'))
    fail('Lecture publique mal restituée dans le bilan');
  if (tribute === 'denonce') {
    click('[data-a="back"]');
    await interact('Parler à Bastien',-2.6,7.9,2,['Tu sais lire']);
    if (!state().bastien.lit || S.bastien.conf !== 3 || S.bastien.expo !== 0)
      fail('Conversation devant l’affiche sans sa conséquence');
    click('#carnetBtn');
    if (!ov.textContent.includes('Un billet écrit à la main')) fail('Billet de la femme masquée absent du carnet');
    click('[data-a="bilan"]');
  }
  const saved = state();
  return {gestures, stage:saved.stage, tribute:saved.flags.tribut, bow:saved.flags.incline,
    confession:saved.flags.aveu, sheets:saved.f.slice().sort()};
}
module.exports = playStory;
