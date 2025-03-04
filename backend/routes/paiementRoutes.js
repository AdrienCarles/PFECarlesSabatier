import express from 'express';
import paiementController from '../controllers/paiementController.js';
import validateSchema from '../middleware/validateSchema.js';
import paiementSchema from '../validations/paiementSchema.js';

const router = express.Router();

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

export default router;