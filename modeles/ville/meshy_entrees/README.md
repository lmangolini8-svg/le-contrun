# Entrées Meshy — façades types de maisons mitoyennes

Six types complémentaires de ceux déjà générés (`maison1`, `maison2`, `maison_pierre`, `imprimerie`), pour garnir les rues de Sarlande.
Aucune génération n'a été lancée.

Chaque PNG fait 1024 × 1024, fond blanc uni, bâtiment entier centré avec une marge d'environ 6 % (le plus grand côté occupe 902 px), sans texte.
Le fond crème des planches a été détouré par seuillage doux : distance de couleur au fond, 22 à 40, puis remplissage depuis les bords pour épargner les enduits clairs intérieurs. Les bords sont lissés.
Pour régénérer les images : `python3 -I preparer_entrees.py`.

**Vues disponibles.** Les planches sources ne montrent que la façade. Aucune planche « quatre faces » de `references/complements-3d/` ne couvre ces types : elles montrent le grand logis, le palais, la chapelle et l'imprimerie.
Il n'y a donc pas de fichier `_cote.png` ni `_dos.png`, et `multi-image-to-3d` n'est pas applicable pour l'instant. Meshy devra inventer les côtés et le dos ; pour des maisons mitoyennes, ces faces seront en grande partie cachées.

Commande commune conseillée (image-to-3d) :

```
image-to-3d --image <fichier> --model-type smart-topology --target-polycount 5000 --should-texture true --target-formats glb
```

Les dimensions réelles sont calculées à partir des proportions de l'image découpée. Après import, mettre le modèle à l'échelle sur la hauteur visée.

| Type | Fichier d'entrée | Planche source | Commande | Triangles visés | Hauteur réelle | Largeur de façade |
|---|---|---|---|---|---|---|
| Maison à pans de bois à encorbellement (boutique de drapier au RDC, 3 étages en surplomb, combles à lucarnes) | `pans_de_bois_face.png` | `references/planches-vie/facade_pans_de_bois.png` | image-to-3d | ≤ 5 000 | 12 m | ≈ 6,9 m |
| Maison à arcades d'échoppe (pierre, 2 arcades ogivales ouvertes, 1 étage + combles) | `arcades_echoppe_face.png` | `references/planches-vie/facade_arcades.png` | image-to-3d | ≤ 5 000 | 10 m | ≈ 7,0 m |
| Hôtel Renaissance en pierre (2 étages, lucarne-pignon sculptée, portail à fronton, ardoise) | `hotel_renaissance_face.png` | `references/planches-vie/facade_hotel_renaissance.png` | image-to-3d | ≤ 5 000 | 12 m | ≈ 7,0 m |
| Maison étroite à pignon sur rue (chaînes d'angle en pierre, pans de bois, poulie de grenier) | `etroite_pignon_face.png` | `references/planches-vie/facade_etroite_pignon.png` | image-to-3d | ≤ 5 000 | 11 m | ≈ 3,2 m (*) |
| Maison pauvre de torchis (colombage, torchis écaillé, clayonnage visible, bardeaux, appentis) | `pauvre_torchis_face.png` | `references/planches-vie/facade_pauvre.png` | image-to-3d | ≤ 4 000 | 9 m | ≈ 6,1 m (avec l'appentis) |
| Maison à tourelle d'escalier (pierre, tourelle ronde hors-œuvre à toit conique, porte gothique) | `tourelle_escalier_face.png` | `references/planches-vie/facade_tourelle.png` | image-to-3d | ≤ 5 000 | 12 m | ≈ 7,3 m |

(*) La maison étroite sort volontairement de la fourchette de 6 à 9 m : c'est une façade d'une seule travée, qui sert de « bouche-trou » entre deux maisons larges. Si une largeur de 6 m est exigée, il faut l'étirer en largeur après import, ce qui déformera la porte et les fenêtres. Il vaut mieux la garder telle quelle.

## Remarques pour la génération
- Pour toutes les maisons, ajouter si besoin un texte de texture du genre : « maison de ville Renaissance française, rendu aquarelle et encre ». Meshy n'en a pas besoin, car l'image suffit.
- Les fenêtres jaunes éclairées et les étals (draps, poteries, fleurs) sont peints : Meshy les mettra en texture ou en petits volumes. On peut accepter des étals simplifiés.
- Pour la maison étroite et la maison pauvre, plus simples, on peut baisser `--target-polycount` à 10000 et 8000, comme indiqué dans le tableau.

## Budget révisé (26 novembre 2026)

Les maisons sont désormais dessinées en série (une copie par maison, un seul envoi à la carte graphique par modèle), avec trois niveaux : modèle complet à moins de 30 m, version légère jusqu'à 90 m, maison dessinée au-delà. Viser **5 000 triangles** pour le modèle complet (comme les bâtiments des jeux sur tablette : le détail vient de la texture) ; la version légère `_loin` est tirée ensuite à environ 2 500 triangles. Texture 2048 px au plus.
