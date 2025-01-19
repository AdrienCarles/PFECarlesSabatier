const express = require('express');
const router = express.Router();
const paiementController = require('../controllers/paiementController');

// GET /api/pai - Liste complète
router.get('/', paiementController.getAllPaiements);

// GET /api/pai/:paiementId - Détail
router.get('/:paiementId', paiementController.getPaiementById);

// POST /api/pai - Création
router.post('/', paiementController.createPaiement);

// PUT /api/pai/:paiementId - Mise à jour
router.put('/:paiementId', paiementController.updatePaiement);

// DELETE /api/pai/:paiementId - Suppression
router.delete('/:paiementId', paiementController.deletePaiement);

module.exports = router;