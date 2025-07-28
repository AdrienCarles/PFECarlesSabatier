import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';

// Mock des modèles et middleware AVANT import
jest.unstable_mockModule('../../models/index.js', () => ({
  USR: {
    create: jest.fn(),
  },
  ABM: {},
  ANI: {},
  ENFA: {},
  OrthophonisteConfig: {},
  RefreshToken: {},
  SES: {},
  sequelize: {
    authenticate: jest.fn(),
    close: jest.fn(),
  },
}));
jest.unstable_mockModule('../../services/emailService.js', () => ({
  sendActivationEmail: jest.fn(),
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
      id: 2,
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
const { USR } = await import('../../models/index.js');
const userRoutes = await import('../../routes/userRoutes.js');
const errorHandler = await import('../../middleware/errorHandler.js');

// Setup app
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api/usr', userRoutes.default);
app.use(errorHandler.default);

describe('TU2 - UserController création utilisateur sécurisé', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Création utilisateur: mot de passe hashé et non retourné', async () => {
    // Données utilisateur à créer
    const userData = {
      USR_email: 'newuser@test.com',
      USR_pass: 'monmotdepasse',
      USR_role: 'parent',
      USR_nom: 'Nouveau',
      USR_prenom: 'User',
    };

    // Mock du hash bcrypt
    const hashed = await bcrypt.hash(userData.USR_pass, 10);

    // Mock USR.create
    USR.create.mockResolvedValue({
      toJSON: () => ({
        USR_id: 10,
        USR_email: userData.USR_email,
        USR_role: userData.USR_role,
        USR_nom: userData.USR_nom,
        USR_prenom: userData.USR_prenom,
        USR_pass: hashed, // Simule le hash en BDD
      }),
    });

    // Requête POST pour créer l'utilisateur
    const response = await request(app)
      .post('/api/usr')
      .send(userData)
      .expect(201);

    // Vérifie que USR.create a été appelé avec un mot de passe hashé
    expect(USR.create).toHaveBeenCalledWith(
      expect.objectContaining({
        USR_email: userData.USR_email,
        USR_role: userData.USR_role,
        USR_nom: userData.USR_nom,
        USR_prenom: userData.USR_prenom,
        USR_pass: expect.stringMatching(/^\$2[aby]\$.{56}$/), // bcrypt hash
      })
    );

    // Vérifie que le mot de passe n'est pas retourné dans la réponse
    expect(response.body).not.toHaveProperty('USR_pass');
    expect(response.body).toHaveProperty('USR_email', userData.USR_email);

    // Résumé
    console.log('Création utilisateur sécurisée (hash et pas de retour du mot de passe)');
  });
});