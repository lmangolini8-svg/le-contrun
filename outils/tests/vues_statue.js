// Vues de contrôle du monument en jeu, au format iPad (1180 × 820, tactile).
// Usage : python3 -m http.server 8765 à la racine, puis
//   node vues_statue.js <dossier_captures> [parametre_glb]   (ex. statue)
const { chromium } = require('playwright');
const out=process.argv[2]||'.', glb=process.argv[3]||'';
// [nom, caméra, cible] — hauteur d'œil de la caméra de jeu, là où passe l'élève.
const VUES=[
  ['rue_imprimerie',[-19,3.2,12],[0,22,-38]],
  ['rue_milieu',[-19,3.2,0],[0,22,-38]],
  ['place',[-6,3.2,10],[0,22,-38]],
  ['face_proche',[0,6,-20],[0,22,-38]],
];
(async()=>{
  const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  const ctx=await b.newContext({viewport:{width:1180,height:820},deviceScaleFactor:1,hasTouch:true,isMobile:true});
  const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
  await p.goto('http://localhost:8765/index.html'+(glb?'?glb='+glb:'')); await p.waitForTimeout(5000);
  await p.tap('[data-a="new"]'); await p.waitForTimeout(2500); await p.tap('#cutSkip').catch(()=>{}); await p.waitForTimeout(5000);
  await p.evaluate(()=>{ const r0=renderFrame; renderFrame=function(){ if(window.__v){ camera.position.set(...__v[0]); camera.lookAt(...__v[1]); camera.updateMatrixWorld(); } r0(); }; });
  for(const [n,c,t] of VUES){ await p.evaluate(([c,t])=>{ window.__v=[c,t]; aimSun(c[0],c[2]); },[c,t]); await p.waitForTimeout(2500); await p.screenshot({path:`${out}/vue_${n}${glb?'_'+glb:''}.png`}); }
  console.log('GLB', await p.evaluate(()=>!!scene.getObjectByName('Colosse de l’Un (GLB)')), 'erreurs', JSON.stringify(errs)); await b.close();
})();
