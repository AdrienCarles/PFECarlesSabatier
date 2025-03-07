import { Sequelize, DataTypes } from 'sequelize';
import AbonnementModel from '../../models/abm.js';

let sequelize;
let Abonnement;

beforeAll(async () => {
  sequelize = new Sequelize('sqlite::memory:', { logging: false }); // Base de données en mémoire
  Abonnement = AbonnementModel(sequelize, DataTypes);
  await sequelize.sync(); // Synchronisation du modèle
});

afterAll(async () => {
  await sequelize.close();
});

describe('Modèle ABM - Structure', () => {
  it('devrait contenir les bonnes colonnes', () => {
    const attributes = Abonnement.rawAttributes;

    expect(attributes).toHaveProperty('ABM_id');
    expect(attributes).toHaveProperty('ABM_dateDebut');
    expect(attributes).toHaveProperty('ABM_dateFin');
    expect(attributes).toHaveProperty('ABM_prix');
    expect(attributes).toHaveProperty('ABM_statut');
    expect(attributes).toHaveProperty('PAI_id');
    expect(attributes).toHaveProperty('USR_id');
  });

  it('devrait avoir un statut par défaut actif', async () => {
    const abonnement = await Abonnement.create({
      ABM_dateDebut: new Date(),
      ABM_dateFin: new Date(new Date().getTime() + 86400000), // +1 jour
      ABM_prix: 100,
      PAI_id: 1,
      USR_id: 1,
    });

    expect(abonnement.ABM_statut).toBe('actif');
  });
});

describe('Modèle ABM - Contraintes de validation', () => {
  it('devrait refuser un abonnement sans date de début', async () => {
    await expect(
      Abonnement.create({
        ABM_dateFin: new Date(),
        ABM_prix: 100,
        PAI_id: 1,
        USR_id: 1,
      })
    ).rejects.toThrow();
  });

  it('devrait refuser un abonnement si la date de fin est avant la date de début', async () => {
    await expect(
      Abonnement.create({
        ABM_dateDebut: new Date(),
        ABM_dateFin: new Date(new Date().getTime() - 86400000), // -1 jour
        ABM_prix: 100,
        PAI_id: 1,
        USR_id: 1,
      })
    ).rejects.toThrow(
      'La date de fin doit être postérieure à la date de début'
    );
  });

  it('devrait refuser un abonnement avec un prix négatif', async () => {
    await expect(
      Abonnement.create({
        ABM_dateDebut: new Date(),
        ABM_dateFin: new Date(new Date().getTime() + 86400000),
        ABM_prix: -50,
        PAI_id: 1,
        USR_id: 1,
      })
    ).rejects.toThrow();
  });

  it('devrait refuser un abonnement avec un statut non valide', async () => {
    await expect(
      Abonnement.create({
        ABM_dateDebut: new Date(),
        ABM_dateFin: new Date(new Date().getTime() + 86400000),
        ABM_prix: 100,
        ABM_statut: 'non-valide', // Valeur invalide
        PAI_id: 1,
        USR_id: 1,
      })
    ).rejects.toThrow();
  });
});

describe('Modèle ABM - Relations', () => {
  it('devrait être lié à un utilisateur', async () => {
    expect(Abonnement.associations.utilisateur).toBeDefined();
    expect(Abonnement.associations.utilisateur.foreignKey).toBe('USR_id');
  });

  it('devrait être lié à un paiement', async () => {
    expect(Abonnement.associations.paiement).toBeDefined();
    expect(Abonnement.associations.paiement.foreignKey).toBe('PAI_id');
  });
});

describe('Modèle ABM - CRUD', () => {
  let abonnement;

  beforeEach(async () => {
    abonnement = await Abonnement.create({
      ABM_dateDebut: new Date(),
      ABM_dateFin: new Date(new Date().getTime() + 86400000),
      ABM_prix: 100,
      PAI_id: 1,
      USR_id: 1,
    });
  });

  it('devrait récupérer un abonnement par son ID', async () => {
    const found = await Abonnement.findByPk(abonnement.ABM_id);
    expect(found).not.toBeNull();
    expect(found.ABM_prix).toBe(100);
  });

  it('devrait mettre à jour un abonnement', async () => {
    await abonnement.update({ ABM_prix: 150 });
    const updated = await Abonnement.findByPk(abonnement.ABM_id);
    expect(updated.ABM_prix).toBe(150);
  });

  it('devrait supprimer un abonnement', async () => {
    await abonnement.destroy();
    const found = await Abonnement.findByPk(abonnement.ABM_id);
    expect(found).toBeNull();
  });
});
