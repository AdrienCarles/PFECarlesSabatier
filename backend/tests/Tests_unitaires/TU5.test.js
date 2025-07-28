import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

// Mock du middleware AVANT import
jest.unstable_mockModule('../../middleware/authMiddleware.js', () => ({
  authenticateToken: (req, res, next) => {
    // Simule l'utilisateur selon le header
    const auth = req.headers['authorization'];
    if (!auth) return res.status(401).json({ message: 'Token manquant' });
    const token = auth.replace('Bearer ', '');
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch {
      return res.status(401).json({ message: 'Token invalide' });
    }
  },
  authorizeRoles:
    (...roles) =>
    (req, res, next) => {
      if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Rôle non autorisé' });
      }
      next();
    },
}));
jest.unstable_mockModule('../../utils/AppError.js', () => ({
  default: class AppError extends Error {
    constructor(statusCode, message) {
      super(message);
      this.statusCode = statusCode;
      this.status = statusCode;
    }
  },
}));

const authMiddleware = await import('../../middleware/authMiddleware.js');

// Setup app de test
const app = express();
app.use(express.json());
app.use(cookieParser());

// Route REST protégée
app.get(
  '/api/secure',
  authMiddleware.authenticateToken,
  authMiddleware.authorizeRoles('admin', 'orthophoniste'),
  (req, res) => {
    res.json({ message: 'Accès autorisé', user: req.user });
  }
);

process.env.JWT_SECRET = 'test-secret';

describe('TU5 - Routes API REST 200/401/403 selon rôle', () => {
  test('401 si token absent', async () => {
    const response = await request(app).get('/api/secure').expect(401);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toMatch(/token/i);
    console.log('401 sans token');
  });

  test('403 si rôle non autorisé', async () => {
    const token = jwt.sign({ id: 1, role: 'parent' }, process.env.JWT_SECRET);
    const response = await request(app)
      .get('/api/secure')
      .set('Authorization', `Bearer ${token}`)
      .expect(403);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toMatch(/rôle/i);
    console.log('403 mauvais rôle');
  });

  test('200 si rôle autorisé (admin)', async () => {
    const token = jwt.sign({ id: 2, role: 'admin' }, process.env.JWT_SECRET);
    const response = await request(app)
      .get('/api/secure')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(response.body).toHaveProperty('message', 'Accès autorisé');
    expect(response.body.user).toHaveProperty('role', 'admin');
    console.log('200 admin');
  });

  test('200 si rôle autorisé (orthophoniste)', async () => {
    const token = jwt.sign({ id: 3, role: 'orthophoniste' }, process.env.JWT_SECRET);
    const response = await request(app)
      .get('/api/secure')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(response.body).toHaveProperty('message', 'Accès autorisé');
    expect(response.body.user).toHaveProperty('role', 'orthophoniste');
    console.log('200 orthophoniste');
  });
});