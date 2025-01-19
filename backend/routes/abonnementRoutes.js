const express = require('express');
const router = express.Router();
const abonnementController = require('../controllers/abonnementController');

// GET /api/abm - Liste complète
router.get('/', abonnementController.getAllAbonnements);

// GET /api/abm/:abonnementId - Détail
router.get('/:abonnementId', abonnementController.getAbonnementById);

// POST /api/abm - Création
router.post('/', abonnementController.createAbonnement);

// PUT /api/abm/:abonnementId - Mise à jour
router.put('/:abonnementId', abonnementController.updateAbonnement);

// DELETE /api/abm/:abonnementId - Suppression
router.delete('/:abonnementId', abonnementController.deleteAbonnement);

// Relations spécifiques
router.get('/par-utilisateur/:utilisateurId', abonnementController.getAbonnementsByUser);

module.exports = router;