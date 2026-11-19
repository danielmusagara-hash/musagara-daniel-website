DTECH — MUSAGARA DANIEL — V5 WORKERS

Cette version ajoute un point d’entrée Cloudflare Worker (src/index.js) tout en conservant les fichiers statiques à la racine.
Le Worker utilise les routes /api/* pour l’authentification et les opérations GitHub. Les fichiers du site sont servis via ASSETS.

CONFIGURATION REQUISE DANS CLOUDFLARE
1. Vérifier que le déploiement GitHub utilise le fichier wrangler.toml à la racine et la commande `npx wrangler deploy`.
2. Dans le Worker `daniel`, ajouter un KV Namespace Binding :
   Variable name : ADMIN_KV
   KV namespace : DTECH_ADMIN_STORAGE
3. Ajouter un Worker Secret nommé SESSION_SECRET, contenant une valeur aléatoire longue (au moins 32 caractères).
4. Redéployer le Worker.
5. Ouvrir /admin/ et saisir une seule fois le Fine-grained GitHub PAT limité au dépôt danielmusagara-hash/musagara-daniel-website avec Contents: Read and write.
6. Le Worker chiffre le jeton dans KV. Le navigateur ne reçoit jamais le jeton. Le cookie de session est HttpOnly, Secure et SameSite=Strict.

IMPORTANT
- Le jeton est conservé chiffré dans KV. Le secret SESSION_SECRET est indispensable : sa perte rend le jeton stocké illisible.
- La session dure 365 jours dans ce prototype. Après expiration ou suppression des cookies, il faudra se reconnecter avec le même jeton.
- Le PAT GitHub a sa propre date d’expiration. S’il expire, il faudra le renouveler et procéder à une rotation côté serveur.
- Les changements du site sont envoyés par commit sur la branche main. Le déploiement Cloudflare dépend de la liaison GitHub existante et de sa configuration.
- N'active pas Cloudflare Access avec une authentification e-mail si tu souhaites conserver le mode d’accès par jeton.
- Ne publie pas le jeton dans GitHub, dans un fichier du site ou dans une capture d’écran.
