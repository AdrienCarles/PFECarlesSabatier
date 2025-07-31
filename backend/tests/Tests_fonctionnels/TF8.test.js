import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';

// Mock des modèles et middleware AVANT import
jest.unstable_mockModule('../../models/index.js', () => ({
  STAT: {
    findAll: jest.fn(),
  },
  SES: {},
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
      id: 10,
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
const { STAT } = await import('../../models/index.js');
const statistiqueRoutes = await import('../../routes/statistiqueRoutes.js');
const errorHandler = await import('../../middleware/errorHandler.js');

// App de test
const app = express();
app.use(express.json());
app.use('/api/stat', statistiqueRoutes.default);
app.use(errorHandler.default);

describe('📊 Test TF8 - Visualisation des statistiques par le parent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('🎯 TF8 - Le parent consulte les stats, affichage des séries vues et temps passé', async () => {
    // Données simulées de stats
    const enfaId = 20;
    const statsMock = [
      {
        STAT_id: 1,
        ENFA_id: enfaId,
        SES_id: 101,
        STAT_tempsPasse: 1200, // secondes
        STAT_dernierAcces: new Date(),
        serie: {
          SES_id: 101,
          SES_titre: 'Sons et Animaux',
        },
      },
      {
        STAT_id: 2,
        ENFA_id: enfaId,
        SES_id: 102,
        STAT_tempsPasse: 800,
        STAT_dernierAcces: new Date(),
        serie: {
          SES_id: 102,
          SES_titre: 'Découverte des couleurs',
        },
      },
    ];
    STAT.findAll.mockResolvedValue(statsMock);

    // Requête GET pour consulter les stats de l'enfant
    const response = await request(app)
      .get(`/api/stat/par-enfant/${enfaId}`)
      .expect(200);

    // Vérifications principales
    expect(
      STAT.findAll.mock.calls.some(
        (call) =>
          call[0] &&
          call[0].where &&
          (call[0].where.ENFA_id == enfaId ||
            call[0].where.ENFA_id === String(enfaId)) &&
          call[0].include &&
          Array.isArray(call[0].include) &&
          call[0].include.some((i) => i.as === 'serie')
      )
    ).toBe(true);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(2);

    // Vérifie le contenu des stats
    expect(response.body[0]).toHaveProperty('SES_id', 101);
    expect(response.body[0]).toHaveProperty('STAT_tempsPasse', 1200);
    expect(response.body[0].serie).toHaveProperty(
      'SES_titre',
      'Sons et Animaux'
    );
    expect(response.body[1]).toHaveProperty('SES_id', 102);
    expect(response.body[1]).toHaveProperty('STAT_tempsPasse', 800);
    expect(response.body[1].serie).toHaveProperty(
      'SES_titre',
      'Découverte des couleurs'
    );

    // Résumé
    console.log('\n🎉 === RÉSUMÉ TF8 ===');
    console.log('   ✅ Séries vues affichées');
    console.log('   ✅ Temps passé affiché');
    console.log('\n🏁 === FIN DU TEST TF8 ===');
  });
});
