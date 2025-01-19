const express = require('express');
const router = express.Router();
const animationController = require('../controllers/animationController');
const validateSchema = require('../middleware/validateSchema');
const animationSchema = require('../validations/animationSchema');

// GET /api/ani - Liste complète
router.get('/', animationController.getAllAnimations);

// GET /api/ani/:animationId - Détail
router.get('/:animationId', animationController.getAnimationById);

// POST /api/ani - Création (avec validation)
router.post('/', validateSchema(animationSchema), animationController.createAnimation);

// PUT /api/ani/:animationId - Mise à jour (avec validation)
router.put('/:animationId', validateSchema(animationSchema), animationController.updateAnimation);

// DELETE /api/ani/:animationId - Suppression
router.delete('/:animationId', animationController.deleteAnimation);

// Relations spécifiques
router.get('/par-serie/:serieId', animationController.getAnimationsBySeries);

module.exports = router;