# Finition des actes I et II de Le Contr’un

Cahier de livraison complémentaire à la [refonte de Sarlande](Refonte_Sarlande.md). Son périmètre va de la page de titre au bilan de l’acte II. Les décisions narratives et les règles de la bible s’appliquent à ce parcours.

## 1. Résultat attendu et ordre de travail

Livrer une version jouable des deux actes en une seule livraison. Le joueur doit pouvoir habiter Sarlande, traverser ses rues, reconnaître ses habitants, entrer et sortir par des seuils cohérents, comprendre les conséquences de ses choix et reprendre sa progression.

Vérifier l’état réel de `main` et des PR #16, #17 et #18. Reprendre les changements utiles sur Aliénor Meshy, la caméra tactile, l’aménagement et les décors en tenant compte des modifications plus récentes. Lire la bible, le suivi de la refonte, l’atlas, les références des actes I et II, les notes de production, les tests et [l’issue #7](https://github.com/lmangolini8-svg/le-contrun/issues/7). Inventorier les ressources déjà disponibles dans le dépôt, ses branches et releases, ainsi que dans Meshy. Générer les éléments manquants à partir des références validées.

Commencer par une boucle complète clos–Drapiers–imprimerie comprenant le nouveau rendu, un dialogue conséquent et une reprise de sauvegarde. Employer les résultats pour ajuster la caméra, les modèles, l’interface et les performances avant de les étendre aux deux actes. Si un accès indispensable, une dépense non autorisée ou un arbitrage éditorial irréversible demande une décision, continuer les lots indépendants.

## 2. Direction visuelle et ville jouable

Retirer le filtre aquarelle de la scène jouable. Unifier la ville en 3D texturée, à hauteur de personnage, avec de la pierre claire usée, du bois sombre, des enduits irréguliers, des tissus mats et des pavés légèrement humides près des rigoles. Utiliser les planches illustrées pour les ouvertures, transitions et collections où elles ont une fonction claire.

Reprendre les décors Meshy de Claude, dont les commits `0420fbb` et `83aff9c` documentent la provenance et le placement. Harmoniser tailles, orientations, pivots, matériaux et niveaux de détail. Vérifier les façades, portes et raccords depuis la caméra réelle. Employer le soleil du matin, les lumières de la fête et la clarté de l’aube pour guider le regard. Mesurer le coût des textures, modèles et ombres sur les parcours réellement joués.

Raccorder le clos, les Drapiers, l’imprimerie, les halles, la fontaine, le quai, la cour des gardes, la chapelle et les lieux de la fête utiles au récit. Utiliser une géographie commune pour terrain, interactions, navigation et carte. Raccorder le tribut et les rendez-vous à cette géographie. Après une transition d’intérieur, revenir par la même porte et restaurer le bon seuil après rechargement. Tester les parcours dans les deux sens, les pentes, les marches, les collisions, les pieds au sol et la visibilité de la destination.

## 3. Personnages et animations

Utiliser le modèle Meshy d’Aliénor en exploration et en dialogue. L’export GitHub « Apron of Autumn Ink » constitue sa source. Reprendre son squelette et ses expressions. Affiner l’appui des pieds, le pli des genoux, le balancement des bras, l’arrêt, le virage, la transition de marche à course et la déformation de la robe et du tablier. Vérifier sourire, inquiétude et regard en gros plan. Ajouter le clignement ou le mouvement des lèvres si le cadrage le justifie. Corriger les substitutions de modèle visibles pendant les transitions.

Partir des modèles existants ou des planches approuvées pour Anselme, Maëlle, Garin et les personnages qui portent les scènes. Préparer leur squelette, leurs déformations et les gestes réellement joués, notamment la marche, l’attente, le dialogue, le travail à la presse et le port du sac. Vérifier les GLB et leurs animations dans Three.js. Pour les portes, volets et roues, animer les pièces rigides autour de leur pivot. Garder les décors fixes en maillage statique. Conserver la provenance et optimiser les exports pour la tablette.

## 4. Page de titre et interface joueur

Composer une page de titre contemplative à partir d’un plan du moteur, avec un premier plan lisible, une lumière choisie et un mouvement de caméra discret. Assurer l’accès à Jouer, Reprendre et Réglages en portrait et en paysage.

S’inspirer de Genshin Impact pour l’ergonomie et créer une identité visuelle propre à Sarlande. En exploration, garder un HUD discret avec objectif suivi, repère utile et action contextuelle. Sur iPad, placer le joystick à gauche, la rotation libre à droite et l’action à portée du pouce droit. Adopter une marche progressive par défaut et un sprint volontaire. Vérifier la caméra près des murs, les gestes simultanés, le relâchement et la reprise après interruption. Soigner aussi le clavier et la souris.

Donner un accès direct à la carte et au carnet. Réunir quatre onglets stables dans le menu joueur.

- **Carte.** Afficher le terrain jouable, la position et l’orientation d’Aliénor, les entrées découvertes et l’objectif suivi. Permettre zoom, déplacement, recentrage et repère personnel. Afficher les accès et les horaires que le joueur connaît. Respecter les révélations du récit.
- **Inventaire.** Présenter les objets en grille par catégorie, avec quantité, fiche d’usage et bourse. Avant une opération, afficher le coût, les ressources possédées et ce qui manque. Utiliser les mêmes données pour l’inventaire, la fabrication, la réserve et la sauvegarde.
- **Carnet.** Mettre en tête l’objectif actif et sa prochaine étape. Relier les objectifs secondaires à la carte quand leur emplacement est connu. Regrouper témoignages, indices, feuillets et notes personnelles. Identifier l’interlocuteur, le lieu et ce qu’Aliénor a réellement appris.
- **Collections.** Regrouper personnages rencontrés, lieux, tenues, feuillets et illustrations. Débloquer les entrées à la découverte, afficher un aperçu lorsqu’il existe et sauvegarder l’état de lecture.

En fermant un menu, rendre le contrôle sans déplacement involontaire ni saut de caméra. Vérifier les cibles tactiles, la lecture des textes longs et le défilement en portrait et paysage.

## 5. Dialogues et relations sociales

Raccorder le système de dialogue et le carnet aux agendas, liens, savoirs, rumeurs, engagements et sujets de `jeu/monde.js`. Proposer des sujets selon le lieu, l’heure, les témoins, les événements récents et les connaissances de chaque interlocuteur. Autoriser, lorsque le contexte le permet, une question, la présentation d’une preuve, une conversation privée, un retour ultérieur ou une sortie d’échange. Afficher clairement l’interlocuteur, sa réplique et les choix.

Faire évoluer la relation à partir de faits précis comme tenir une confidence, rendre un service, manquer un rendez-vous ou formuler une accusation publique. Traiter la réputation publique et les rumeurs par quartier selon leur circulation dans le temps et l’espace. Conserver la provenance de l’information et distinguer les faits vus, les faits rapportés et ce qu’Aliénor peut effectivement savoir.

Rendre les conséquences perceptibles par les répliques, les regards, les horaires, les refus, les invitations et les sujets proposés. Dans le carnet, noter des faits observables plutôt qu’une jauge d’affection. Éviter de réappliquer les effets d’un salut répété ou d’un choix déjà sauvegardé. Préserver une suite jouable pour chaque profil de relation prévu par le récit.

Comparer la pesée publique chez Maëlle et la question posée en privé depuis deux sauvegardes comparables. Revoir Maëlle et un autre habitant pour vérifier leur information, leurs répliques et le carnet. Comparer un rendez-vous honoré et manqué, tester une décision liée aux gardes pendant la fête, puis recharger juste après un choix et vérifier qu’il compte une seule fois.

## 6. Aménagement, fabrication et jardinage

Prendre Animal Crossing comme référence pour la simplicité de l’aménagement sur grille. Permettre, dans la maison et le jardin, de sélectionner, déplacer, prévisualiser, placer et annuler. Indiquer l’emprise et les cases bloquées. Faire correspondre les cases aux objets visibles en 3D et garder les portes et chemins praticables. Sauvegarder placements et réserve.

Rendre jouable, dans le calendrier des deux actes, au moins un cycle complet de recherche de matières, consultation de recette, fabrication, pose d’un bac, achat ou obtention de graines, semis, arrosage, compost et récolte. Donner aux récoltes un usage dans la cuisine ou une autre activité existante. Vérifier le coût affiché, les ressources insuffisantes et l’absence de consommation ou de gain en double après rechargement.

## 7. Son et musique

Inventorier et écouter les pistes de `son/` et leur provenance dans `son/registre.json`. Employer le thème d’Aliénor au réveil, la cloche du tribut, les ambiances d’atelier et de marché, la fête et le thème du lendemain aux moments appropriés. Préserver le rôle des motifs de la lettre et de Mahaut.

Faire évoluer les ambiances selon le lieu, l’heure et les seuils. Donner une perspective aux pas, à l’eau, à la presse et à la foule. Stabiliser les transitions et les fondus autour des portes. Vérifier les volumes, réglages par famille, le muet, les signaux visuels, la reprise après interruption et le comportement si un fichier audio manque.

## 8. Recette et livraison

Jouer les deux actes avec les entrées normales. Pour l’acte I, couvrir le réveil, la lettre, le trajet, le travail, les courses, les variantes de la pesée, le tribut, la cour des gardes, la chapelle et la transition vers la fête. Pour l’acte II, couvrir la fête, les témoignages, les choix liés aux gardes, la presse, l’aube et le bilan. Confirmer les bornes et variantes attendues dans la bible. Rejouer les branches qui changent la progression, les relations ou la compréhension du récit.

Tester une nouvelle partie et la migration d’une ancienne sauvegarde. Recharger près d’une porte, après un paiement, au changement d’acte et au bilan. Vérifier position, bourse, inventaire, notes, décisions, relations et progression. Jouer aussi une boucle carte–déplacement–conversation–carnet et une boucle de fabrication et jardinage sans modifier manuellement la sauvegarde.

Lancer les tests du dépôt et adapter les parcours concernés. Vérifier dans Chromium et WebKit si disponibles. Compléter les tests automatisés par des trajets joués, une inspection visuelle et une écoute. Sur iPad physique, vérifier portrait, paysage, fluidité, gestes simultanés, rotation et mise en veille. Consigner le modèle, le navigateur et les mesures disponibles. En cas d’émulation seule, préciser la couverture et les contrôles qui restent sur appareil.

Livrer une PR prête à relire et une version d’essai au lien vérifié, avec les commandes et la direction graphique retenues actives dès le démarrage. Indiquer le commit déployé, les trajets réellement joués, les résultats et les limites vérifiées. Lier l’issue #7 et la fermer lorsque ses propres critères sont satisfaits. Corriger les défauts bloquants reproductibles et redéployer la version corrigée.
