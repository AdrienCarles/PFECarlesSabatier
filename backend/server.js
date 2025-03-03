const express = require('express');
const cors = require('cors');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const AppError = require('./utils/AppError');
const errorHandler = require('./middleware/errorHandler');
const { globalLimiter } = require('./middleware/rateLimiter');
const initCronJobs = require('./cron');

const authRoutes = require('./routes/authRoutes');
const abonnementRoutes = require('./routes/abonnementRoutes');
const accesRoutes = require('./routes/accesRoutes');
const animationRoutes = require('./routes/animationRoutes');
const enfantRoutes = require('./routes/enfantRoutes');
const paiementRoutes = require('./routes/paiementRoutes');
const serieRoutes = require('./routes/serieRoutes');
const statistiqueRoutes = require('./routes/statistiqueRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(globalLimiter);
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // URL de votre frontend
    credentials: true, // Autoriser les cookies cross-origin
  })
);

app.use(express.json());
app.use(cookieParser());

// Routes API
app.use('/api/auth', authRoutes); // Authentification
app.use('/api/abm', abonnementRoutes); // Abonnements
app.use('/api/acces', accesRoutes); // Accès
app.use('/api/ani', animationRoutes); // Animations
app.use('/api/enfa', enfantRoutes); // Enfants
app.use('/api/pai', paiementRoutes); // Paiements
app.use('/api/ses', serieRoutes); // Séries
app.use('/api/stat', statistiqueRoutes); // Statistiques
app.use('/api/usr', userRoutes); // Utilisateurs

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
