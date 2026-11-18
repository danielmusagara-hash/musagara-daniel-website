# MUSAGARA DANIEL — DTECH - DSquare Technologies

Site professionnel et éditeur visuel personnalisé.

## Identité
- MUSAGARA DANIEL — CEO & Founder
- DTECH - DSquare Technologies
- Humanity - Innovation - Hope

## Architecture V5 — Cloudflare Workers
- Les fichiers publics restent à la racine du dépôt.
- `src/index.js` gère les routes serveur `/api/*`.
- Les autres fichiers sont servis par le binding statique `ASSETS`.
- `wrangler.toml` configure le Worker `daniel`.
- L'éditeur `/admin/` envoie les modifications via le Worker ; le jeton GitHub n'est pas exposé au navigateur.

## Configuration Cloudflare obligatoire
Dans le Worker `daniel` :
1. Ajouter un KV Namespace Binding : variable `ADMIN_KV`, namespace `DTECH_ADMIN_STORAGE`.
2. Ajouter un Worker Secret `SESSION_SECRET` contenant une valeur aléatoire forte d'au moins 32 caractères.
3. Vérifier que le déploiement GitHub exécute `npx wrangler deploy` depuis la racine du dépôt et utilise `wrangler.toml`.
4. Redéployer après configuration.

## Première connexion
Ouvrir `/admin/` et saisir le Fine-grained GitHub Personal Access Token limité au dépôt `danielmusagara-hash/musagara-daniel-website`, avec la permission `Contents: Read and write`. Le Worker vérifie l'accès au dépôt, chiffre le jeton avec `SESSION_SECRET`, puis le stocke dans KV. Le navigateur ne conserve pas le jeton. Une session HttpOnly/Secure/SameSite est créée pour 365 jours.

Le jeton GitHub a sa propre expiration. À son expiration, il faudra le renouveler et effectuer une rotation du jeton stocké côté serveur. Ne jamais mettre le jeton dans un fichier, un commit ou une capture d'écran.

## Publication
Le bouton « Enregistrer & publier » crée un commit sur la branche `main`. Si le Worker est bien relié au dépôt GitHub avec le déploiement automatique activé, ce commit déclenche un nouveau déploiement.

## Limites de cette version
L'éditeur visuel V4 est conservé : modification de textes, images, styles simples, ordre/visibilité des sections et ajout d'une section simple. Ce n'est pas un clone complet d'Elementor.
