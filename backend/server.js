const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json()); // Permet de lire les JSON envoyés depuis le frontend

// Route par défaut
app.get('/', (req, res) => {
  res.send('Le serveur backend fonctionne 🚀');
});

// Port par défaut ou celui défini dans le fichier .env
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Serveur Express démarré sur http://localhost:${PORT}`);
});
