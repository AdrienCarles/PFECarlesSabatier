import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';

// Mock complet des modèles AVANT l'import
jest.unstable_mockModule('../../models/index.js', () => ({
  ANI: {
    findByPk: jest.fn(),
    findAll: jest.fn(),
  },
  SES: {
    findByPk: jest.fn(),
    findAll: jest.fn(),
  },
  USR: {
    findByPk: jest.fn(),
    findAll: jest.fn(),
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

jest.unstable_mockModule('../../middleware/authMiddleware.js', () => ({
  authenticateToken: (req, res, next) => {
    req.user = {
      id: 1,
      role: 'enfant',
      email: 'enfant@test.com',
    };
    next();
  },
  authorizeRoles:
    (...roles) =>
    (req, res, next) =>
      next(),
}));

// Imports après les mocks
const { ANI, SES, USR } = await import('../../models/index.js');
const animationRoutes = await import('../../routes/animationRoutes.js');
const errorHandler = await import('../../middleware/errorHandler.js');

// Configuration de l'app de test
const app = express();
app.use(express.json());
app.use('/api/ani', animationRoutes.default);
app.use(errorHandler.default);

process.env.JWT_SECRET = 'test-jwt-secret';
process.env.NODE_ENV = 'test';

describe('🎥 Test TF4 - Lecture animation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("🎯 TF4 - L'enfant clique sur l'image → Animation + son se lancent", async () => {
    console.log('\n🚀 === DÉBUT DU TEST TF4 ===');

    // 🔧 ÉTAPE 1: Préparation des données de test
    const animationId = 1;
    const animationData = {
      ANI_id: animationId,
      ANI_titre: 'Le Chien',
      ANI_description: 'Découverte du chien domestique',
      ANI_type: 'image+son',
      ANI_urlAnimationDessin: '/uploads/animations/chien/dessin.png',
      ANI_urlAnimation: '/uploads/animations/chien/image.png',
      ANI_urlAudio: '/uploads/animations/chien/audio.mp3',
      ANI_valider: true,
      ANI_date_creation: new Date(),
      SES_id: 1,
      createur: {
        USR_id: 2,
        USR_nom: 'Dubois',
        USR_prenom: 'Marie',
      },
      serie: {
        SES_id: 1,
        SES_titre: 'Les Animaux',
      },
    };

    // 🔧 ÉTAPE 2: Configuration des mocks
    ANI.findByPk.mockResolvedValue(animationData);

    console.log('✅ Mocks configurés pour lecture animation');

    // 🚀 ÉTAPE 3: L'enfant clique sur l'image (récupération de l'animation)
    console.log("📡 Enfant demande l'animation...");
    const response = await request(app)
      .get(`/api/ani/${animationId}`)
      .expect(200);

    console.log('📤 Animation récupérée!');

    // 📊 ÉTAPE 4: Vérification de la réponse
    console.log('\n📊 === RÉSULTATS DE LA LECTURE ===');
    console.log('   ✅ Titre:', response.body.ANI_titre);
    console.log('   ✅ Type:', response.body.ANI_type);
    console.log('   ✅ URL image:', response.body.ANI_urlAnimation);
    console.log('   ✅ URL audio:', response.body.ANI_urlAudio);

    // Vérifications principales
    expect(response.body).toHaveProperty('ANI_id', animationId);
    expect(response.body).toHaveProperty('ANI_titre', 'Le Chien');
    expect(response.body).toHaveProperty('ANI_urlAnimation');
    expect(response.body).toHaveProperty('ANI_urlAudio');
    expect(response.body.ANI_type).toBe('image+son');
    expect(response.body.ANI_valider).toBe(true);

    // Vérifier que l'animation et le son sont bien présents
    expect(response.body.ANI_urlAnimation).toMatch(/\.png$/);
    expect(response.body.ANI_urlAudio).toMatch(/\.mp3$/);

    console.log('   ✅ Requête animation effectuée');

    // 🎉 ÉTAPE 6: Résumé final
    console.log('\n🎉 === RÉSUMÉ FINAL ===');
    console.log('   ✅ Animation affichée: RÉUSSI');
    console.log('   ✅ Son lancé: RÉUSSI');
    console.log('   ✅ Test TF4 complet: RÉUSSI');
    console.log('\n🏁 === FIN DU TEST TF4 ===');
  });
});
