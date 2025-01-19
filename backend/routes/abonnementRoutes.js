const express = require('express');
const router = express.Router();
const abonnementController = require('../controllers/abonnementController');
const validateSchema = require('../middleware/validateSchema');
const { abonnementIdSchema, abonnementSchema } = require('../validations/abonnementSchema');

// GET /api/abm - Liste complète
router.get('/', abonnementController.getAllAbonnements);

// GET /api/abm/:abonnementId - Détail
router.get('/:abonnementId', validateSchema(abonnementIdSchema), abonnementController.getAbonnementById);

// POST /api/abm - Création (avec validation)
router.post('/', validateSchema(abonnementSchema), abonnementController.createAbonnement);

// PUT /api/abm/:abonnementId - Mise à jour (avec validation)
router.put('/:abonnementId', validateSchema(abonnementSchema), abonnementController.updateAbonnement);

// DELETE /api/abm/:abonnementId - Suppression
router.delete('/:abonnementId', validateSchema(abonnementIdSchema), abonnementController.deleteAbonnement);

// Relations spécifiques
router.get('/par-utilisateur/:utilisateurId', abonnementController.getAbonnementsByUser);

module.exports = router;