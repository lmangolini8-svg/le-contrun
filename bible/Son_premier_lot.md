# Le son de Sarlande · premier lot

Suite du [cahier des charges musical](Musique_et_son_de_Sarlande.md) · 25 novembre 2026  
Branche : `claude/funny-rubin-73ab3e`, partie de la première journée jouable (`claude/inspiring-noether-bwo7dc`).

## 1. Ce qui a été écouté, et par qui

Claude ne peut pas écouter. Les « écoutes » de ce document sont des mesures : tonalité estimée par le profil des hauteurs, niveau, silences, longueur des phrases. Elles servent à monter et à raccorder les pistes, pas à juger la musique. **Lucas a écouté** la banque de l'acte I et les trois danses de la fête, et a retenu la gaillarde et la ronde. **Personne n'a encore écouté** les quatre pièces du premier lot ni les sons du clos : c'est l'objet de la page d'écoute.

## 2. Relevé des dix musiques existantes

Tonalité et tempo sont des estimations automatiques. Le tempo est peu fiable sur une musique sans battue marquée.

| Fichier | Rôle actuel | Couleur (d'après le prompt et la mesure) | Durée | Réemploi proposé |
|---|---|---|---:|---|
| `mus-titre` | Titre, planches, soir au clos | Pavane, luth et flûte à bec, mélancolique, ré mineur | 1:19 | Garder pour les planches. À l'album, interlude possible entre 2 et 3. Au soir du clos, à remplacer plus tard par une variante du thème d'Aliénor. |
| `mus-jour` | Place, acte I | Luth, viole, flûte, tambour léger, ré dorien | 2:00 | Matière de *Sous la halle* (3). À remplacer à terme par la phrase de Sarlande. |
| `mus-cour` | Cour des gardes | Bourdon de viole, luth épars, tambour comme un cœur | 1:27 | Garder comme musique d'infiltration. Pas sur l'album. |
| `mus-branle` (gaillarde) | Fête, première des trois danses | Luth et cistre, flûte et vièle, cornemuse au refrain | 1:28 | Retenue par Lucas. Cœur de *Les lanternes de l'Un* (6). |
| `mus-ronde` | Fête, deuxième des trois danses | Flûtes, cromornes, vielle à roue, tambourin | 1:28 | Retenue par Lucas. Second temps de (6). |
| `mus-tourdion` | Fête, troisième des trois danses (ajoutée le 25 novembre) | Chalemies, bombarde, saqueboute, cornemuse, tambour : la bande de plein air | 1:28 | Retenue par Lucas. Troisième temps de (6). |
| `mus-farce` | Tréteaux | Cromornes, tambourin, burlesque | 1:00 | Garder en jeu. Hors album, ou bref passage dans (6). |
| `mus-fanfare` | Grand toast | Saqueboutes, trompettes, timbales | 0:37 | À reprendre avec l'appel du tribut : la fête doit en garder une partie « séduisante ». |
| `mus-litiere` | Passage de la litière | Tambours lents, bourdon de saqueboute | 0:59 | Garder la scène. Matière de *Quand l'appel reste sans réponse* (12). |
| `mus-nuit` | Tombée du soir, nuit à la presse | Arpèges de luth, viole lente | 1:25 | Base de *La presse après minuit* (7), à doter de la pulsation de l'atelier. |
| `mus-aube` | Aube de l'acte II | Flûte à bec, luth, violes, ré majeur | 1:25 | Garder pour l'affiche. Pont possible vers 8. |

Les dix WAV de la branche des planches (`codex/planches-vie-2026-11-25`) sont les anciens sons synthétiques : quatre notes de luth, trois pas, un pas d'armure, une feuille et `peau.wav`. La banque MP3 les remplace tous. Je ne propose pas de les réintégrer.

## 3. Le premier lot musical

| Album | Fichier de jeu | Durée | Construction |
|---|---|---:|---|
| **1. Les volets du clos** | `mus-volets` | 2:28 | Luth seul, ré dorien. Le thème d'Aliénor est exposé nu de 0 à 28,6 s, développé, puis repris jusqu'à une cadence finale (132,4 à 149,5 s dans la source). |
| **5. La cloche du tribut** | `mus-tribut` | 2:25 | Cloche sur chaque temps, chalemies et saqueboute en appel de quatre notes, tambour de file. S'amincit jusqu'à un dernier coup sans résolution. |
| **13. Le lendemain, les volets** | `mus-lendemain` | 3:04 | Montage, pas une nouvelle génération. La même phrase de luth ouvre le morceau et se perd dans une nappe de violes, flûtes et vièle en ré (les timbres de la ville). Elle revient sur le bourdon final, suivie de la cadence du premier morceau. |
| **10. Ce qu'Anselme a tu** (esquisse) | `mus-mahaut` | 1:47 | Violon seul et luth discret. Trois notes longues, un silence, puis la mélodie entière, développée, qui revient et s'éteint. |
| (fragment) | `lettre` | 0:11 | Les trois premières notes de `mus-mahaut`, jouées à la première lecture de la lettre. La lettre reste anonyme à l'écran. |

**Pourquoi le dernier morceau reprend bien la même mélodie.** ElevenLabs ne sait pas reprendre une mélodie donnée : deux générations au même prompt donnent deux airs différents. Le retour du thème est donc obtenu par montage de l'enregistrement d'origine. Il sonne autrement parce qu'il n'est plus seul : au premier morceau, le luth joue dans la chambre ; au dernier, il entre et sort d'un ensemble, et sa dernière cadence se pose sur le bourdon de la ville. Même principe pour Mahaut : la lettre, la confession et l'album partent du même fichier.

**Limites à trancher à l'écoute**

- **Les deux modes** : la nappe est mesurée en ré majeur (fa dièse), le thème en ré dorien (fa naturel). Ils ne se superposent qu'au début et à la fin de la nappe, où elle se réduit au ré et au la. Si un frottement s'entend, il faut décaler le retour du luth de quelques secondes.
- **Mahaut** : le violon est mesuré en la, autour de la et ré, comme demandé. Le luth ne reprend pas encore deux notes du thème d'Aliénor. Il faudra monter ces deux notes à partir de `mus-volets`, ou faire jouer la pièce par un musicien.
- **La confession** : à l'acte III, `mus-mahaut` devra entrer après un silence, une fois la révélation dite. La place est réservée dans `MUSIC.mahaut`, la scène reste à écrire.

## 4. Raccordement au jeu

- **Quatre familles et leurs réglages** :
  - musique de récit ;
  - musique jouée dans le monde (fête, farce, toast), filtrée par la distance ;
  - ambiances ;
  - effets et voix.

  Le bouton du son ouvre un petit panneau : volume général, musique, ambiances, effets et voix, et « Couper tout le son ». L'ancien réglage muet est conservé tel quel dans la sauvegarde.
- **Choix de la musique** (`musicNow`) :
  - au clos : le thème d'Aliénor au réveil, la pavane le soir, le silence la nuit, *Le lendemain* au lendemain ;
  - sur la place : *La cloche du tribut* de la cloche jusqu'au paiement, puis le jour ;
  - aux seuils, la musique ne change qu'après trois secondes de présence stable ; les scènes, elles, passent tout de suite.
- **Ambiances du clos** : la maison se mêle à la cour selon la distance à la porte, et les volets ouverts laissent entrer le dehors. Le soir et la nuit, la nuit remplace la cour.
- **Ambiance du fournil** : près de Maëlle, seulement aux heures d'ouverture, lues dans `Monde.ouvert`.
- **Bruitages** :
  - volets ;
  - puits suivi de la cruche ;
  - on frappe chez Ysabeau, et la porte s'ouvre si elle est là ;
  - on frappe chez Aliénor au lendemain ;
  - la balance chez Maëlle et au tribut : le même geste, dans deux scènes ;
  - les trois notes du violon à la lettre.
- **Équivalent visuel** : quand le son ou les effets sont coupés, la cloche du tribut et minuit s'affichent en sous-titre.
- **iPad** :
  - le son démarre au premier geste et reprend après une mise en arrière-plan ou une interruption (`pageshow` et `visibilitychange`, ainsi que tout toucher quand l'état n'est pas `running`) ;
  - musiques et ambiances sont décodées à la demande puis libérées ;
  - un fichier absent laisse la partie jouable.

## 5. Vérifications réellement effectuées

- `node --test outils/tests/monde.test.js` : 12 tests sur 12 passent.
- `node outils/tests/premiere_journee.js <dossier> A` : le parcours complet, du réveil au lendemain avec rechargement, passe dans Chromium sans erreur de script.
- `node outils/tests/son_parcours.js <dossier> A` (nouveau) : le même parcours, avec relevé de la musique et des ambiances qui jouent réellement.

  | Moment | Musique | Ambiances actives |
  |---|---|---|
  | Réveil, dans la maison | `mus-volets` | maison, clos (faible), vent |
  | Cour du clos, près du puits | `mus-volets` | clos, vent |
  | Six allers-retours rapides sur le seuil | `mus-volets`, sans relance | maison et clos mêlés |
  | Imprimerie, avant la cloche | `mus-jour` | marché, atelier, ruelle, vent |
  | Place, la cloche a sonné | `mus-tribut` | marché, atelier, ruelle |
  | Devant le fournil, fichier refusé exprès | `mus-tribut` | la partie continue |
  | Tribut payé | `mus-jour` | marché, ruelle |
  | Soir au clos | `mus-titre` | maison, nuit |
  | Lendemain au clos | `mus-lendemain` | maison, clos |
  | Interruption simulée, puis un toucher | le son passe de `suspended` à `running` | |
  | Après rechargement de la page | `mus-lendemain` | maison, clos, vent |

- **Non vérifié** :
  - iPad réel, casque, sortie tablette : aucun appareil n'est accessible ;
  - la mémoire décodée sur tablette ;
  - le rendu des curseurs de volume au toucher ;
  - l'acte II n'a été traversé que par le saut du test, sans jouer la farce, la litière ni le toast.

## 6. Ce qui reste à produire

**Premier parcours**

- Le trajet à pied clos, Drapiers, imprimerie : il n'existe pas encore en jeu (planche). Il faudra une ambiance des Drapiers, avec étoffes, ciseaux, peigne et rubans, flacons et coffrets.
- Halles : voix et paniers distincts selon les étals ouverts ; réduire les sources quand ils ferment.
- Imprimerie : caractères, encre et presse synchronisés avec les gestes du tableau des commandes. La pulsation de l'atelier deviendra le motif de la presse.
- Jardin et pépinière : arrosoir, insectes, variation selon la saison.

**Disque** : 2. *La lettre sous la porte* ; 3. *Sous la halle* (phrase de Sarlande) ; 4. *Le poids du pain* ; 6. *Les lanternes de l'Un* (à monter depuis la gaillarde et la ronde, avec l'appel du tribut rendu séduisant) ; 7. *La presse après minuit* ; 8. *La lumière sur la pierre* ; 9. *Les chemins de l'hiver* ; 10. *Ce qu'Anselme a tu*, version complète ; 11. *Une ville à plusieurs voix* ; 12. *Quand l'appel reste sans réponse*. Les quartiers suivants (rue des Drapiers, quai et ateliers, cathédrale, cimetière, couvent) attendent leurs lieux en jeu.

**Conseil de méthode** : pour que les cinq motifs restent les mêmes d'un morceau à l'autre, monter chaque variante à partir de l'enregistrement de référence de son motif, comme pour *Le lendemain*, plutôt que de régénérer. Pour un développement plus riche que le montage, il faudra des musiciens ou une partition jouée.

## 7. Fichiers

- `son/` : fichiers de jeu, en MP3 de 96 à 128 kbit/s.
- `son/album/` : mix d'écoute du premier lot, en MP3 192 kbit/s.
- `son/sources/` : fichiers tels que livrés par ElevenLabs.
- `son/registre.json` : pour chaque piste, catégorie, durée, usage, source et prompt exact. Pour le montage de *Le lendemain*, il donne aussi les points de coupe.

ElevenLabs ne livre que du MP3 à 192 kbit/s. Il n'existe donc pas de master WAV.

Le compte Starter autorise l'usage commercial. Le premier lot a coûté environ 8 700 crédits ; il en restait 15 000 environ ce mois-ci.

## 8. La cathédrale (26 novembre)

**Les cloches sonnent déjà en jeu.** On les entend de toute la ville, plus claires près de la cathédrale (nord-est de la place) et étouffées au clos. Elles suivent le calendrier du monde (`tempsMonde()`).

| Moment | Ce qui sonne |
|---|---|
| Matin | L'angélus : trois fois trois coups de bourdon, puis une petite volée. Le dimanche et les jours de fête, la grande volée remplace la petite. |
| Midi | Le carillon (22 s), puis la grande volée des six cloches pendant 42 s, sous laquelle le bourdon frappe douze coups. La musique s'efface le temps de la sonnerie. Deux carillons et deux volées alternent d'un jour à l'autre. |
| Soir | L'angélus et la petite volée. |
| Entre deux | L'horloge frappe l'heure, parfois précédée du quart. |
| Récit | Minuit au bourdon pendant la fête. Le glas est prêt (`sonnerie("glas")`). |

Chaque sonnerie de plage ne sonne qu'une fois par jour, même après un rechargement (`S.cloches`). Quand le son est coupé, la sonnerie s'affiche en sous-titre.

**La nef et le quartier ne sont pas encore praticables.** Leur son est prêt et branché sur les zones `nef`, `parvis` et `cloitre` : il jouera dès qu'elles existeront.

- **Dans la nef** : pendant un office (dimanche et fêtes, matin et soir), le plain-chant et le motet à quatre voix alternent ; hors office, l'orgue, avec de longs silences. Les cloches y arrivent étouffées par les murs.
- **Dans le quartier** : le parvis et le cloître alternent.
- **Ambiances** : la nef, le parvis, le cloître.
- **Bruitages** : la porte de la cathédrale, le bénitier, le cierge, la clochette de l'élévation, l'encensoir, l'envol des pigeons, six pas sur les dalles de la nef.

**À écouter de près** : le plain-chant et le motet sont chantés dans un latin généré, sans texte réel.

**Vérifié** : `node outils/tests/son_cloches.js`. Au passage du matin à l'après-midi, midi sonne en entier (carillon, grande volée, douze coups de bourdon), une seule fois, même après un rechargement. Le parcours `son_parcours.js` relève aussi l'angélus du matin au réveil (grande volée de la Saint-Michel), l'angélus du soir au clos et celui du lendemain.

## 9. La fête en trois danses

Gaillarde (`mus-branle`), ronde (`mus-ronde`) et tourdion (`mus-tourdion`) s'enchaînent en fondu pendant toute la fête, puis reprennent. Si la danse suivante n'a pas fini de charger, la danse en cours rejoue une fois plutôt que de laisser un silence. Vérifié : `node outils/tests/son_fete.js`.
