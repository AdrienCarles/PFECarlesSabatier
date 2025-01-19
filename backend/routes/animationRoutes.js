const express = require('express');
const router = express.Router();
const animationController = require('../controllers/animationController');

// GET /api/ani - Liste complète
router.get('/', animationController.getAllAnimations);

// GET /api/ani/:animationId - Détail
router.get('/:animationId', animationController.getAnimationById);

// POST /api/ani - Création
router.post('/', animationController.createAnimation);

// PUT /api/ani/:animationId - Mise à jour
router.put('/:animationId', animationController.updateAnimation);

// DELETE /api/ani/:animationId - Suppression
router.delete('/:animationId', animationController.deleteAnimation);

// Relations spécifiques
router.get('/par-serie/:serieId', animationController.getAnimationsBySeries);

module.exports = router;
