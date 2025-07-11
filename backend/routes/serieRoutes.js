import express from 'express';
import serieController from '../controllers/serieController.js';
import {
  authenticateToken,
  authorizeRoles,
} from '../middleware/authMiddleware.js';
import { uploadSeriesIcon } from '../middleware/uploadFormatMiddleware.js';

const router = express.Router();

// GET /api/ses - Liste complète
router.get(
  '/',
  authenticateToken,
  authorizeRoles('admin', 'orthophoniste'),
  serieController.getAllSeries
);

// GET /api/ses/actives - Séries actives
router.get(
  '/actives',
  authenticateToken,
  authorizeRoles('admin', 'orthophoniste'),
  serieController.getActivesSeries
);

// GET /api/ses/:sesId - Détail
router.get('/:sesId', authenticateToken, serieController.getSerieById);

// GET /api/ses/enfant/:enfantId - Séries pour un enfant
router.get(
  '/enfant/:enfantId',
  authenticateToken,
  authorizeRoles('orthophoniste', 'admin'),
  serieController.getEnfantSeries
);

// GET /api/ses/:sesId/animations - Récupérer les animations d'une série
router.get(
  '/:sesId/animations',
  authenticateToken,
  authorizeRoles('admin', 'orthophoniste', 'parent'),
  serieController.getSerieAnimations
);

// POST /api/ses - Création
router.post(
  '/',
  authenticateToken,
  authorizeRoles('admin', 'orthophoniste'),
  uploadSeriesIcon,
  serieController.createSerie
);

// PUT /api/ses/:sesId - Mise à jour
router.put(
  '/:sesId',
  authenticateToken,
  uploadSeriesIcon,
  serieController.updateSerie
);

// PUT /api/ses/enfant/:enfantId - Mise à jour des séries assignées à un enfant
router.put(
  '/enfant/:enfantId',
  authenticateToken,
  authorizeRoles('orthophoniste', 'admin'),
  serieController.updateEnfantSeries
);

// DELETE /api/ses/:sesId - Suppression
router.delete(
  '/:sesId',
  authenticateToken,
  authorizeRoles('admin'),
  serieController.deleteSerie
);

// PUT /api/ses/:sesId/valider - Validation d'une série par un admin
router.put(
  '/:sesId/valider',
  authenticateToken,
  authorizeRoles('admin'),
  serieController.validerSerie
);

export default router;
