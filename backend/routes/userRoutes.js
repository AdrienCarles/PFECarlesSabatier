const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const validateSchema = require('../middleware/validateSchema');
const userSchema = require('../validations/userSchema');

// GET /api/utilisateurs - Liste complète
router.get('/', userController.getAllUsers);

// GET /api/utilisateurs/:utilisateurId - Détail
router.get('/:utilisateurId', userController.getUserById);

// POST /api/utilisateurs - Création
router.post('/',  validateSchema(userSchema), userController.createUser);

// PUT /api/utilisateurs/:utilisateurId - Mise à jour
router.put('/:utilisateurId', validateSchema(userSchema), userController.updateUser);

// DELETE /api/utilisateurs/:utilisateurId - Suppression
router.delete('/:utilisateurId', userController.deleteUser);

// Relations spécifiques
router.get('/par-parent/:utilisateurId/enfants', userController.getParentChildren);
router.get('/par-orthophoniste/:utilisateurId/enfants', userController.getOrthophonisteChildren);

module.exports = router;