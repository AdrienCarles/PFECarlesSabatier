import express from 'express';
import serieController from '../controllers/serieController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';
import { uploadSeriesIcon } from '../middleware/uploadMiddleware.js';


const router = express.Router();

// GET /api/ses - Liste complète
router.get('/', 
    serieController.getAllSeries
);

// GET /api/ses/:sesId - Détail
router.get('/:sesId', 
    serieController.getSerieById
);

// POST /api/ses - Création
router.post('/', 
    authenticateToken, 
    authorizeRoles('admin', 'orthophoniste'),
    uploadSeriesIcon,
    serieController.createSerie
  );

// PUT /api/ses/:sesId - Mise à jour
router.put('/:sesId', 
    serieController.updateSerie
);

// DELETE /api/ses/:sesId - Suppression
router.delete('/:sesId', 
    serieController.deleteSerie
);

export default router;