import express from 'express';
import statistiqueController from '../controllers/statistiqueController.js';

const router = express.Router();

// GET /api/stat - Liste complète
router.get('/', 
    statistiqueController.getAllStats
);

// GET /api/stat/:statId - Détail
router.get('/:statId', 
    statistiqueController.getStatById
);

// POST /api/stat - Création
router.post('/', 
    statistiqueController.createStat
);

// PUT /api/stat/:statId - Mise à jour
router.put('/:statId', 
    statistiqueController.updateStat
);

// Relations spécifiques
router.get('/par-enfant/:enfaId', 
    statistiqueController.getStatsByEnfant
);
router.get('/par-serie/:sesId', 
    statistiqueController.getStatsBySerie
);

export default router;