import express from 'express';
import * as authController from '../controllers/authController.js';
import validateSchema from '../middleware/validateSchema.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { loginLimiter } from '../middleware/rateLimiter.js';
import authSchema from '../validations/authSchema.js';

const router = express.Router();

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

export default router;