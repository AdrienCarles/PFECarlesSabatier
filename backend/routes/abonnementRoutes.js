const express = require('express');
const router = express.Router();
const abonnementController = require('../controllers/abonnementController');
const validateSchema = require('../middleware/validateSchema');
const abonnementSchema = require('../validations/abonnementSchema');

// GET /api/abm - Liste complète
router.get('/', 
    abonnementController.getAllAbonnements
);

// GET /api/abm/:abmId - Détail
router.get('/:abmId', 
    validateSchema(abonnementSchema.params, 'params'), 
    abonnementController.getAbonnementById
);

// POST /api/abm - Création
router.post('/', 
    validateSchema(abonnementSchema.create), 
    abonnementController.createAbonnement
);

// PUT /api/abm/:abmId - Mise à jour (avec validation)
router.put('/:abmId', 
    validateSchema(abonnementSchema.params, 'params'),
    validateSchema(abonnementSchema.create),
    abonnementController.updateAbonnement
);

// DELETE /api/abm/:abmId - Suppression
router.delete('/:abmId', 
    validateSchema(abonnementSchema.params, 'params'), 
    abonnementController.deleteAbonnement
);

// Relations spécifiques
router.get('/par-utilisateur/:usrId', 
    validateSchema(abonnementSchema.userParams, 'params'), 
    abonnementController.getAbonnementsByUser
);

module.exports = router;