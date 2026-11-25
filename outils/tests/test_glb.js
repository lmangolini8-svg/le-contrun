const { chromium } = require('playwright');
// Usage : python3 -m http.server 8765 (à la racine du dépôt), puis node test_glb.js <dossier_captures>
const SP=process.argv[2]||'.';
async function run(b,q,tag){
  const ctx=await b.newContext({viewport:{width:1180,height:820},deviceScaleFactor:1,hasTouch:true,isMobile:true});
  const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
  await p.goto('http://localhost:8765/index.html'+q); await p.waitForTimeout(5000);
  await p.tap('[data-a="new"]'); await p.waitForTimeout(2500); await p.tap('#cutSkip').catch(()=>{}); await p.waitForTimeout(4000);
  const info=await p.evaluate(()=>{ const r={mode}; const o=scene.getObjectByName('Colosse de l’Un'), g=scene.getObjectByName('Colosse de l’Un (GLB)');
    const bb=x=>{const B=new THREE.Box3().setFromObject(x);return [B.min,B.max].map(v=>v.toArray().map(n=>+n.toFixed(2)));};
    r.proc={visible:o.visible,box:bb(o)}; if(g){ let n=0,mats=new Set(); g.traverse(m=>{if(m.isMesh){n++;mats.add(m.material.type+(m.material.vertexColors?'+vc':''));}}); r.glb={visible:g.visible,box:bb(g),meshes:n,mats:[...mats]}; }
    r.say=document.getElementById('say').textContent; return r; });
  console.log(tag,JSON.stringify(info));
  await p.screenshot({path:`${SP}/${tag}_debut.png`});
  // déplacement au doigt : glisser vers le haut de l'écran pendant 2 s (événements tactiles réels via CDP)
  const pos0=await p.evaluate(()=>player.position.toArray());
  const cdp=await ctx.newCDPSession(p); const x=600,y=600;
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});
  for(let i=1;i<=40;i++){ await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+Math.min(i,10)*2,y:y-Math.min(i,10)*6}]}); await p.waitForTimeout(50); }
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  const pos1=await p.evaluate(()=>player.position.toArray());
  console.log(tag,'deplacement tactile',pos0.map(n=>n.toFixed(2)),'->',pos1.map(n=>n.toFixed(2)));
  // vue de la statue depuis la place, à la distance de jeu
  await p.evaluate(()=>{ const r0=renderFrame; renderFrame=function(){ camera.position.set(-17,8.5,-5); camera.lookAt(0.5,17.5,-38); camera.updateMatrixWorld(); r0(); }; });
  await p.waitForTimeout(3500);
  await p.screenshot({path:`${SP}/${tag}_statue.png`});
  console.log(tag,'erreurs',JSON.stringify(errs)); await ctx.close();
}
(async()=>{ const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  await run(b,'?glb=ancien','orig'); await run(b,'?glb=colosse','glb'); await b.close(); })();
