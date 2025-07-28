import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

jest.unstable_mockModule('../../utils/AppError.js', () => ({
  default: class AppError extends Error {
    constructor(statusCode, message) {
      super(message);
      this.statusCode = statusCode;
      this.status = statusCode;
    }
  },
}));

let authMiddleware;
let errorHandler;
let app;

beforeAll(async () => {
  authMiddleware = await import('../../middleware/authMiddleware.js');
  errorHandler = await import('../../middleware/errorHandler.js');

  app = express();
  app.use(express.json());
  app.use(cookieParser());

  app.get(
    '/api/protected',
    (req, res, next) => authMiddleware.authenticateToken(req, res, next),
    (req, res, next) => authMiddleware.authorizeRoles('admin')(req, res, next),
    (req, res) => {
      res.json({ message: 'Accès autorisé', user: req.user });
    }
  );
  app.use((req, res, next) => errorHandler.default(req, res, next));
});

process.env.JWT_SECRET = 'test-secret';

describe('TU3 - Middleware authentification', () => {
  test('Blocage si token JWT absent', async () => {
    const response = await request(app).get('/api/protected').expect(401);

    expect(response.body).toBeDefined();
    expect(
      response.body.message || response.body.error || response.text
    ).toMatch(/token|autorisé|rôle/i);
    console.log('Blocage sans token');
  });

  test('Blocage si rôle incorrect', async () => {
    // Génère un token JWT avec rôle "parent"
    const token = jwt.sign({ id: 1, role: 'parent' }, process.env.JWT_SECRET);

    const response = await request(app)
      .get('/api/protected')
      .set('Authorization', `Bearer ${token}`)
      .expect(403);

    expect(response.body).toBeDefined();
    expect(
      response.body.message || response.body.error || response.text
    ).toMatch(/token/i);
    console.log('Blocage mauvais rôle');
  });

  test('Accès autorisé si token et rôle correct', async () => {
    // Génère un token JWT avec rôle "admin"
    const token = jwt.sign({ id: 2, role: 'admin' }, process.env.JWT_SECRET);

    const response = await request(app)
      .get('/api/protected')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toBeDefined();
    expect(
      response.body.message || response.body.error || response.text
    ).toMatch(/autorisé|rôle/i);
    console.log('Accès autorisé avec bon rôle');
  });
});
