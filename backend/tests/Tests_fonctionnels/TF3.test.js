import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';

// Mock complet des modèles AVANT l'import
jest.unstable_mockModule('../../models/index.js', () => ({
  ENFA: {
    create: jest.fn(),
    findByPk: jest.fn(),
    findAll: jest.fn(),
    destroy: jest.fn()
  },
  USR: {
    findOne: jest.fn(),
    findByPk: jest.fn(),
    findAll: jest.fn()
  },
  SES: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn()
  },
  ANI: {
    findAll: jest.fn(),
    findByPk: jest.fn()
  },
  ACCES: {
    create: jest.fn(),
    findAll: jest.fn(),
    destroy: jest.fn(),
    bulkCreate: jest.fn()
  },
  ABM: {
    findOne: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn()
  },
  OrthophonisteConfig: {
    findOne: jest.fn(),
    findAll: jest.fn()
  },
  sequelize: {
    authenticate: jest.fn(),
    close: jest.fn()
  },
  Op: {}
}));

// Mock d'AppError
jest.unstable_mockModule('../../utils/AppError.js', () => ({
  default: class AppError extends Error {
    constructor(statusCode, message) {
      super(message);
      this.statusCode = statusCode;
    }
  }
}));

// Mock du middleware d'authentification
jest.unstable_mockModule('../../middleware/authMiddleware.js', () => ({
  authenticateToken: (req, res, next) => {
    // Simuler un utilisateur parent authentifié
    req.user = {
      id: 1,
      role: 'parent',
      email: 'parent@test.com'
    };
    next();
  },
  authorizeRoles: (...roles) => (req, res, next) => next()
}));

// Imports après les mocks
const { ENFA, USR, SES, ANI, ACCES, ABM, OrthophonisteConfig } = await import('../../models/index.js');
const serieRoutes = await import('../../routes/serieRoutes.js');
const enfantRoutes = await import('../../routes/enfantRoutes.js');
const errorHandler = await import('../../middleware/errorHandler.js');

// Configuration de l'app de test
const app = express();
app.use(express.json());
app.use('/api/ses', serieRoutes.default);
app.use('/api/enfa', enfantRoutes.default);
app.use(errorHandler.default);

// Variables d'environnement pour les tests
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.NODE_ENV = 'test';

describe('🎬 Test TF3 - Sélection série', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('🎯 TF3 - Parent sélectionne série → Série affichée côté enfant', async () => {
    console.log('\n🚀 === DÉBUT DU TEST TF3 ===');
    
    // 🔧 ÉTAPE 1: Préparation des données de test
    const parentUser = {
      USR_id: 1,
      USR_email: 'parent@test.com',
      USR_role: 'parent',
      USR_nom: 'Martin',
      USR_prenom: 'Sophie'
    };

    const enfantData = {
      ENFA_id: 1,
      ENFA_prenom: 'Lucas',
      ENFA_nom: 'Martin',
      ENFA_dateNaissance: '2020-03-15',
      ENFA_niveauAudition: 'modere',
      USR_parent_id: 1,
      USR_orthophoniste_id: 2
    };

    const seriesDisponibles = [
      {
        SES_id: 1,
        SES_titre: 'Les Animaux',
        SES_theme: 'Découverte',
        SES_description: 'Une série dédiée à la découverte des animaux.',
        SES_statut: 'actif',
        SES_icone: '/uploads/series/animaux.svg',
        SES_dateCreation: new Date()
      },
      {
        SES_id: 2,
        SES_titre: 'Les Couleurs',
        SES_theme: 'Apprentissage',
        SES_description: 'Apprenez les couleurs primaires et secondaires.',
        SES_statut: 'actif',
        SES_icone: '/uploads/series/couleurs.svg',
        SES_dateCreation: new Date()
      }
    ];

    const serieSelectionnee = seriesDisponibles[0]; // Les Animaux

    console.log('📋 Données du test:', {
      parent: parentUser.USR_prenom + ' ' + parentUser.USR_nom,
      enfant: enfantData.ENFA_prenom + ' ' + enfantData.ENFA_nom,
      serieChoisie: serieSelectionnee.SES_titre,
      theme: serieSelectionnee.SES_theme
    });

    // 🔧 ÉTAPE 2: Configuration des mocks pour les séries disponibles
    SES.findAll.mockResolvedValue(seriesDisponibles);
    ENFA.findByPk.mockResolvedValue(enfantData);

    console.log('✅ Mocks configurés pour les séries disponibles');

    // 🎬 ÉTAPE 3: Parent consulte les séries disponibles
    console.log('📡 Parent consulte les séries disponibles...');
    
    const seriesResponse = await request(app)
      .get('/api/ses/actives')
      .expect(200);

    console.log('📤 Séries disponibles récupérées!');

    // 📊 ÉTAPE 4: Vérification des séries disponibles
    console.log('\n📊 === SÉRIES DISPONIBLES ===');
    console.log('   ✅ Nombre de séries actives:', seriesResponse.body.length);
    console.log('   ✅ Première série:', seriesResponse.body[0]?.SES_titre);
    console.log('   ✅ Deuxième série:', seriesResponse.body[1]?.SES_titre);

    // Vérifications des séries
    expect(seriesResponse.body).toBeInstanceOf(Array);
    expect(seriesResponse.body).toHaveLength(2);
    expect(seriesResponse.body[0]).toHaveProperty('SES_titre', 'Les Animaux');
    expect(seriesResponse.body[1]).toHaveProperty('SES_titre', 'Les Couleurs');
    console.log('   ✅ Séries disponibles validées');

    // 🔧 ÉTAPE 5: Configuration des mocks pour l'assignation
    ACCES.destroy.mockResolvedValue(1); // Suppression des anciens accès
    ACCES.bulkCreate.mockResolvedValue([
      {
        USR_id: parentUser.USR_id,
        SES_id: serieSelectionnee.SES_id,
        ENFA_id: enfantData.ENFA_id
      }
    ]);

    console.log('\n🎯 === SÉLECTION DE SÉRIE ===');
    console.log('📡 Parent assigne la série "Les Animaux" à l\'enfant...');

    // 🚀 ÉTAPE 6: Parent sélectionne une série pour l'enfant
    const assignationData = {
      seriesIds: [serieSelectionnee.SES_id],
      parentId: parentUser.USR_id
    };

    const assignationResponse = await request(app)
      .put(`/api/ses/enfant/${enfantData.ENFA_id}`)
      .send(assignationData)
      .expect(200);

    console.log('📤 Série assignée avec succès!');

    // 📊 ÉTAPE 7: Vérification de l'assignation
    console.log('\n📊 === RÉSULTATS ASSIGNATION ===');
    console.log('   ✅ Message:', assignationResponse.body.message);
    console.log('   ✅ Séries assignées:', assignationResponse.body.assignedSeries);

    // Vérifications de l'assignation
    expect(assignationResponse.body).toHaveProperty('message', 'Séries mises à jour avec succès');
    expect(assignationResponse.body).toHaveProperty('assignedSeries', 1);
    console.log('   ✅ Assignation validée');

    // 🗄️ ÉTAPE 8: Vérification des appels de base de données (avec flexibilité pour les types)
    console.log('\n🗄️ === VÉRIFICATION BASE DE DONNÉES ===');
    
    // L'ID peut être passé comme string ou number selon la route
    expect(ENFA.findByPk).toHaveBeenCalledWith(expect.any(String));
    console.log('   ✅ Vérification enfant effectuée');
    
    expect(ACCES.destroy).toHaveBeenCalledWith({
      where: { ENFA_id: expect.any(String) }
    });
    console.log('   ✅ Anciens accès supprimés');
    
    expect(ACCES.bulkCreate).toHaveBeenCalledWith([{
      USR_id: parentUser.USR_id,
      SES_id: serieSelectionnee.SES_id,
      ENFA_id: expect.any(String)
    }]);
    console.log('   ✅ Nouveaux accès créés');

    // 🔧 ÉTAPE 9: Configuration des mocks pour l'affichage côté enfant
    const seriesEnfant = [
      {
        SES_id: serieSelectionnee.SES_id,
        SES_titre: serieSelectionnee.SES_titre,
        SES_theme: serieSelectionnee.SES_theme,
        SES_description: serieSelectionnee.SES_description,
        SES_statut: serieSelectionnee.SES_statut,
        SES_icone: serieSelectionnee.SES_icone,
        acces: [{
          ENFA_id: enfantData.ENFA_id,
          SES_id: serieSelectionnee.SES_id
        }]
      }
    ];

    const animationsEnfant = [
      {
        ANI_id: 1,
        ANI_titre: 'Le Chien',
        ANI_description: 'Découverte du chien domestique',
        ANI_valider: true,
        SES_id: serieSelectionnee.SES_id,
        serie: {
          SES_icone: serieSelectionnee.SES_icone,
          SES_titre: serieSelectionnee.SES_titre
        }
      },
      {
        ANI_id: 2,
        ANI_titre: 'Le Chat',
        ANI_description: 'Découverte du chat domestique',
        ANI_valider: true,
        SES_id: serieSelectionnee.SES_id,
        serie: {
          SES_icone: serieSelectionnee.SES_icone,
          SES_titre: serieSelectionnee.SES_titre
        }
      }
    ];

    // Configurer les mocks pour l'affichage côté enfant
    SES.findAll.mockResolvedValueOnce(seriesEnfant); // Pour getEnfantSeries
    ACCES.findAll.mockResolvedValue([{ SES_id: serieSelectionnee.SES_id }]);
    ANI.findAll.mockResolvedValue(animationsEnfant);

    console.log('\n👶 === AFFICHAGE CÔTÉ ENFANT ===');
    console.log('📡 Récupération des séries de l\'enfant...');

    // 🚀 ÉTAPE 10: Vérification affichage côté enfant - Séries
    const enfantSeriesResponse = await request(app)
      .get(`/api/enfa/${enfantData.ENFA_id}/series`)
      .expect(200);

    console.log('📤 Séries de l\'enfant récupérées!');

    console.log('📡 Récupération des animations de l\'enfant...');

    // 🚀 ÉTAPE 11: Vérification affichage côté enfant - Animations
    const enfantAnimationsResponse = await request(app)
      .get(`/api/enfa/${enfantData.ENFA_id}/animations`)
      .expect(200);

    console.log('📤 Animations de l\'enfant récupérées!');

    // 📋 ÉTAPE 12: Vérification de l'affichage côté enfant
    console.log('\n📋 === VÉRIFICATION CÔTÉ ENFANT ===');
    console.log('   ✅ Séries accessibles:', enfantSeriesResponse.body.length);
    if (enfantSeriesResponse.body.length > 0) {
      console.log('   ✅ Première série:', enfantSeriesResponse.body[0]?.SES_titre);
      console.log('   ✅ Thème:', enfantSeriesResponse.body[0]?.SES_theme);
    }
    
    console.log('   ✅ Animations accessibles:', enfantAnimationsResponse.body.length);
    if (enfantAnimationsResponse.body.length > 0) {
      console.log('   ✅ Première animation:', enfantAnimationsResponse.body[0]?.ANI_titre);
      console.log('   ✅ Série associée:', enfantAnimationsResponse.body[0]?.serie?.SES_titre);
    }

    // Vérifications côté enfant
    expect(enfantSeriesResponse.body).toBeInstanceOf(Array);
    expect(enfantSeriesResponse.body).toHaveLength(1);
    expect(enfantSeriesResponse.body[0]).toHaveProperty('SES_titre', 'Les Animaux');
    expect(enfantSeriesResponse.body[0]).toHaveProperty('SES_theme', 'Découverte');
    console.log('   ✅ Série visible côté enfant');

    expect(enfantAnimationsResponse.body).toBeInstanceOf(Array);
    expect(enfantAnimationsResponse.body).toHaveLength(2);
    expect(enfantAnimationsResponse.body[0]).toHaveProperty('ANI_titre', 'Le Chien');
    expect(enfantAnimationsResponse.body[0].serie).toHaveProperty('SES_titre', 'Les Animaux');
    console.log('   ✅ Animations visibles côté enfant');

    // 🗄️ ÉTAPE 13: Vérification des appels de récupération côté enfant (avec flexibilité)
    console.log('\n🗄️ === VÉRIFICATION REQUÊTES ENFANT ===');
    
    expect(ACCES.findAll).toHaveBeenCalledWith({
      where: { ENFA_id: expect.any(String) },
      attributes: ['SES_id']
    });
    console.log('   ✅ Accès enfant vérifiés');

    expect(ANI.findAll).toHaveBeenCalledWith({
      where: { SES_id: [serieSelectionnee.SES_id] },
      include: expect.arrayContaining([
        expect.objectContaining({
          model: SES,
          as: 'serie'
        })
      ])
    });
    console.log('   ✅ Animations récupérées');

    // 🎉 ÉTAPE 14: Résumé final
    console.log('\n🎉 === RÉSUMÉ FINAL ===');
    console.log('   ✅ Séries disponibles consultées: RÉUSSI');
    console.log('      - Nombre de séries actives:', seriesResponse.body.length);
    console.log('   ✅ Série sélectionnée par le parent: RÉUSSI');
    console.log('      - Série choisie:', serieSelectionnee.SES_titre);
    console.log('      - Assignation confirmée: OUI');
    console.log('   ✅ Série affichée côté enfant: RÉUSSI');
    console.log('      - Séries visibles:', enfantSeriesResponse.body.length);
    console.log('      - Animations disponibles:', enfantAnimationsResponse.body.length);
    console.log('      - Contenu accessible: OUI');
    console.log('   ✅ Test TF3 complet: RÉUSSI');
    
    console.log('\n🏁 === FIN DU TEST TF3 ===');
  });

});