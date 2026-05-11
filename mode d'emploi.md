# Déploiement de Goutte Verte

## Identifiants exacts du projet

### Supabase
- **URL** : `https://viwudhiicyyossivxupxt.supabase.co`
- **Clé Anon** : (voir fichier `secrets-goutteverte.txt`)
- **Clé Service Role** : (voir fichier `secrets-goutteverte.txt`)

### Netlify
- **Site** : (l'URL de votre site Netlify)
- **Variables d'environnement** :
  - `SUPABASE_URL` = `https://viwudhiicyyossivxupxt.supabase.co`
  - `SUPABASE_ANON_KEY` = (votre clé anon)
  - `SUPABASE_SERVICE_KEY` = (votre clé service_role)
  - `ADMIN_SECRET` = `GV@Admin2025`

### GitHub
- **Dépôt** : `https://github.com/gouteverte-collab/goute-verte.git`

## Procédure pas à pas

1. Assurez-vous que les 9 fonctions Netlify sont bien dans le dossier `netlify/functions` :
   - public-config.js, products.js, orders.js, config.js, promos.js, wilayas.js, settings.js, setup.js, admin-auth.js

2. Remplacez le fichier `index.html` par le **contenu complet** fourni ci-dessus (enregistrez-le en UTF-8).

3. Depuis le dossier du projet, exécutez :
   ```bash
   git add index.html
   git commit -m "Index complet avec design, fonctionnalités et sécurisation admin"
   git push origin master