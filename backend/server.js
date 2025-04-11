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
import paiementRoutes from './routes/paiementRoutes.js';
import serieRoutes from './routes/serieRoutes.js';
import statistiqueRoutes from './routes/statistiqueRoutes.js';
import userRoutes from './routes/userRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

app.use(globalLimiter);

app.use(
  cors({
    origin: process.env.FRONTEND_URL, // This uses http://localhost:3000 from your .env
    credentials: true, // Important for cookies/authentication
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
app.use('/api/pai', paiementRoutes);
app.use('/api/ses', serieRoutes);
app.use('/api/stat', statistiqueRoutes);
app.use('/api/usr', userRoutes);

// Handle undefined routes
// app.all('*', (req, res, next) => {
//   next(new AppError(404, `Route ${req.originalUrl} introuvable`));
// });

// // Global error handler
// app.use(errorHandler);

app.get('/', (req, res) => {
  res.send('Le serveur backend fonctionne 🚀');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Serveur Express démarré sur http://localhost:${PORT}`);
  initCronJobs();
});
