import express from 'express';
import abonnementController from '../controllers/abonnementController.js';
import {
  authenticateToken,
  authorizeRoles,
} from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/abm - Liste complète
router.get('/', 
    abonnementController.getAllAbonnements
);

// GET /api/abm/:abmId - Détail
router.get('/:abmId', 
    abonnementController.getAbonnementById
);

// POST /api/abm/create-subscription - Création
router.post('/create-subscription', 
    authenticateToken,
    authorizeRoles('parent'),
    abonnementController.createSubscription
);

// PUT /api/abm/:abmId - Mise à jour (avec validation)
router.put('/:abmId', 
    abonnementController.updateAbonnement
);

// DELETE /api/abm/:abmId - Suppression
router.delete('/:abmId', 
    abonnementController.deleteAbonnement
);

// GET /api/abm/check-status/:enfantId - Vérifier le statut d'abonnement
router.get('/check-status/:enfantId',
    authenticateToken,
    authorizeRoles('parent'),
    abonnementController.checkSubscriptionStatus
);

// GET /api/abm/check-payment-required/:enfantId - Vérifier si un paiement est requis
router.get('/check-payment-required/:enfantId',
    authenticateToken,
    authorizeRoles('parent'),
    abonnementController.checkPaymentRequired
);

// POST /api/abm/confirm-payment - Confirmer le paiement 
router.post('/confirm-payment',
    authenticateToken,
    authorizeRoles('parent'),
    abonnementController.confirmStripePayment
);

export default router;