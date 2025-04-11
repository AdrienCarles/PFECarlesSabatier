import express from 'express';
import authController from '../controllers/authController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';
import { loginLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Route pour se connecter
router.post('/login',
    loginLimiter,
    authController.login
);

// Route pour obtenir le profil utilisateur
router.get('/self',
    authenticateToken,
    authController.self
);

router.post('/logout', 
    authController.logout
);

router.post('/refresh-token', 
    authController.refreshToken
);

export default router;