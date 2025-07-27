# Guide de Déploiement Rose-d'Eden sur Hostinger

## Prérequis
- Compte Hostinger avec hébergement VPS ou Business
- Accès SSH au serveur
- Base de données PostgreSQL (disponible avec les plans Business et VPS)

## Étape 1: Préparer le site pour la production

1. **Construire le projet**
   ```bash
   node build-production.js
   ```
   Cela créera un dossier `production` avec tous les fichiers nécessaires.

## Étape 2: Configuration de la base de données sur Hostinger

1. **Créer une base de données PostgreSQL**
   - Connectez-vous à votre panneau de contrôle Hostinger
   - Allez dans "Bases de données" → "PostgreSQL"
   - Créez une nouvelle base de données
   - Notez les informations de connexion (host, port, username, password, database name)

## Étape 3: Upload des fichiers

1. **Via File Manager ou FTP**
   - Uploadez tout le contenu du dossier `production` vers le dossier racine de votre domaine
   - Assurez-vous que la structure est :
     ```
     public_html/
     ├── public/ (fichiers statiques)
     ├── server/ (code serveur)
     ├── shared/ (fichiers partagés)
     ├── uploads/ (images)
     ├── index.js (point d'entrée)
     ├── package.json
     └── .env (à créer)
     ```

## Étape 4: Configuration des variables d'environnement

1. **Créer le fichier .env** dans le dossier racine :
   ```env
   # Base de données
   DATABASE_URL=postgresql://username:password@host:port/database_name
   PGHOST=votre_host_postgres
   PGPORT=5432
   PGDATABASE=nom_de_votre_base
   PGUSER=votre_utilisateur
   PGPASSWORD=votre_mot_de_passe

   # Stripe (clés de production)
   STRIPE_SECRET_KEY=sk_live_votre_cle_secrete_stripe
   VITE_STRIPE_PUBLIC_KEY=pk_live_votre_cle_publique_stripe

   # Production
   NODE_ENV=production
   PORT=3000
   ```

## Étape 5: Configuration Node.js sur Hostinger

1. **Dans le panneau de contrôle :**
   - Allez dans "Avancé" → "Node.js"
   - Sélectionnez la version Node.js (recommandé: 20.x)
   - Définissez le point d'entrée : `index.js`
   - Définissez le dossier racine de l'application
   - Cliquez sur "Créer"

2. **Variables d'environnement dans le panneau :**
   Ajoutez les mêmes variables que dans le fichier .env via l'interface Hostinger

## Étape 6: Installation des dépendances

1. **Via SSH :**
   ```bash
   ssh username@your-server.hostinger.com
   cd /home/username/domains/votre-domaine.com/public_html
   npm install --production
   ```

2. **Ou via l'interface Hostinger :**
   - Dans Node.js App, cliquez sur "Installer les dépendances"

## Étape 7: Configuration de la base de données

1. **Migrer la base de données :**
   ```bash
   npm run db:push
   ```

## Étape 8: Configuration du domaine

1. **Dans le panneau Hostinger :**
   - Allez dans "Domaines"
   - Configurez votre domaine pour pointer vers l'application Node.js
   - Activez HTTPS/SSL

## Étape 9: Test et lancement

1. **Démarrer l'application :**
   - Dans le panneau Node.js, cliquez sur "Démarrer"
   - Vérifiez que l'application fonctionne via votre domaine

2. **Tests à effectuer :**
   - Page d'accueil se charge
   - Connexion admin fonctionne
   - Upload d'images fonctionne
   - Base de données répond correctement

## Étape 10: Configuration des emails (optionnel)

Si votre site envoie des emails :
1. Configurez SMTP via Hostinger
2. Ajoutez les variables SMTP dans .env

## Dépannage courant

### Erreur de connexion à la base de données
- Vérifiez les informations de connexion dans .env
- Assurez-vous que PostgreSQL est activé sur votre plan

### Erreur 502 Bad Gateway
- Vérifiez que Node.js est bien configuré
- Regardez les logs d'erreur dans le panneau

### Images ne s'affichent pas
- Vérifiez les permissions du dossier uploads (755)
- Assurez-vous que les chemins sont corrects

### Stripe ne fonctionne pas
- Utilisez les clés de production Stripe
- Vérifiez que HTTPS est activé

## Contact Support

Pour toute assistance :
- Support Hostinger : via chat ou ticket
- Documentation Rose-d'Eden : consultez DEPLOY.md dans le dossier production

## Sauvegarde

N'oubliez pas de :
- Sauvegarder régulièrement votre base de données
- Garder une copie locale de vos fichiers
- Tester les mises à jour sur un environnement de test d'abord