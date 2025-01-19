// Mock environment and config first
process.env.NODE_ENV = 'test';

// Mock config before requiring any modules
jest.mock('../../config/config.js', () => ({
    test: {
        database: 'test_db',
        username: 'test',
        password: 'test',
        host: '127.0.0.1',
        dialect: 'mysql'
    }
}));

// Mock Sequelize
jest.mock('sequelize', () => {
    const actualSequelize = jest.requireActual('sequelize');
    const mockSequelize = jest.fn(() => ({
        define: jest.fn(),
        sync: jest.fn(),
        model: jest.fn()
    }));
    mockSequelize.DataTypes = actualSequelize.DataTypes;
    return {
        Sequelize: mockSequelize
    };
});

// Mock models
jest.mock('../../models/index.js', () => ({
    ABM: {
        findAll: jest.fn(),
        findByPk: jest.fn(),
        create: jest.fn(),
        update: jest.fn()
    },
    USR: {
        findAll: jest.fn(),
        findByPk: jest.fn()
    },
    PAI: {
        findAll: jest.fn(),
        findByPk: jest.fn()
    }
}));

// Mock AppError
jest.mock('../../utils/AppError.js', () => {
    return class AppError extends Error {
        constructor(statusCode, message) {
            super(message);
            this.statusCode = statusCode;
            this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        }
    }
});

const { ABM, USR, PAI } = require('../../models/index.js');
const abonnementController = require('../../controllers/abonnementController.js');
const AppError = require('../../utils/AppError.js');

describe('AbonnementController', () => {
    let mockReq;
    let mockRes;
    let mockNext;

    beforeEach(() => {
        mockReq = {
            params: {},
            body: {}
        };
        mockRes = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };
        mockNext = jest.fn();

        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    describe('getAllAbonnements', () => {
        it('should return all abonnements', async () => {
            const mockAbonnements = [
                { id: 1, USR_id: 1, ABM_prix: 100 },
                { id: 2, USR_id: 2, ABM_prix: 200 }
            ];
            ABM.findAll.mockResolvedValue(mockAbonnements);

            await abonnementController.getAllAbonnements(mockReq, mockRes, mockNext);

            expect(ABM.findAll).toHaveBeenCalledWith({
                include: [
                    { model: USR, as: 'utilisateur' },
                    { model: PAI, as: 'paiement' }
                ]
            });
            expect(mockRes.json).toHaveBeenCalledWith(mockAbonnements);
        });

        it('should handle errors', async () => {
            const error = new Error('Database error');
            ABM.findAll.mockRejectedValue(error);

            await abonnementController.getAllAbonnements(mockReq, mockRes, mockNext);

            expect(mockNext).toHaveBeenCalledWith(
                expect.objectContaining({
                    statusCode: 500,
                    message: error.message
                })
            );
        });
    });

    describe('getAbonnementById', () => {
        it('should return abonnement by id', async () => {
            const mockAbonnement = { id: 1, USR_id: 1, ABM_prix: 100 };
            mockReq.params.id = 1;
            ABM.findByPk.mockResolvedValue(mockAbonnement);

            await abonnementController.getAbonnementById(mockReq, mockRes, mockNext);

            expect(ABM.findByPk).toHaveBeenCalledWith(1, {
                include: [
                    { model: USR, as: 'utilisateur' },
                    { model: PAI, as: 'paiement' }
                ]
            });
            expect(mockRes.json).toHaveBeenCalledWith(mockAbonnement);
        });

        it('should handle not found', async () => {
            mockReq.params.id = 999;
            ABM.findByPk.mockResolvedValue(null);

            await abonnementController.getAbonnementById(mockReq, mockRes, mockNext);

            expect(mockNext).toHaveBeenCalledWith(
                expect.objectContaining({
                    statusCode: 404,
                    message: 'Abonnement non trouvé'
                })
            );
        });
    });

    describe('createAbonnement', () => {
        it('should create new abonnement', async () => {
            const mockAbonnement = {
                USR_id: 1,
                ABM_prix: 100,
                ABM_dateDebut: new Date(),
                ABM_dateFin: new Date()
            };
            mockReq.body = mockAbonnement;
            ABM.create.mockResolvedValue(mockAbonnement);

            await abonnementController.createAbonnement(mockReq, mockRes, mockNext);

            expect(ABM.create).toHaveBeenCalledWith(mockAbonnement);
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith(mockAbonnement);
        });
    });

    describe('updateAbonnement', () => {
        it('should update existing abonnement', async () => {
            const mockAbonnement = {
                id: 1,
                update: jest.fn().mockResolvedValue({ id: 1, USR_id: 1, ABM_prix: 200 })
            };
            mockReq.params.id = 1;
            mockReq.body = { ABM_prix: 200 };
            ABM.findByPk.mockResolvedValue(mockAbonnement);

            await abonnementController.updateAbonnement(mockReq, mockRes, mockNext);

            expect(mockAbonnement.update).toHaveBeenCalledWith(mockReq.body);
            expect(mockRes.json).toHaveBeenCalled();
        });
    });

    describe('deleteAbonnement', () => {
        it('should delete existing abonnement', async () => {
            const mockAbonnement = {
                id: 1,
                destroy: jest.fn().mockResolvedValue(undefined)
            };
            mockReq.params.id = 1;
            ABM.findByPk.mockResolvedValue(mockAbonnement);

            await abonnementController.deleteAbonnement(mockReq, mockRes, mockNext);

            expect(mockAbonnement.destroy).toHaveBeenCalled();
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
                message: expect.any(String)
            }));
        });
    });

    describe('getAbonnementsByUser', () => {
        it('should return abonnements for user', async () => {
            const mockAbonnements = [
                { id: 1, USR_id: 1, ABM_prix: 100 },
                { id: 2, USR_id: 1, ABM_prix: 200 }
            ];
            mockReq.params.userId = 1;
            ABM.findAll.mockResolvedValue(mockAbonnements);

            await abonnementController.getAbonnementsByUser(mockReq, mockRes, mockNext);

            expect(ABM.findAll).toHaveBeenCalledWith({
                where: { USR_id: 1 },
                include: [{ model: PAI, as: 'paiement' }]
            });
            expect(mockRes.json).toHaveBeenCalledWith(mockAbonnements);
        });
    });
});