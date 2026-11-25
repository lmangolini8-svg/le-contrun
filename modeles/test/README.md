# Test de chaîne Blender → GLB → jeu (mission à 0 €, 24 novembre 2026)

`colosse_blender_test.glb` est un **fichier de test**, pas un actif validé. C'est le colosse
procédural du jeu, extrait d'`index.html`, passé dans Blender 5.3 puis réexporté.

- Ouvrir le test : `index.html?glb=colosse`. Sans ce paramètre, le jeu est inchangé.
- Script Blender : `outils/blender/colosse_test.py` (import, fusion des sommets en double,
  échelle réelle 1 unité = 1 m, origine au pied, vues face / profil / dos, export GLB).
- Test automatique : `outils/tests/test_glb.js` (Chromium, format iPad 1180 × 820, tactile).

## Mesures

| | Avant Blender | Après Blender |
|---|---|---|
| Sommets | 190 437 | 33 629 |
| Taille du fichier | 7,6 Mo | 1,5 Mo |
| Boîte englobante en jeu (m) | (−8,44 ; 7,89 ; −41,24) → (15,24 ; 37,47 ; −32,55) | identique |

Statue seule : 23,7 m de large, 8,7 m de profondeur, 29,6 m de haut.

## Conventions retenues pour tous les GLB du jeu

- Three.js r128 (`vendor/three.r128.min.js`), chargeur `vendor/GLTFLoader.r128.js` de la même version,
  chargé seulement quand un GLB est demandé.
- 1 unité = 1 mètre, Y vers le haut, face vers +Z du jeu (−Y dans Blender), origine au pied.
- À l'arrivée, les matériaux PBR sont convertis en `MeshLambertMaterial` (fonction `inkMaterials`)
  pour recevoir la même lumière que les décors avant le passage encre et aquarelle.
- Couleurs de sommets : valeurs sRGB brutes, comme le reste du jeu.

## Écarts du colosse actuel avec `references/planches-3d/statue_reference.png`

Le modèle procédural ne suit pas la planche validée : figure masculine, épée dans SA main droite
(à gauche de l'image), main gauche tendue et vide, aucun globe, fleurs de lys sur le tablier,
patine vert-de-gris au lieu du bleu sombre, couronne à fleurons simples. À reprendre à l'étape statue.
