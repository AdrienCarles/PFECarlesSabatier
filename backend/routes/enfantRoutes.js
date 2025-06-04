import express from 'express';
import enfantController from '../controllers/enfantController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/enfa - Liste complète
router.get('/', 
    authenticateToken,
    enfantController.getAllEnfants
);

// GET /api/enfa/enfants/:orthophonisteId - VUE ENFANTS avec leurs parents
router.get('/enfants/:orthophonisteId', 
    authenticateToken,
    authorizeRoles('admin', 'orthophoniste'),
    enfantController.getEnfantsByOrthophoniste
);

// GET /api/enfa/parents/:orthophonisteId - VUE PARENTS avec leurs enfants
router.get('/parents/:orthophonisteId', 
    authenticateToken,
    authorizeRoles('admin', 'orthophoniste'),
    enfantController.getParentsByOrthophoniste
);

// GET /api/enfa/:enfaId - Détail d'un enfant
router.get('/:enfaId', 
    authenticateToken,
    enfantController.getEnfantById
);

// POST /api/enfa - Création d'un enfant seul (pour parent existant)
router.post('/', 
    authenticateToken,
    authorizeRoles('admin', 'orthophoniste'),
    enfantController.createEnfant
);

// PUT /api/enfa/:enfaId - Mise à jour
router.put('/:enfaId', 
    authenticateToken,
    enfantController.updateEnfant
);

// DELETE /api/enfa/:enfaId - Suppression
router.delete('/:enfaId', 
    authenticateToken,
    enfantController.deleteEnfant
);

export default router;