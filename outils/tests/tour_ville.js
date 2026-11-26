// Tour de la ville à l'échelle : vues du ciel et à hauteur d'Aliénor, pour juger le remplissage.
// Usage : node outils/tests/tour_ville.js <dossier>
const { chromium } = require("playwright");
const path = require("path"), fs = require("fs");
const RACINE = path.resolve(__dirname, "../..");
const OUT = process.argv[2] || ".";
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".webp": "image/webp", ".jpg": "image/jpeg", ".png": "image/png", ".mp3": "audio/mpeg", ".glb": "model/gltf-binary", ".woff2": "font/woff2", ".css": "text/css" };
(async () => {
  const b = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
  const ctx = await b.newContext({ viewport: { width: 1180, height: 820 }, deviceScaleFactor: 1 });
  await ctx.route("http://sarlande.test/**", r => {
    const f = path.join(RACINE, decodeURIComponent(new URL(r.request().url()).pathname));
    if (!f.startsWith(RACINE) || !fs.existsSync(f)) return r.fulfill({ status: 404, body: "" });
    r.fulfill({ status: 200, path: f, contentType: TYPES[path.extname(f)] || "application/octet-stream" });
  });
  const p = await ctx.newPage(); const errs = [];
  p.on("pageerror", e => errs.push(e.message));
  const attendre = async (cond, ms = 60000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await p.evaluate(cond)) return; await p.waitForTimeout(250); } throw new Error("attente : " + cond); };
  await p.goto("http://sarlande.test/index.html"); await p.waitForTimeout(5000);
  await p.click('[data-a="new"]');
  await attendre(() => mode === "plate" && plateReady); await p.click("#plate"); await attendre(() => mode !== "plate" && mode !== "turn"); await p.waitForTimeout(600);
  for (let i = 0; i < 40 && await p.evaluate(() => document.getElementById("dlg").style.display === "block" && !document.querySelector("#dlg [data-c]")); i++) { await p.click("#dlg"); await p.waitForTimeout(150); }
  await p.evaluate(() => { Vie.V().tenue = "ocre"; Vie.V().recit.lettre = "lue"; const it = INTER.find(x => x.label === "Traverser la ville à pied"); const q = it.p(); player.position.set(q.x, player.position.y, q.z); it.act(); });
  await attendre(() => mode === "play" && Ville.enVille()); await p.waitForTimeout(8000);
  console.log("maisons du tissu", await p.evaluate(() => Ville.TISSU ? Ville.TISSU() : "?"));
  await p.evaluate(() => {
    const r0 = renderFrame;
    renderFrame = function () { if (window.__v) { camera.fov = __v[2]; camera.updateProjectionMatrix(); camera.position.set(...__v[0]); camera.lookAt(...__v[1]); camera.updateMatrixWorld(); } r0(); };
  });
  const V = [
    ["ciel", [320, 470, 260], [320, 432, 0], 50],
    ["oblique_sud", [320, 520, 90], [320, 430, 0], 55],
    ["drapiers", [270, 400, 1.7], [300, 396, 2.5], 60],
    ["halles", [350, 450, 1.7], [362, 440, 2.5], 60],
    ["fontaine", [335, 440, 1.7], [360, 430, 2.5], 60],
    ["quai", [340, 470, 1.7], [380, 468, 2.5], 60],
    ["clos", [500, 430, 1.7], [470, 430, 2.5], 60],
  ];
  for (const [n, c, t, f] of V) {
    await p.evaluate(([c, t, f]) => {
      const pt = (X, Y, h, haut) => { const s = Atlas.versScene(X, Y), v = Ville.VILLE; return [s.x + v.x, (haut ? 0 : s.y) + h, s.z + v.z]; };
      const a = pt(c[0], c[1], c[2], c[2] > 20), z = pt(t[0], t[1], t[2], t[2] > 20 || c[2] > 20);
      window.__fog = window.__fog || scene.fog; scene.fog = c[2] > 20 ? null : window.__fog;
      window.__v = [a, z, f]; player.position.set(z[0], z[1] - 2.5, z[2]);
    }, [c, t, f]);
    await p.waitForTimeout(3500); await p.screenshot({ path: `${OUT}/tour_${n}.png` });
  }
  // Le trajet réel, du clos à l'imprimerie, avec la caméra du jeu derrière Aliénor.
  await p.evaluate(() => { window.__v = null; scene.fog = window.__fog || scene.fog; });
  const pts = await p.evaluate(() => { const P = Ville.chemin(Ville.dehorsAtlas("maison"), Ville.dehorsAtlas("presse")) || []; return P; });
  for (let i = 0; i < 6 && pts.length > 2; i++) {
    const k = Math.min(pts.length - 2, Math.round(i * (pts.length - 2) / 5));
    await p.evaluate(([a, b]) => { const v = Ville.VILLE, A = Atlas.versScene(a[0], a[1]), Bp = Atlas.versScene(b[0], b[1]);
      player.position.set(A.x + v.x, player.position.y, A.z + v.z); player.rotation.y = Math.atan2(Bp.x - A.x, Bp.z - A.z); if (typeof snapCam === "function") snapCam(); }, [pts[k], pts[k + 1]]);
    await p.waitForTimeout(3000); await p.screenshot({ path: `${OUT}/trajet_${i}.png` });
    console.log("trajet", i, await p.evaluate(() => { renderer.info.autoReset = true; renderFrame(); const r = renderer.info.render;
      return JSON.stringify({ triangles: r.triangles, appels: r.calls, meshy: Ville.tissuMeshy ? Ville.tissuMeshy() : null, memoire_Mo: performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1e6) : null, textures: renderer.info.memory.textures, geometries: renderer.info.memory.geometries }); }));
  }
  console.log("erreurs", JSON.stringify(errs.slice(0, 5))); await b.close();
})();
