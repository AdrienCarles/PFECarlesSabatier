import express from 'express';
import serieController from '../controllers/serieController.js';
import validateSchema from '../middleware/validateSchema.js';
import serieSchema from '../validations/serieSchema.js';

const router = express.Router();

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

export default router;