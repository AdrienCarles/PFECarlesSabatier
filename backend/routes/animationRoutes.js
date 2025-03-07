import express from 'express';
import animationController from '../controllers/animationController.js';

const router = express.Router();

// GET /api/ani - Liste complète
router.get('/', 
    animationController.getAllAnimations
);

// GET /api/ani/:aniId - Détail
router.get('/:aniId', 
    animationController.getAnimationById
);

// POST /api/ani - Création (avec validation)
router.post('/', 
    animationController.createAnimation
);

// PUT /api/ani/:aniId - Mise à jour (avec validation)
router.put('/:aniId', 
    animationController.updateAnimation
);

// DELETE /api/ani/:aniId - Suppression
router.delete('/:aniId', 
    animationController.deleteAnimation);

// Relations spécifiques
router.get('/par-serie/:sesId', 
    animationController.getAnimationsBySeries
);

export default router;