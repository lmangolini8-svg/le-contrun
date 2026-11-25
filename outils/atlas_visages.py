"""Complète l'atlas des visages 3D (img/visages-modeles.webp) et les portraits de dialogue.

Usage : python3 outils/atlas_visages.py   (depuis la racine du projet)

L'atlas est une grille de 5 × 5 cases de 204 px. Les cases 0 à 17 existent déjà.
Ce script remplit les cases 18 à 23, dans l'ordre de `faceNames` dans index.html :
  18 bastien  · 19 brisset · 20 joris · 21 garde2 · 22 garde3 · 23 garde4
Le cadrage reprend celui des cases existantes : les yeux à 62 px du haut,
le menton à 179 px, le nez au milieu.
Les trois gardes de rang sont tirés du visage du garde (case 5), retourné
et recoloré (cheveux, moustache, teint), pour que la garde ne soit plus
un seul homme copié dix fois.
"""
from PIL import Image, ImageOps
import colorsys

T = 204
REF = "references/planches-3d/"
ATLAS = "img/visages-modeles.webp"


def tile_pos(i):
    return (i % 5) * T, (i // 5) * T


def crop_face(path, box):
    return Image.open(path).convert("RGB").crop(box).resize((T, T), Image.LANCZOS)


def recolor(tile, hair, skin, flip=False, dark=105):
    """Teint en douceur les poils (cheveux, sourcils, moustache) et décale le teint.

    Le poids de la teinte monte progressivement quand le pixel s'assombrit,
    pour éviter les taches : la valeur d'origine est gardée, seule la couleur change.
    """
    im = ImageOps.mirror(tile) if flip else tile.copy()
    px = im.load()
    hl = 0.3 * hair[0] + 0.59 * hair[1] + 0.11 * hair[2]
    for y in range(T):
        for x in range(T):
            r, g, b = px[x, y]
            lum = 0.3 * r + 0.59 * g + 0.11 * b
            w = min(1.0, max(0.0, (dark + 25 - lum) / 60))
            # le teint
            h, s, v = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
            h = (h + skin[0]) % 1
            s = min(1, max(0, s * skin[1]))
            v = min(1, max(0, v * skin[2]))
            sr, sg, sb = (c * 255 for c in colorsys.hsv_to_rgb(h, s, v))
            # les poils : même valeur relative, autre couleur
            k = min(1.6, lum / 70)
            tr, tg, tb = (min(255, c * k) for c in hair) if hl else (lum, lum, lum)
            px[x, y] = (int(sr * (1 - w) + tr * w), int(sg * (1 - w) + tg * w), int(sb * (1 - w) + tb * w))
    return im


def build_atlas():
    atlas = Image.open(ATLAS).convert("RGB")
    garde = atlas.crop((*tile_pos(5), tile_pos(5)[0] + T, tile_pos(5)[1] + T))
    tiles = {
        18: crop_face(REF + "bastien_tete.png", (72, 347, 354, 629)),
        19: crop_face(REF + "brisset_tete.png", (167, 432, 321, 586)),
        20: crop_face(REF + "joris_neutre.png", (418, 63, 756, 401)),
        # garde2 : brun très foncé, teint mat, retourné
        21: recolor(garde, (40, 30, 26), (0.0, 1.08, 0.95), flip=True),
        # garde3 : grisonnant, teint rougeaud
        22: recolor(garde, (132, 124, 114), (-0.01, 1.12, 1.0), dark=62),
        # garde4 : roux clair, teint pâle, retourné
        23: recolor(garde, (120, 64, 34), (0.006, 0.9, 1.04), flip=True),
    }
    for i, im in tiles.items():
        atlas.paste(im, tile_pos(i))
    atlas.save(ATLAS, "WEBP", quality=92, method=6)


def save_portrait(im, name):
    im.convert("RGB").resize((512, 512), Image.LANCZOS).save(
        f"img/portraits/{name}.webp", "WEBP", quality=88, method=6)


def build_portraits():
    for e in ("neutre", "sourire", "inquietude", "colere"):
        save_portrait(Image.open(REF + f"bastien_{e}.png"), f"bastien_{e}")
    # La feuille du sergent est une grille 2 × 2 : neutre, sourire / inquiétude, colère.
    sheet = Image.open(REF + "brisset_expressions.png").convert("RGB")
    for (qx, qy), e in zip([(0, 0), (1, 0), (0, 1), (1, 1)],
                           ("neutre", "sourire", "inquietude", "colere")):
        x0, y0 = qx * 768 - (52 if qx else 0), qy * 512
        save_portrait(sheet.crop((x0 + 205, y0 + 10, x0 + 695, y0 + 500)), f"brisset_{e}")


if __name__ == "__main__":
    build_atlas()
    build_portraits()
    print("atlas et portraits écrits")
