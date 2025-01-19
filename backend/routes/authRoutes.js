const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validateSchema = require('../middleware/validateSchema');
const authMiddleware = require('../middleware/authMiddleware');
const { loginLimiter } = require('../middleware/rateLimiter');
const authSchema = require('../validations/authSchema');


// Route pour se connecter
router.post('/login',
    loginLimiter,
    validateSchema(authSchema.login),
    authController.login
);

// Route pour obtenir le profil utilisateur
router.get('/self',
    authMiddleware,
    authController.self
);

router.post('/logout', 
    validateSchema(authSchema.refresh), 
    authController.logout
);


module.exports = router;
