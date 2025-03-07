import express from 'express';
import accesController from '../controllers/accesController.js';

const router = express.Router();

// GET /api/acces - Liste complète
router.get('/', 
    accesController.getAllAcces
);

// GET /api/acces/:usrId/:sesId - Détail
router.get('/:usrId/:sesId', 
    accesController.getAccesById
);

// POST /api/acces - Création (avec validation)
router.post('/', 
    accesController.createAcces
);

// DELETE /api/acces/:usrId/:sesId - Suppression
router.delete('/:usrId/:sesId', 
    accesController.deleteAcces
);

// Relations spécifiques
router.get('/par-utilisateur/:usrId', 
    accesController.getUserAcces
);

export default router;