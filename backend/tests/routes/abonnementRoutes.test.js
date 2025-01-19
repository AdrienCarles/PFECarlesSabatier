const request = require('supertest');
const app = require('../../app'); // Remplacez par le chemin vers votre application Express
const { ABM } = require('../../models');

jest.mock('../../models'); // Mock Sequelize pour éviter les appels réels à la base de données

describe('Routes des abonnements', () => {
    beforeAll(() => {
        // Configuration initiale pour l'environnement de test
        console.log('Initialisation des tests des routes d\'abonnement');
    });

    afterEach(() => {
        // Nettoyer les mocks après chaque test
        jest.clearAllMocks();
    });

    afterAll(() => {
        // Nettoyage final après tous les tests
        console.log('Tests des routes d\'abonnement terminés');
    });

    // Tests pour la route GET /api/abm
    describe('GET /api/abm', () => {
        it('doit retourner tous les abonnements', async () => {
            const mockAbonnements = [
                { ABM_id: 1, USR_id: 1, ABM_statut: 'actif' },
                { ABM_id: 2, USR_id: 2, ABM_statut: 'inactif' },
            ];
            ABM.findAll.mockResolvedValue(mockAbonnements);

            const res = await request(app).get('/api/abm');

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(mockAbonnements);
        });

        it('doit gérer les erreurs', async () => {
            ABM.findAll.mockRejectedValue(new Error('Erreur de base de données'));

            const res = await request(app).get('/api/abm');

            expect(res.statusCode).toBe(500);
            expect(res.body).toHaveProperty('message', 'Erreur interne du serveur');
        });
    });

    // Tests pour la route GET /api/abm/:abmId
    describe('GET /api/abm/:abmId', () => {
        it('doit retourner un abonnement avec l\'utilisateur et le paiement associés', async () => {
            const mockAbonnement = {
                ABM_id: 1,
                USR_id: 1,
                utilisateur: { USR_id: 1, USR_email: 'test@test.com' },
                paiement: { PAI_id: 1 },
            };
            ABM.findByPk.mockResolvedValue(mockAbonnement);

            const res = await request(app).get('/api/abm/1');

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('utilisateur'); // Vérifie la présence de l'utilisateur
            expect(res.body).toHaveProperty('paiement'); // Vérifie la présence du paiement
        });

        it('doit retourner 404 si l\'abonnement n\'est pas trouvé', async () => {
            ABM.findByPk.mockResolvedValue(null);

            const res = await request(app).get('/api/abm/999');

            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty('message', 'Abonnement non trouvé');
        });

        it('doit retourner 400 pour un format d\'ID invalide', async () => {
            const res = await request(app).get('/api/abm/abc');

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('message');
        });
    });

    // Tests pour la route POST /api/abm
    describe('POST /api/abm', () => {
        it('doit valider les champs requis', async () => {
            const invalidData = {}; // Données vides pour simuler un cas invalide
            const res = await request(app).post('/api/abm').send(invalidData);

            expect(res.statusCode).toBe(400);
            expect(res.body.error).toBeDefined(); // Vérifie qu'une erreur est retournée
        });

        it('doit créer un nouvel abonnement avec des données valides', async () => {
            const validData = {
                USR_id: 1,
                ABM_dateDebut: '2025-01-01',
                ABM_dateFin: '2025-12-31',
                ABM_prix: 100,
                ABM_statut: 'actif',
            };
            ABM.create.mockResolvedValue({ ABM_id: 1, ...validData });

            const res = await request(app).post('/api/abm').send(validData);

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('ABM_id', 1);
        });
    });

    // Tests pour la route PUT /api/abm/:abmId
    describe('PUT /api/abm/:abmId', () => {
        it('doit mettre à jour un abonnement avec des données valides', async () => {
            const updatedData = {
                ABM_dateDebut: '2025-02-01',
                ABM_dateFin: '2025-12-31',
                ABM_prix: 200,
                ABM_statut: 'actif',
            };

            ABM.findByPk.mockResolvedValue({
                update: jest.fn().mockResolvedValue({ ABM_id: 1, ...updatedData }),
            });

            const res = await request(app).put('/api/abm/1').send(updatedData);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('ABM_prix', 200);
        });

        it('doit retourner 404 si l’abonnement n’est pas trouvé', async () => {
            ABM.findByPk.mockResolvedValue(null);

            const res = await request(app).put('/api/abm/999').send({
                ABM_prix: 200,
            });

            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty('message', 'Abonnement non trouvé');
        });

        it('doit retourner 400 pour un format d’ID invalide', async () => {
            const res = await request(app).put('/api/abm/abc').send({
                ABM_prix: 200,
            });

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('message');
        });
    });

    // Tests pour la route DELETE /api/abm/:abmId
    describe('DELETE /api/abm/:abmId', () => {
        it('doit supprimer un abonnement par son ID', async () => {
            ABM.findByPk.mockResolvedValue({
                destroy: jest.fn().mockResolvedValue(),
            });

            const res = await request(app).delete('/api/abm/1');

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('message', 'Abonnement supprimé avec succès');
        });

        it('doit retourner 404 si l’abonnement n’est pas trouvé', async () => {
            ABM.findByPk.mockResolvedValue(null);

            const res = await request(app).delete('/api/abm/999');

            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty('message', 'Abonnement non trouvé');
        });

        it('doit retourner 400 pour un format d’ID invalide', async () => {
            const res = await request(app).delete('/api/abm/abc');

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('message');
        });
    });

    // Tests pour la route GET /api/abm/par-utilisateur/:usrId
    describe('GET /api/abm/par-utilisateur/:usrId', () => {
        it('doit retourner les abonnements pour un utilisateur spécifique', async () => {
            const mockAbonnements = [
                { ABM_id: 1, USR_id: 1, ABM_statut: 'actif' },
                { ABM_id: 2, USR_id: 1, ABM_statut: 'inactif' },
            ];
            ABM.findAll.mockResolvedValue(mockAbonnements);

            const res = await request(app).get('/api/abm/par-utilisateur/1');

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(mockAbonnements);
        });

        it('doit retourner 400 pour un format d’ID utilisateur invalide', async () => {
            const res = await request(app).get('/api/abm/par-utilisateur/abc');

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('message', "L'ID utilisateur doit être un nombre entier");
        });

        it('doit retourner 404 si aucun abonnement n’est trouvé pour l’utilisateur', async () => {
            ABM.findAll.mockResolvedValue([]);

            const res = await request(app).get('/api/abm/par-utilisateur/999');

            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty('message', 'Aucun abonnement trouvé pour cet utilisateur');
        });
    });

});
