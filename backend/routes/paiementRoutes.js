const express = require('express');
const router = express.Router();
const paiementController = require('../controllers/paiementController');
const validateSchema = require('../middleware/validateSchema');
const paiementSchema = require('../validations/paiementSchema');

// GET /api/pai - Liste complète
router.get('/', paiementController.getAllPaiements);

// GET /api/pai/:paiementId - Détail
router.get('/:paiementId', paiementController.getPaiementById);

// POST /api/pai - Création
router.post('/', validateSchema(paiementSchema), paiementController.createPaiement);

// PUT /api/pai/:paiementId - Mise à jour
router.put('/:paiementId', validateSchema(paiementSchema), paiementController.updatePaiement);

// DELETE /api/pai/:paiementId - Suppression
router.delete('/:paiementId', paiementController.deletePaiement);

module.exports = router;