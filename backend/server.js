import { fileURLToPath } from 'url';
import path from 'path';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

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

// Configuration pour reverse proxy (très important)
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1); // Faire confiance au premier proxy
}

app.use(globalLimiter);

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

// Health check endpoint pour le reverse proxy
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

const PORT = process.env.PORT || 5000;

// Configuration simple - le reverse proxy gère HTTPS
app.listen(PORT, () => {
  const env = process.env.NODE_ENV || 'development';

  if (process.env.NODE_ENV === 'production') {
    console.log('HTTPS géré par le reverse proxy');
  }
  
  initCronJobs();
});