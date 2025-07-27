import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🔨 Building Rose-d\'Eden for production...');

// 1. Build the frontend
console.log('📦 Building frontend...');
execSync('npm run build', { stdio: 'inherit' });

// 2. Create production server structure
console.log('🗂️ Creating production structure...');
const prodDir = './production';
const serverDir = './production/server';

// Clean and create directories
if (fs.existsSync(prodDir)) {
  fs.rmSync(prodDir, { recursive: true });
}
fs.mkdirSync(prodDir);
fs.mkdirSync(serverDir);
fs.mkdirSync('./production/uploads');

// 3. Copy necessary files
console.log('📋 Copying files...');

// Copy built client files
if (fs.existsSync('./dist/public')) {
  fs.cpSync('./dist/public', './production/public', { recursive: true });
}

// Copy server files
fs.cpSync('./server', serverDir, { recursive: true });

// Copy shared files
fs.cpSync('./shared', './production/shared', { recursive: true });

// Copy package files
fs.copyFileSync('./package.json', './production/package.json');
fs.copyFileSync('./package-lock.json', './production/package-lock.json');

// Copy database config
fs.copyFileSync('./drizzle.config.ts', './production/drizzle.config.ts');

// Copy uploads if they exist
if (fs.existsSync('./uploads')) {
  fs.cpSync('./uploads', './production/uploads', { recursive: true });
}

// 4. Create production start script
console.log('📝 Creating start script...');
const startScript = `import express from 'express';
import path from 'path';
import { registerRoutes } from './server/routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static('public'));

// Register API routes
const server = await registerRoutes(app);

// Catch-all handler for SPA
app.get('*', (req, res) => {
  res.sendFile(path.resolve('public/index.html'));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(\`🌹 Rose-d'Eden server running on port \${PORT}\`);
});
`;

fs.writeFileSync('./production/index.js', startScript);

// 5. Create .env template
console.log('🔧 Creating environment template...');
const envTemplate = `# Database Configuration
DATABASE_URL=your_postgresql_connection_string
PGHOST=your_db_host
PGPORT=5432
PGDATABASE=your_db_name
PGUSER=your_db_user
PGPASSWORD=your_db_password

# Stripe Configuration
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
VITE_STRIPE_PUBLIC_KEY=pk_live_your_stripe_public_key

# Production Settings
NODE_ENV=production
PORT=3000
`;

fs.writeFileSync('./production/.env.example', envTemplate);

// 6. Create deployment guide
const deployGuide = `# Déploiement Rose-d'Eden sur Hostinger

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
`;

fs.writeFileSync('./production/DEPLOY.md', deployGuide);

console.log('✅ Build terminé ! Votre site est prêt dans le dossier "production"');
console.log('📖 Consultez production/DEPLOY.md pour les instructions de déploiement');