const express = require('express');
const router = express.Router();
const enfantController = require('../controllers/enfantController');
const validateSchema = require('../middleware/validateSchema');
const enfantSchema = require('../validations/enfantSchema');

// GET /api/enfa - Liste complète
router.get('/', 
    enfantController.getAllEnfants
);

// GET /api/enfa/:enfaId - Détail
router.get('/:enfaId', 
    validateSchema(enfantSchema.params, 'params'), 
    enfantController.getEnfantById
);

// POST /api/enfa - Création
router.post('/', 
    validateSchema(enfantSchema.create), 
    enfantController.createEnfant
);

// PUT /api/enfa/:enfaId - Mise à jour
router.put('/:enfaId', 
    validateSchema(enfantSchema.params, 'params'), 
    validateSchema(enfantSchema.update),
    enfantController.updateEnfant
);

// DELETE /api/enfa/:enfaId - Suppression
router.delete('/:enfaId', 
    validateSchema(enfantSchema.params, 'params'), 
    enfantController.deleteEnfant
);

// Routes de relations
router.get('/par-parent/:usrId', 
    validateSchema(enfantSchema.userParams, 'params'), 
    enfantController.getEnfantsByParent
);
router.get('/par-orthophoniste/:usrId', 
    validateSchema(enfantSchema.userParams, 'params'), 
    enfantController.getEnfantsByOrthophoniste
);

module.exports = router;