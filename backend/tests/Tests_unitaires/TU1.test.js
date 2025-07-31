import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcrypt';

// Mock des modèles et middleware AVANT import
jest.unstable_mockModule('../../models/index.js', () => ({
  USR: {
    findOne: jest.fn(),
    findByPk: jest.fn(),
  },
  RefreshToken: {
    create: jest.fn(),
    destroy: jest.fn(),
  },
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

// Imports après mocks
const { USR, RefreshToken } = await import('../../models/index.js');
const authRoutes = await import('../../routes/authRoutes.js');
const errorHandler = await import('../../middleware/errorHandler.js');

// Setup app
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes.default);
app.use(errorHandler.default);

// Setup env secrets
process.env.JWT_SECRET = 'test-secret';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
process.env.NODE_ENV = 'test';

describe('TU1 - AuthController Login/Logout JWT', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Login: retourne un JWT valide et le stocke en cookie', async () => {
    // Mock user trouvé et actif
    const userMock = {
      USR_id: 1,
      USR_email: 'test@test.com',
      USR_pass: await bcrypt.hash('password', 10),
      USR_role: 'parent',
      USR_nom: 'Test',
      USR_prenom: 'User',
      USR_statut: 'actif',
      update: jest.fn(),
    };
    USR.findOne.mockResolvedValue(userMock);
    RefreshToken.create.mockResolvedValue({});

    // Mock bcrypt.compare
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

    // Requête login
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@test.com', password: 'password' })
      .expect(200);

    // Vérifie le JWT
    expect(response.body).toHaveProperty('token');
    const decoded = jwt.verify(response.body.token, process.env.JWT_SECRET);
    expect(decoded).toHaveProperty('id', 1);
    expect(decoded).toHaveProperty('role', 'parent');

    // Vérifie le cookie
    const setCookies = response.headers['set-cookie'] || [];
    expect(setCookies.some((c) => c.startsWith('accessToken='))).toBe(true);
    expect(setCookies.some((c) => c.startsWith('refreshToken='))).toBe(true);

    // Résumé
    console.log('Login: JWT et cookies valides');
  });

  test('Logout: supprime le refreshToken et efface les cookies', async () => {
    RefreshToken.destroy.mockResolvedValue(1);

    // Simule les cookies envoyés par le client
    const cookies =
      'refreshToken=fake-refresh-token; accessToken=fake-access-token';

    // Requête logout
    const response = await request(app)
      .post('/api/auth/logout')
      .set('Cookie', cookies)
      .expect(200);

    // Vérifie suppression du token
    expect(RefreshToken.destroy).toHaveBeenCalledWith({
      where: { token: 'fake-refresh-token' },
    });
    expect(response.body).toHaveProperty('message', 'Déconnexion réussie');

    // Vérifie effacement des cookies
    const setCookies = response.headers['set-cookie'] || [];
    expect(setCookies.some((c) => c.startsWith('accessToken=;'))).toBe(true);
    expect(setCookies.some((c) => c.startsWith('refreshToken=;'))).toBe(true);

    // Résumé
    console.log('Logout: token supprimé et cookies effacés');
  });
});
