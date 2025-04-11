import express from 'express';
import userController from '../controllers/userController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/usr - Liste complète
router.get('/',
    authenticateToken, 
    authorizeRoles('admin'),
    userController.getAllUsers
);

// GET /api/usr/:usrId - Détail
router.get('/:usrId', 
    authenticateToken,
    userController.getUserById
);

// POST /api/usr - Création
router.post('/',  
    authenticateToken,
    authorizeRoles('admin', 'orthophoniste'),
    userController.createUser
);

// PUT /api/usr/:usrId - Mise à jour
router.put('/:usrId', 
    authenticateToken,
    userController.updateUser
);

// DELETE /api/usr/:usrId - Suppression
router.delete('/:usrId', 
    authenticateToken,    
    authorizeRoles('admin'),
    userController.deleteUser
);

// Relations spécifiques
router.get('/par-parent/:usrId/enfants', 
    userController.getParentChildren
);
router.get('/par-orthophoniste/:usrId/enfants', 
    userController.getOrthophonisteChildren
);

export default router;