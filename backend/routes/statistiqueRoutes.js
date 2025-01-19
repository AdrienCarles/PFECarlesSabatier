const express = require('express');
const router = express.Router();
const statistiqueController = require('../controllers/statistiqueController');
const validateSchema = require('../middleware/validateSchema');
const statistiqueSchema = require('../validations/statistiqueSchema');

// GET /api/stat - Liste complète
router.get('/', statistiqueController.getAllStats);

// GET /api/stat/:statistiqueId - Détail
router.get('/:statistiqueId', statistiqueController.getStatById);

// POST /api/stat - Création
router.post('/', validateSchema(statistiqueSchema), statistiqueController.createStat);

// PUT /api/stat/:statistiqueId - Mise à jour
router.put('/:statistiqueId', validateSchema(statistiqueSchema), statistiqueController.updateStat);

// Relations spécifiques
router.get('/par-enfant/:enfantId', statistiqueController.getStatsByEnfant);
router.get('/par-serie/:serieId', statistiqueController.getStatsBySerie);

module.exports = router;