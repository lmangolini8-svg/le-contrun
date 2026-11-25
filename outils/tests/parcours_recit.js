// Exécuté dans la page par Playwright. Le temps du jeu avance par pas de 50 ms.
// Les dialogues, transitions, patrouilles et collisions tournent normalement.
// Seul le dessin des images est omis pour accélérer ces longues traversées en CI.
function playStory({tribute, resumeDawn = false, interruptDawn = false}) {
  const dt = .05;
  window.requestAnimationFrame = () => 0;
  clock.getDelta = () => dt;
  renderFrame = () => {};
  let sawStoneFall = false;

  function fail(message) {
    throw new Error(message + ' · ' + JSON.stringify({
      tribute, stage: S.stage, mode, position: player.position.toArray(),
      action: current?.label, dialogue: dlg.textContent.slice(0, 180)
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

  function advance(choices = [], stopAtDawn = false) {
    const remaining = [...choices];
    for (let count = 0; count < 260; count++) {
      switch (mode) {
        case 'dialog': {
          if (stopAtDawn && S.stage === 15) {
            if (remaining.length) fail('Choix manquants avant l’aube');
            return;
          }
          if (!waitingChoice) {
            dlg.click();
            break;
          }
          const buttons = [...dlg.querySelectorAll('button')];
          const wanted = remaining.shift();
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
  function pressArrow(key, frames) {
    window.dispatchEvent(new KeyboardEvent('keydown', {key}));
    for (let i = 0; i < frames && mode === 'play'; i++) tick();
    window.dispatchEvent(new KeyboardEvent('keyup', {key}));
  }

  // Recherche en largeur sur une grille dont le pas correspond à deux images de marche.
  // Dans la cour, on évite les cônes visibles et on recalcule le trajet pendant la patrouille.
  function pathTo(tx, tz, radius, inCourt) {
    const {x: ox, z: oz} = player.position;
    const stride = 4.7 * dt * 2;
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

  function walk(tx, tz, radius, label, untilStage) {
    const p = player.position;
    for (let attempt = 0; attempt < 700; attempt++) {
      if (untilStage && S.stage === untilStage) return;
      advance();
      tick();
      if (mode !== 'play') continue;
      if (Math.hypot(p.x-tx,p.z-tz) < radius && (!label || current?.label === label)) return;
      const inCourt = S.act === 1 && (p.x > 26 || tx > 30);
      const path = pathTo(tx, tz, radius, inCourt);
      if (!path) {
        if (!inCourt) fail('Chemin introuvable vers '+[tx,tz,radius]);
        for (let t = 0; t < 8 && mode === 'play'; t++) tick();
        continue;
      }
      for (const key of inCourt ? path.slice(0,4) : path) {
        pressArrow(key,2);
        if (mode !== 'play') break;
      }
      if (mode === 'play' && label && current?.label !== label && Math.hypot(p.x-tx,p.z-tz) < radius) {
        radius -= .15;
      }
    }
    fail('Trajet interrompu vers ' + [tx,tz,label]);
  }

  function interact(label, x, z, radius, choices) {
    walk(x,z,radius,label);
    click('#act');
    advance(choices);
  }
  function person(name, key, choices) {
    const {x,z} = N[key].position;
    interact('Parler à '+name,x,z,2,choices);
  }
  const quotes = (...ids) => ids.map(id => FEU[id].cit);
  const state = () => JSON.parse(localStorage.getItem('sarlande-acte1-v1'));

  if (resumeDawn) {
    click('[data-a="resume"]');
    expectStage(15);
    if (!dawn || player.position.x !== -19.4 || player.position.z !== 7.6)
      fail('Reprise hors de la sortie de l’atelier');
  } else {
    click('[data-a="new"]');
    advance();
    person('Anselme','anselme');
    expectStage(1);
    const responses = {paye:'Payer la mesure', denonce:'Dire que le sac', refus:'Demander à quoi sert'};
    interact('Parler au percepteur',0,-14.6,3.2,[responses[tribute]]);
    expectStage(2);
    if (S.flags.tribut !== tribute) fail('Choix du tribut perdu');
    person('Maëlle','maelle');
    expectStage(3);
    interact('Fouiller la chapelle',52.7,-2,2.4);
    expectStage(4);
    if (tribute === 'paye') {
      interact('Ramasser le feuillet',51.9,-8.5,1.8);
      if (!S.f.includes('F5')) fail('Feuillet de la cour absent');
      interact('Ramasser le feuillet',17.5,17.6,2.15);
      if (!S.f.includes('F4')) fail('Feuillet du quai absent');
    }
    if (tribute === 'refus') {
      person('Garin','garin',quotes('F2','F2'));
      expectStage(4);
    }
    person('Garin','garin',quotes('F1','F2','F3'));
    expectStage(5);
    if (!sawStoneFall) fail('Chute de la pierre absente pendant la scène');
    person('Anselme','anselme');
    expectStage(6);
    click('[data-a="act2"]');
    advance();
    expectStage(10);
    person('Anselme','anselme');
    expectStage(11);
    person('Ysabeau','ysabeau');
    interact('Ramasser le feuillet',5.7,-11.7,1.8);
    person('Maëlle','maelle',quotes('F6','F7'));
    expectStage(12);
    const replies = quotes('F6','F7','F8');
    if (tribute === 'denonce') replies.unshift('C’était moi');
    person('Garin','garin',replies);
    expectStage(13);
    walk(0,7.3,1);
    for (let n = 0; n < 1200 && !(T2.on && T2.big); n++) { advance(); tick(); }
    if (!T2.big || !S.maelleSuit || !S.allies.garin) fail('Escorte absente au grand toast');
    walk(ATELIER.x,ATELIER.z,3,undefined,14);
    expectStage(14);
    const press = ['Tirer la barre','Tirer la barre','Tirer la barre'];
    const litter = tribute === 'paye' ? 'S’incliner' : 'Rester debout';
    advance(['Composer la page',...LINE,...press,'Et s’ils',litter], true);
    expectStage(15);
    const dawnSave = state();
    if (dawnSave.impression !== undefined) fail('Travail d’imprimerie encore actif à l’aube');
    if (dawnSave.stage !== 15 || dawnSave.pos[0] !== player.position.x || dawnSave.pos[1] !== player.position.z)
      fail('Position sauvegardée avant la sortie de l’atelier : '+JSON.stringify(dawnSave.pos));
    if (interruptDawn) return 'aube';
    advance();
  }
  interact('Coller l’affiche',0,6.1,2.1);
  expectStage(16);
  if (!fete.poster.visible || !ov.textContent.includes('Cent feuilles avant l’aube'))
    fail('Affiche ou bilan absent');
  const saved = state();
  return {stage:saved.stage, tribute:saved.flags.tribut, bow:saved.flags.incline,
    confession:saved.flags.aveu, sheets:saved.f.slice().sort()};
}
module.exports = playStory;
