import sys, numpy as np
from PIL import Image, ImageDraw, ImageFilter
SRC='/home/user/le-contrun/references/planches-vie/'
OUT='/home/user/le-contrun/modeles/ville/meshy_entrees/'
JOBS={'pans_de_bois':'facade_pans_de_bois.png','arcades_echoppe':'facade_arcades.png',
 'hotel_renaissance':'facade_hotel_renaissance.png','etroite_pignon':'facade_etroite_pignon.png',
 'pauvre_torchis':'facade_pauvre.png','tourelle_escalier':'facade_tourelle.png'}
T0,T1=22,40   # seuils de distance couleur (doux)
def process(name,fn):
    im=Image.open(SRC+fn).convert('RGB'); a=np.asarray(im).astype(np.float32)
    H,W=a.shape[:2]
    b=np.concatenate([a[:6].reshape(-1,3),a[-6:].reshape(-1,3),a[:,:6].reshape(-1,3),a[:,-6:].reshape(-1,3)])
    bg=np.median(b,0)
    # carte de fond local lissée (vignettage du papier) : flou fort des pixels proches du fond
    d=np.sqrt(((a-bg)**2).sum(2))
    cand=(d<T1).astype(np.uint8)*255
    m=Image.fromarray(cand,'L').copy()
    for x in range(0,W,7):
        for y in (0,H-1):
            if m.getpixel((x,y))==255: ImageDraw.floodfill(m,(x,y),128)
    for y in range(0,H,7):
        for x in (0,W-1):
            if m.getpixel((x,y))==255: ImageDraw.floodfill(m,(x,y),128)
    region=(np.array(m)==128)
    alpha=np.ones((H,W),np.float32)
    soft=np.clip((d-T0)/(T1-T0),0,1)
    alpha[region]=soft[region]
    # nettoyer les poussières : ouverture morphologique sur le masque opaque
    fg=Image.fromarray((alpha>0.5).astype(np.uint8)*255).filter(ImageFilter.MinFilter(5)).filter(ImageFilter.MaxFilter(5))
    fgm=np.asarray(fg)>0
    alpha=np.where(fgm|(~region),alpha,0)  # supprime îlots isolés dans la région de fond
    # garder les pixels doux bordant le bâtiment (dilatation)
    near=np.asarray(fg.filter(ImageFilter.MaxFilter(7)))>0
    alpha=np.where(near,alpha,0)
    # lisser légèrement le bord
    al=Image.fromarray((alpha*255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.6))
    alpha=np.asarray(al).astype(np.float32)/255
    ys,xs=np.where(alpha>0.5)
    y0,y1,x0,x1=ys.min(),ys.max()+1,xs.min(),xs.max()+1
    comp=a*alpha[...,None]+255*(1-alpha[...,None])
    crop=Image.fromarray(comp[y0:y1,x0:x1].clip(0,255).astype(np.uint8))
    S=1024; inner=int(S*(1-2*0.06)); w,h=crop.size; k=inner/max(w,h)
    crop=crop.resize((max(1,round(w*k)),max(1,round(h*k))),Image.LANCZOS)
    out=Image.new('RGB',(S,S),(255,255,255)); out.paste(crop,((S-crop.size[0])//2,(S-crop.size[1])//2))
    out.save(OUT+name+'_face.png',optimize=True)
    print(name,'bg',bg.round(),'bbox',(x0,y0,x1,y1),'src',(W,H),'->',crop.size, 'fond%%=%.1f'%(100*region.mean()))
for n,f in JOBS.items(): process(n,f)
