# Construit img/alienor-atlas.webp, la planche de peinture du modèle 3D d'Aliénor.
# Sources : les deux portraits originaux (visage) et la planche de costume du jeu (étoffes).
# Usage : python3 outils/atlas_alienor.py   (depuis la racine du projet ; PIL et numpy)
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = __file__.rsplit('/outils/', 1)[0] + '/'
S = 1024
atlas = Image.new('RGB', (S, S), (236, 214, 186))
rng = np.random.default_rng(7)


def bilinear(src, xs, ys):
    h, w, _ = src.shape
    xs = np.clip(xs, 0, w - 1.001); ys = np.clip(ys, 0, h - 1.001)
    x0 = xs.astype(int); y0 = ys.astype(int); fx = (xs - x0)[..., None]; fy = (ys - y0)[..., None]
    a = src[y0, x0]; b = src[y0, x0 + 1]; c = src[y0 + 1, x0]; d = src[y0 + 1, x0 + 1]
    return (a * (1 - fx) + b * fx) * (1 - fy) + (c * (1 - fx) + d * fx) * fy


def wash(shape, scale, amp):
    """Bruit doux de lavis (somme d'octaves flous)."""
    out = np.zeros(shape)
    for o, s in enumerate([scale, scale / 2, scale / 4]):
        n = Image.fromarray((rng.random((shape[0] // max(1, int(s)) + 2, shape[1] // max(1, int(s)) + 2)) * 255).astype(np.uint8))
        n = np.asarray(n.resize((shape[1], shape[0]), Image.BICUBIC), float) / 255 - .5
        out += n * amp / (o + 1)
    return out


# ---------- Visage : redressement frontal du portrait ----------
SKIN_TONES = []
def face(path, box):
    src = np.asarray(Image.open(ROOT + path).convert('RGB'), float)
    n = box[2] - box[0]
    u = (np.arange(n) + .5) / n; v = (np.arange(n) + .5) / n
    X = -.10 + .20 * u[None, :] + 0 * v[:, None]          # mètres, repère de la tête
    Y = .27 - .30 * v[:, None] + 0 * u[None, :]
    # Points relevés sur le portrait : bord gauche, œil gauche, nez, œil droit, bord droit.
    kx = np.array([-.072, -.031, 0, .031, .066]); px = np.array([497, 607, 700, 753, 813], float)
    sx = np.interp(X, kx, px)
    sx = np.where(X < kx[0], px[0] + (X - kx[0]) * (px[1] - px[0]) / (kx[1] - kx[0]), sx)
    sx = np.where(X > kx[-1], px[-1] + (X - kx[-1]) * (px[-1] - px[-2]) / (kx[-1] - kx[-2]), sx)
    # Le portrait est de trois quarts : une fois redressé, le regard filerait sur le côté.
    # Un léger glissement local recentre les iris dans l'œil.
    for ex in (-.031, .031):
        sx = sx + 9 * np.exp(-((X - ex - .002) ** 2 / .012 ** 2 + (Y - .135) ** 2 / .0065 ** 2))
    sy = 301 + (.135 - Y) * 2050
    col = bilinear(src, sx, sy)
    # Masque : ovale du visage, mâchoire resserrée vers le menton.
    top = .069 * np.sqrt(np.clip(1 - ((Y - .11) / .145) ** 2, 0, 1))
    low = .069 * np.sqrt(np.clip(1 - ((.11 - Y) / .104) ** 2, 0, 1)) ** 1.15
    rx = np.where(Y >= .11, top, low)
    d = (rx - np.abs(X))
    m = np.clip(d / .012, 0, 1)[..., None]
    cheek = (np.abs(X) < .045) & (Y > .045) & (Y < .125)
    tone = np.percentile(col[cheek], 72, axis=0)
    SKIN_TONES.append(tone)
    fill = tone[None, None, :] * (1 + wash(X.shape, 40, .07))[..., None]
    # Ombre douce sous le menton et sur les côtés, en lavis chaud.
    shade = np.clip((.03 - Y) / .05, 0, 1) * .16 + np.clip((np.abs(X) - .06) / .04, 0, 1) * .10
    fill = fill * (1 - shade[..., None] * np.array([.9, 1.1, .55]))
    out = col * m + fill * (1 - m)
    atlas.paste(Image.fromarray(np.clip(out, 0, 255).astype(np.uint8)), box[:2])


face('references/portraits-originaux/alienor-neutre.webp', (0, 0, 384, 384))
face('references/portraits-originaux/alienor-sourire.webp', (384, 0, 768, 384))

# ---------- Étoffes prélevées sur la planche de costume ----------
sheet = Image.open(ROOT + 'img/alienor-atelier.webp').convert('RGB')
def patch(src_box, dst_box, mirror=False, img=sheet, tint=None):
    p = img.crop(src_box)
    if mirror: p = p.transpose(Image.FLIP_LEFT_RIGHT)
    p = p.resize((dst_box[2] - dst_box[0], dst_box[3] - dst_box[1]), Image.LANCZOS)
    if tint is not None:
        a = np.asarray(p, float) * np.array(tint)[None, None, :]
        p = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))
    atlas.paste(p, dst_box[:2])

patch((612, 905, 930, 1386), (0, 384, 384, 1024))        # jupe orange, plis de dos
patch((110, 532, 450, 1150), (384, 384, 704, 1024))      # tablier, taches d'encre
patch((200, 300, 352, 505), (704, 384, 832, 576))        # bavette
patch((724, 305, 798, 500), (832, 384, 960, 576))        # corsage froncé
patch((872, 296, 946, 452), (704, 576, 832, 768))        # manche bouffante
patch((64, 462, 156, 534), (832, 576, 960, 672))         # revers roulé
patch((166, 1418, 214, 1488), (704, 768, 832, 896))      # bottine
etoffes = Image.open(ROOT + 'img/etoffes.webp').convert('RGB')
patch((560, 130, 980, 470), (704, 896, 832, 1024), img=etoffes, tint=(.80, .66, .47))   # toile du sac
patch((170, 1430, 210, 1480), (896, 848, 960, 1024), tint=(.92, .85, .80))              # cuir de la sangle

# Peau : lavis chaud, très légères taches de rousseur.
SKIN = SKIN_TONES[0]
sk = SKIN[None, None, :] * (1 + wash((128, 128), 24, .08))[..., None]
skin = Image.fromarray(np.clip(sk, 0, 255).astype(np.uint8)); dr = ImageDraw.Draw(skin)
for _ in range(14):
    x, y = rng.integers(0, 128, 2); r = rng.uniform(.3, .6)
    dr.ellipse((x - r, y - r, x + r, y + r), fill=(176, 112, 78))
atlas.paste(skin.filter(ImageFilter.GaussianBlur(.6)), (832, 720))

# Cheveux : mèches roux cuivré en lavis, dans le sens de la longueur (v), quelques traits de plume.
hw, hh = 256, 384
X = np.arange(hw)[None, :] + 0 * np.arange(hh)[:, None]; Yh = np.arange(hh)[:, None] + 0 * X
w = wash((hh, hw), 64, .9)
clump = .5 + .5 * np.sin(X * 2 * np.pi / 37 + 3.0 * w + .02 * Yh) * np.sin(X * 2 * np.pi / 91 + 1.7 * w)
fine = .5 + .5 * np.sin(X * 2 * np.pi / 7.3 + 2.2 * w + .05 * np.sin(Yh / 23))
k = np.clip(.55 * clump + .30 * fine + .15 * (1 + w), 0, 1)[..., None]
dark, mid, light = np.array([112, 44, 22]), np.array([186, 82, 34]), np.array([238, 142, 70])
col = np.where(k < .5, dark + (mid - dark) * (k / .5), mid + (light - mid) * ((k - .5) / .5))
hair = Image.fromarray(np.clip(col, 0, 255).astype(np.uint8)); dr = ImageDraw.Draw(hair)
for k2 in range(70):
    x = rng.uniform(0, hw); y = rng.uniform(-40, hh); L = rng.uniform(40, 120); ph = rng.uniform(0, 6.3)
    pts = [((x + 3 * np.sin(ph + tt / 14)) % hw, y + tt) for tt in np.arange(0, L, 3)]
    c = (70, 32, 22) if k2 % 3 else (245, 170, 96)
    for i in range(1, len(pts)):
        if abs(pts[i][0] - pts[i - 1][0]) < 20: dr.line([pts[i - 1], pts[i]], fill=c, width=1)
hair = hair.filter(ImageFilter.GaussianBlur(.8))
atlas.paste(hair.crop((0, 0, 256, 384)), (768, 0))

atlas.save(ROOT + 'img/alienor-atlas.webp', quality=90, method=6)
print('ok', atlas.size)
