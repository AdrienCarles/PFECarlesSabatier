const express = require('express');
const router = express.Router();
const serieController = require('../controllers/serieController');
const validateSchema = require('../middleware/validateSchema');
const serieSchema = require('../validations/serieSchema');


// GET /api/ses - Liste complète
router.get('/', 
    serieController.getAllSeries
);

// GET /api/ses/:sesId - Détail
router.get('/:sesId', 
    validateSchema(serieSchema.params, 'params'),
    serieController.getSerieById
);

// POST /api/ses - Création
router.post('/', 
    validateSchema(serieSchema.create),
    serieController.createSerie
);

// PUT /api/ses/:sesId - Mise à jour
router.put('/:sesId', 
    validateSchema(serieSchema.params, 'params'),
    validateSchema(serieSchema.create), 
    serieController.updateSerie
);

// DELETE /api/ses/:sesId - Suppression
router.delete('/:sesId', 
    validateSchema(serieSchema.params, 'params'),
    serieController.deleteSerie
);

module.exports = router;