import express from 'express';
import paiementController from '../controllers/paiementController.js';
const router = express.Router();

// GET /api/pai - Liste complète
router.get('/', 
    paiementController.getAllPaiements
);

// GET /api/pai/:paiId - Détail
router.get('/:paiId',
    paiementController.getPaiementById
);

// POST /api/pai - Création
router.post('/', 
    paiementController.createPaiement
);

// PUT /api/pai/:paiId - Mise à jour
router.put('/:paiId', 
    paiementController.updatePaiement
);

// DELETE /api/pai/:paiId - Suppression
router.delete('/:paiId', 
    paiementController.deletePaiement
);

export default router;