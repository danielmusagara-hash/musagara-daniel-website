# Site professionnel — Musagara Daniel | DTECH - DSquare Technologies

Site statique responsive, conçu avec une direction artistique sobre et institutionnelle : bleu nuit, blanc, bleu technologique et touches dorées. La mise en page s'adapte aux mobiles, tablettes et ordinateurs.

## Identité retenue
- MUSAGARA DANIEL
- CEO & Founder
- DTECH - DSquare Technologies
- Humanity - Innovation - Hope

## Contenu préparé
- Présentation du dirigeant et de l'entreprise (plus de 10 ans d'expérience, selon les informations communiquées).
- Domaines : applications web, mobiles et desktop, sites web, gestion d'entreprise, sécurité numérique, systèmes personnalisés, données, IA, automatisation et accompagnement.
- Produits : KESE, Nova Drive AI et INFINITY.
- Portfolio : plus de 15 sites web développés et mis en ligne, et applications de gestion pour différents secteurs.
- Rubriques administrables prévues : biographie, parcours scolaire, réalisations, mérites, certifications, produits, projets, galerie, actualités et contact.

Les informations factuelles ci-dessus sont reprises de vos indications. Les références de clients, liens des sites, images des produits, diplômes et certifications restent à ajouter/valider avant publication.

## Aperçu local
Ouvrez `index.html` dans un navigateur. Pour le chargement du fichier `content.json`, il est préférable d'utiliser un serveur local ou de publier une première version sur Cloudflare Pages.

## Publication Cloudflare Pages via GitHub
1. Créez un dépôt GitHub, par exemple `musagara-daniel-site`.
2. Téléversez le contenu de cette archive (fichiers et dossiers à la racine du dépôt).
3. Dans Cloudflare, ouvrez Workers & Pages → Create application → Pages → Connect to Git.
4. Connectez le dépôt GitHub. Pour ce site statique, aucune commande de build n'est nécessaire ; le répertoire de sortie est `.`.
5. Déployez. Cloudflare attribuera une adresse `*.pages.dev`.

## Administration et médias
- Accédez à `/admin/` après déploiement.
- L'administration modifie `content.json` dans GitHub et permet de téléverser des images dans `assets/`.
- Le site se redéploie après les commits GitHub si Cloudflare Pages est connecté au dépôt.
- L'éditeur utilise le format JSON : faites une copie de sauvegarde avant les modifications et conservez la syntaxe.

### Sécuriser l'administration
Avant toute utilisation publique, configurez Cloudflare Access pour protéger le chemin `/admin/*` et autoriser uniquement votre adresse e-mail. Ne placez jamais de mot de passe par défaut dans le code public. Créez un Fine-grained Personal Access Token GitHub limité à ce seul dépôt avec uniquement `Contents: Read and write`. Le jeton est saisi dans l'onglet d'administration et n'est pas sauvegardé dans le site. Révoquez-le en cas d'exposition.

## Photographie
`assets/portrait-original.jpg` est la photo fournie. La page d'accueil utilise provisoirement `assets/portrait-original.jpg`, sans aucune modification des traits du visage. Le détourage transparent n'est pas encore intégré : il devra être réalisé avec un masque manuel vérifié pour ne pas altérer un seul détail du visage. Vous pourrez téléverser une version détourée validée et modifier `portraitImage` dans `content.json`.

## À compléter avant la mise en ligne définitive
- Biographie exacte et parcours de Musagara Daniel.
- Établissements, diplômes, années, certifications et distinctions.
- Coordonnées professionnelles vérifiées.
- Exemples et liens des sites web clients publiables.
- Captures d'écran et visuels authentiques de KESE, Nova Drive AI et INFINITY.
- Confirmer la dénomination légale exacte de l'entreprise .


## Prévisualisation permanente (recommandée)
Pour ne plus demander une prévisualisation à chaque modification, connectez ce projet à GitHub et Cloudflare Pages. Créez une branche `preview` et activez les déploiements de prévisualisation Cloudflare. La première publication de cette branche génère une URL de prévisualisation dédiée. Chaque commit/push sur `preview` met cette URL à jour automatiquement. La branche `main` reste réservée au site officiel. Après validation, fusionnez `preview` vers `main`.

Pour un aperçu local ponctuel, ouvrez `musagara-daniel-preview.html` fourni séparément : il est autonome et intègre le contenu, le CSS, le logo et la photo. Il ne se met pas à jour automatiquement après édition des fichiers sources ; pour cela, utilisez l'URL de prévisualisation Cloudflare liée à la branche `preview`.

**Dénomination à utiliser partout :** `DTECH - DSquare Technologies` uniquement. Ne pas employer d'autre nom d'entreprise.

## Éditeur visuel personnalisé (version initiale)
L'interface `/admin/` est un éditeur visuel en aperçu intégré : sélectionner un texte ou une image directement dans la page, modifier le texte, remplacer une image, changer les couleurs, la taille de police, l'alignement, les espacements et les coins arrondis. Elle permet également de réordonner/masquer les sections et d'ajouter une section simple. Les modifications visuelles sont stockées dans `site-edits.json` et appliquées au site public par `site.js`.

### Connexion et publication
- Dans `/admin/`, fournir un Fine-grained Personal Access Token GitHub limité au dépôt `danielmusagara-hash/musagara-daniel-website`, permission `Contents: Read and write`.
- Charger les modifications depuis GitHub, effectuer les changements dans l'aperçu, puis cliquer sur « Enregistrer & publier ».
- Les fichiers médias sont ajoutés dans `assets/`. Le contenu des modifications est commité dans `site-edits.json`.
- Cloudflare Pages doit surveiller la branche `main` pour redéployer après le commit.
- Le jeton est gardé en mémoire dans l'onglet courant et n'est pas stocké dans les fichiers du site. Le fermer/actualiser nécessite de le ressaisir.

### Sécurité obligatoire
Configurer Cloudflare Access pour protéger l'ensemble du chemin `/admin/*` et autoriser uniquement l'adresse e-mail de l'administrateur. L'éditeur n'est pas un système d'authentification à lui seul. Ne jamais laisser `/admin/` accessible publiquement sans Cloudflare Access et ne jamais placer de jeton GitHub dans le code.

### Limites de cette première version
Cet éditeur fournit une édition visuelle directe et un panneau de propriétés, mais n'est pas encore un clone complet d'Elementor : les mises en page complexes en colonnes, les widgets arbitraires, le glisser-déposer libre de tous les éléments et les réglages responsive indépendants par appareil ne sont pas encore disponibles. Les sections peuvent être réordonnées avec les commandes Monter/Descendre. Les nouvelles sections ajoutées sont des blocs simples titre + texte.
