const express = require('express');
const router = express.Router();
const accesController = require('../controllers/accesController');
const validateSchema = require('../middleware/validateSchema');
const accesSchema = require('../validations/accesSchema');

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

module.exports = router;