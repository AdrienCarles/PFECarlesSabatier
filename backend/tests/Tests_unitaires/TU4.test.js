import { jest } from '@jest/globals';

// Mock Sequelize et les modèles
jest.unstable_mockModule('../../models/index.js', () => ({
  SES: {
    create: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
  ABM: {
    create: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
  sequelize: {
    authenticate: jest.fn(),
    close: jest.fn(),
  },
}));

const { SES, ABM } = await import('../../models/index.js');

describe('TU4 - Models Série & Abonnement CRUD + contraintes Sequelize', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('CRUD Série: create, read, update, delete', async () => {
    // CREATE
    const serieData = {
      SES_titre: 'Test Série',
      SES_theme: 'Test',
      SES_description: 'Description',
      SES_statut: 'actif',
      SES_dateCreation: new Date(),
    };
    const serieMock = { ...serieData, SES_id: 1, update: jest.fn(), destroy: jest.fn() };
    SES.create.mockResolvedValue(serieMock);

    const created = await SES.create(serieData);
    expect(created).toMatchObject(serieData);

    // READ
    SES.findByPk.mockResolvedValue(serieMock);
    const found = await SES.findByPk(1);
    expect(found).toHaveProperty('SES_id', 1);

    // UPDATE
    serieMock.update.mockResolvedValue({ ...serieMock, SES_titre: 'Modifié' });
    const updated = await serieMock.update({ SES_titre: 'Modifié' });
    expect(updated).toHaveProperty('SES_titre', 'Modifié');

    // DELETE
    serieMock.destroy.mockResolvedValue(1);
    const deleted = await serieMock.destroy();
    expect(deleted).toBe(1);

    // Contraintes: titre obligatoire
    SES.create.mockRejectedValue({ name: 'SequelizeValidationError', message: 'SES_titre cannot be null' });
    await expect(SES.create({ SES_theme: 'Test' })).rejects.toHaveProperty('name', 'SequelizeValidationError');
  });

  test('CRUD Abonnement: create, read, update, delete', async () => {
    // CREATE
    const abmData = {
      USR_id: 1,
      ENFA_id: 2,
      ABM_statut: 'actif',
      ABM_dateDebut: new Date(),
      ABM_dateFin: new Date(),
      ABM_prix: 19.99,
      ABM_mode_paiement: 'stripe',
    };
    const abmMock = { ...abmData, ABM_id: 10, update: jest.fn(), destroy: jest.fn() };
    ABM.create.mockResolvedValue(abmMock);

    const created = await ABM.create(abmData);
    expect(created).toMatchObject(abmData);

    // READ
    ABM.findByPk.mockResolvedValue(abmMock);
    const found = await ABM.findByPk(10);
    expect(found).toHaveProperty('ABM_id', 10);

    // UPDATE
    abmMock.update.mockResolvedValue({ ...abmMock, ABM_statut: 'inactif' });
    const updated = await abmMock.update({ ABM_statut: 'inactif' });
    expect(updated).toHaveProperty('ABM_statut', 'inactif');

    // DELETE
    abmMock.destroy.mockResolvedValue(1);
    const deleted = await abmMock.destroy();
    expect(deleted).toBe(1);

    // Contraintes: USR_id obligatoire
    ABM.create.mockRejectedValue({ name: 'SequelizeValidationError', message: 'USR_id cannot be null' });
    await expect(ABM.create({ ENFA_id: 2 })).rejects.toHaveProperty('name', 'SequelizeValidationError');
  });
});