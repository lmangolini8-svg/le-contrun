# Château de l'Un (Meshy Pro, 25 novembre 2026)

Style retenu par Lucas : remparts et porte médiévaux, palais Renaissance derrière. Pierre calcaire
claire, ardoise bleu-gris, bannières pourpres à l'emblème de l'Un (disque d'or sur trois degrés),
sans fleur de lys.

| Pièce | Fichier | Triangles | Hauteur | Texture |
|---|---|---|---|---|
| Porte fortifiée à deux tours | `porte.glb` | 30 000 | 17 m | 2048 |
| Pan de rempart crénelé | `rempart.glb` | 18 000 | 8 m | 1024 |
| Palais Renaissance | `palais.glb` | 40 000 | 26 m | 2048 |
| Tour ronde | `tour.glb` | 10 000 | 30 m | 1024 |
| Donjon | `donjon.glb` | 20 000 | 40 m | 1024 |
| Pavillon d'angle | `pavillon.glb` | 12 000 | 18 m | 1024 |

- Chaîne : concept image Meshy (nano-banana-pro, 9 crédits) → image-to-3d texturé (30 crédits) →
  `outils/blender/prepare_meshy.py` (réduction, échelle, couleur seule, teinte pierre 0.96/0.92/0.84).
- Coût total : 6 concepts (54) + 6 modèles (180) = **234 crédits**.
- Bruts, concepts et suivi : `meshy_output/` (GLB bruts et fiches de tâche non versionnés).
- En jeu : `CHATEAU_PIECES` dans `index.html` (13 pièces posées, ~220 000 triangles). Les anciens
  volumes ne sont plus construits ; `index.html?chateau=ancien` les rétablit pour comparer. Collisions
  inchangées.
- Aperçus : `apercus/concepts.jpg`, `apercus/pieces_face.jpg`, `apercus/avant_apres.jpg`,
  `apercus/chateau_en_jeu.jpg`.
- Reste : cathédrale et flèches du fond, décor de la planche « Le palais » (V), contrôle iPad.
