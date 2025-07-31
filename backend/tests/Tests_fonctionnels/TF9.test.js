import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import cookieParser from 'cookie-parser';


// Mock des modèles et middleware AVANT import
jest.unstable_mockModule('../../models/index.js', () => ({
  RefreshToken: {
    destroy: jest.fn(),
  },
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
const { RefreshToken } = await import('../../models/index.js');
const authRoutes = await import('../../routes/authRoutes.js');
const errorHandler = await import('../../middleware/errorHandler.js');

// App de test
const app = express();
app.use(express.json());
app.use(cookieParser()); 
app.use('/api/auth', authRoutes.default);
app.use(errorHandler.default);

describe('🔒 Test TF9 - Déconnexion utilisateur', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("🎯 TF9 - L’utilisateur clique sur 'Déconnexion', token supprimé et retour à la page login", async () => {
    // Mock destruction du refreshToken
    RefreshToken.destroy.mockResolvedValue(1);

    // Simule les cookies envoyés par le client
    const cookies = 'refreshToken=fake-refresh-token; accessToken=fake-access-token';

    // Requête POST pour déconnexion
    const response = await request(app)
      .post('/api/auth/logout')
      .set('Cookie', cookies)
      .expect(200);

    // Vérifications principales
    expect(RefreshToken.destroy).toHaveBeenCalledWith({
      where: { token: 'fake-refresh-token' },
    });
    expect(response.body).toHaveProperty('message', 'Déconnexion réussie');

    // Vérifie que les cookies sont supprimés
    const setCookies = response.headers['set-cookie'] || [];
    expect(setCookies.some(c => c.startsWith('accessToken=;'))).toBe(true);
    expect(setCookies.some(c => c.startsWith('refreshToken=;'))).toBe(true);

    // Résumé
    console.log('\n🎉 === RÉSUMÉ TF9 ===');
    console.log('   ✅ Token supprimé');
    console.log('   ✅ Retour à la page login (front)');
    console.log('\n🏁 === FIN DU TEST TF9 ===');
  });
});