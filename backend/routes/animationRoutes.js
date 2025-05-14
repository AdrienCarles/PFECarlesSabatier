import express from 'express';
import {
  authenticateToken,
  authorizeRoles,
} from '../middleware/authMiddleware.js';
import animationController from '../controllers/animationController.js';
import { uploadAnimationFiles } from '../middleware/uploadAnimation.js';

const router = express.Router();

// GET /api/ani - Liste complète
router.get('/', authenticateToken, animationController.getAllAnimations);

// GET /api/ani/:aniId - Détail
router.get('/:aniId', authenticateToken, animationController.getAnimationById);

// POST /api/ani - Création (avec validation)
router.post(
  '/',
  authenticateToken,
  authorizeRoles('admin', 'orthophoniste'),
  uploadAnimationFiles, // Notre nouveau middleware d'upload
  animationController.createAnimation
);

// PUT /api/ani/:aniId - Mise à jour (avec validation)
router.put('/:aniId', authenticateToken, animationController.updateAnimation);

// DELETE /api/ani/:id - Suppression
router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles('admin', 'orthophoniste'),
  animationController.deleteAnimation
);

// Relations spécifiques
// GET /api/bySerie/:sesId - Récupérer les animations par série
router.get(
  '/bySerie/:sesId',
  authenticateToken,
  animationController.getAnimationsBySerie
);

export default router;
