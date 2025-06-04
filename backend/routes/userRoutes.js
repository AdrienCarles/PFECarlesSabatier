import express from 'express';
import userController from '../controllers/userController.js';
import {
  authenticateToken,
  authorizeRoles,
} from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/usr - Liste complète
router.get(
  '/',
  authenticateToken,
  authorizeRoles('admin', 'orthophoniste'),
  userController.getAllUsers
);

// GET /api/usr/:usrId - Détail
router.get('/:usrId', authenticateToken, userController.getUserById);

// POST /api/usr - Création
router.post(
  '/',
  authenticateToken,
  authorizeRoles('admin', 'orthophoniste'),
  userController.createUser
);

// POST /api/usr/patient-complet - Création PARENT + ENFANT ensemble
router.post(
  '/patient-complet',
  authenticateToken,
  authorizeRoles('admin', 'orthophoniste'),
  userController.createPatientComplete
);

// POST /api/usr/activate/:token - Activation du compte parent
router.post('/activate/:token', userController.activateParentAccount);

// PUT /api/usr/:usrId - Mise à jour
router.put('/:usrId', authenticateToken, userController.updateUser);

// DELETE /api/usr/:usrId - Suppression
router.delete(
  '/:usrId',
  authenticateToken,
  authorizeRoles('admin'),
  userController.deleteUser
);

export default router;
