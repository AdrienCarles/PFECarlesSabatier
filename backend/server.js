import { fileURLToPath } from 'url';
import path from 'path';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import https from 'https';
import http from 'http';
import fs from 'fs';

import { globalLimiter } from './middleware/rateLimiter.js';
import initCronJobs from './cron/index.js';

import authRoutes from './routes/authRoutes.js';
import abonnementRoutes from './routes/abonnementRoutes.js';
import accesRoutes from './routes/accesRoutes.js';
import animationRoutes from './routes/animationRoutes.js';
import enfantRoutes from './routes/enfantRoutes.js';
import serieRoutes from './routes/serieRoutes.js';
import statistiqueRoutes from './routes/statistiqueRoutes.js';
import userRoutes from './routes/userRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

app.use(globalLimiter);

if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
}

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/abm', abonnementRoutes);
app.use('/api/acces', accesRoutes);
app.use('/api/ani', animationRoutes);
app.use('/api/enfa', enfantRoutes);
app.use('/api/ses', serieRoutes);
app.use('/api/stat', statistiqueRoutes);
app.use('/api/usr', userRoutes);

// app.all('*', (req, res, next) => {
//   next(new AppError(404, `Route ${req.originalUrl} introuvable`));
// });

// // Global error handler
// app.use(errorHandler);

app.get('/', (req, res) => {
  res.send('Le serveur backend fonctionne 🚀');
});

const PORT = process.env.PORT || 5000;

// Configuration du serveur en fonction de l'environnement
if (process.env.NODE_ENV === 'production') {
  // Production: Utiliser HTTPS avec certificats SSL réels
  try {
    const options = {
      key: fs.readFileSync(process.env.SSL_KEY_PATH || '/etc/ssl/private/private.key'),
      cert: fs.readFileSync(process.env.SSL_CERT_PATH || '/etc/ssl/certs/certificate.crt'),
      ca: process.env.SSL_CA_PATH ? fs.readFileSync(process.env.SSL_CA_PATH) : undefined
    };

    // Serveur HTTPS
    https.createServer(options, app).listen(PORT, () => {
      console.log(`Serveur HTTPS (production) démarré sur port ${PORT}`);
      initCronJobs();
    });

    // Serveur HTTP pour redirection
    http.createServer(app).listen(PORT, () => {
      console.log(`Serveur HTTP (redirection) démarré sur port ${PORT}`);
    });

  } catch (error) {
    console.error('Erreur lors du chargement des certificats SSL:', error.message);
    console.log('Démarrage en HTTP uniquement (non recommandé pour la production)');
    
    app.listen(PORT, () => {
      console.log(`Serveur HTTP démarré sur port ${PORT} (PRODUCTION - SSL requis!)`);
      initCronJobs();
    });
  }
} else {
  // Développement: HTTP simple
  app.listen(PORT, () => {
    console.log(`Serveur Express (développement) démarré sur http://localhost:${PORT}`);
    initCronJobs();
  });
}