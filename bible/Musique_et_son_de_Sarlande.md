# Musique et son de Sarlande

Cahier des charges pour *Le Contr’un* · 25 novembre 2026  
À lire avec la [refonte de Sarlande](Refonte_Sarlande.md) et la [bible des personnages](Personnages.md).

## 1. Intention

Composer une bande originale qui raconte Sarlande à elle seule. On doit pouvoir l’écouter d’un bout à l’autre et entendre un chemin, du premier réveil d’Aliénor au lendemain de la chute de l’Un. Chaque morceau important doit avoir une entrée, une idée qui se développe et une fin. Dans le jeu, le même matériau se décline en versions courtes, boucles, reprises et silences selon les lieux et les décisions.

Direction retenue pour le brief : combiner intimité des cordes pincées, souffle des vents, polyphonie et danse. Prendre pour repères les branles, pavanes et gaillardes documentés autour de 1550 et les éditions de Pierre Attaingnant. Une danse jouée sur la place, un chant entendu dans la nef et une musique de récit ont des fonctions distinctes. Vérifier auprès d’une référence d’époque les instruments montrés à l’image et les usages liturgiques retenus. Proposer des compositions originales et des arrangements cohérents. Pour toute source préexistante, consigner les droits de la composition, de l’arrangement et de l’enregistrement séparément. [Danseries conservées par la BnF](https://catalogue.bnf.fr/ark:/12148/cb397354311) · [Éditions d’Attaingnant](https://bp16.bnf.fr/12230232/pierre_attaignant/page2)

## 2. Inventaire GitHub

Relevé du 25 novembre. Les quatre branches suivantes partagent exactement le même dossier `son/` : `main` (`34c16f1`), la branche de refonte (`30d418a`), la branche du calendrier de Claude (`53dba1e`) et la branche de la fête de Claude (`795a2e5`).

| Banque | Quantité | Contenu |
|---|---:|---|
| Musiques MP3 | 10 | `mus-titre`, `mus-jour`, `mus-cour`, `mus-branle`, `mus-ronde`, `mus-farce`, `mus-nuit`, `mus-aube`, `mus-fanfare`, `mus-litiere`. |
| Ambiances MP3 | 13 | `amb-marche`, `amb-fontaine`, `amb-quai`, `amb-cour`, `amb-chapelle`, `amb-atelier`, `amb-fete`, `amb-nuit`, `amb-aube`, `amb-ruelle`, `amb-feu`, `amb-vent`, `amb-pluie`. |
| Bruitages MP3 | 30 | 6 pas, 5 pas d’armure, puis page, feuillet, pièces, pierre, presse, colle, caractère, cloche, rires, applaudissements, acclamation, verres, halte, porte, chouette, murmure, sac, plume et bois. |

Les 53 MP3 totalisent environ 17,1 Mo compressés. Sur `codex/planches-vie-2026-11-25` (`8c27301`), le dossier compte 10 WAV : quatre notes de luth, trois pas, un pas d’armure, une feuille et `peau.wav`. Lors du rapprochement des branches, partir de la banque MP3 complète et évaluer ces WAV comme sources complémentaires. L’inventaire porte sur les fichiers et leur usage dans le code. Une écoute éditoriale des dix morceaux reste à faire avant de choisir lesquels intégrer à l’album. Le code attribue la banque MP3 à ElevenLabs. Consigner la provenance détaillée de chaque piste avant une diffusion de la bande originale.

**Moteur actuel.** Dans `index.html`, `musicNow()` choisit surtout selon l’acte, la scène et la distinction place/cour. La gaillarde (`mus-branle` côté fichier) alterne avec la ronde. Le code dispose déjà de fondus, de pauses entre morceaux, d’ambiances mélangées selon la position, d’un filtre d’éloignement pour la fête, d’une baisse de la musique en dialogue, de variations de pas et d’un cache pour les pistes longues. Le bouton affiché comme « musique » coupe actuellement le son général.

[Banque MP3 de référence](https://github.com/lmangolini8-svg/le-contrun/tree/34c16f173f355fdf54b43c117b6a1c01fcf51dd7/son) · [Banque WAV](https://github.com/lmangolini8-svg/le-contrun/tree/8c27301/son) · [Code audio](https://github.com/lmangolini8-svg/le-contrun/blob/34c16f173f355fdf54b43c117b6a1c01fcf51dd7/index.html#L3286) · [Agenda et temps du monde](https://github.com/lmangolini8-svg/le-contrun/tree/53dba1eb4b12d8952f425a6e85f391b320f95f5c/jeu)

## 3. Les thèmes et l’histoire du disque

| Motif | Première apparition | Transformation au fil du récit |
|---|---|---|
| **Aliénor** | Luth seul, phrase simple au réveil. | Une voix répond quand elle gagne en autonomie. Lorsqu’elle publie sous son nom, le motif est joué entier. |
| **La presse et les écrits** | Pulsation issue de la cadence de l’atelier, prolongée par les cordes. | Le rythme circule dans les thèmes des quartiers. Au tirage clandestin, il devient moteur du morceau. |
| **Mahaut et la lettre** | Une phrase suspendue après la lecture du billet. | Au cimetière et aux archives, la réponse se fait entendre par fragments. La confession donne enfin sa forme complète au thème. Le carnet et la lettre restent lisibles à son rythme. |
| **Le tribut et l’Un** | Appel mesuré et régulier, reconnaissable à la cloche et aux vents. | La fête en reprend une partie dans une couleur séduisante. Quand l’autorité vacille, l’appel attend des réponses qui arrivent en retard ou disparaissent. |
| **Sarlande** | Plusieurs voix courtes autour des halles et des rues. | Les quartiers reprennent la même phrase avec leurs timbres. Après la chute, les voix ont chacune leur place dans le dernier morceau. |
| **La nef et le couvent** | Un intervalle entendu dans un chant ou une réponse de voix. | Il réapparaît dans la traversée des jardins, puis peut revenir à découvert lors d’un moment de recueillement. Donner aux deux lieux leur acoustique et leur rythme propres. |

**Ordre proposé pour l’album.** Treize titres et environ **40 à 50 minutes** constituent une cible éditoriale pour la campagne complète. Titres de travail et durée à ajuster après écoute.

| Titres | Fonction dans le disque |
|---|---|
| 1. *Les volets du clos* · 2. *La lettre sous la porte* | Entrer dans l’intimité d’Aliénor, puis introduire la question qui la fait sortir. |
| 3. *Sous la halle* · 4. *Le poids du pain* · 5. *La cloche du tribut* | Faire entendre la ville au travail. La seconde pesée reprend des éléments de la première avec une autre tension. |
| 6. *Les lanternes de l’Un* · 7. *La presse après minuit* | La danse atteint son éclat. À l’atelier, quelques éléments de sa pulsation survivent derrière la porte. |
| 8. *La lumière sur la pierre* · 9. *Les chemins de l’hiver* · 10. *Ce qu’Anselme a tu* | Ouvrir l’espace de la nef, traverser l’hiver et l’enquête, puis aboutir au thème entier de Mahaut. |
| 11. *Une ville à plusieurs voix* · 12. *Quand l’appel reste sans réponse* | Faire se rencontrer les quartiers. La chute s’entend dans des gestes familiers qui se désaccordent ou s’interrompent. |
| 13. *Le lendemain, les volets* | Reprendre l’intimité du premier morceau avec les timbres de la ville. Donner une fin musicale à la campagne et un seuil au futur postgame. |

Écouter d’abord les dix morceaux existants et consigner fonction, durée, tempo si pertinent, couleur, caractère et décision de réemploi. Conserver comme reprises, interludes ou morceaux complets ceux qui s’accordent avec la suite. Pour valider la direction, produire trois épreuves musicales : *Les volets du clos*, *La cloche du tribut*, puis *Le lendemain, les volets*. Vérifier à l’écoute hors jeu que les trois appartiennent au même monde et que le retour du premier thème raconte un changement.

## 4. Donner une identité audible à chaque lieu

Les boutiques héritent du thème de leur quartier. Une variante de timbre ou un passage de chambre peut les distinguer. Leur identité vient aussi d’une activité audible et située, qui suit l’ouverture, le travail et le départ de la clientèle. Prévoir des pauses musicales réelles.

| Lieu | Motif, ambiance et détails |
|---|---|
| **Clos, maison, puits, jardin** | Luth intime, air au matin. Volets, corde et seau localisés. Dans la maison, bois, tissu, foyer et cour. Le jardin passe du vent aux oiseaux et aux insectes selon saison et moment. |
| **Menuisier, tapissière, pépinière** | Variantes légères du clos. Rabot, copeaux et bois proches. Métier et froissement de toile plus feutrés. À la pépinière, arrosage et présence du dehors. |
| **Place et halles** | Thème de Sarlande joué à plusieurs. Fontaine, voix, pas, paniers et pesées. Réduire les sources quand les stands ferment. La foule et la cloche du tribut ont leur scène propre. |
| **Fournil, boucher, chasseur, paysan** | Fournil : foyer, pétrin, pelle, croûte et balance. Autres étals : gestes espacés, balances, paniers et arrivages. Étals absents les jours de fermeture. La pesée de Maëlle laisse entendre les poids et la réaction des clients. |
| **Caisse et brocanteur** | Caisse : plume, monnaie et acoustique courte. Brocanteur : objets manipulés et bruit du marché à la porte. Garder les échanges lisibles. |
| **Drapiers, tailleur, coiffeuse, fards et parures** | Même phrase du quartier, en variantes fines. Ciseaux et étoffe, peigne et rubans, petits flacons et coffrets. Réserver les changements musicaux aux visites assez longues ou significatives. |
| **Quai, teinturerie, potière, verrier et ferronnier** | Phrase plus ouverte avec eau et vent. Drisses et pas sur le bois au quai. Cuves et étoffes chez Aubin, tour et terre chez la potière, foyer et pinces chez le verrier, fer et soufflet à la forge. Atténuer graduellement la forge à distance. |
| **Imprimerie et relieuse-papetière** | Motif de la presse. Caractères, encre, plateau et papier déclenchés par les gestes. Pause lorsqu’Anselme confie quelque chose à Aliénor. Froissements et outils fins à la reliure. L’horloger a des mécanismes légers avec des pauses. |
| **Palais, cour et archives** | Motif du tribut dans les espaces de représentation. Pas réverbérés, portes et fragments de voix. Les archives privilégient le papier et le silence. La litière conserve son traitement de scène. |
| **Parvis, cathédrale, cloître et cimetière** | Parvis commerçant et cloches situées. Dans la nef, acoustique plus ample, voix ou orgue lorsqu’un office ou une scène le motive. Le cloître retrouve lumière, pas et oiseaux. Au cimetière, vent, visites, silence et quelques retours du motif de la lettre. |
| **Couvent, prés, forêt et exil de Mahaut** | Jardins et couvent avec voix, eau et travaux selon l’heure. Dans les bois, végétation, insectes et oiseaux sélectifs selon la saison. Pour l’exil de Mahaut, laisser l’abri s’entendre avant d’exposer son thème. |
| **Fête, farce et après-fête** | Conserver et évaluer les danses, la fanfare, la farce et la foule existantes. Sonner depuis la place et les tréteaux. Depuis une rue lointaine, la fête se filtre. À l’aube, laisser les pas, la fontaine et les restes de la fête prendre la place de la foule. |

## 5. Intégration dans le jeu et confort

- Séparer **musique de récit**, **musique située dans le monde**, **ambiances**, **bruitages et voix**. Prévoir un volume général et au minimum des volumes musique, ambiances et effets/voix. Migrer l’ancien réglage muet en conservant sa valeur. Prévoir un équivalent visuel ou textuel pour une cloche ou une alerte indispensable.
- Partir de l’état commun du monde : lieu précis, quartier parent, intérieur ou extérieur, plage horaire, météo, saison, commerce ouvert, office, fête, narration. En l’absence d’un profil exact, reprendre l’ambiance du lieu parent et laisser sa musique se poursuivre. Le son lit le calendrier et les événements du monde.
- Donner priorité au passage de récit lorsqu’une scène le demande. Une performance située et audible peut ensuite réduire le fond musical. Pendant un dialogue, baisser la musique et préserver les éléments nécessaires à la scène. Le silence peut être demandé explicitement, avec un retour contrôlé à l’exploration.
- Au seuil d’une boutique, modifier d’abord l’acoustique, les sons proches, et l’atténuation de la rue selon l’ouverture de la porte. Proposition de départ : fondus d’ambiance de **0,5 à 1,5 s**, maintien du thème sur les entrées brèves et changement musical après **2 à 5 s** de présence stable ou à une fin de phrase. Vérifier les allers-retours rapides. Réserver un démarrage immédiat aux gestes et aux événements synchronisés.
- Planifier des reprises, des variantes et des silences en exploration. Reprendre le morceau en cours ou une version compatible au retour, selon le contexte. Éviter les petits sons en série avec variations et temps de repos. Un chargement tardif respecte toujours la scène qui est devenue active.
- Alimenter un registre de fichiers avec identifiant, durée, emplacement, catégorie, cible sonore, source et droits. Ajouter selon le besoin tempo, points de boucle, points de transition et son de remplacement. Conserver des masters WAV, proposer des fichiers de jeu compressés compatibles avec Safari et garder un mix d’album séparé. Les raccords s’écoutent dans le format final, notamment après compression.
- Sur iPad, démarrer le son lors d’un geste explicite. Charger à la demande, garder le nombre de pistes simultanées limité, libérer les longues pistes hors usage et prévoir la reprise après mise en arrière-plan. Mesurer la mémoire décodée ainsi que le poids transféré. Vérifier sortie tablette, casque et état muet. [Documentation Apple sur le geste de démarrage](https://developer.apple.com/documentation/webkit/wkaudiovisualmediatypes/audio)

## 6. Livrables et ordre de production

1. **Premier parcours.** Inventaire d’écoute, carte audio du clos à la place et première palette commune. Personnaliser maison, puits, rue, presse, fournil, halle, tribut et retour. Réutiliser les ambiances présentes. Produire les trois morceaux pilotes ou leurs maquettes et les premiers sons manquants, notamment les poids de la balance et la cruche.
2. **Quartiers et fêtes.** Étendre la carte et ses variantes à chaque commerce dans le tableau. Placer les performances sur la carte, intégrer les seuils intérieur/extérieur et le calendrier, enrichir les bruits de travail et les variantes jour/soir.
3. **Enquête et campagne.** Produire les profils cathédrale, couvent, cimetière, bois et archives. Ajouter la confession, les reprises à travers les saisons, la chute et le lendemain. Finaliser l’écoute de l’album. Les besoins musicaux du postgame seront précisés dans son propre cahier des charges.

Pour une pièce de l’album, livrer **mix complet avec fin**, source et crédits. Pour le jeu, ajouter selon la pièce **boucle ou extrait**, repères de raccord, une ou deux variantes utiles et éventuellement une fin courte. Pour une ambiance, fournir un fond propre et les sons remarquables séparés. Pour un bruit récurrent, fournir plusieurs prises lorsque le geste s’y prête.

**Vérifications de livraison**

- En allant de la halle au fournil puis en ressortant immédiatement, entendre la rue et le travail changer sans succession de départs musicaux.
- Entendre des étals différents à l’ouverture et à la fermeture. Entendre le quai, la forge ou la fête à une distance et une orientation plausibles.
- Vérifier le retour d’une musique après dialogue, changement de scène et rechargement. L’absence d’un fichier laisse la partie jouable.
- Tester l’Acte II existant : l’alternance danse/ronde, la farce, la litière, les cloches, puis l’aube.
- Comparer ordinateur, iPad réel et casque pendant un trajet avec franchissements répétés. Relever coupures, raccords, niveaux, pistes actives et téléchargements. Tester les réglages et les indices équivalents en mode muet.
- Écouter les morceaux pilotes à la suite, puis écouter l’album entier hors jeu. Vérifier que les motifs restent identifiables et que le dernier morceau répond au premier.

Les titres, tempos, durées, instruments exacts et réemplois restent des décisions de composition. Le présent document fixe l’intention, l’intégration et les critères d’écoute.
