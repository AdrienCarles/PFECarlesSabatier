const express = require('express');
const router = express.Router();
const serieController = require('../controllers/serieController');

// GET /api/ses - Liste complète
router.get('/', serieController.getAllSeries);

// GET /api/ses/:serieId - Détail
router.get('/:serieId', serieController.getSerieById);

// POST /api/ses - Création
router.post('/', serieController.createSerie);

// PUT /api/ses/:serieId - Mise à jour
router.put('/:serieId', serieController.updateSerie);

// DELETE /api/ses/:serieId - Suppression
router.delete('/:serieId', serieController.deleteSerie);

module.exports = router;