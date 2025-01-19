const express = require('express');
const cors = require('cors');
require('dotenv').config();
const AppError = require('./utils/AppError');
const errorHandler = require('./middleware/errorHandler');


const abonnementRoutes = require('./routes/abonnementRoutes');
const accesRoutes = require('./routes/accesRoutes');
const animationRoutes = require('./routes/animationRoutes');
const enfantRoutes = require('./routes/enfantRoutes');
const paiementRoutes = require('./routes/paiementRoutes');
const serieRoutes = require('./routes/serieRoutes');
const statistiqueRoutes = require('./routes/statistiqueRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Routes API
app.use('/api/abm', abonnementRoutes);    // Abonnements
app.use('/api/acces', accesRoutes);       // Accès
app.use('/api/ani', animationRoutes);     // Animations
app.use('/api/enfa', enfantRoutes);       // Enfants
app.use('/api/pai', paiementRoutes);      // Paiements
app.use('/api/ses', serieRoutes);         // Séries
app.use('/api/stat', statistiqueRoutes);  // Statistiques
app.use('/api/usr', userRoutes);          // Utilisateurs

// Handle undefined routes
app.all('*', (req, res, next) => {
  next(new AppError(404, `Route ${req.originalUrl} introuvable`));
});

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Serveur Express démarré sur http://localhost:${PORT}`);
});