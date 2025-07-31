import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';

// Mock complet des modèles AVANT l'import
jest.unstable_mockModule('../../models/index.js', () => ({
  ENFA: {
    create: jest.fn(),
    findByPk: jest.fn(),
    findAll: jest.fn()
  },
  USR: {
    findOne: jest.fn(),
    findByPk: jest.fn()
  },
  ABM: {
    findOne: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn()
  },
  sequelize: {
    authenticate: jest.fn(),
    close: jest.fn()
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
const { ENFA, USR, ABM } = await import('../../models/index.js');
const enfantRoutes = await import('../../routes/enfantRoutes.js');
const errorHandler = await import('../../middleware/errorHandler.js');

// Configuration de l'app de test
const app = express();
app.use(express.json());
app.use('/api/enfa', enfantRoutes.default);
app.use(errorHandler.default);

// Variables d'environnement pour les tests
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.NODE_ENV = 'test';

describe('🔐 Test TF2 - Création profil enfant', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('🎯 TF2 - Parent crée profil enfant → Enfant affiché dans espace parent', async () => {
    console.log('\n🚀 === DÉBUT DU TEST TF2 ===');
    
    // 🔧 ÉTAPE 1: Préparation des données de test
    const parentUser = {
      USR_id: 1,
      USR_email: 'parent@test.com',
      USR_role: 'parent',
      USR_nom: 'Martin',
      USR_prenom: 'Sophie'
    };

    const orthophonisteUser = {
      USR_id: 2,
      USR_email: 'ortho@test.com',
      USR_role: 'orthophoniste',
      USR_nom: 'Dubois',
      USR_prenom: 'Marie'
    };

    const enfantData = {
      ENFA_prenom: 'Lucas',
      ENFA_nom: 'Martin',
      ENFA_dateNaissance: '2020-03-15',
      ENFA_niveauAudition: 'modere',
      ENFA_dateDebutSuivi: '2025-01-01',
      ENFA_notesSuivi: 'Enfant très motivé',
      USR_parent_id: 1,
      USR_orthophoniste_id: 2
    };

    const enfantCree = {
      ENFA_id: 1,
      ...enfantData,
      ENFA_dateCreation: new Date()
    };

    const enfantAvecParent = {
      ...enfantCree,
      parent: {
        USR_id: parentUser.USR_id,
        USR_nom: parentUser.USR_nom,
        USR_prenom: parentUser.USR_prenom,
        USR_email: parentUser.USR_email,
        USR_telephone: '0123456789'
      }
    };

    console.log('📋 Données de l\'enfant à créer:', {
      prenom: enfantData.ENFA_prenom,
      nom: enfantData.ENFA_nom,
      dateNaissance: enfantData.ENFA_dateNaissance,
      niveauAudition: enfantData.ENFA_niveauAudition,
      parentId: enfantData.USR_parent_id,
      orthophonisteId: enfantData.USR_orthophoniste_id
    });

    // 🔧 ÉTAPE 2: Configuration des mocks pour la création
    ENFA.create.mockResolvedValue(enfantCree);
    ENFA.findByPk.mockResolvedValue(enfantAvecParent);

    console.log('✅ Mocks configurés pour création');

    // 🚀 ÉTAPE 3: Création du profil enfant
    console.log('📡 Envoi de la requête de création...');
    
    const response = await request(app)
      .post('/api/enfa')
      .send(enfantData)
      .expect(201);

    console.log('📤 Enfant créé avec succès!');

    // 📊 ÉTAPE 4: Vérification de la création
    console.log('\n📊 === RÉSULTATS DE LA CRÉATION ===');
    console.log('   ✅ Status HTTP:', response.status);
    console.log('   ✅ Enfant ID:', response.body.ENFA_id);
    console.log('   ✅ Prénom:', response.body.ENFA_prenom);
    console.log('   ✅ Nom:', response.body.ENFA_nom);
    console.log('   ✅ Date naissance:', response.body.ENFA_dateNaissance);
    console.log('   ✅ Niveau audition:', response.body.ENFA_niveauAudition);
    console.log('   ✅ Parent associé:', response.body.parent?.USR_prenom, response.body.parent?.USR_nom);

    // 🔍 ÉTAPE 5: Vérifications de la création
    console.log('\n🔍 === VÉRIFICATIONS CRÉATION ===');
    
    // Vérifier la structure de réponse
    expect(response.body).toHaveProperty('ENFA_id');
    expect(response.body).toHaveProperty('ENFA_prenom', enfantData.ENFA_prenom);
    expect(response.body).toHaveProperty('ENFA_nom', enfantData.ENFA_nom);
    expect(response.body).toHaveProperty('USR_parent_id', enfantData.USR_parent_id);
    expect(response.body).toHaveProperty('parent');
    console.log('   ✅ Structure de réponse valide');
    
    // Vérifier les données de l'enfant
    expect(response.body.ENFA_prenom).toBe(enfantData.ENFA_prenom);
    expect(response.body.ENFA_nom).toBe(enfantData.ENFA_nom);
    expect(response.body.ENFA_niveauAudition).toBe(enfantData.ENFA_niveauAudition);
    console.log('   ✅ Données enfant correctes');

    // Vérifier l'association parent
    expect(response.body.parent).toBeDefined();
    expect(response.body.parent.USR_id).toBe(parentUser.USR_id);
    expect(response.body.parent.USR_nom).toBe(parentUser.USR_nom);
    console.log('   ✅ Association parent correcte');

    // 🗄️ ÉTAPE 6: Vérification des appels de base de données
    console.log('\n🗄️ === VÉRIFICATION BASE DE DONNÉES ===');
    
    expect(ENFA.create).toHaveBeenCalledWith(enfantData);
    console.log('   ✅ Enfant créé en base');
    
    expect(ENFA.findByPk).toHaveBeenCalledWith(enfantCree.ENFA_id, expect.objectContaining({
      include: expect.arrayContaining([
        expect.objectContaining({
          model: USR,
          as: 'parent'
        })
      ])
    }));
    console.log('   ✅ Données enrichies récupérées');

    // 🏠 ÉTAPE 7: Simulation de l'affichage dans l'espace parent
    console.log('\n🏠 === SIMULATION ESPACE PARENT ===');
    
    // Mock pour récupérer les enfants du parent
    const enfantsDuParent = [
      {
        ENFA_id: 1,
        ENFA_prenom: 'Lucas',
        ENFA_nom: 'Martin',
        ENFA_dateNaissance: '2020-03-15',
        ENFA_niveauAudition: 'modere',
        ENFA_dateDebutSuivi: '2025-01-01',
        orthophoniste: {
          USR_id: 2,
          USR_nom: 'Dubois',
          USR_prenom: 'Marie'
        }
      }
    ];

    ENFA.findAll.mockResolvedValue(enfantsDuParent);

    console.log('📡 Récupération des enfants du parent...');
    
    const espaceParentResponse = await request(app)
      .get('/api/enfa/mes-enfants/1')
      .expect(200);

    console.log('📤 Liste des enfants récupérée!');

    // 📋 ÉTAPE 8: Vérification de l'affichage dans l'espace parent
    console.log('\n📋 === VÉRIFICATION ESPACE PARENT ===');
    console.log('   ✅ Nombre d\'enfants:', espaceParentResponse.body.length);
    console.log('   ✅ Premier enfant:', espaceParentResponse.body[0]?.ENFA_prenom, espaceParentResponse.body[0]?.ENFA_nom);
    console.log('   ✅ Orthophoniste associé:', espaceParentResponse.body[0]?.orthophoniste?.USR_prenom, espaceParentResponse.body[0]?.orthophoniste?.USR_nom);

    // Vérifications de l'espace parent
    expect(espaceParentResponse.body).toBeInstanceOf(Array);
    expect(espaceParentResponse.body).toHaveLength(1);
    expect(espaceParentResponse.body[0]).toHaveProperty('ENFA_id', 1);
    expect(espaceParentResponse.body[0]).toHaveProperty('ENFA_prenom', 'Lucas');
    expect(espaceParentResponse.body[0]).toHaveProperty('orthophoniste');
    console.log('   ✅ Enfant visible dans espace parent');

    // Vérifier l'appel à la base pour récupérer les enfants
    expect(ENFA.findAll).toHaveBeenCalledWith({
      where: {
        USR_parent_id: 1
      },
      attributes: expect.any(Array),
      include: expect.any(Array)
    });
    console.log('   ✅ Requête enfants du parent effectuée');

    // 🎉 ÉTAPE 9: Résumé final
    console.log('\n🎉 === RÉSUMÉ FINAL ===');
    console.log('   ✅ Profil enfant créé: RÉUSSI');
    console.log('      - ID enfant:', response.body.ENFA_id);
    console.log('      - Nom complet:', response.body.ENFA_prenom, response.body.ENFA_nom);
    console.log('      - Parent associé:', response.body.parent?.USR_prenom, response.body.parent?.USR_nom);
    console.log('   ✅ Enfant affiché dans espace parent: RÉUSSI');
    console.log('      - Nombre d\'enfants visibles:', espaceParentResponse.body.length);
    console.log('      - Données complètes récupérées: OUI');
    console.log('   ✅ Test TF2 complet: RÉUSSI');
    
    console.log('\n🏁 === FIN DU TEST TF2 ===');
  });

});