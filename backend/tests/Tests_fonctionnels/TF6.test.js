import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';

// Mock des modèles et middleware AVANT import
jest.unstable_mockModule('../../models/index.js', () => ({
  SES: {
    create: jest.fn(),
  },
  ACCES: {},
  ANI: {},
  ENFA: {},
  USR: {},
  sequelize: {
    authenticate: jest.fn(),
    close: jest.fn(),
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
      id: 42,
      role: 'orthophoniste',
      email: 'ortho@test.com',
    };
    next();
  },
  authorizeRoles:
    (...roles) =>
    (req, res, next) =>
      next(),
}));

// Imports après mocks
const { SES } = await import('../../models/index.js');
const serieRoutes = await import('../../routes/serieRoutes.js');
const errorHandler = await import('../../middleware/errorHandler.js');

// App de test
const app = express();
app.use(express.json());
app.use('/api/ses', serieRoutes.default);
app.use(errorHandler.default);

describe('📝 Test TF6 - Création série par orthophoniste', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('🎯 TF6 - L’orthophoniste ajoute une série, série en attente de validation', async () => {
    // Données de la série à créer
    const serieData = {
      SES_titre: 'Sons et Animaux',
      SES_description: 'Série pour travailler les sons avec les animaux',
      SES_statut: 'en_attente',
      USR_orthophoniste_id: 42,
    };

    // Mock création série
    const serieMock = {
      SES_id: 100,
      SES_titre: serieData.SES_titre,
      SES_description: serieData.SES_description,
      SES_statut: 'en_attente',
      USR_orthophoniste_id: 42,
      SES_dateCreation: new Date(),
    };
    SES.create.mockResolvedValue(serieMock);

    // Requête POST pour créer la série
    const response = await request(app)
      .post('/api/ses')
      .send(serieData)
      .expect(201);

    // Vérifications principales
    expect(SES.create).toHaveBeenCalledWith(
      expect.objectContaining({
        SES_titre: serieData.SES_titre,
        SES_description: serieData.SES_description,
        SES_statut: 'en_attente',
        USR_orthophoniste_id: 42,
      })
    );
    expect(response.body).toHaveProperty('SES_id', 100);
    expect(response.body).toHaveProperty('SES_titre', serieData.SES_titre);
    expect(response.body).toHaveProperty('SES_statut', 'en_attente');
    expect(response.body).toHaveProperty('USR_orthophoniste_id', 42);

    // Résumé
    console.log('\n🎉 === RÉSUMÉ TF6 ===');
    console.log('   ✅ Série créée par orthophoniste');
    console.log('   ✅ Statut: en attente de validation');
    console.log('\n🏁 === FIN DU TEST TF6 ===');
  });
});
