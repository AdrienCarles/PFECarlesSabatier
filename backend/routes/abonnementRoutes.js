import express from 'express';
import abonnementController from '../controllers/abonnementController.js';

const router = express.Router();

// GET /api/abm - Liste complète
router.get('/', 
    abonnementController.getAllAbonnements
);

// GET /api/abm/:abmId - Détail
router.get('/:abmId', 
    abonnementController.getAbonnementById
);

// POST /api/abm - Création
router.post('/', 
    abonnementController.createAbonnement
);

// PUT /api/abm/:abmId - Mise à jour (avec validation)
router.put('/:abmId', 
    abonnementController.updateAbonnement
);

// DELETE /api/abm/:abmId - Suppression
router.delete('/:abmId', 
    abonnementController.deleteAbonnement
);

// Relations spécifiques
router.get('/par-utilisateur/:usrId', 
    abonnementController.getAbonnementsByUser
);

export default router;