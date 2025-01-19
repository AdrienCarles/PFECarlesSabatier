const express = require('express');
const router = express.Router();
const enfantController = require('../controllers/enfantController');

// GET /api/enfa - Liste complète
router.get('/', enfantController.getAllEnfants);

// GET /api/enfa/:enfantId - Détail
router.get('/:enfantId', enfantController.getEnfantById);

// POST /api/enfa - Création
router.post('/', enfantController.createEnfant);

// PUT /api/enfa/:enfantId - Mise à jour
router.put('/:enfantId', enfantController.updateEnfant);

// DELETE /api/enfa/:enfantId - Suppression
router.delete('/:enfantId', enfantController.deleteEnfant);

// Routes de relations
router.get('/par-parent/:utilisateurId', enfantController.getEnfantsByParent);
router.get('/par-orthophoniste/:utilisateurId', enfantController.getEnfantsByOrthophoniste);

module.exports = router;