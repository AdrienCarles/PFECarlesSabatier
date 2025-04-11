import express from 'express';
import {
    authenticateToken,
    authorizeRoles,
  } from '../middleware/authMiddleware.js';
import animationController from '../controllers/animationController.js';

const router = express.Router();

// GET /api/ani - Liste complète
router.get('/', 
    authenticateToken,
    animationController.getAllAnimations
);

// GET /api/ani/:aniId - Détail
router.get('/:aniId', 
    authenticateToken,
    animationController.getAnimationById
);

// POST /api/ani - Création (avec validation)
router.post('/', 
    authenticateToken,
    animationController.createAnimation
);

// PUT /api/ani/:aniId - Mise à jour (avec validation)
router.put('/:aniId', 
    authenticateToken,
    animationController.updateAnimation
);

// DELETE /api/ani/:aniId - Suppression
router.delete('/:aniId', 
    authenticateToken,
    animationController.deleteAnimation);

// Relations spécifiques
// DELETE /api/bySerie/:sesId - Suppression
router.get('/bySerie/:sesId', 
    authenticateToken,
    animationController.getAnimationsBySerie
);

export default router;