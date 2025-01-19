const express = require('express');
const router = express.Router();
const statistiqueController = require('../controllers/statistiqueController');
const validateSchema = require('../middleware/validateSchema');
const statistiqueSchema = require('../validations/statistiqueSchema');

// GET /api/stat - Liste complète
router.get('/', 
    statistiqueController.getAllStats
);

// GET /api/stat/:statId - Détail
router.get('/:statId', 
    validateSchema(statistiqueSchema.params, 'params'),
    statistiqueController.getStatById
);

// POST /api/stat - Création
router.post('/', 
    validateSchema(statistiqueSchema.create),
    statistiqueController.createStat
);

// PUT /api/stat/:statId - Mise à jour
router.put('/:statId', 
    validateSchema(statistiqueSchema.params, 'params'),
    validateSchema(statistiqueSchema.create),
    statistiqueController.updateStat
);

// Relations spécifiques
router.get('/par-enfant/:enfaId', 
    validateSchema(statistiqueSchema.enfantParams, 'params'),
    statistiqueController.getStatsByEnfant
);
router.get('/par-serie/:sesId', 
    validateSchema(statistiqueSchema.serieParams, 'params'),
    statistiqueController.getStatsBySerie
);

module.exports = router;