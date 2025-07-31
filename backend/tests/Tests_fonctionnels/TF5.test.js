import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';

// Mock des modèles et services AVANT import
jest.unstable_mockModule('../../models/index.js', () => ({
  ABM: {
    create: jest.fn(),
  },
  ENFA: {},
  USR: {},
  PAI: {},
  OrthophonisteConfig: {},
  sequelize: {
    authenticate: jest.fn(),
    close: jest.fn(),
  },
}));
jest.unstable_mockModule('../../services/stripeService.js', () => ({
  stripeService: {
    verifyPayment: jest.fn(),
  },
}));
jest.unstable_mockModule('../../utils/AppError.js', () => ({
  default: class AppError extends Error {
    constructor(statusCode, message) {
      super(message);
      this.statusCode = statusCode;
    }
  },
}));
jest.unstable_mockModule('../../middleware/authMiddleware.js', () => ({
  authenticateToken: (req, res, next) => {
    req.user = {
      id: 10, // parent id
      role: 'parent',
      email: 'parent@test.com',
    };
    next();
  },
  authorizeRoles:
    (...roles) =>
    (req, res, next) =>
      next(),
}));

// Imports après mocks
const { ABM } = await import('../../models/index.js');
const { stripeService } = await import('../../services/stripeService.js');
const abonnementRoutes = await import('../../routes/abonnementRoutes.js');
const errorHandler = await import('../../middleware/errorHandler.js');

// App de test
const app = express();
app.use(express.json());
app.use('/api/abm', abonnementRoutes.default);
app.use(errorHandler.default);

describe('💳 Test TF5 - Paiement Stripe et activation abonnement', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("🎯 TF5 - Le parent effectue un paiement Stripe, paiement confirmé et accès élargi", async () => {
    // Données simulées Stripe
    const sessionId = 'sess_123';
    const sessionMock = {
      payment_status: 'paid',
      id: sessionId,
      metadata: {
        parent_id: '10',
        enfant_id: '20',
        prix: '19.99',
      },
    };
    stripeService.verifyPayment.mockResolvedValue(sessionMock);

    // Mock création abonnement
    const abonnementMock = {
      ABM_id: 1,
      USR_id: 10,
      ENFA_id: 20,
      ABM_statut: 'actif',
      ABM_prix: 19.99,
      ABM_mode_paiement: 'stripe',
      ABM_stripe_subscription_id: sessionId,
      ABM_dateDebut: expect.any(Date),
      ABM_dateFin: expect.any(Date),
    };
    ABM.create.mockResolvedValue(abonnementMock);

    // Requête POST pour confirmer le paiement
    const response = await request(app)
      .post('/api/abm/confirm-payment')
      .send({ sessionId })
      .expect(200);

    // Vérifications principales
    expect(stripeService.verifyPayment).toHaveBeenCalledWith(sessionId);
    expect(ABM.create).toHaveBeenCalledWith(
      expect.objectContaining({
        USR_id: 10,
        ENFA_id: 20,
        ABM_statut: 'actif',
        ABM_prix: 19.99,
        ABM_mode_paiement: 'stripe',
        ABM_stripe_subscription_id: sessionId,
      })
    );
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('abonnement');
    expect(response.body.abonnement).toMatchObject({
      USR_id: 10,
      ENFA_id: 20,
      ABM_statut: 'actif',
      ABM_prix: 19.99,
      ABM_mode_paiement: 'stripe',
      ABM_stripe_subscription_id: sessionId,
    });
    expect(response.body).toHaveProperty(
      'message',
      'Paiement confirmé et abonnement activé'
    );

    // Résumé
    console.log('\n🎉 === RÉSUMÉ TF5 ===');
    console.log('   ✅ Paiement Stripe confirmé');
    console.log('   ✅ Abonnement activé');
    console.log('   ✅ Accès élargi: RÉUSSI');
    console.log('\n🏁 === FIN DU TEST TF5 ===');
  });
});