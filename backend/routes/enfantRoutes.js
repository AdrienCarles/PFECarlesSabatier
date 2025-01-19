const express = require('express');
const router = express.Router();
const enfantController = require('../controllers/enfantController');
const validateSchema = require('../middleware/validateSchema');
const enfantSchema = require('../validations/enfantSchema');

// GET /api/enfa - Liste complète
router.get('/', enfantController.getAllEnfants);

// GET /api/enfa/:enfantId - Détail
router.get('/:enfantId', enfantController.getEnfantById);

// POST /api/enfa - Création
router.post('/', validateSchema(enfantSchema), enfantController.createEnfant);

// PUT /api/enfa/:enfantId - Mise à jour
router.put('/:enfantId', validateSchema(enfantSchema), enfantController.updateEnfant);

// DELETE /api/enfa/:enfantId - Suppression
router.delete('/:enfantId', enfantController.deleteEnfant);

// Routes de relations
router.get('/par-parent/:utilisateurId', enfantController.getEnfantsByParent);
router.get('/par-orthophoniste/:utilisateurId', enfantController.getEnfantsByOrthophoniste);

module.exports = router;