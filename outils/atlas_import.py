"""Importe les données de terrain de l'atlas de Sarlande (25 novembre 2026) dans le jeu.

Source : Sarlande_Cartes_et_terrain.zip, dossier Donnees/ (branche codex/planches-vie-2026-11-25,
references/planches-vie/). Sortie : jeu/atlas_donnees.js, lu par jeu/atlas.js.

  python3 outils/atlas_import.py <dossier Donnees extrait>

- hauteurs_mm.png : 16 bits, 601 × 641, recopié sans retouche (valeurs brutes en mm, base64 Uint16 LE) ;
- secteurs.png : indices 8 bits, codés par plages (valeur, longueur) ligne après ligne ;
- terrain_et_sites.json, profils.csv, secteurs.json : recopiés tels quels.
"""
import base64, csv, json, sys
from pathlib import Path

import numpy as np
from PIL import Image

src = Path(sys.argv[1])
out = Path(__file__).resolve().parent.parent / "jeu" / "atlas_donnees.js"

h = np.array(Image.open(src / "hauteurs_mm.png"))
assert h.shape == (641, 601) and h.dtype in (np.uint16, np.int32), (h.shape, h.dtype)
h = h.astype("<u2")
sec = np.array(Image.open(src / "secteurs.png")).astype(np.uint8)
assert sec.shape == (641, 601)
flat = sec.ravel()
rle, i = [], 0
while i < flat.size:
    j = i
    while j < flat.size and flat[j] == flat[i]:
        j += 1
    rle += [int(flat[i]), j - i]
    i = j

terrain = json.loads((src / "terrain_et_sites.json").read_text(encoding="utf-8"))
noms = json.loads((src / "secteurs.json").read_text(encoding="utf-8"))
with open(src / "profils.csv", encoding="utf-8-sig", newline="") as f:
    profils = {}
    for r in csv.DictReader(f, delimiter=";"):
        profils[r["Tracé"]] = {
            "longueur": float(r["Longueur m"]), "cote0": float(r["Cote initiale m"]), "cote1": float(r["Cote finale m"]),
            "penteTerrain": float(r["Pente max terrain initial sur 10 m (%)"]),
            "penteVoie": float(r["Pente max voie proposée sur 10 m (%)"]),
        }

donnees = {
    "repere": terrain["repere"], "largeur": 601, "hauteur": 641, "y0": 40,
    "hauteurs": base64.b64encode(h.tobytes()).decode(),
    "secteurs": rle, "nomsSecteurs": noms,
    "sites": terrain["sites"], "chemins": terrain["chemins"], "profils": profils,
    "ruelles": terrain["ruelles_xy_m"], "enceinte": terrain["enceinte"], "brasOccidental": terrain["bras_occidental"],
}
txt = json.dumps(donnees, ensure_ascii=False, separators=(",", ":"))
out.write_text(
    "/* Données de terrain de l'atlas de Sarlande, 25 novembre 2026. Fichier produit par outils/atlas_import.py : ne pas éditer. */\n"
    "(function (root, d) { if (typeof module === \"object\" && module.exports) module.exports = d; else root.ATLAS_DONNEES = d; })"
    "(typeof self !== \"undefined\" ? self : this, " + txt + ");\n",
    encoding="utf-8",
)
print(out, out.stat().st_size, "octets ;", len(terrain["sites"]), "sites,", len(profils), "profils,", len(terrain["ruelles_xy_m"]), "ruelles,", len(rle) // 2, "plages de secteurs")
