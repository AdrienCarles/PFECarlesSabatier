import express from 'express';
import statistiqueController from '../controllers/statistiqueController.js';
import validateSchema from '../middleware/validateSchema.js';
import statistiqueSchema from '../validations/statistiqueSchema.js';

const router = express.Router();

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

export default router;