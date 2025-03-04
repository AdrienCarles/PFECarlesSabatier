import express from 'express';
import userController from '../controllers/userController.js';
import validateSchema from '../middleware/validateSchema.js';
import userSchema from '../validations/userSchema.js';

const router = express.Router();

// GET /api/utilisateurs - Liste complète
router.get('/', 
    userController.getAllUsers
);

// GET /api/utilisateurs/:usrId - Détail
router.get('/:usrId', 
    validateSchema(userSchema.params, 'params'),
    userController.getUserById
);

// POST /api/utilisateurs - Création
router.post('/',  
    validateSchema(userSchema.create),
    userController.createUser
);

// PUT /api/utilisateurs/:usrId - Mise à jour
router.put('/:usrId', 
    validateSchema(userSchema.params, 'params'),
    validateSchema(userSchema.create),
    userController.updateUser
);

// DELETE /api/utilisateurs/:usrId - Suppression
router.delete('/:usrId', 
    validateSchema(userSchema.params, 'params'),
    userController.deleteUser
);

// Relations spécifiques
router.get('/par-parent/:usrId/enfants', 
    validateSchema(userSchema.params, 'params'),
    userController.getParentChildren
);
router.get('/par-orthophoniste/:usrId/enfants', 
    validateSchema(userSchema.params, 'params'),
    userController.getOrthophonisteChildren
);

export default router;