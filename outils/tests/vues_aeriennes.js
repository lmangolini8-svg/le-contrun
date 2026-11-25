// Calques pour ChatGPT : la ville du jeu vue du ciel et sous plusieurs angles.
// Usage : node outils/tests/vues_aeriennes.js <dossier_de_sortie>
// (ouvre index.html depuis le disque ; Chromium lancé avec --allow-file-access-from-files)
// Repère du jeu : x vers l'est, z vers le sud ; le palais est au nord (z négatif).
const { chromium } = require('playwright');
const path = require('path');
const out = process.argv[2] || '.';
const page = 'file://' + path.resolve(__dirname, '../../index.html');
// [nom, position de la caméra, point visé, angle de champ]
const VUES = [
  ['plan_ville', [0, 260, -6], [0, 0, -7], 26],
  ['plan_palais', [0, 120, -30], [0, 0, -31], 22],
  ['vue_sud', [0, 70, 85], [0, 0, -12], 40],
  ['vue_sud_est', [70, 60, 60], [0, 0, -12], 40],
  ['vue_sud_ouest', [-70, 60, 60], [0, 0, -12], 40],
  ['vue_est', [95, 55, -8], [0, 0, -8], 40],
  ['vue_ouest', [-95, 55, -8], [0, 0, -8], 40],
  ['vue_nord', [0, 70, -110], [0, 0, -8], 40],
  ['palais_face', [0, 14, 8], [0, 9, -30], 50],
  ['palais_sud_est', [32, 30, 4], [0, 5, -28], 45],
  ['palais_sud_ouest', [-32, 30, 4], [0, 5, -28], 45],
  ['palais_dessus', [0, 55, -2], [0, 0, -30], 45],
];
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--allow-file-access-from-files'] });
  const ctx = await b.newContext({ viewport: { width: 1536, height: 1024 }, deviceScaleFactor: 1 });
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.goto(page); await p.waitForTimeout(5000);
  await p.click('[data-a="new"]'); await p.waitForTimeout(2500);
  await p.click('#cutSkip').catch(() => {}); await p.waitForTimeout(4000);
  await p.evaluate(() => {
    scene.fog = null; camera.far = 3000;
    document.querySelectorAll('#hud, .hud, #act, #obj, #joy').forEach(e => e.style.visibility = 'hidden');
    const r0 = renderFrame;
    renderFrame = function () { if (window.__v) { camera.fov = __v[2]; camera.updateProjectionMatrix(); camera.position.set(...__v[0]); camera.lookAt(...__v[1]); camera.updateMatrixWorld(); } r0(); };
  });
  for (const [n, c, t, f] of VUES) {
    await p.evaluate(([c, t, f]) => { window.__v = [c, t, f]; if (typeof aimSun === 'function') aimSun(t[0], t[2]); }, [c, t, f]);
    await p.waitForTimeout(2500); await p.screenshot({ path: `${out}/calque_${n}.png` });
  }
  console.log('erreurs', JSON.stringify(errs)); await b.close();
})();
