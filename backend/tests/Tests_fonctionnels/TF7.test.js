import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';

// Mock des modèles et middleware AVANT import
jest.unstable_mockModule('../../models/index.js', () => ({
  SES: {
    findByPk: jest.fn(),
    update: jest.fn(),
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
      id: 1,
      role: 'admin',
      email: 'admin@test.com',
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

describe('🛡️ Test TF7 - Validation série par admin', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('🎯 TF7 - L’admin valide une série, elle devient disponible dans le catalogue', async () => {
    // Données de la série avant validation
    const serieId = 200;
    const serieAvant = {
      SES_id: serieId,
      SES_titre: 'Sons et Animaux',
      SES_statut: 'en_attente',
      update: jest.fn(),
    };
    const serieApres = {
      SES_id: serieId,
      SES_titre: 'Sons et Animaux',
      SES_statut: 'actif',
    };

    // Mock findByPk et update
    SES.findByPk
      .mockResolvedValueOnce(serieAvant) // pour la vérif existence
      .mockResolvedValueOnce(serieApres); // pour le retour final
    serieAvant.update.mockResolvedValue(serieApres);

    // Requête PUT pour valider la série
    const response = await request(app)
      .put(`/api/ses/${serieId}/valider`)
      .send({ statut: 'valide' })
      .expect(200);

    // Vérifications principales
    expect(
      SES.findByPk.mock.calls.some(
        (call) =>
          (call[0] == serieId || call[0] === String(serieId)) &&
          call[1] &&
          typeof call[1] === 'object' &&
          Array.isArray(call[1].include)
      )
    ).toBe(true);
    expect(serieAvant.update).toHaveBeenCalledWith({ SES_statut: 'actif' });
    expect(response.body).toHaveProperty(
      'message',
      'Série validée avec succès'
    );
    expect(response.body.serie).toHaveProperty('SES_id', serieId);
    expect(response.body.serie).toHaveProperty('SES_statut', 'actif');

    // Résumé
    console.log('\n🎉 === RÉSUMÉ TF7 ===');
    console.log('   ✅ Série validée par admin');
    console.log('   ✅ Disponible dans le catalogue');
    console.log('\n🏁 === FIN DU TEST TF7 ===');
  });
});
