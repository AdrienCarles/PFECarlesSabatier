const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validateSchema = require('../middleware/validateSchema');
const authMiddleware = require('../middleware/authMiddleware');
const authSchema = require('../validations/authSchema');

// Route pour se connecter
router.post('/login', validateSchema(authSchema.login), authController.login);

// Route pour obtenir le profil utilisateur
router.get('/self', authMiddleware, authController.me);

module.exports = router;
