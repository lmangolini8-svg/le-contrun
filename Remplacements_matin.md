# Le Contr’un • Remplacements depuis la version Sarlande volumes

Les blocs suivent leur ordre d’application dans index.html.


## La ville • Colosse de l’Un et socle

Ancien code exact

```js
/* colosse : socle, statue drapée, couronne */
const CX=0, CZ=-38, BR=0x34406e, BR2=0x232b4c;
put(G.box,ST2,CX,1.1,CZ-0.5,14,2.2,9); for(const c of [0,2,3]) put(G.box,ST,CX-5.25+c*3.5,1.1,CZ+4.5,3.44,2.16,1.0);
put(G.box,ST,CX,3.3,CZ,12,2.2,8.6); put(G.box,ST2,CX,5.6,CZ,10,2.4,7.4); put(G.box,ST,CX,6.95,CZ,10.6,0.3,8);
for(let i=0;i<5;i++){ put(G.box,ST2,CX-4+i*2,3.3,CZ+4.32,0.12,2.2,0.06); put(G.box,ST,CX-4.5+i*2.25,5.6,CZ+3.72,0.12,2.4,0.06); }
const stone=new THREE.Mesh(G.box,LM(0xd0c4ac)); stone.scale.set(3.44,2.16,1.0); stone.castShadow=true; stone.receiveShadow=true; scene.add(stone);
function placeStone(k){ const e=Math.min(1,Math.max(0,k)); stone.position.set(CX-1.75,1.1-(e>0.55?(e-0.55)*1.3:0),CZ+4.5+e*4.2); stone.rotation.x=e>0.4?(e-0.4)*1.6:0; }
placeStone(0);
{ B.push(CX,CZ,0); const Y=7.1,K=1.5; const P=(g,c,x,y,z,sx,sy,sz,ry,rx,rz)=>put(g,c,x*K,Y+y*K,z*K,sx*K,(sy===undefined?sx:sy)*K,(sz===undefined?sx:sz)*K,ry,rx,rz);
  B.jit=0.02; put(G.robe,BR,0,Y,0,K,K,K*0.72);
  for(let i=0;i<9;i++){ const a=(-0.9+i*0.225)*Math.PI/2+Math.PI/2; const x=Math.cos(a)*2.05, z=Math.sin(a)*2.05*0.72; P(G.c8,BR2,x,4.2,z,0.09,7.6,0.09,0,0.02*Math.sin(a)*4,-0.05*Math.cos(a)); }
  P(G.s,BR,0,12.7,0,2.55,0.95,1.35); P(G.s,BR,0,15.35,0.05,1.12,1.34,1.18); P(G.box,BR,0,15.25,1.2,0.22,0.42,0.3); P(G.s,BR2,0,14.55,0.55,0.75,0.95,0.6);
  P(G.c16,ORANGE,0,16.45,0.02,1.2,0.42,1.25); for(let i=0;i<9;i++){ const a=i/9*Math.PI*2; P(G.k4,ORANGE,Math.cos(a)*1.08,17.2,Math.sin(a)*1.12,0.26,1.25,0.26); }
  P(G.c8,BR,-2.75,10.6,0.3,0.52,4.4,0.52,0,-0.12,-0.16); P(G.c8,BR,-3.0,8.0,1.3,0.44,2.6,0.44,0,-0.9,-0.05); P(G.s,ORANGE,-3.0,7.6,2.6,0.85);
  P(G.c8,BR,2.9,11.0,0.2,0.52,3.6,0.52,0,-0.1,0.5); P(G.c8,BR,3.9,10.9,1.2,0.44,3.0,0.44,0,-0.5,-0.25); P(G.c8,ORANGE,4.3,12.2,1.9,0.16,13.5,0.16); P(G.s,ORANGE,4.3,19.2,1.9,0.55); P(G.k4,ORANGE,4.3,20.3,1.9,0.3,1.3,0.3);
  P(G.hcyl,BR2,0,6.6,-0.25,2.75,12.4,2.1,Math.PI/2); B.jit=0.05; B.pop(); }
```

Nouveau code complet

```js
/* colosse : socle, statue drapée, couronne */
const CX=0,CZ=-38;
{
  // Le rang inférieur réserve une véritable alvéole à la pierre mobile.
  put(G.box,ST2,CX,1.1,CZ-.5,14,2.2,9);
  for(const c of [0,2,3])put(G.box,ST,CX-5.25+c*3.5,1.1,CZ+4.5,3.44,2.16,1.0);
  for(const [y,w,h,d,c] of [[2.32,14.45,.28,10.35,0xb5a78e],[2.60,13.84,.28,9.92,0xe4d0a0],[3.69,12.86,1.9,9.10,0xb9a98c],[4.80,13.28,.33,9.56,0xe1cda6],[5.63,12.30,1.42,8.85,0xccbda0],[6.6,13.08,.55,9.6,0xa69173],[7.12,13.68,.49,10.0,0xe6d5ae],[7.50,14.15,.27,10.3,0xb6a483],[7.80,13.80,.32,10.02,0xd0bc93]])
    put(G.box,c,CX,y,CZ,w,h,d);
  for(const side of [-1,1]){
    for(let k=-7;k<=7;k++)put(G.box,0xd3c1a0,CX+k*.83,6.67,CZ+side*4.76,.39,.63,.36);
    for(let k=-4;k<=4;k++)put(G.box,0xd3c1a0,CX+side*6.48,6.67,CZ+k*.93,.37,.63,.47);
    for(let k=-2;k<=2;k++)put(G.box,0xaa9b80,CX+k*2.22,3.68,CZ+side*4.56,.06,1.80,.06);
  }
}
const stone=new THREE.Mesh(G.box,LM(0xd0c4ac)); stone.scale.set(3.44,2.16,1.0); stone.castShadow=true; stone.receiveShadow=true; scene.add(stone);
function placeStone(k){const e=Math.min(1,Math.max(0,k));stone.position.set(CX-1.75,1.1-(e>.55?(e-.55)*1.3:0),CZ+4.5+e*4.2);stone.rotation.x=e>.4?(e-.4)*1.6:0;}
placeStone(0);
{
  const b=new Builder();b.jit=0;
  const patina=0x5e8580,shadow=0x314956,light=0x91aaa0,robe=0x48686a,velvet=0x345560,azure=0x76958b;
  const gold=0xc59a48,rim=0xe5c078,deepGold=0x9e783e;
  const tau=Math.PI*2,V=(x,y,z)=>new THREE.Vector3(x,y,z);
  const solidPart=(g,c,x,y,z,rx,ry,rz,yaw=0,tilt=0,roll=0)=>b.put(g,c,x,y,z,rx,ry,rz,yaw,tilt,roll);
  const oval=(c,x,y,z,rx,ry,rz,yaw=0,tilt=0,roll=0)=>solidPart(G.s,c,x,y,z,rx,ry,rz,yaw,tilt,roll);
  function surface(cols,rows,point,c){
    const p=[],ix=[];
    for(let y=0;y<=rows;y++)for(let x=0;x<=cols;x++){
      const v=point(x/cols,y/rows);p.push(v.x,v.y,v.z);
      if(x&&y){const k=y*(cols+1)+x;ix.push(k-cols-2,k-cols-1,k,k-cols-2,k,k-1);}
    }
    const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.Float32BufferAttribute(p,3));g.setIndex(ix);g.computeVertexNormals();
    b.put(g,c,0,0,0,1);_ni.delete(g);g.dispose();
  }
  function cord(points,radii,c,sides=9,flatness=1){
    const line=points.map(a=>V(...a));
    const u=[],v=[];
    for(let j=0;j<line.length;j++){
      const axis=line[Math.min(j+1,line.length-1)].clone().sub(line[Math.max(0,j-1)]).normalize();
      const lateral=axis.clone().cross(Math.abs(axis.z)>.88?V(1,0,0):V(0,0,1)).normalize();
      u.push(lateral);v.push(axis.clone().cross(lateral).normalize());
    }
    surface(sides,line.length-1,(s,t)=>{
      const j=Math.round(t*(line.length-1)),a=tau*s;
      return line[j].clone().addScaledVector(u[j],Math.cos(a)*radii[j]).addScaledVector(v[j],Math.sin(a)*radii[j]*flatness);
    },c);
  }
  function smoothCord(points,r,c,sides=7){
    const curve=new THREE.CatmullRomCurve3(points.map(p=>V(...p)));
    const samples=curve.getPoints(Math.max(7,points.length*3)).map(p=>p.toArray());
    cord(samples,samples.map(()=>r),c,sides);
  }
  function loft(rows,c,folds=0,twist=0){
    surface(44,rows.length-1,(u,v)=>{
      const row=rows[Math.round(v*(rows.length-1))],a=u*tau,shape=1+folds*(.67*Math.cos(a*9+twist*v)+.33*Math.cos(a*6-twist*v));
      return V(row[0]+Math.sin(a)*row[3]*shape,row[1],row[2]+Math.cos(a)*row[4]*shape);
    },c);
  }
  // Une bottine avance sur l'emmarchement, le poids retombe sur l'autre jambe.
  for(const [x,y,z] of [[-.39,.18,-.14],[.80,.23,.49]]){
    oval(shadow,x,y,z+.13,.34,.20,.57,0,.03);
    for(let k=0;k<4;k++)oval(k%2?patina:azure,x,y+.12+k*.075,z+.09-k*.055,.32-k*.024,.13,.41-k*.045);
    smoothCord([[x-.23,y+.14,z+.43],[x,y+.22,z+.52],[x+.23,y+.14,z+.43]],.029,gold);
  }
  loft([[-.05,.05,-.08,1.11,.58],[-.05,.30,-.10,1.23,.69],[-.02,1.33,.00,1.06,.66],[.06,2.17,.07,.97,.65],[.12,3.10,.03,.85,.59],[.01,4.07,0,.72,.50],[.01,4.44,0,.67,.46]],robe,.17,1.8);
  // Panneau brodé devant le genou, bord inférieur oblique.
  const tab=(u,v)=>{
    const a=(u-.49)*1.73+.14, r=(1.0-.37*v)*(1+.049*Math.cos(7*a+v));
    return V(.13+Math.sin(a)*r,1.05+.46*u+2.94*v,Math.cos(a)*r*.58+.24);
  };
  surface(24,13,tab,azure);
  function edgeLine(fn,r,c){smoothCord(Array.from({length:12},(_,i)=>fn(i/11).toArray()),r,c);}
  edgeLine(u=>tab(u,0),.032,rim);edgeLine(v=>tab(0,v),.026,gold);edgeLine(v=>tab(1,v),.028,gold);
  function lily(x,y,z,s){
    oval(gold,x,y,z,.043*s,.135*s,.023*s);oval(rim,x,y+.115*s,z,.035*s,.060*s,.018*s);
    for(const sign of [-1,1])smoothCord([[x,y-.045*s,z],[x+sign*.058*s,y+.032*s,z+.015],[x+sign*.109*s,y+.044*s,z],[x+sign*.123*s,y-.006*s,z]],.023*s,gold,5);
  }
  for(const [x,y,sc] of [[.17,1.77,1.25],[.46,2.40,.8],[.08,3.22,1.0]])lily(x,y,.84-(y-1.7)*.10,sc);
  loft([[0,4.10,0,.68,.53],[0,4.43,0,.71,.49],[-.045,4.85,-.02,.79,.51],[-.04,5.30,0,.93,.56],[0,5.62,.01,1.02,.53],[.05,5.92,0,.98,.45],[.10,6.12,0,.40,.32]],patina,.027,1.4);
  loft([[0,4.32,0,.74,.54],[0,4.37,0,.78,.56],[0,4.50,0,.76,.53],[0,4.54,0,.70,.51]],gold);
  for(let k=0;k<12;k++){const a=k*tau/12;oval(rim,Math.sin(a)*.756,4.42,.54*Math.cos(a),.035,.041,.030);}
  // Un grand manteau s'ouvre depuis le bras qui désigne la ville.
  // Les points d'attache, les creux et les ourlets existent dans la géométrie.
  function mantle(sign,u,v){
    const wave=Math.sin(Math.PI*u),heavy=v*v*(3-2*v),right=sign>0;
    const x0=right?.50:-.53,x1=right?2.47:-1.45;
    const shoulder=(right?5.93:5.72)+(right?.16:-.80)*u-.53*wave;
    const hem=right?.49+2.58*u+.40*Math.cos(8*u+.25):.19+1.68*u+.46*Math.sin(12*u+1);
    const bank=u*5.4+v*(right?-.94:1.8);
    const crease=(.59*Math.cos(bank*3)+.30*Math.cos(bank*5-.51)+.18*Math.cos(bank*8+.6))*Math.sin(Math.PI*v*.90+.23);
    const swing=right?(.21*Math.sin(Math.PI*v)-.49*heavy):(.46*Math.sin(Math.PI*v)+.16*heavy);
    const x=x0+(x1-x0)*u+sign*(swing*(.6+.55*u)+.085*crease);
    const z=-.30+(right?.51:.67)*u-.37*heavy+.16*wave+(.13+.29*heavy)*crease;
    return V(x,shoulder+(hem-shoulder)*v+.095*crease*heavy,z);
  }
  for(const sign of [-1,1]){
    const fn=(u,v)=>mantle(sign,u,v);
    surface(42,24,fn,sign>0?velvet:robe);
    edgeLine(u=>fn(u,1),.044,gold);edgeLine(u=>fn(u,.964),.021,rim);
    edgeLine(v=>fn(1,v),.032,gold);
    for(let k=1;k<=7;k++){
      const u=k/8,pt=fn(u,.925);
      oval(gold,pt.x,pt.y,pt.z+.03,.037,.066,.021,0,0,.37*Math.sin(u*7));
    }
  }
  // Une écharpe en diagonale donne la direction du buste.
  // Trois lais chevauchants sont ramassés à la fibule de l’épaule.
  function chest(u,v){
    const x=-1.27+2.07*u+.10*(v-.5)*Math.sin(Math.PI*u);
    const top=5.29+.77*u+.22*Math.sin(Math.PI*u)-.08*u*u;
    const vel=4.68+1.17*u-.23*Math.sin(Math.PI*u);
    const y=top+(vel-top)*v;
    const width=.90+.08*Math.cos(Math.PI*(y-5.5));
    const zFront=.34+.39*Math.sqrt(Math.max(0,1-Math.min(1,x*x/(width*width))));
    const pleat=.092*Math.cos(v*17.9+2.6*u+.31*Math.sin(4.09*u))+.034*Math.cos(v*35+5*u);
    return V(x,y,zFront+.083*Math.sin(Math.PI*u)+pleat);
  }
  surface(32,26,chest,azure);edgeLine(u=>chest(u,.945),.024,gold);
  // La bande d’épaule converge sur la broche et repose contre le chiton.
  const sash=(u,v)=>{const a=(u-.5)*.225;return V(-.83+1.49*v+a,4.47+1.43*v-a*.65,.63+.238*Math.sin(Math.PI*v)-.06*v*v+.038*Math.cos(2*Math.PI*u));};
  surface(9,23,sash,velvet);edgeLine(v=>sash(0,v),.026,gold);edgeLine(v=>sash(1,v),.035,rim);
  oval(deepGold,.67,5.89,.569,.173,.169,.062,0,0,.42);oval(rim,.67,5.89,.626,.103,.105,.032);
  oval(0x478681,.67,5.89,.655,.060,.063,.019);
  // Le tombé du chiton se plie sur la cuisse puis se dégage de la cheville.
  // Un pan en biais enveloppe la taille puis s'évase sur la jambe libre.
  const overcoat=(u,v)=>{
    const a=-2.15+4.01*u;
    const hem=1.29+1.20*u+.20*Math.sin(tau*u+1);
    const top=4.26+.29*u;
    const y=hem+(top-hem)*v;
    const flute=(.42+.58*(1-v))*(.24*Math.cos(21*u+4.3*v)+.10*Math.cos(43*u+5.9*v+.9));
    const radius=1.22-.44*v+flute;
    return V(-.01+Math.sin(a)*radius,y,.058+Math.cos(a)*radius*.69);
  };
  surface(49,22,overcoat,patina);edgeLine(u=>overcoat(u,0),.035,gold);
  for(let i=0;i<13;i++){
    const uv=(i+.5)/13,p=overcoat(uv,.10),offset=(uv-.5)*3.9;
    oval(i%3?deepGold:gold,p.x+.02*Math.sin(offset),p.y,p.z+.022*Math.cos(offset),.039,.068,.025,offset,0,.30*Math.sin(offset));
  }
  // Pans superposés de tailles différentes : chacun part de la ceinture
  // et décrit une arête oblique devant le corps, comme dans la gravure.
  function panel(index,u,v){
    const angles=[-1.31,-.49,.29,.98],base=angles[index],w=[.83,.82,.70,.62][index];
    const a=base+(u-.50)*w+.51*v-.17*Math.sin(Math.PI*v)*(index%2?1:-1);
    const hem=[.53,1.12,1.48,.81][index]+[.89,1.19,1.09,.95][index]*u+.15*Math.sin(u*4.84);
    const top=4.45+.09*Math.cos(a*3),y=hem+(top-hem)*v;
    const f=.11*Math.cos(u*7.32+2.3*v)+.044*Math.cos(u*16.4-v);
    const r=1.10+.38*(1-v)-.28*v+.10*Math.sin(2.5*v)+f*(1.2-v*.35)+index*.018;
    return V(.06+Math.sin(a)*r,y,.14+Math.cos(a)*r*.73);
  }
  for(let i=0;i<4;i++){
    const cut=(u,v)=>panel(i,u,v);
    surface(21,22,cut,[shadow,robe,azure,velvet][i]);
    edgeLine(t=>cut(t,0),.035,rim);edgeLine(t=>cut(.015,t),.021,deepGold);
  }
  // Les fleurs sont ciselées à plat dans le repère courbe du vêtement.
  function fleurOn(fn,uc,vc,sx,sy){
    const map=(u,v,raise)=>{
      const p=fn(uc+sx*u,vc+sy*v),pa=fn(uc+sx*u+.002,vc+sy*v),pb=fn(uc+sx*u,vc+sy*v+.002);
      const n=pa.sub(p).cross(pb.sub(p)).normalize();if(n.z<0)n.negate();return p.addScaledVector(n,raise);
    };
    const petals=[
      [[0,-.38],[0,.08],[-.18,.33],[-.10,.57],[0,.86],[.10,.56],[.16,.33],[.04,.06]],
      [[-.04,-.14],[-.25,.13],[-.45,.23],[-.66,.12],[-.73,-.03],[-.66,-.23],[-.52,-.15],[-.52,.00],[-.41,.02],[-.23,-.06]],
      [[.04,-.14],[.25,.13],[.45,.23],[.66,.12],[.73,-.03],[.66,-.23],[.52,-.15],[.52,.00],[.41,.02],[.23,-.06]],
      [[-.25,-.19],[-.22,-.31],[.22,-.31],[.25,-.19]],
      [[-.10,-.29],[-.15,-.51],[0,-.69],[.15,-.51],[.10,-.29]]];
    for(const outline of petals){
      const contour=outline.map(p=>new THREE.Vector2(...p)),tris=THREE.ShapeUtils.triangulateShape(contour,[]);
      const pts=outline.map(p=>map(p[0],p[1],.036)),g=new THREE.BufferGeometry();
      g.setAttribute("position",new THREE.Float32BufferAttribute(pts.flatMap(p=>p.toArray()),3));g.setIndex(tris.flat());g.computeVertexNormals();
      b.put(g,rim,0,0,0,1);_ni.delete(g);g.dispose();
    }
  }
  fleurOn((u,v)=>panel(2,u,v),.58,.59,.42,.13);
  fleurOn((u,v)=>panel(3,u,v),.55,.32,.42,.12);
  fleurOn((u,v)=>panel(1,u,v),.52,.22,.38,.095);
  fleurOn((u,v)=>panel(0,u,v),.49,.36,.38,.10);
  // Le blason est porté par un véritable lé frontal, pris à la ceinture :
  // sa pointe découpée, sa doublure et sa bordure suivent le genou avancé.
  const heraldry=(u,v)=>{
    const cut=.97+.42*Math.abs(2*u-1),y=cut+(4.42-cut)*v;
    const w=.79-.42*v,x=.53+(u-.5)*w+.11*Math.sin(Math.PI*v);
    return V(x,y,1.30-.51*v+.05*Math.sin(2*Math.PI*u)+.06*Math.sin(Math.PI*v));
  };
  surface(14,23,heraldry,robe);
  edgeLine(t=>heraldry(t,0),.033,rim);edgeLine(t=>heraldry(1,t),.026,gold);
  for(const [level,rh] of [[.23,.10],[.51,.095],[.76,.12]])fleurOn(heraldry,.49,level,.47,rh);
  // Des plis continus passent devant le buste et retombent du poignet en festons.
  const shoulderCloth=(u,v)=>{
    const x=.64+1.66*u;
    const top=5.91+.18*u-.21*Math.sin(Math.PI*u);
    const edge=5.56+u*.32-.66*Math.sin(Math.PI*u);
    const fall=Math.sin(Math.PI*u),phase=17*u+5*v-.72*Math.sin(v*4);
    const flutter=(.082*Math.sin(phase)+.032*Math.cos(phase*2.1))*(.22+fall)*v;
    return V(x+.066*Math.sin(Math.PI*v)*Math.cos(phase),top+(edge-top)*v,.18+.16*u+.16*Math.sin(Math.PI*v)+flutter);
  };
  surface(38,11,shoulderCloth,robe);edgeLine(u=>shoulderCloth(u,1),.044,gold);edgeLine(u=>shoulderCloth(u,.84),.022,deepGold);
  for(let k=1;k<9;k++){
    const p=shoulderCloth(k/10,.68);
    oval(gold,p.x,p.y,p.z+.016,.032,.046,.019,0,0,-.38+k*.043);
  }
  // Manche ample du bras d'appui, poignets étroits et bords rapportés.
  cord([[-.74,5.74,.03],[-1.03,5.56,.11],[-1.29,5.28,.23]],[.35,.44,.40],velvet,16);
  cord([[-1.22,5.36,.215],[-1.27,5.31,.228]],[.408,.403],gold,16);
  for(let k=0;k<4;k++){
    const p=k*.072;
    smoothCord([[-.69,5.86-p,.31],[-.84,5.76-p,.41],[-1.07,5.59-p,.45],[-1.21,5.40-p,.43]],.022,k===3?deepGold:patina);
  }
  // Main ouverte, paume vers le ciel, chaque doigt suit son propre arc.
  cord([[.77,5.79,0],[1.06,5.75,.01],[1.62,5.77,.08],[2.17,5.97,.18],[2.86,6.22,.26],[3.15,6.36,.31]],[.33,.42,.32,.25,.19,.13],patina,14);
  cord([[2.85,6.21,.26],[2.96,6.27,.28]],[.209,.194],gold,14);
  oval(light,3.33,6.43,.32,.31,.137,.215,0,0,.25);
  for(let k=0;k<4;k++){
    const z=.16+k*.088,dx=[.24,.36,.39,.30][k];
    cord([[3.42,6.42,z],[3.55,6.47,z-.015],[3.55+dx*.57,6.51+k*.018,z-.025],[3.55+dx,6.59+k*.026,z-.045]],[.066,.063,.047,.018],patina,8);
  }
  cord([[3.27,6.45,.47],[3.39,6.54,.55],[3.50,6.63,.54],[3.57,6.68,.5]],[.083,.069,.052,.025],light,8);
  // Épée en appui devant la jambe, tranchants réellement biseautés.
  cord([[-.77,5.72,.04],[-1.05,5.62,.12],[-1.32,5.18,.26],[-1.66,4.80,.48],[-1.61,4.62,.68]],[.37,.38,.33,.27,.154],patina,13);
  const tip=V(-.12,.23,1.08),guard=V(-1.53,4.04,.76),axis=guard.clone().sub(tip).normalize(),across=V(axis.y,-axis.x,0).normalize();
  const oriented=(y,x,z)=>guard.clone().addScaledVector(axis,y).addScaledVector(across,x).add(V(0,0,z)).toArray();
  function bladePoint(u,v){
    const i=Math.round(u*4),base=tip.clone().lerp(guard,v),span=.137*Math.min(v*6,1)*(1+.13*v);
    return base.addScaledVector(across,[0,1,0,-1,0][i]*span).add(V(0,0,[1,0,-1,0,1][i]*.070*Math.min(v*8,1)));
  }
  surface(4,9,bladePoint,rim);
  for(const dir of [-1,1])smoothCord([oriented(0,0,0),oriented(.045,dir*.18,0),oriented(.001,dir*.39,0),oriented(-.095,dir*.48,0)],.057,gold);
  cord([oriented(.02,0,0),oriented(.59,0,0)],[.085,.070],deepGold);
  for(let i=0;i<5;i++)cord([oriented(.11+i*.09,0,0),oriented(.142+i*.09,0,0)],[.093,.088],rim);
  const pom=oriented(.65,0,0);oval(gold,...pom,.132,.164,.117);
  oval(patina,-1.66,4.73,.69,.216,.243,.179,0,-.20,-.25);
  for(let i=0;i<4;i++)smoothCord([[-1.79+i*.084,4.80,.77],[-1.78+i*.084,4.71,.86],[-1.75+i*.084,4.59,.87],[-1.69+i*.084,4.56,.80]],.051,light,7);
  loft([[.06,5.88,0,.36,.30],[.11,6.16,-.008,.30,.25],[.16,6.43,.01,.255,.23],[.19,6.58,.02,.30,.27]],patina);
  // Les volumes de la tête sont sculptés dans un repère tourné vers le bras.
  const hx=.19,hy=6.875,hz=.055,turn=.45,cs=Math.cos(turn),sn=Math.sin(turn);
  const H=(x,y,z)=>[hx+x*cs+z*sn,hy+y,hz-x*sn+z*cs];
  const faceOval=(c,x,y,z,rx,ry,rz,roll=0)=>oval(c,...H(x,y,z),rx,ry,rz,turn,0,roll);
  const skull=[[-.48,.15,.16,.10],[-.39,.24,.248,.06],[-.24,.312,.28,.03],[-.10,.352,.325,.025],[.03,.353,.344,.00],[.16,.363,.331,-.018],[.30,.365,.304,-.025],[.41,.307,.275,-.035],[.49,.14,.14,-.025]];
  surface(52,30,(u,v)=>{
    const row=v*(skull.length-1),r=Math.min(skull.length-2,Math.floor(row)),t=row-r;
    const [y,w,d,oz]=skull[r].map((value,i)=>value+(skull[r+1][i]-value)*t);
    const a=u*tau,x=Math.sin(a)*w,front=Math.max(0,Math.cos(a));
    const cheek=.039*Math.exp(-((Math.abs(x)-.205)**2/.010+(y+.12)**2/.023));
    const orbit=.032*Math.exp(-((Math.abs(x)-.158)**2/.010+(y-.038)**2/.0048));
    return V(...H(x,y,Math.cos(a)*d+oz+(cheek-orbit)*front**3));
  },patina);
  for(const side of [-1,1]){
    faceOval(shadow,side*.147,.042,.299,.094,.030,.014);
    faceOval(azure,side*.145,.047,.309,.064,.014,.016);
    faceOval(shadow,side*.142,.050,.324,.018,.013,.009);
    faceOval(patina,side*.146,.102,.292,.107,.033,.042,side*.15);
    faceOval(patina,side*.345,-.028,-.006,.054,.095,.063);
  }
  faceOval(azure,.001,-.014,.322,.053,.152,.067);faceOval(azure,0,-.100,.372,.056,.044,.055);
  for(const side of [-1,1]){faceOval(patina,side*.047,-.117,.354,.046,.030,.034);faceOval(shadow,side*.045,-.127,.376,.019,.009,.009);}
  faceOval(shadow,0,-.238,.296,.112,.020,.018);faceOval(azure,0,-.259,.299,.093,.023,.021);
  faceOval(patina,0,-.350,.239,.137,.074,.061);
  for(let j=0;j<17;j++){
    const a=.87+j*.283, sx=Math.sin(a),zz=Math.cos(a);
    const path=[[sx*.29,.37,zz*.23-.024],[sx*.355,.17,zz*.303-.025],[sx*.37-.04,-.04,zz*.31-.076],[sx*.42-.10,-.25,zz*.30-.13],[sx*.37-.17,-.47,zz*.27-.20],[sx*.32-.25,-.62,zz*.22-.22]];
    cord(path.map(pt=>H(...pt)),[.08,.095,.10,.090,.064,.017],j%3?shadow:patina,8,.72);
  }
  // Couronne ajourée, fleurons à trois lobes, gemmes dans la bande.
  const crown=(a,h,r)=>H(Math.sin(a)*r,h,Math.cos(a)*r*.88-.015);
  surface(40,3,(u,v)=>{const radii=[.353,.393,.402,.369];return V(...crown(u*tau,.26+v*.13,radii[Math.round(v*3)]));},gold);
  for(let j=0;j<8;j++){
    const a=j*tau/8,peak=j%2?.63:.72;
    for(const sign of [-1,1])cord([crown(a+sign*.28,.37,.385),crown(a+sign*.12,.42,.408),crown(a,.53,.437),crown(a,peak,.474)],[.029,.036,.042,.012],rim,7);
    const top=crown(a,peak,.474);oval(gold,...top,.036,.047,.033);
    const gem=crown(a,.33,.408);oval(j%2?azure:shadow,...gem,.037,.039,.037);
  }
  // Dépôts de vert-de-gris dans les creux, retours cuivrés sur les épaules.
  // Peinte aux sommets une seule fois, cette patine ne sollicite pas le fragment shader.
  for(let i=0;i<b.c.length;i+=3){
    const x=b.p[i],y=b.p[i+1],z=b.p[i+2];
    if(b.c[i]>b.c[i+1]*1.19)continue;
    const wash=.5+.28*Math.sin(3.1*x+2.3*y+2.8*z)+.22*Math.sin(7*x-3.1*y+4.2*z);
    const recess=Math.max(0,Math.min(1,.24+.32*(1-b.n[i+2])+.35*wash));
    const grade=(.90+.14*wash);
    b.c[i]*=grade*(1-.13*recess);
    b.c[i+1]=Math.min(1,b.c[i+1]*grade+.063*recess);
    b.c[i+2]=Math.min(1,b.c[i+2]*grade+.046*recess);
  }
  const material=new THREE.MeshLambertMaterial({vertexColors:true,side:THREE.DoubleSide});
  const sculpture=b.mesh(material);sculpture.name="Colosse de l’Un";sculpture.position.set(CX,7.97,CZ);
  sculpture.scale.setScalar(3.86);scene.add(sculpture);
}
```


## Maison de l’imprimeur

Ancien code exact

```js
house(-27.5,4.5,Math.PI/2,8.4,8,{pl:0xeed2b4,gable:true,rf:SLATE,sh:FORET,aw:OCRE});
```

Nouveau code complet

```js
house(-27.5,4.5,Math.PI/2,8.4,8,{pl:0xeed2b4,gable:true,rf:SLATE,sh:FORET,aw:OCRE,atelier:true});
```


## Ouverture réelle du rez-de-chaussée

Ancien code exact

```js
  const door=-w/4, front=d/2+0.16;
```

Nouveau code complet

```js
  if(o.atelier)return;
  const door=-w/4, front=d/2+0.16;
```


## Niche de l’atelier

Ancien code exact

```js
  put(G.box,ST,0,1.5,0,w,3,d); put(G.box,pl,0,4.45,0.25,w+0.3,2.9,d+0.5);
```

Nouveau code complet

```js
  if(o.atelier){
    const depth=2.85;
    put(G.box,ST,0,1.5,-depth/2,w,3,d-depth);
    for(const sign of [-1,1])put(G.box,ST,sign*(w/2-.18),1.5,f-depth/2,.36,3,depth);
    put(G.box,0x484457,0,2.91,f-depth/2,w,.18,depth);
    put(G.box,0x635951,0,.06,f-depth/2,w,.12,depth);
  }else put(G.box,ST,0,1.5,0,w,3,d);
  put(G.box,pl,0,4.45,0.25,w+0.3,2.9,d+0.5);
```


## Baies de boutique

Ancien code exact

```js
  const dx=-w/4; put(G.box,0x5b4331,dx,1.08,f+0.02,1.05,2.15,0.1); put(G.box,ST2,dx,2.3,f+0.04,1.45,0.26,0.16); put(G.box,ST2,dx,0.08,f+0.3,1.5,0.16,0.6);
  const sx=w/5; put(G.box,0x2a2c33,sx,1.75,f+0.01,2.0,1.3,0.08); put(G.box,WOOD,sx,1.05,f+0.28,2.2,0.1,0.56); if(o.aw) put(G.box,o.aw,sx,2.68,f+0.52,2.4,0.06,1.05,0,0.36,0);

```

Nouveau code complet

```js
  if(!o.atelier){
  const dx=-w/4; put(G.box,0x5b4331,dx,1.08,f+0.02,1.05,2.15,0.1); put(G.box,ST2,dx,2.3,f+0.04,1.45,0.26,0.16); put(G.box,ST2,dx,0.08,f+0.3,1.5,0.16,0.6);
  const sx=w/5; put(G.box,0x2a2c33,sx,1.75,f+0.01,2.0,1.3,0.08); put(G.box,WOOD,sx,1.05,f+0.28,2.2,0.1,0.56); if(o.aw) put(G.box,o.aw,sx,2.68,f+0.52,2.4,0.06,1.05,0,0.36,0);
  }

```


## Imprimerie, presse, casse, feuilles et enseigne en volume

Ancien code exact

```js
/* enseigne de l'imprimerie : un livre ouvert */
put(G.box,0x3a2e26,-22.45,3.75,4.5,1.3,0.08,0.08); put(G.box,0xe9e2d2,-22.1,3.2,4.5,0.9,0.75,0.07,0,0,0); put(G.box,0x7b2f35,-22.1,3.2,4.5,0.06,0.8,0.1);

```

Nouveau code complet

```js
/* Atelier occidental. X est la profondeur, Z suit l’étal et Y la hauteur. */
{
  const previousJitter=B.jit;
  B.jit=0;
  const walnut=0x785139, oak=0xa87545, ink=0x393747, paper=0xf1dfba, flax=0xc9ac70;
  function plank(x,y,z,w,h,d,c=walnut){
    put(G.box,c,x,y,z,w,h,d,0,0,0,c===walnut||c===oak?6:0);
  }
  function rod(a,b,r,color,round=true){
    const v=new THREE.Vector3().fromArray(b).sub(new THREE.Vector3().fromArray(a));
    const e=new THREE.Euler().setFromQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),v.clone().normalize()),"YXZ");
    put(round?G.c8:G.box,color,(a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2,r,v.length(),r,e.y,e.x,e.z,0);
  }
  // L’ombre et les madriers encadrent la presse que l’on aperçoit depuis la place.
  plank(-26.29,1.36,4.52,.07,2.52,7.55,0x404253);
  for(const z of [1.38,2.90,6.54,8.04]){
    for(const h of [.53,1.02,1.52,2.08])plank(-25.97,h,z,.54,.065,1.43,0x785743);
    for(const sign of [-1,1])plank(-25.99,1.26,z+sign*.69,.43,1.69,.062,0x634939);
    for(let i=0;i<6;i++){
      const y=i>2?1.09:.60,zz=z-.47+.46*(i%3);
      plank(-25.92,y+.12,zz,.42,.24,.393,0x8e694b);
      plank(-25.698,y+.15,zz,.025,.058,.115,0xd1ba87);
    }
    for(let i=0;i<4;i++)plank(-25.92,1.59+.030*i,z-.26,.39,.024,.68,i%2?0xbeaa84:0xd2c6a5);
    put(G.c8,0x65503d,-25.89,1.78,z+.26,.087,.35,.087,0,.11,0);
  }
  for(const z of [.52,3.53,8.45]){
    plank(-23.52,1.45,z,.26,2.90,.23);
    plank(-23.50,.16,z,.46,.32,.39,0xb19a72);
  }
  for(let i=0;i<12;i++){
    const z=.71+i*.67;
    put(G.box,i%4===0?0x788374:0xb8ae8b,-22.91,2.74,z,1.97,.07,.68,0,0,-.18,0);
    put(G.box,i%4===0?0x758172:0xa79a79,-21.96,2.49,z,.048,.16,.68,0,0,0,0);
  }
  plank(-21.99,2.57,4.4,.093,.10,7.95);
  for(const z of [.56,4.37,8.38])rod([-23.49,1.98,z],[-22.13,2.62,z],.075,walnut,false);
  // Presse à vis. Jumelles, sommier, platine, train roulant et barre de manœuvre.
  const px=-24.50,pz=4.96;
  for(const sign of [-1,1]){
    const z=pz+sign*.79;
    plank(px,.15,z,1.24,.20,.29); plank(px,1.18,z,.26,2.13,.24);
    plank(px,2.07,z,.33,.20,.34,oak);
    rod([px-.48,.17,z],[px,.84,z],.105,oak,false);
    rod([px+.48,.17,z],[px,.84,z],.105,oak,false);
    plank(px,.79,z,.86,.26,.30,oak);
  }
  plank(px,2.23,pz,.40,.28,1.86);
  plank(px,2.39,pz,.49,.075,1.95,oak);
  plank(px+.09,.93,pz,1.07,.16,1.84);
  plank(px+.15,1.035,pz,1.04,.066,1.65,ink);
  plank(px+.20,1.083,pz,.74,.025,1.12,paper);
  put(G.c16,0x6b574e,px,1.81,pz,.118,.70,.118);
  for(let i=0;i<7;i++)put(G.c16,i%2?0x987955:0xa48a68,px,1.54+i*.085,pz,.134,.025,.134,0,.13);
  plank(px,1.435,pz,.84,.115,1.09);
  plank(px,1.51,pz,.61,.061,.88,oak);
  rod([px-.20,1.82,pz-.15],[px+.79,1.71,pz+.51],.043,0xa47448);
  put(G.s,oak,px+.79,1.71,pz+.51,.077,.068,.070);
  // Casse en bois à casiers et paquets de papier dans la deuxième travée.
  for(const z of [1.11,3.05]){
    plank(-24.52,.49,z,.61,.87,.12);
    plank(-24.52,.95,z,.82,.09,.16,oak);
  }
  plank(-24.53,.92,2.08,.89,.10,2.12);
  put(G.box,0x4f4446,-24.50,1.00,1.89,.58,.068,1.37,0,0,-.16,0);
  for(let i=0;i<9;i++)plank(-24.5,1.044,1.22+i*.169,.58,.035,.025,oak);
  for(let j=0;j<4;j++)plank(-24.79+j*.19,1.044,1.89,.024,.04,1.38,oak);
  for(let i=0;i<4;i++)plank(-24.49,.998+i*.029,2.84,.56,.026,.44,i%2?paper:0xd9caa7);
  // Tablette de composition. L’outil d’Anselme vient s’y poser pendant le dialogue.
  plank(-22.15,.875,6.06,.76,.12,.66,oak);
  plank(-22.33,.50,5.87,.105,.70,.105);
  plank(-22.33,.50,6.25,.105,.70,.105);
  rod([-22.33,.37,6.20],[-21.92,.85,6.20],.061,walnut,false);
  // Papier à sécher : corde affaissée, angles décollés, pinces et texte sans contenu lisible.
  const cords=[[-22.54,2.40,.75],[-22.54,2.26,2.96],[-22.54,2.40,5.15]];
  rod(cords[0],cords[1],.014,walnut);rod(cords[1],cords[2],.014,walnut);
  for(let i=0;i<7;i++){
    const z=1.00+i*.61,top=2.27+.062*Math.abs(z-2.96),w=.39,h=.48+(i%3)*.048;
    const dx=i%2?.073:.030;
    const corners=[0,top,z-w/2,0,top,z+w/2,dx,top-h,z+w/2,dx+.032,top-h+.020,z-w/2];
    const page=new THREE.BufferGeometry();
    page.setAttribute("position",new THREE.Float32BufferAttribute(corners.concat(corners),3));
    page.setIndex([0,1,2,0,2,3,6,5,4,7,6,4]);page.computeVertexNormals();
    put(page,i%3?paper:0xe0d2b3,-22.54,0,0,1);
    for(let j=0;j<3;j++)plank(-22.54+dx*(.32+j*.10)+.012,top-h*(.32+j*.10),z,.009,.009,w*(.68-j*.08),0x766b62);
    plank(-22.53,top-.009,z-.095,.038,.060,.030,oak);
  }
  // Livre ouvert suspendu en oblique : pages et ferrure sont visibles de l’entrée comme du quai.
  const signX=-21.47,signZ=7.91,signY=2.94,turn=.85;
  rod([-23.36,3.78,signZ],[-20.91,3.78,signZ],.055,0x4c4540,false);
  rod([-23.33,3.20,signZ],[-21.76,3.77,signZ],.042,0x4c4540);
  for(const side of [-1,1]){
    const u=side*.295,x=signX+Math.cos(turn)*u,z=signZ-Math.sin(turn)*u,a=turn-side*.23;
    rod([x,3.77,signZ],[x,3.36,z],.018,0x5b5146);
    put(G.box,0x7e4033,x,signY,z,.62,.85,.125,a,0,-side*.025,0);
    for(const face of [-1,1]){
      const shift=face*.073,xx=x+Math.sin(a)*shift,zz=z+Math.cos(a)*shift;
      put(G.box,0xf2deb0,xx,signY,zz,.565,.755,.023,a,0,-side*.025,0);
      for(let line=0;line<5;line++){
        const offset=face*.017;
        put(G.box,line===0?0x9d5139:0x786253,xx+Math.sin(a)*offset,signY+.19-.087*line,zz+Math.cos(a)*offset,line===0?.15:.34-(line%2)*.048,.018,.013,a,0,0,0);
      }
    }
  }
  put(G.c8,0x945936,signX,signY,signZ,.043,.91,.043);
  // Tranche dorée en tête et en queue de la reliure, et page cornée du grand folio.
  for(const y of [signY-.39,signY+.39])put(G.c8,0xaa8544,signX,y,signZ,.049,.048,.049);
  for(const side of [-1,1]){
    const a=turn-side*.23,u=side*.53,x=signX+Math.cos(turn)*u,z=signZ-Math.sin(turn)*u;
    for(const y of [signY+.29,signY-.29])for(const face of [-1,1]){
      put(G.s,0xb0894b,x+Math.sin(a)*face*.090,y,z+Math.cos(a)*face*.090,.019,.019,.009,a);
    }
  }
  B.jit=previousJitter;
}

```


## Anselme, drapé asymétrique du béret et barbe grise

Ancien code exact

```js
  if(h==="beret"){ H(G.s,0xbdb6aa,0,1.65,-0.03,0.112,0.11,0.118); H(G.s,hc,0.02,1.745,0,0.165,0.045,0.165); H(G.s,0xaba08d,0,1.532,0.023,0.081,0.053,0.065); }
```

Nouveau code complet

```js
  if(h==="beret"){
    H(G.s,0x9e907a,0,1.646,-.047,.109,.107,.108);
    if(o.likeness==="anselme"){
      const capPoints=[], capIndices=[], segments=28;
      // Le bandeau serre le front ; le velours forme une poche qui retombe à gauche.
      const rings=[[1.694,.106,.116,0],[1.712,.116,.12,-.003],[1.704,.15,.144,-.022],[1.723,.172,.151,-.035],[1.757,.159,.134,-.027],[1.782,.099,.088,-.017],[1.787,.002,.002,0]];
      rings.forEach(([y,rx,rz,c],j)=>{
        for(let i=0;i<=segments;i++){
          const a=2*Math.PI*i/segments,fall=Math.max(0,-Math.sin(a));
          const ripple=1+(j>1?.035:.013)*Math.cos(7*a+j*.8);
          capPoints.push(c+rx*Math.sin(a)*ripple,y-.046*fall*(j>1?1:.28)+.009*Math.sin(3*a+j*.42),-.016+rz*Math.cos(a)*ripple);
          if(i&&j){const n=j*(segments+1)+i;capIndices.push(n-segments-2,n-segments-1,n,n-segments-2,n,n-1);}
        }
      });
      const cap=new THREE.BufferGeometry();cap.setAttribute("position",new THREE.Float32BufferAttribute(capPoints,3));cap.setIndex(capIndices);cap.computeVertexNormals();
      H(cap,0xa04832,0,0,0,1,1,1);
      for(let i=0;i<11;i++){
        const a=.92+i*.436,grey=[0xb5a78e,0x918471,0xc2b296][i%3];
        H(G.s,grey,.102*Math.sin(a),1.622+.011*Math.cos(a*3),-.022+.082*Math.cos(a),.020,.042,.025,a,0,.46*Math.sin(2*a));
      }
    }else{
      H(G.s,hc,.02,1.745,0,.165,.045,.165);
      H(G.s,0xaba08d,0,1.532,.023,.081,.053,.065);
    }
  }
```


## Béret des figurants

Ancien code exact

```js
  if(h==="beret") H(G.s,hc,-.038,1.754,-.01,.156,.052,.14,0,0,.14);
```

Nouveau code complet

```js
  if(h==="beret" && o.likeness!=="anselme") H(G.s,hc,-.038,1.754,-.01,.156,.052,.14,0,0,.14);
```


## Bretelles de toile cousues le long du buste

Ancien code exact

```js
    for(const s of [-1,1]){a.detail(G.box,leather?0x925c30:0xebd9b0,s*.13,1.399,.106,.030,.15,.018,0,.48,-s*.12);
      a.detail(G.box,0xc8ac81,s*.13,1.4,-.1,.029,.17,.018,0,-.55,s*.12);}

```

Nouveau code complet

```js
    if(o.likeness==="anselme"){
      for(const side of [-1,1]){
        const points=[],indices=[];
        const path=[[.134,1.337,.135],[.140,1.378,.130],[.145,1.414,.109],[.148,1.439,.073],[.148,1.452,.022],[.146,1.453,-.023],[.14,1.444,-.068],[.127,1.411,-.112],[.092,1.295,-.142],[.054,1.152,-.146]];
        for(let j=0;j<path.length;j++){
          const [x,y,z]=path[j];points.push(side*x-.014,y,z,side*x+.014,y,z);
          if(j){const k=2*j;indices.push(k-2,k-1,k,k-1,k+1,k);}
        }
        const ribbon=new THREE.BufferGeometry();ribbon.setAttribute("position",new THREE.Float32BufferAttribute(points,3));
        ribbon.setIndex(indices);ribbon.computeVertexNormals();a.detail(ribbon,0xb39b76,0,0,0,1);
      }
    }else{
    for(const s of [-1,1]){a.detail(G.box,leather?0x925c30:0xebd9b0,s*.13,1.399,.106,.030,.15,.018,0,.48,-s*.12);
      a.detail(G.box,0xc8ac81,s*.13,1.4,-.1,.029,.17,.018,0,-.55,s*.12);}
    }

```


## Tablier d’Anselme, coordonnées du portrait

Ancien code exact

```js
      uv.push(tile<0?.99:(tile%3+.024+.952*u)/3,tile<0?.009:1-(Math.floor(tile/3)+.024+.952*(1-v))/3);
```

Nouveau code complet

```js
      if(tile===9)uv.push(1.434+.200*u,.024+.186*v);
      else uv.push(tile<0?.99:(tile%3+.024+.952*u)/3,tile<0?.009:1-(Math.floor(tile/3)+.024+.952*(1-v))/3);
```


## Linge taché de l’imprimeur

Ancien code exact

```js
const leather=o.likeness==="garin",at=leather?7:1;
```

Nouveau code complet

```js
const leather=o.likeness==="garin",at=leather?7:o.likeness==="anselme"?9:1;
```


## Matière peinte du tablier

Ancien code exact

```js
const jointCloth=wardrobe.clone(); jointCloth.skinning=true;
```

Nouveau code complet

```js
const jointCloth=wardrobe.clone(); jointCloth.skinning=true;
const printerCloth=wardrobe.clone();printerCloth.onBeforeCompile=printerFace.onBeforeCompile;
```


## Matière du buste d’Anselme

Ancien code exact

```js
  return a.mesh(wardrobe);
```

Nouveau code complet

```js
  return a.mesh(o.likeness==="anselme"?printerCloth:wardrobe);
```


## Anselme, cordons de chemise, tablier de métier

Ancien code exact

```js
  if(o.pouch)a.detail(G.s,0x895737,.162,.906,.072,.083,.087,.066);
```

Nouveau code complet

```js
  if(o.likeness==="anselme"){
    for(const side of [-1,1]){
      a.detail(G.s,0xb8a184,side*.047,1.456,.076,.042,.010,.018,0,0,-side*.27);
      a.detail(G.s,0xc7a780,side*.038,1.412,.110,.007,.044,.007,0,0,-side*.30);
      a.detail(G.s,0x927749,side*.134,1.355,.141,.008,.008,.004);
    }
    a.detail(G.box,0xb5a181,-.048,.89,.185,.124,.102,.012,0,-.09,-.026);
    a.detail(G.box,0xb09976,-.048,.944,.190,.13,.012,.013,0,0,-.026);
    for(let j=0;j<2;j++)a.detail(G.c8,j?0x6a5242:0x403e41,-.080+j*.045,.974,.186,.008,.108,.008,0,0,j?.17:-.14);
  }
  if(o.pouch)a.detail(G.s,0x895737,.162,.906,.072,.083,.087,.066);
```


## Aliénor, construction de la main articulée

Ancien code exact

```js
function paintedAlienor(){
```

Nouveau code complet

```js
// Cinq doigts séparés prolongent la paume ; leur texture provient de la main du modèle.
function paintedHand(forearm,side,shoulder,elbowY){
  const g=forearm.geometry, coords=Array.from(g.attributes.position.array),tex=Array.from(g.attributes.uv.array),idx=Array.from(g.index.array),unit=.00121;
  const digits=[
    [432,735,-.013,-.009,.054,.0090,.009, -.014],
    [444,748,-.005,-.004,.078,.0092,.010, .006],
    [457,749,.006,-.004,.083,.010,.010, .006],
    [469,747,.013,-.004,.076,.0091,.010, .004],
    [476,742,.016,-.004,.065,.0077,.008, .001]
  ];
  digits.forEach(([px,py,spread,lean,length,r,d,z0],digit)=>{
    const start=coords.length/3,radial=8;
    for(const [row,t,swell] of [[0,0,.78],[1,.24,1],[2,.53,.87],[3,.77,.84],[4,.94,.73],[5,1,.19]]){
      for(let k=0;k<=radial;k++){
        const a=k*2*Math.PI/radial;
        coords.push(side*((px-256)*unit+spread*t*.4)+r*swell*Math.sin(a)-shoulder,(1502-py)*unit-elbowY-length*t,z0+d*swell*Math.cos(a)+lean*t+.008*t*t);
        const sourceX=side===1?px:512-px;
        tex.push((sourceX+6*Math.sin(a))/1024,1-(py+t*length/unit)/1536);
        if(row&&k){const n=start+row*(radial+1)+k;idx.push(n-radial-2,n,n-radial-1,n-radial-2,n-1,n);}
      }
    }
  });
  g.setAttribute("position",new THREE.Float32BufferAttribute(coords,3));g.setAttribute("uv",new THREE.Float32BufferAttribute(tex,2));g.setIndex(idx);
  g.deleteAttribute("normal");g.computeVertexNormals();
}
function paintedAlienor(){
```


## Aliénor, doigts solidaires du poignet

Ancien code exact

```js
    joint.add(couture([[504,405,29,32],[537,405,30,31],[589,415,26,29],[685,441,20,23],[711,450,20,20],[760,455,23,17],[806,453,19,14],[824,454,9,9]],[shoulder,elbowY],side));

```

Nouveau code complet

```js
    const forearm=couture([[504,405,29,32],[537,405,30,31],[589,415,26,29],[685,441,20,23],[711,450,20,20],[737,454,23,17],[752,455,22,13],[757,455,17,10]],[shoulder,elbowY],side);
    paintedHand(forearm,side,shoulder,elbowY);joint.add(forearm);

```


## Aliénor, ruban de lin et mèches sous le chignon

Ancien code exact

```js
  hair.put(G.s,0xbd9a73,0,.161,-.122,.044,.008,.019);
```

Nouveau code complet

```js
  hair.put(G.s,0xbd9a73,0,.161,-.122,.044,.008,.019);
  for(const side of [-1,1]){
    hair.put(G.s,0xd4ba8c,side*.024,.172,-.147,.033,.010,.012,0,0,side*.37);
    hair.put(G.s,0xbaa07a,side*.023,.145,-.148,.011,.030,.009,0,0,-side*.26);
    const base=[new THREE.Vector3(side*.083,.177,.037),new THREE.Vector3(side*.101,.158,.047),new THREE.Vector3(side*.102,.137,.031),new THREE.Vector3(side*.093,.117,.041),new THREE.Vector3(side*.093,.094,.025)];
    const lock=new THREE.TubeGeometry(new THREE.CatmullRomCurve3(base),12,.0037,5,false);
    hair.put(lock,side>0?0x8d4c2e:0x995a39,0,0,0,1);
  }
```


## Trait du maître imprimeur

Ancien code exact

```js
  anselme:npc({likeness:"anselme",
```

Nouveau code complet

```js
  anselme:npc({likeness:"anselme",noOutline:true,
```


## Pigments du béret et des mèches d’Anselme

Ancien code exact

```js
function skinFromPortrait(head, count, name){
```

Nouveau code complet

```js
const printerPortrait=new THREE.TextureLoader().load("img/portraits/anselme_neutre.webp");
const printerFace=faceMaterial.clone();
printerFace.onBeforeCompile=sh=>{
  sh.uniforms.printerReference={value:printerPortrait};
  sh.fragmentShader=sh.fragmentShader.replace("#include <common>","#include <common>\nuniform sampler2D printerReference;").replace("#include <map_fragment>",
    "#ifdef USE_MAP\nvec4 pigment=vUv.x>1.?texture2D(printerReference,vec2(vUv.x-1.,vUv.y)):texture2D(map,vUv);diffuseColor*=mapTexelToLinear(pigment);\n#endif");
};
function skinFromPortrait(head, count, name){
```


## Dépliage de la coiffe sur le portrait original

Ancien code exact

```js
  g.setAttribute("uv",new THREE.BufferAttribute(uv,2)); head.material=faceMaterial;
```

Nouveau code complet

```js
  if(name==="anselme"){
    for(let i=0;i<count;i++){
      if(uv[2*i]>.021 || uv[2*i+1]>.021)continue;
      const y=pos.getY(i),x=pos.getX(i);
      uv[2*i]=1.351+Math.abs(x)*.22;
      uv[2*i+1]=.624+(y-.125)*.56;
      col.setXYZ(i,.80,.82,.80);
    }
    for(let i=count;i<pos.count;i++){
      const x=pos.getX(i),y=pos.getY(i),z=pos.getZ(i);
      const velvet=col.getX(i)>col.getY(i)*1.8;
      if(velvet){
        uv[2*i]=1.490+x*.74;uv[2*i+1]=.886+(y-.23)*.49+z*.073;
        col.setXYZ(i,.79,.78,.78);
      }else if(y>.060&&z<.059){
        uv[2*i]=1.298+x*.16+z*.14;uv[2*i+1]=.646+(y-.11)*.40;
        col.setXYZ(i,.82,.85,.88);
      }
    }
  }
  g.setAttribute("uv",new THREE.BufferAttribute(uv,2));head.material=name==="anselme"?printerFace:faceMaterial;
```


## Balle d’encrage et tache animée

Ancien code exact

```js
const guardLook=
```

Nouveau code complet

```js
// L’outil suit la main, puis sa position s’interpole jusqu’à la tablette.
const atelierHand=N.anselme.userData.elbows[1], atelierTool=(()=>{
  const b=new Builder();b.jit=0;
  b.put(G.c8,0x856044,0,0,0,.024,.169,.024);
  b.put(G.c16,0x785239,0,-.073,0,.066,.032,.066);
  b.put(G.s,0x46404b,0,-.102,0,.071,.043,.071);
  b.put(G.c16,0x938063,0,-.072,0,.068,.012,.068);
  return b.mesh(VC2);
})();
const atelierSmudge=(()=>{
  const b=new Builder();b.jit=0;
  for(const [x,y,r] of [[0,0,.019],[-.017,.011,.011],[.011,.013,.008],[-.006,-.015,.010],[.014,-.010,.004]]){
    b.put(G.s,0x545265,x,y,0,r*.94,r,.004,0,0,.24);
  }
  const stain=b.mesh(VC2);stain.castShadow=false;stain.receiveShadow=false;
  stain.rotation.y=-.35;stain.position.set(-.032,-.225,.044);
  player.userData.arms[0].add(stain);return stain;
})();
const atelierGrip=new THREE.Vector3(0,-.306,.034),atelierTable=new THREE.Vector3(-21.95,1.088,6.08);
const atelierQ=new THREE.Quaternion(),atelierLevel=new THREE.Quaternion();
atelierHand.add(atelierTool);atelierTool.position.copy(atelierGrip);
function atelierActorProps(toolDown=0,inkSpread=0){
  toolDown=THREE.MathUtils.clamp(toolDown,0,1);
  atelierSmudge.scale.set(1+.64*inkSpread,1+1.08*inkSpread,1);
  atelierSmudge.rotation.z=-.29*inkSpread;
  if(toolDown<=0){
    if(atelierTool.parent!==atelierHand)atelierHand.add(atelierTool);
    atelierTool.position.copy(atelierGrip);atelierTool.quaternion.identity();
    atelierTool.visible=true;
  }else{
    if(atelierTool.parent!==scene)scene.add(atelierTool);
    atelierHand.updateWorldMatrix(true,false);
    atelierTool.position.copy(atelierGrip).applyMatrix4(atelierHand.matrixWorld).lerp(atelierTable,toolDown);
    atelierHand.getWorldQuaternion(atelierQ);
    atelierTool.quaternion.copy(atelierQ).slerp(atelierLevel,toolDown);
    atelierTool.visible=N.anselme.visible;
  }
}
const guardLook=
```


## Quai • Barques, amarre et abattant de l’étal

Ancien code exact

```js
for(const [bx,bz,r] of [[-12,24,0.3],[9,26,-0.2]]){ put(G.s,0x7b5c3e,bx,0.05,bz,2.6,0.5,0.9,r); put(G.box,0x5b4331,bx,0.3,bz,3.4,0.08,0.5,r); put(G.c8,0x5b4331,bx,1.6,bz,0.05,3,0.05); }
```

Nouveau code complet

```js
/* Deux canots à clins. Les membrures, le plat-bord et les bancs suivent la coque. */
const quayBoats=[];
for(const [bx,bz,r] of [[-12,24,.3],[9,23.25,-.20]]){
  const hull=new Builder();hull.jit=.018;
  const points=[], colors=[];
  const width=u=>.80*Math.pow(Math.max(0,1-u*u),.70)+.044;
  function ribPoint(u,h,side){
    return [2.38*u,-.39+h*.85+.16*u*u,side*width(u)*(.43+.57*h)];
  }
  for(const side of [-1,1])for(let row=0;row<5;row++)for(let i=0;i<18;i++){
    const u=-1+i/9,v=u+1/9,h=row/5,j=(row+1)/5;
    const a=ribPoint(u,h,side),b=ribPoint(v,h,side),c=ribPoint(v,j,side),d=ribPoint(u,j,side);
    const base=new THREE.Color([0x63473a,0x896046,0xa17850,0x77624b,0xb29a6c][row]);
    for(const q of [a,b,c,c,d,a]){points.push(...q); colors.push(base.r,base.g,base.b);}
  }
  const shell=new THREE.BufferGeometry();shell.setAttribute("position",new THREE.Float32BufferAttribute(points,3));shell.computeVertexNormals();
  shell.setAttribute("color",new THREE.Float32BufferAttribute(colors,3));shell.setAttribute("pat",new THREE.Float32BufferAttribute(new Float32Array(points.length/3).fill(6),1));
  for(const u of [-.67,-.16,.50])hull.put(G.box,0x977444,u*2.38,.24,0,.30,.095,width(u)*1.82,0,0,0,6);
  hull.put(G.box,0x69523e,0,-.15,0,3.18,.13,.80);
  for(const side of [-1,1])for(let i=0;i<12;i++){
    const u=-1+i/6,v=u+1/6;
    const a=new THREE.Vector3(...ribPoint(u,1,side)),b=new THREE.Vector3(...ribPoint(v,1,side));
    const edge=new THREE.TubeGeometry(new THREE.LineCurve3(a,b),1,.045,5,false);
    hull.put(edge,0xc29863,0,0,0,1);
  }
  // Une écope, deux avirons croisés, des varangues et des tours de cordage occupent le fond.
  for(let j=-2;j<=2;j++)hull.put(G.box,j%2?0x6f513d:0x8d6445,0,-.092,j*.143,3.40,.08,.129,0,0,0,6);
  for(const side of [-1,1]){
    for(let j=0;j<7;j++){
      const u=(j-3)/4.3;
      const a=new THREE.Vector3(...ribPoint(u,.10,side)),b=new THREE.Vector3(...ribPoint(u,.91,side));
      a.z*=.90;b.z*=.90;
      const g=new THREE.TubeGeometry(new THREE.LineCurve3(a,b),1,.029,5,false);
      hull.put(g,0x5a4837,0,0,0,1);
    }
    const angle=side*.19;
    hull.put(G.box,0x9b754c,.23,.339,side*.34,3.19,.055,.055,angle,0,0,6);
    hull.put(G.s,0x74543b,-1.23,.33,side*.62,.51,.036,.106,angle,0,0,6);
  }
  for(let n=0;n<4;n++){
    const line=[],rad=.10+n*.026;
    for(let k=0;k<=33;k++){const a=k/33*Math.PI*2;line.push(new THREE.Vector3(-.42+rad*Math.cos(a),.306+n*.0037,rad*.72*Math.sin(a)));}
    hull.put(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(line),32,.012,5,false),0x654d35,0,0,0,1);
  }
  const boat=new THREE.Group();boat.add(new THREE.Mesh(shell,cityPaint),hull.mesh(cityPaint));boat.position.set(bx,0,bz);boat.rotation.y=r;scene.add(boat);quayBoats.push(boat);
}
const mooring=new THREE.Mesh(G.c8,LM(0x65503c));scene.add(mooring);
const mooringOrigin=new THREE.Vector3(9,1.37,18.7),mooringEnd=new THREE.Vector3(),axisUp=new THREE.Vector3(0,1,0),mooringDirection=new THREE.Vector3();
function rockBoats(t){
  for(let i=0;i<quayBoats.length;i++){const q=quayBoats[i];q.rotation.z=.019*Math.sin(t*1.55+i);q.rotation.x=.052*Math.sin(t*1.12+i);q.position.y=.05+.064*Math.sin(t*1.27+i); }
  const q=quayBoats[1];q.position.z=23.25+.16*Math.sin(t*.94);
  mooringEnd.set(.90,.45,-.47);q.localToWorld(mooringEnd);mooringDirection.subVectors(mooringEnd,mooringOrigin);
  mooring.position.copy(mooringOrigin).lerp(mooringEnd,.5);mooring.scale.set(.034,mooringDirection.length(),.034);mooring.quaternion.setFromUnitVectors(axisUp,mooringDirection.normalize());
}
const stallFlap=new THREE.Group();{
  const boards=new Builder();boards.jit=.04;
  for(let i=0;i<5;i++)boards.put(G.box,i%2?0x86623e:0x99754e,-1.08+i*.54,-.43,0,.53,.86,.055);
  for(const x of [-.87,.88])boards.put(G.box,0x4b4543,x,-.44,.036,.08,.67,.035);
  stallFlap.add(boards.mesh());stallFlap.position.set(13,.98,9.38);scene.add(stallFlap);
}
```


## Commandes de lecture et titre du quai

Ancien code exact

```js
</style>
```

Nouveau code complet

```js
#cutSkip{position:fixed;bottom:max(18px,env(safe-area-inset-bottom));right:max(18px,env(safe-area-inset-right));z-index:8;min-height:44px;padding:8px 16px;border-radius:3px;font-size:17px}
#cutPlace{position:fixed;bottom:max(9%,36px);left:6%;color:#fff1cf;text-shadow:0 1px 4px #272331,0 0 12px #272331;font:italic clamp(23px,4vw,44px) var(--display);pointer-events:none}
#cutPlace small{display:block;font:normal .48em var(--display);letter-spacing:.07em}
#cutSkip[hidden],#cutPlace[hidden]{display:none}
@media(max-height:580px){#ov.home .small{display:none}#ov.home .pitch{font-size:15px;margin:4px 0}#ov.home .bot{gap:4px}}
</style>
```


## Interface des séquences

Ancien code exact

```js
<button id="snd" class="cart"></button>
```

Nouveau code complet

```js
<button id="snd" class="cart"></button>
<div id="cutPlace" hidden>Sarlande<small>Le matin du tribut</small></div>
<button id="cutSkip" class="cart" hidden>Passer la scène</button>
```


## Lecture depuis le menu • Scène de la pierre

Ancien code exact

```js
<p class="small">La partie s’enregistre sur cet appareil.</p>
```

Nouveau code complet

```js
<button class="sec" data-a="stone-preview">Voir la scène de la pierre</button>
  <p class="small">La partie s’enregistre sur cet appareil.</p>
```


## Nouvelle partie et reprise

Ancien code exact

```js
function startPlay(){ closePanel(); S.started=true; applyStage(); save(); fpsT=0; fpsN=0; const pending=document.fonts&&document.fonts.status!=="loaded"?document.fonts.ready:null; turnPage("ville",()=>{ mode="play"; zone=zoneOf(); refreshHud(); snapCam(); },pending); }
```

Nouveau code complet

```js
function startPlay(newGame=false){
  closePanel();S.started=true;applyStage();save();fpsT=0;fpsN=0;setScene(true);setCones(true);
  if(newGame){firstExchange=false;player.rotation.y=-Math.PI/2;startMovie("matin",enterPlay);}
  else{inkSpread=S.stage>0?1:0;toolDown=inkSpread;atelierActorProps(toolDown,inkSpread);enterPlay();}
}
```


## Choix de l’écran d’accueil

Ancien code exact

```js
player.position.set(S.pos[0],0,S.pos[1]); startPlay(); }
```

Nouveau code complet

```js
player.position.set(S.pos[0],0,S.pos[1]); startPlay(true); }
  else if(a==="stone-preview"){previewStone();}
```


## Première conversation • Entrée

Ancien code exact

```js
if(S.stage===0) return talk([[AN,"« Te voilà
```

Nouveau code complet

```js
if(S.stage===0) return beginMeeting([[AN,"« Te voilà
```


## Changement de sujet à l’atelier

Ancien code exact

```js
  const l=queue.shift(); waitingChoice=false;
```

Nouveau code complet

```js
  if(firstExchange&&Array.isArray(queue[0])&&queue[0][1].startsWith("« C’est le matin du tribut.")){
    firstExchange=false;startMovie("outil",()=>{mode="dialog";nextLine();refreshHud();});return;
  }
  const l=queue.shift(); waitingChoice=false;
```


## Quêtes • Chute au pied du colosse

Ancien code exact

```js
function startCine(){ turnPage("chateau",()=>{ mode="cine"; cineT=0; fallT=0; refreshHud(); $("obj").style.display="none"; camPos.set(-9,4.5,-24.5); camLook.set(-1.4,2.2,-32.5); }); }
```

Nouveau code complet

```js
function startCine(){turnPage("chateau",()=>startMovie("pierre",()=>{
  setStage(5);enterPlay();
  talk([["","Au pied du colosse, une pierre gît hors du socle. Sur la place, personne ne l’a encore remarqué."],["","Maître Anselme doit l’apprendre. L’imprimerie est à l’ouest de la place : suivez la flèche."]]);
}));}
```


## Régie des quatre séquences

Ancien code exact

```js
/* ================= Boucle ================= */
```

Nouveau code complet

```js
/* Mise en scène du matin. Une sortie unique rétablit les commandes et la caméra. */
let sceneRun=null,firstExchange=false,toolDown=0,inkSpread=0;
const ease01=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);};
const sceneDurations={matin:16,manche:4.2,outil:2.4,pierre:6};
function setLens(f){if(Math.abs(camera.fov-f)>.02){camera.fov=f;camera.updateProjectionMatrix();}}
function frame(x,y,z,tx,ty,tz,f){camPos.set(x,y,z);camLook.set(tx,ty,tz);setLens(f);}
function freeView(){
  const P=player.position,o=camOff();
  const interest=S.act===1&&S.stage===0?Math.max(0,1-Math.hypot(P.x+20,P.z-7)/9):0;
  return [P.x+.84*interest,o[0]+.15*interest,P.z+o[1]+(portrait?3.1*interest:0),P.x-(portrait?4.1:5.3)*interest,o[2],P.z-7,portrait?60:46];
}
function stoneJoint(){frame(-5.7,2.05,-25.3,-1.68,1.56,-33.12,portrait?57:41);aimSun(0,-34);}
function startMovie(name,done){
  joyEnd();Object.keys(keys).forEach(k=>keys[k]=false);current=null;
  sceneRun={name,t:0,done,fired:new Set(),cones:conesOn};mode="sequence";setCones(false);dlg.style.display="none";
  refreshHud();$("cutSkip").hidden=false;marker.visible=false;reveal=1.3;revealDir=1;
  if(name==="matin"){toolDown=0;inkSpread=0;stallFlap.rotation.x=0;}
  if(name==="pierre")placeStone(0);
  directScene(0);
}
function releaseMovie(){
  const m=sceneRun;if(!m)return;sceneRun=null;
  $("cutSkip").hidden=true;$("cutPlace").hidden=true;setCones(m.cones);setLens(portrait?60:46);
  for(const g of [player,N.anselme]){const u=g.userData;u.head.rotation.x=0;u.head.rotation.y=0;u.body.rotation.z=0;u.arms.forEach(a=>{a.rotation.z=0;});}
  if(m.name==="matin"){stallFlap.rotation.x=-1.4;playerSack.rotation.z=0;}
  if(m.name==="manche")inkSpread=1;
  if(m.name==="outil")toolDown=1;
  if(m.name==="pierre")placeStone(1);
  atelierActorProps(toolDown,inkSpread);current=null;m.done();
}
function enterPlay(){mode="play";zone=zoneOf();snapCam();refreshHud();}
function beginMeeting(lines){
  const a=N.anselme.position,p=player.position;
  N.anselme.rotation.y=Math.atan2(p.x-a.x,p.z-a.z);player.rotation.y=Math.atan2(a.x-p.x,a.z-p.z);
  firstExchange=true;toolDown=0;inkSpread=0;startMovie("manche",()=>{talk(lines);});
}
function directScene(delta){
  const m=sceneRun;if(!m)return;
  m.t+=delta;const t=m.t,P=player.position,A=N.anselme.position,H=player.userData,M=N.anselme.userData;
  const cue=(id,when,f)=>{if(t>=when&&!m.fired.has(id)){m.fired.add(id);f();}};
  const phase=(a,b)=>ease01((t-a)/(b-a));
  $("cutPlace").hidden=m.name!=="matin"||t<.35||t>3.05;
  if(m.name==="matin"){
    cue("bois",2.8,()=>{if(Snd.ctx){thump(Snd.ctx.currentTime+.01,.22,119,.19);}});
    cue("presse",5.2,()=>sfx("press"));
    stallFlap.rotation.x=-1.4*phase(2.3,3.5);
    if(t<2.65){const k=phase(0,2.65);frame(12.55-.87*k,1.53+.65*k,25.4+.38*k,8.4, .54+.28*k,22.1,portrait?61:49);aimSun(9,20);}
    else if(t<4.25){frame(10.45,1.42,12.36,13,.99,9.1,portrait?58:43);aimSun(12,9);}
    else if(t<7.95){const k=phase(4.25,6.8);frame(-8+k*.72,3+k*.88,20,3,13+10*k,-38,portrait?57:41);aimSun(0,-27);}
    else if(t<9.35)stoneJoint();
    else if(t<11.85){
      const q=file[4],v=q.position;frame(v.x-2.45,1.32,v.z+2.58,v.x+.16,1.13,v.z-.28,portrait?57:44);aimSun(v.x,v.z);
      cue("pas",10.22,()=>{if(Snd.ctx)acoustic("pas-1",Snd.ctx.currentTime+.02,.22,.89,0);});
    }else{
      const k=phase(11.85,13.1),hold=phase(11.84,12.58)*(1-phase(13.42,14.6));
      faceTo(player,A.x,A.z,Math.min(.3,delta),5);
      H.arms[0].rotation.x=-.75*hold;H.arms[0].rotation.z=.19*hold;H.elbows[0].rotation.x=-.2-1.52*hold;
      H.body.rotation.z=-.046*hold;playerSack.rotation.z=-.079*hold;H.head.rotation.x=.13*hold;
      const far=freeView(),r=phase(14.55,16);
      const from=[-17.72+.28*k,1.61+.31*k,8.66+.28*k,-20.34-k*.78,1.32+.39*k,6.54,portrait?62:48];
      frame(...from.map((v,i)=>v+(far[i]-v)*r));aimSun(P.x,P.z-3);
    }
  }else if(m.name==="pierre"){
    if(t<1.65){frame(-8,3.85,20,3,23,-38,portrait?57:41);aimSun(0,-28);}
    else{stoneJoint();const d=phase(2.62,4.95);placeStone(d*d);
      const tremble=.055*Math.sin(45*t)*(1-phase(4.65,5.22))*phase(4.47,4.68);camPos.y+=tremble;}
    cue("chute",3.54,()=>sfx("stone"));
  }else{
    const dx=A.x-P.x,dz=A.z-P.z,L=Math.max(.1,Math.hypot(dx,dz)),ux=dx/L,uz=dz/L;
    const side=uz<0?-1:1, nx=-uz*side,nz=ux*side;
    // Regarder depuis le côté sud, hors du mur ouest. Les mains se détachent entre les deux corps.
    const cx=(P.x+A.x)*.5,cz=(P.z+A.z)*.5,dist=portrait?Math.max(2.75,L*1.72):Math.max(2.32,L*.99);
    if(m.name==="manche"){
      const touch=phase(.58,1.68)*(1-phase(2.84,3.88)),rub=Math.sin(t*10)*.08*touch;
      H.head.rotation.x=.32*phase(.30,1.15)*(1-phase(2.74,3.92));M.head.rotation.x=.30*(1-phase(2.53,3.90));
      H.arms[0].rotation.z=.30*touch;H.arms[0].rotation.x=-.93*touch;H.elbows[0].rotation.x=-.18-.72*touch;
      H.arms[1].rotation.z=(-.67+rub)*touch;H.arms[1].rotation.x=-.72*touch;H.elbows[1].rotation.x=-.15-1.15*touch;
      inkSpread=phase(1.81,2.84);
      cue("manche",1.93,()=>{if(Snd.ctx)acoustic("feuille",Snd.ctx.currentTime+.01,.095,.79,0);});
      frame(cx+Math.abs(nx)*dist+.26,1.51,cz+Math.abs(nz)*dist+.12,cx,1.25,cz,portrait?49:38);
    }else{
      toolDown=phase(.22,1.32);M.head.rotation.x=.30*phase(.05,.82);M.arms[1].rotation.x=-.70+.52*toolDown;M.elbows[1].rotation.x=-.79+.58*toolDown;
      cue("outil",1.3,()=>{if(Snd.ctx)thump(Snd.ctx.currentTime+.01,.12,250,.13);});
      const r=phase(1.35,2.37);frame(A.x+1.65,1.41+r*.12,A.z+1.58,A.x+.08+r*.31,1.11+r*.33,A.z+.06,portrait?54:44);
    }
    aimSun(cx,cz);atelierActorProps(toolDown,inkSpread);
  }
  if(t>=sceneDurations[m.name])releaseMovie();
}
function previewStone(){
  closePanel();setScene(true,"day");
  startMovie("pierre",()=>{applyStage();showTitle();});
}
function skipCurrent(){
  if(sceneRun)releaseMovie();
  else if(mode==="cine2")endCine2();
  else if(mode==="farce"){farT=16.7;Object.assign(fete.cues,{l1:1,l2:1,l3:1,l4:1,a1:1,g:1});farceTick(0);}
}
$("cutSkip").addEventListener("click",skipCurrent);
window.addEventListener("keydown",e=>{if(e.key==="Escape"&&(sceneRun||mode==="cine2"||mode==="farce")){e.preventDefault();skipCurrent();}});

/* ================= Boucle ================= */
```


## Raccord vers le jeu libre

Ancien code exact

```js
function snapCam(){ const p=player.position, o=camOff(); camPos.set(p.x,o[0],p.z+o[1]); camLook.set(p.x,o[2],p.z-7); }
```

Nouveau code complet

```js
function snapCam(){frame(...freeView());}
```


## Horloge cinématique découplée des collisions

Ancien code exact

```js
const dt=Math.min(clock.getDelta(),0.05); time+=dt;
```

Nouveau code complet

```js
const elapsed=clock.getDelta(), dt=Math.min(elapsed,0.05); time+=dt;rockBoats(time);
```


## Marche de la file du tribut

Ancien code exact

```js
  for(const p of file){ p.position.z-=dt*0.6; if(p.position.z<-11.5) p.position.z=16.4; animate(p,true,dt,3.2); }
```

Nouveau code complet

```js
  for(let i=0;i<file.length;i++){
    const p=file[i],inOpening=sceneRun&&sceneRun.name==="matin";
    const lineMoves=!inOpening||sceneRun.t>(i===4?10.06:10.59+i*.055);
    const advance=inOpening?Math.min(elapsed,.16):dt;
    if(lineMoves){p.position.z-=advance*.6;if(p.position.z<-11.5)p.position.z=16.4;}
    animate(p,lineMoves,advance,3.2);
  }
```


## Anselme à sa casse avant la rencontre

Ancien code exact

```js
soundTick(dt); charTick(dt);
```

Nouveau code complet

```js
soundTick(dt); charTick(dt);
  if(S.act===1&&S.stage===0&&!sceneRun&&mode==="play"&&!firstExchange&&toolDown===0){
    const u=N.anselme.userData,bend=.5+.5*Math.sin(time*2.8);
    u.elbows[1].rotation.x=-.72-.48*bend;u.arms[1].rotation.x=-.50+.17*bend;
    u.head.rotation.x=.20+.065*bend;
  }
```


## Caméra • Plans de l’ouverture et de la rencontre

Ancien code exact

```js
if(mode==="plate"&&plate){ tmp.set(
```

Nouveau code complet

```js
if(sceneRun){directScene(document.hidden?0:Math.min(elapsed,.4));}
  else if(mode==="plate"&&plate){ tmp.set(
```


## Caméra • Raccord du pied du colosse

Ancien code exact

```js
  else if(mode==="cine"){ cineT+=dt; tmp.set(-9,4.5,-24.5); camPos.lerp(tmp,Math.min(1,dt*2)); tmp.set(-1.4,2.2,-32.5); aimSun(0,-30); camLook.lerp(tmp,Math.min(1,dt*2.5)); if(cineT>1.6){ if(fallT===0) sfx("stone"); fallT=Math.min(1,fallT+dt*0.5); placeStone(fallT*fallT); } if(cineT>5.2){ mode="turn"; setStage(5); wash(()=>{ snapCam(); mode="play"; zone=zoneOf(); refreshHud(); talk([["","Au pied du colosse, une pierre gît hors du socle. Sur la place, personne ne l’a encore remarqué."],["","Maître Anselme doit l’apprendre. L’imprimerie est à l’ouest de la place : suivez la flèche."]]); }); } }
```

Nouveau code complet

```js
  // La chute de la pierre partage le cadre de la première visite au socle.
```


## Cadre libre à proximité de l’imprimerie

Ancien code exact

```js
else { const p=player.position; const o=camOff(); tmp.set(p.x,o[0],p.z+o[1]); camPos.lerp(tmp,k); tmp.set(p.x,o[2],p.z-7); camLook.lerp(tmp,k); aimSun(p.x,p.z-6); }
```

Nouveau code complet

```js
else {const p=player.position,v=freeView();tmp.set(v[0],v[1],v[2]);camPos.lerp(tmp,k);tmp.set(v[3],v[4],v[5]);camLook.lerp(tmp,k);aimSun(p.x,p.z-6);}
```


## Commande des scènes existantes

Ancien code exact

```js
function refreshHud(){ const playing=mode==="play";
```

Nouveau code complet

```js
function refreshHud(){ const playing=mode==="play"; $("cutSkip").hidden=!(mode==="sequence"||mode==="farce"||mode==="cine2");
```


## Mixage du quai et de la première rencontre

Ancien code exact

```js
const set=(g,v,k)=>g.gain.setTargetAtTime(v,now,k||0.4);
```

Nouveau code complet

```js
const set=(g,v,k)=>g.gain.setTargetAtTime(v,now,k||0.4);
  const opening=sceneRun&&sceneRun.name==="matin";
```


## Musique sous les gestes

Ancien code exact

```js
mode==="dialog"?.49:.83
```

Nouveau code complet

```js
opening?(sceneRun.t<5?.17:.43):(mode==="dialog"||mode==="sequence"?.49:.83)
```


## Présence de l’eau à l’amarre

Ancien code exact

```js
set(Snd.riverG,inGame?0.16*Math.max(0.12,Math.min(1,(P.z-2)/15)):0.05);
```

Nouveau code complet

```js
set(Snd.riverG,opening?.055+.38*(1-ease01((sceneRun.t-2.2)/3.5)):inGame?0.16*Math.max(0.12,Math.min(1,(P.z-2)/15)):0.05);
```


## Lavis du matin • Source peinte et intensité

Ancien code exact

```js
uniform float lite; uniform sampler2D tColor;
```

Nouveau code complet

```js
uniform float uMatin; uniform sampler2D tMatin; uniform float lite; uniform sampler2D tColor;
```


## Ciel • Papier et lavis de l’illustration du quai

Ancien code exact

```js
const postMat=new THREE.ShaderMaterial({uniforms:{tHorizon:
```

Nouveau code complet

```js
const postMat=new THREE.ShaderMaterial({uniforms:{uMatin:{value:0},tMatin:{value:new THREE.TextureLoader().load("img/lieux/couverture.webp")},tHorizon:
```


## Ciel de Sarlande • Plans au petit matin

Ancien code exact

```js
  if(sky){
    float h=vUv.y;
```

Nouveau code complet

```js
  if(sky&&uMatin<.5){
    float h=vUv.y;
```


## Ciel • Lavis orienté dans le monde

Ancien code exact

```js
    float az=atan(dir.x,-dir.z);
```

Nouveau code complet

```js
    float az=atan(dir.x,-dir.z);
    if(uMatin>.5){
      // La réserve de papier entre Aliénor et le palais fournit la vraie granulation du ciel.
      vec2 washUv=vec2(.445+.111*dir.x+.013*dir.z,.705+.099*dir.y);
      vec3 washSky=texture2D(tMatin,washUv).rgb;
      float high=smoothstep(.12,.80,dir.y);
      vec3 lightSky=mix(washSky,vec3(.58,.72,.77),.40*high+.07);
      float layer=noise(vec2(dir.x*4.1+dir.z*2.4,dir.y*11.2));
      lightSky=mix(lightSky,vec3(.58,.62,.67),.13*smoothstep(.48,.79,layer));
      float disc=distance(dir,normalize(vec3(.34,.40,-.85)));
      lightSky=mix(lightSky,vec3(1.,.91,.69),.65*(1.-smoothstep(.035,.053,disc))+.15*(1.-smoothstep(.07,.36,disc)));
      pig=lightSky;dens=1.;ink=0.;
    }
```


## Éclairage du premier matin

Ancien code exact

```js
let k=Math.min(1,dt*4); dlgOn=false;
```

Nouveau code complet

```js
let k=Math.min(1,dt*4); dlgOn=false;
  postMat.uniforms.uMatin.value=(sceneRun&&sceneRun.name==="pierre")||
    (S.act===1&&S.stage===0&&mode!=="plate")?1:0;
```


## Eau aux quais • Reflets brisés

Ancien code exact

```js
c=mix(c,vec3(0.97,0.95,0.88),smoothstep(0.74,0.90,s)*0.75);
```

Nouveau code complet

```js
c=mix(c,vec3(0.97,0.95,0.88),smoothstep(0.74,0.90,s)*0.75);
  float ripple=noise(vec2(vW.x*1.1+.13*uT,vW.z*13.9+.26*uT));
  float glint=smoothstep(.54,.79,ripple)*smoothstep(.45,.81,s2);
  c=mix(c,vec3(.83,.69,.45),glint*.76);
```


## File du marché • Sacs de toile noués sur l’épaule

Ancien code exact

```js
  if(o.sack) b.put(G.s,0xb9a27c,0.2,1.57,-0.05,0.2,0.15,0.25);
```

Nouveau code complet

```js
  if(o.sack){
    b.put(G.s,0x9d845f,.216,1.38,-.125,.209,.286,.214,0,-.26,-.19);
    b.put(G.s,0xb99a6c,.205,1.534,-.047,.156,.132,.179);
    b.put(G.s,0xb59969,.219,1.54,.11,.079,.131,.072,0,.53,-.11);
    for(let band=0;band<3;band++)b.put(G.c8,0x66523c,.212,1.569+band*.013,.111,.068,.013,.058,0,.35);
    for(const side of [-1,1])b.put(G.box,0x786548,.217+side*.039,1.47,.161,.013,.116,.009,0,0,side*.17);
  }
```


## File du marché • Le poids du sac

Ancien code exact

```js
    animate(p,lineMoves,advance,3.2);
```

Nouveau code complet

```js
    animate(p,lineMoves,advance,3.2);
    p.userData.arms[1].rotation.x=-2.05+(lineMoves?.08*Math.sin(2*p.userData.ph):0);
    p.userData.body.rotation.z=-.073;p.userData.head.rotation.z=.046;
```


## Choix de qualité dès le titre

Ancien code exact

```js
<p class="small">La partie s’enregistre sur cet appareil.</p>
```

Nouveau code complet

```js
<p class="small"><button data-a="lite-intro" aria-pressed="${S.lite}" class="qualityStart">Affichage allégé · ${S.lite?"activé":"désactivé"}</button></p>
```


## Qualité des plans dès l’ouverture

Ancien code exact

```js
else if(a==="resume"){ startPlay(); }
```

Nouveau code complet

```js
else if(a==="resume"){ startPlay(); }
  else if(a==="lite-intro"){S.lite=!S.lite;resize();save();showTitle();}
```


## Qualité • Contrôle accessible sur petit écran

Ancien code exact

```js
@media(max-height:580px){#ov.home .small{display:none}
```

Nouveau code complet

```js
#ov .qualityStart{font:inherit;color:inherit;text-decoration:underline;text-underline-offset:3px;min-height:36px}
@media(max-height:580px){#ov.home .small{display:block;font-size:13px;margin:0}#ov.home .qualityStart{min-height:26px}
```


## Envoi groupé des géométries et ombres de proximité

Ancien code exact

```js
function renderFrame(){ if(canPost&&rt){
```

Nouveau code complet

```js
function renderFrame(){ prepareDraws(); if(canPost&&rt){
```


## Regroupement des personnages, fleurs et halos

Ancien code exact

```js
function buildFete(){
```

Nouveau code complet

```js
// Les attributs du vêtement et la position de ses articulations sont conservés.
const preparedActors=new WeakMap();
function mergeWardrobe(actor){
  const u=actor.userData;
  if(actor===player||!u.elbows||!u.elbows.length)return;
  actor.updateWorldMatrix(true,true);
  const parts=[];
  u.body.traverse(m=>{if(m.isMesh&&(m.material===wardrobe||m.material===jointCloth))parts.push(m);});
  if(parts.length<2)return;
  const origin=actor.matrixWorld.clone().invert(),pos=[],norm=[],color=[],tex=[],indices=[],weights=[],bones=[],inverses=[];
  const v=new THREE.Vector3(),m4=new THREE.Matrix4(),n3=new THREE.Matrix3();
  for(const part of parts){
    m4.multiplyMatrices(origin,part.matrixWorld);n3.getNormalMatrix(m4);
    const a=flat(part.geometry).attributes,offset=bones.length;
    if(part.isSkinnedMesh){
      for(let j=0;j<part.skeleton.bones.length;j++){
        bones.push(part.skeleton.bones[j]);
        inverses.push(part.skeleton.boneInverses[j].clone().multiply(part.bindMatrix).multiply(part.matrixWorld.clone().invert()));
      }
    }else{
      bones.push(part);inverses.push(part.matrixWorld.clone().invert());
    }
    for(let i=0;i<a.position.count;i++){
      v.fromBufferAttribute(a.position,i).applyMatrix4(m4);pos.push(v.x,v.y,v.z);
      v.fromBufferAttribute(a.normal,i).applyMatrix3(n3).normalize();norm.push(v.x,v.y,v.z);
      v.fromBufferAttribute(a.color,i);color.push(v.x,v.y,v.z);
      tex.push(a.uv.getX(i),a.uv.getY(i));
      if(part.isSkinnedMesh){
        indices.push(offset+a.skinIndex.getX(i),offset+a.skinIndex.getY(i),0,0);
        weights.push(a.skinWeight.getX(i),a.skinWeight.getY(i),0,0);
      }else{indices.push(offset,0,0,0);weights.push(1,0,0,0);}
    }
    // Les os et leurs accessoires restent parcourus, la surface est dessinée avec le lot.
    part.layers.disable(0);part.castShadow=false;
  }
  const geometry=new THREE.BufferGeometry();
  for(const [key,data,size] of [["position",pos,3],["normal",norm,3],["color",color,3],["uv",tex,2],["skinWeight",weights,4]])geometry.setAttribute(key,new THREE.Float32BufferAttribute(data,size));
  geometry.setAttribute("skinIndex",new THREE.Uint16BufferAttribute(indices,4));
  geometry.computeBoundingSphere();geometry.boundingSphere.radius+=.66;
  const cloth=new THREE.SkinnedMesh(geometry,jointCloth);
  actor.add(cloth);cloth.updateWorldMatrix(true,false);
  cloth.bind(new THREE.Skeleton(bones,inverses),cloth.matrixWorld);
  cloth.castShadow=true;cloth.receiveShadow=true;
}
let floralGroups=null,haloBatch=null,groupedHalos=-1,firstQueue=true;
function prepareDraws(){
  if(firstQueue){firstQueue=false;for(const g of file)bindCrowdFigure(g);}
  if(!floralGroups && (renderer.capabilities.isWebGL2||renderer.extensions.has("ANGLE_instanced_arrays"))){
    const lists=new Map();
    for(const f of flowers){if(!lists.has(f.geometry))lists.set(f.geometry,[]);lists.get(f.geometry).push(f);scene.remove(f);}
    floralGroups=[];
    for(const [geometry,members] of lists){
      const blooms=new THREE.InstancedMesh(geometry,VC,members.length);blooms.frustumCulled=false;blooms.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      scene.add(blooms);floralGroups.push({blooms,members});
    }
  }
  if(floralGroups)for(const {blooms,members} of floralGroups){
    let index=0;for(const f of members){if(f.userData.k<=0)continue;f.updateMatrix();blooms.setMatrixAt(index++,f.matrix);}
    blooms.count=index;blooms.visible=index>0;blooms.instanceMatrix.needsUpdate=true;
  }
  if(groupedHalos!==halos.length){
    if(haloBatch){scene.remove(haloBatch);haloBatch.geometry.dispose();haloBatch.material.dispose();}
    groupedHalos=halos.length;
    const g=new THREE.BufferGeometry(),loc=[],corners=[];
    for(const h of halos){
      for(const xy of [[-.5,-.5],[.5,-.5],[.5,.5],[-.5,-.5],[.5,.5],[-.5,.5]]){
        loc.push(h.position.x,h.position.y,h.position.z);corners.push(...xy);
      }
      scene.remove(h);
    }
    g.setAttribute("position",new THREE.Float32BufferAttribute(loc,3));g.setAttribute("corner",new THREE.Float32BufferAttribute(corners,2));
    g.setAttribute("glow",new THREE.BufferAttribute(new Float32Array(12*halos.length),2).setUsage(THREE.DynamicDrawUsage));
    const mat=new THREE.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{pigment:{value:haloTex}},vertexShader:"attribute vec2 corner;attribute vec2 glow;varying vec2 uvInk;varying float a;void main(){vec4 v=modelViewMatrix*vec4(position,1.);v.xy+=corner*glow.x;uvInk=corner+.5;a=glow.y;gl_Position=projectionMatrix*v;}",fragmentShader:"uniform sampler2D pigment;varying vec2 uvInk;varying float a;void main(){vec4 c=texture2D(pigment,uvInk);gl_FragColor=vec4(c.rgb,c.a*a);}"});
    haloBatch=new THREE.Mesh(g,mat);haloBatch.frustumCulled=false;scene.add(haloBatch);
  }
  const values=haloBatch.geometry.attributes.glow;
  for(let i=0;i<halos.length;i++){const h=halos[i];for(let j=0;j<6;j++)values.setXY(i*6+j,h.visible?h.scale.x:0,h.material.opacity);}
  values.needsUpdate=true;
  for(const actor of HUMANS){
    if(!actor.visible)continue;
    let parts=preparedActors.get(actor);
    if(!parts){
      mergeWardrobe(actor);parts={casters:[],ink:[]};
      actor.traverse(m=>{if(m.isMesh && m.visible && m.castShadow && (m.layers.mask&1))parts.casters.push(m);if(m.isMesh&&m.material===OUTLINE)parts.ink.push(m);});
      preparedActors.set(actor,parts);
    }
    const near=actor.position.distanceToSquared(camera.position)<(S.lite?15:23)**2;
    for(const m of parts.casters)m.castShadow=near;
    for(const m of parts.ink)m.visible=near;
  }
}
function buildFete(){
```
