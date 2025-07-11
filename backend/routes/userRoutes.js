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

// GET /api/usr/:userId/config - Récupérer la configuration d'un orthophoniste
router.get(
  '/:userId/config',
  authenticateToken,
  authorizeRoles('admin', 'orthophoniste'),
  userController.getOrthophonisteConfig
);

// GET /api/usr/validate-token/:token - Validation du token d'activation
router.get('/validate-token/:token', userController.validateActivationToken);

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

// PUT /api/usr/:userId/config - Mise à jour de la configuration d'un orthophoniste
router.put(
  '/:userId/config',
  authenticateToken,
  authorizeRoles('admin'),
  userController.updateOrthophonisteConfig
);

// DELETE /api/usr/:usrId - Suppression
router.delete(
  '/:usrId',
  authenticateToken,
  authorizeRoles('admin'),
  userController.deleteUser
);

export default router;
