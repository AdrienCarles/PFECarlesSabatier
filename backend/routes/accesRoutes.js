import express from 'express';
import accesController from '../controllers/accesController.js';
import validateSchema from '../middleware/validateSchema.js';
import accesSchema from '../validations/accesSchema.js';

const router = express.Router();

// GET /api/acces - Liste complète
router.get('/', 
    accesController.getAllAcces
);

// GET /api/acces/:usrId/:sesId - Détail
router.get('/:usrId/:sesId', 
    validateSchema(accesSchema.params, 'params'), 
    accesController.getAccesById
);

// POST /api/acces - Création (avec validation)
router.post('/', 
    validateSchema(accesSchema.create), 
    accesController.createAcces
);

// DELETE /api/acces/:usrId/:sesId - Suppression
router.delete('/:usrId/:sesId', 
    validateSchema(accesSchema.params, 'params'), 
    accesController.deleteAcces
);

// Relations spécifiques
router.get('/par-utilisateur/:usrId', 
    validateSchema(accesSchema.userParams, 'params'), 
    accesController.getUserAcces
);

export default router;