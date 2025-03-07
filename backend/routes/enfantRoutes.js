import express from 'express';
import enfantController from '../controllers/enfantController.js';
const router = express.Router();

// GET /api/enfa - Liste complète
router.get('/', 
    enfantController.getAllEnfants
);

// GET /api/enfa/:enfaId - Détail
router.get('/:enfaId', 
    enfantController.getEnfantById
);

// POST /api/enfa - Création
router.post('/', 
    enfantController.createEnfant
);

// PUT /api/enfa/:enfaId - Mise à jour
router.put('/:enfaId', 
    enfantController.updateEnfant
);

// DELETE /api/enfa/:enfaId - Suppression
router.delete('/:enfaId', 
    enfantController.deleteEnfant
);

// Routes de relations
router.get('/par-parent/:usrId', 
    enfantController.getEnfantsByParent
);

router.get('/par-orthophoniste/:usrId', 
    enfantController.getEnfantsByOrthophoniste
);

export default router;