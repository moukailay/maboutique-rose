import express from 'express';
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
  console.log(`🌹 Rose-d'Eden server running on port ${PORT}`);
});
