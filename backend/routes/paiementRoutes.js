const express = require('express');
const router = express.Router();
const paiementController = require('../controllers/paiementController');
const validateSchema = require('../middleware/validateSchema');
const paiementSchema = require('../validations/paiementSchema');

// GET /api/pai - Liste complète
router.get('/', 
    paiementController.getAllPaiements
);

// GET /api/pai/:paiId - Détail
router.get('/:paiId',
    validateSchema(paiementSchema.params, 'params'),
    paiementController.getPaiementById
);

// POST /api/pai - Création
router.post('/', 
    validateSchema(paiementSchema.create),
    paiementController.createPaiement
);

// PUT /api/pai/:paiId - Mise à jour
router.put('/:paiId', 
    validateSchema(paiementSchema.params, 'params'),
    validateSchema(paiementSchema.create),
    paiementController.updatePaiement
);

// DELETE /api/pai/:paiId - Suppression
router.delete('/:paiId', 
    validateSchema(paiementSchema.params, 'params'),
    paiementController.deletePaiement
);

module.exports = router;