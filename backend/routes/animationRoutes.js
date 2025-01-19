const express = require('express');
const router = express.Router();
const animationController = require('../controllers/animationController');
const validateSchema = require('../middleware/validateSchema');
const animationSchema = require('../validations/animationSchema');

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

module.exports = router;