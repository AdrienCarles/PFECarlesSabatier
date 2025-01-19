const express = require('express');
const router = express.Router();
const accesController = require('../controllers/accesController');
const validateSchema = require('../middleware/validateSchema');
const accesSchema = require('../validations/accesSchema');

// GET /api/acces - Liste complète
router.get('/', accesController.getAllAcces);

// GET /api/acces/:utilisateurId/:serieId - Détail
router.get('/:utilisateurId/:serieId', accesController.getAccesById);

// POST /api/acces - Création (avec validation)
router.post('/', validateSchema(accesSchema), accesController.createAcces);

// DELETE /api/acces/:utilisateurId/:serieId - Suppression
router.delete('/:utilisateurId/:serieId', accesController.deleteAcces);

// Relations spécifiques
router.get('/par-utilisateur/:utilisateurId', accesController.getUserAcces);

module.exports = router;