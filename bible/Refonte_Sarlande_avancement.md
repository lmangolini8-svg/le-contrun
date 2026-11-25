# Refonte de Sarlande · état d’avancement

Suivi du [cahier des charges](Refonte_Sarlande.md) · 25 novembre 2026

## Ce qui est en place

**Phase 1 et 2 du phasage : le socle commun.** Trois fichiers séparés de la page, pour ne pas alourdir `index.html` et limiter les conflits avec le travail en cours sur la reprise iPad.

| Fichier | Rôle |
|---|---|
| `jeu/calendrier.js` | Calendrier julien de 1550, Pâques julienne, millésime des actes qui change à Pâques (modèle lyonnais), fêtes fixes et mobiles, jours de marché (mercredi et samedi), trois plages par jour. Le temps de jeu est un compteur continu, converti à part pour l’affichage. |
| `jeu/monde.js` | État commun de la partie, rangé dans la sauvegarde existante (`S.vie`, version 2). Habitants avec domicile, lieu de travail, agenda et écarts motivés ; savoirs par habitant (fait, version, provenance) et rumeurs par quartier ; liens dans chaque sens et réputation publique distincte ; engagements, visites, sujets de conversation ; bourse, inventaire, boutiques et horaires ; commandes sur devis ; épreuves d’Anselme ; quatre barres. |
| `jeu/vie.js` | La première journée jouable, raccordée aux scènes existantes. |

**Reprise sûre.** Chaque effet qui ne doit compter qu’une fois (un paiement, une livraison, la résolution d’une plage, une nuit) passe par un journal. Une reprise ne le rejoue jamais. Les parties enregistrées avant la refonte sont migrées : si elles avaient dépassé le début de l’acte I, l’ouverture au clos n’est pas rejouée.

**Phase 3 : du réveil au lendemain matin.**

1. **Réveil au clos des murailles.** Maison visitable (lit, table, âtre, fenêtre à volets, miroir), lettre sous la porte, provisions, jardin, puits commun, porte d’Ysabeau (absente au marché : on peut laisser un mot), menuisier et ses devis, pépinière près de la poterne. Le miroir fait essayer puis choisir la robe ocre ou la robe indigo.
2. **Trajet.** Planche de la rue des Drapiers, puis la scène d’ouverture existante à l’imprimerie. Le trajet n’est pas encore marchable de bout en bout.
3. **Prise de poste.** Anselme renvoie au tableau des commandes, puis la cloche sonne : le tribut est ouvert jusqu’au soir et le joueur le rejoint quand il veut. Le tableau affiche, avant tout engagement, le client, le délai, la paie, l’effort, les matériaux et la signature. Trois commandes ont chacune une petite décision d’atelier (composer à l’envers, corriger le bon de farine, ordre de livraison) ; une quatrième s’ouvre après l’épreuve « Composer une commande ». Le devis refuse un travail qui ferait manquer le tribut.
4. **Courses et enquête.** Le fournil de Maëlle, l’étal du boucher (ouvert le jour du tribut), les paniers de Jeanne, le banc du chasseur (jours de marché seulement : l’horaire découvert est noté au carnet). La miche peut être pesée devant les clientes, demandée en privé après le tribut, ou laissée de côté.
5. **Tribut.** La scène existante est conservée. Qui a vu peser la miche voit la balance du percepteur et pense aux deux balances. La mesure payée de sa poche sort de la bourse.
6. **Soir.** À la fin de l’acte I, Anselme propose de rentrer au clos avant la fête : repas avec les achats du jour, repos, lettre. La fête (acte II) part du clos.
7. **Nuit et lendemain.** À la fin de l’acte II, on rentre dormir. La nuit est courte (la presse a tourné), ce qui pèse sur le Repos et l’Endurance. Au réveil, quelqu’un frappe, avec un motif qui dépend de ce que cette personne a réellement appris :
   - miche pesée en public : Maëlle vient faire un reproche, Perrine a changé de boulanger ;
   - question posée en privé : Maëlle apporte le bon de farine ;
   - lettre gardée sans rien faire : Perrine, qui avait reçu la même lettre, a fait peser la miche l’après-midi, hors champ ; Maëlle, qui ne sait pas lire, vient demander qu’on lui lise une lettre.
   On peut ouvrir, demander de repasser (un rendez-vous est pris) ou ne pas répondre (un mot est glissé sous la porte). Ysabeau et Garin modifient leur programme selon ce qui s’est passé.

**Interface.** La date, la plage et les quatre barres sont visibles sous l’objectif. Le carnet ajoute un almanach et un journal : date lisible, millésime des actes s’il diffère, fêtes, bourse, inventaire, barres et phrase de Convictions, sujets abordés (à relire avant d’y revenir), adresses et horaires découverts, épreuves, derniers événements.

**Textes.** Le libelle clandestin de Sarlande remplace le livre brûlé dans les répliques d’Anselme et sur la page de titre. La décision sur Mahaut et Anselme est reportée dans `Personnages.md`. Les questions de chronologie qui en découlent sont ajoutées à la partie 10 de la bible.

## Vérifications

- `node --test outils/tests/monde.test.js` : douze tests des règles (pesée A et B, pesée privée, rechargements après achat, livraison, saut de plage et visite manquée, horaires, examen différé, protection du tribut, sujets relus et insistance, endurance, Pâques et ellipse, migration).
- `node outils/tests/premiere_journee.js <dossier> [A|B]` : parcours complet dans Chromium, du réveil au lendemain, avec rechargement de la page au lendemain. Les fichiers sont servis par Playwright, sans serveur.

## Ce qui reste à faire

- Contrôle tactile sur iPad (WebKit) du clos, du tableau et du miroir : à ajouter aux parcours de la PR de reprise iPad une fois celle-ci fusionnée.
- Le trajet clos, Drapiers, imprimerie à pied ; les autres quartiers (halles agrandies, quai, parvis, cathédrale, cimetière, hors les murs) sur la même horloge.
- La lumière de l’après-midi sur la place quand une commande fait avancer le temps.
- La Caisse des métiers, l’arbre de compétences, les catalogues de boutiques (identifiants des deux classeurs).
- Le lendemain sur la place : il attend l’acte III.
- Décisions prises le 25 novembre 2026 : cadre du libelle (manuscrit recopié dans les marges), Mahaut autrice de la lettre (révélé à l’acte III), Saint-Michel 1550. Reste ouverte : la question 15 (cloche, seuils, montants), à régler après essais avec des élèves.

## Cartographie du 25 novembre 2026 : ce qu’elle change pour le jeu

Source : branche `codex/planches-vie-2026-11-25`, dossier `references/planches-vie/` (carte de production, plan des circulations, atlas de 32 planches, carnets des cinq actes, `Sarlande_Cartes_et_terrain.zip`). Repère des données : 1 m par unité, X vers l’est, Y vers le sud, altitudes relatives.

**Accords avec la première journée**
- Quartiers : le clos des murailles (secteur 8), l’imprimerie et les Drapiers (5), la place et les halles (6), la cour des gardes (7), le quai (9) correspondent aux quartiers de `jeu/monde.js`.
- Le carnet de l’acte I (« Le matin du tribut ») repère l’imprimerie, le fournil, la fontaine, la Caisse des métiers et la poterne : ce sont les lieux de la première journée.
- Les commerces du clos (menuisier, tapissière, pépiniériste) sont ceux du décor.

**Corrections faites le 25 novembre 2026 au soir**
- Le clos suit l’atlas (rempart à l’est, rivière au sud, voisins et commerces à leurs places) et une rue praticable mène à pied de la maison à l’imprimerie, par la poterne des gardes, la Caisse des métiers, les halles et les Drapiers.
- Sur la place, Maëlle et son fournil passent entre l’imprimerie et la fontaine, Garin prend l’étal de l’est, les étals tournants (boucher, Jeanne, chasseur) sont au sud-est de la fontaine, la Caisse des métiers est bâtie au nord-est.
- À l’acte I, la lumière de la place suit l’horloge : matin, après-midi ambré, soir.
- Reste : l’échelle de la place (trois fois trop resserrée), à reprendre avec la réécriture des scènes.

**Écarts relevés avant correction**
1. **Orientation du clos.** Dans l’atlas, le clos est au sud-est, contre l’enceinte est, au-dessus de la rivière. La maison d’Aliénor est à la cote 6,2 m, le puits des voisins à 14 m au nord-ouest, le menuisier à 30 m au nord-ouest, la tapissière à 30 m au nord, le pépiniériste à 20 m au nord-est ; le terrain monte vers le nord. Le décor actuel met la muraille au nord et la pépinière près d’une poterne : à refaire sur ce plan. La poterne de l’atlas est celle de la cour des gardes, à une centaine de mètres à l’ouest.
2. **Échelle de la place.** La scène 3D existante est environ trois fois plus resserrée que l’atlas (de l’imprimerie à la chapelle des gardes : 75 m en jeu, 228 m sur le plan). Les positions relatives sont justes (imprimerie à l’ouest, cour des gardes à l’est, palais au nord, quai au sud) ; le fournil et les halles sont à replacer : fournil entre l’imprimerie et la fontaine, halles au sud-est de la fontaine, Caisse des métiers au nord-est.
3. **Trajet du matin.** De la maison à l’imprimerie, environ 270 m à vol d’oiseau, par les rues du clos et le sud de la place, puis la rue de l’imprimerie (le parcours court place–quai monte jusqu’à 11 %). Le trajet à pied du cahier des charges doit suivre ce tracé, raccourci pour le jeu.
4. **Boucher et chasseur.** Ils ne figurent pas parmi les douze enseignes ; ils relèvent des étals tournants du marché (planche 08b). À placer sous les halles.

**À reprendre directement**
- `commerces.csv` : 1 040 références, boutique, quartier, prix, acte et point, pour remplir les boutiques du jeu (cahier des charges, partie 6).
- Les cinq cartes du carnet, à donner une à une, acte par acte, à la place de la carte schématique actuelle.
