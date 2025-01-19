const express = require('express');
const router = express.Router();
const serieController = require('../controllers/serieController');
const validateSchema = require('../middleware/validateSchema');
const serieSchema = require('../validations/serieSchema');


// GET /api/ses - Liste complète
router.get('/', serieController.getAllSeries);

// GET /api/ses/:serieId - Détail
router.get('/:serieId', serieController.getSerieById);

// POST /api/ses - Création
router.post('/', validateSchema(serieSchema), serieController.createSerie);

// PUT /api/ses/:serieId - Mise à jour
router.put('/:serieId', validateSchema(serieSchema), serieController.updateSerie);

// DELETE /api/ses/:serieId - Suppression
router.delete('/:serieId', serieController.deleteSerie);

module.exports = router;