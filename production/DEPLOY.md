# Déploiement Rose-d'Eden sur Hostinger

## Étapes de déploiement :

1. **Upload des fichiers**
   - Uploadez tout le contenu du dossier 'production' vers votre serveur Hostinger
   - Assurez-vous que les permissions sont correctes (755 pour les dossiers, 644 pour les fichiers)

2. **Configuration de la base de données**
   - Créez une base de données PostgreSQL dans votre panneau Hostinger
   - Copiez .env.example vers .env et remplissez les variables

3. **Installation des dépendances**
   - Connectez-vous en SSH à votre serveur
   - Naviguez vers le dossier de votre site
   - Exécutez: npm install --production

4. **Configuration du serveur**
   - Configurez Node.js dans votre panneau Hostinger
   - Pointez vers le fichier index.js
   - Définissez les variables d'environnement

5. **Migration de la base de données**
   - Exécutez: npm run db:push

## Fichiers importants :
- index.js : Point d'entrée du serveur
- .env : Variables d'environnement (à créer)
- package.json : Dépendances Node.js
- public/ : Fichiers statiques du frontend
- server/ : Code du serveur backend
- uploads/ : Images uploadées

## Support :
Pour toute question, contactez l'équipe de développement.
