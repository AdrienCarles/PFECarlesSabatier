import express from 'express';
import animationController from '../controllers/animationController.js';
import validateSchema from '../middleware/validateSchema.js';
import animationSchema from '../validations/animationSchema.js';

const router = express.Router();

// GET /api/ani - Liste complète
router.get('/', 
    animationController.getAllAnimations
);

// GET /api/ani/:aniId - Détail
router.get('/:aniId', 
    validateSchema(animationSchema.params, 'params'), 
    animationController.getAnimationById
);

// POST /api/ani - Création (avec validation)
router.post('/', 
    validateSchema(animationSchema.create), 
    animationController.createAnimation
);

// PUT /api/ani/:aniId - Mise à jour (avec validation)
router.put('/:aniId', 
    validateSchema(animationSchema.params, 'params'), 
    validateSchema(animationSchema.create), 
    animationController.updateAnimation
);

// DELETE /api/ani/:aniId - Suppression
router.delete('/:aniId', 
    validateSchema(animationSchema.params, 'params'), 
    animationController.deleteAnimation);

// Relations spécifiques
router.get('/par-serie/:sesId', 
    validateSchema(animationSchema.serieParams, 'params'), 
    animationController.getAnimationsBySeries
);

export default router;