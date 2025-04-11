import express from 'express';
import userController from '../controllers/userController.js';

const router = express.Router();

// GET /api/usr - Liste complète
router.get('/', 
    userController.getAllUsers
);

// GET /api/usr/:usrId - Détail
router.get('/:id', 
    userController.getUserById
);

// POST /api/usr - Création
router.post('/',  
    userController.createUser
);

// PUT /api/usr/:usrId - Mise à jour
router.put('/:usrId', 
    userController.updateUser
);

// DELETE /api/usr/:usrId - Suppression
router.delete('/:usrId', 
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