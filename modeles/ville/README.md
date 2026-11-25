# Ville de Sarlande (Meshy Pro, 25 novembre 2026)

| Modèle | Source | Triangles | Où dans le jeu |
|---|---|---|---|
| `maison1`, `maison2`, `imprimerie` | planches `lieu_facade_*.png` détourées (sans concept payé) | 15 000 / 15 000 / 25 000 | rangées ouest et est de la place ; l'imprimerie à la place de l'atelier d'Anselme (auvent, feuilles et enseigne du jeu conservés) |
| `maison_pierre` | concept Meshy | 15 000 | rangées de la place |
| `*_loin` | mêmes modèles allégés | 9 000 | maisons du fond (ouest, est, au-delà de la rivière), tournées vers la ville |
| `fontaine` | concept | 20 000 | centre de la place (collision inchangée) |
| `etal_bleu`, `etal_rouge` | concepts | 25 000 / 40 000 | les quatre étals de la place |
| `chapelle` | concept | 15 000 | fond de la cour des gardes |
| `corps_de_garde` | concept | 15 000 ×2 | galerie nord de la cour des gardes |
| `cathedrale` | concept | 15 000 | cathédrale lointaine à l'ouest du palais |

- Préparation : `outils/blender/prepare_meshy.py` (largeur imposée `L…` pour caler les maisons).
- Herbe : lavis de verts et d'ocre calculé dans le shader (plus de vert uni).
- `index.html?ville=ancien` rétablit les anciens volumes ; collisions inchangées.
- Coût : 9 concepts (81 crédits) + 12 modèles (360) = **441 crédits**, dont l'arbre (39) inutilisable :
  feuillage en confettis et tronc cassé, les arbres peints du jeu sont conservés.
- Aperçus : `apercus/avant.jpg`, `apercus/ville_en_jeu.jpg`, `apercus/imprimerie_fond.jpg`,
  `apercus/herbe_vue_haute.jpg`, `apercus/concepts.jpg`, `apercus/modeles_face.jpg`.
- À vérifier sur iPad : fluidité (scène nettement plus lourde) et temps de chargement (~25 Mo de modèles).
