const Joi = require('joi');
const abonnementSchema = require('../../validations/abonnementSchema');

describe('Abonnement Schema Validation', () => {
  describe('create schema', () => {
    it('should validate a valid abonnement object', () => {
      const validData = {
        USR_id: 1,
        ABM_dateDebut: '2025-01-01',
        ABM_dateFin: '2025-12-31',
        ABM_prix: 100,
        ABM_statut: 'actif',
      };

      const { error } = abonnementSchema.create.validate(validData);
      expect(error).toBeUndefined(); // Pas d'erreur attendue
    });

    it('should return an error if USR_id is missing', () => {
      const invalidData = {
        ABM_dateDebut: '2025-01-01',
        ABM_dateFin: '2025-12-31',
        ABM_prix: 100,
        ABM_statut: 'actif',
      };

      const { error } = abonnementSchema.create.validate(invalidData);
      expect(error).toBeDefined();
      expect(error.details[0].message).toBe("L'ID utilisateur est requis");
    });

    it('should return an error if ABM_dateFin is earlier than ABM_dateDebut', () => {
      const invalidData = {
        USR_id: 1,
        ABM_dateDebut: '2025-12-31',
        ABM_dateFin: '2025-01-01',
        ABM_prix: 100,
        ABM_statut: 'actif',
      };

      const { error } = abonnementSchema.create.validate(invalidData);
      expect(error).toBeDefined();
      expect(error.details[0].message).toBe(
        'La date de fin doit être postérieure à la date de début'
      );
    });

    it('should return an error if ABM_prix is negative', () => {
      const invalidData = {
        USR_id: 1,
        ABM_dateDebut: '2025-01-01',
        ABM_dateFin: '2025-12-31',
        ABM_prix: -100,
        ABM_statut: 'actif',
      };

      const { error } = abonnementSchema.create.validate(invalidData);
      expect(error).toBeDefined();
      expect(error.details[0].message).toBe('Le prix doit être positif');
    });

    it('should return an error if ABM_statut is not valid', () => {
      const invalidData = {
        USR_id: 1,
        ABM_dateDebut: '2025-01-01',
        ABM_dateFin: '2025-12-31',
        ABM_prix: 100,
        ABM_statut: 'non-valide',
      };

      const { error } = abonnementSchema.create.validate(invalidData);
      expect(error).toBeDefined();
      expect(error.details[0].message).toBe(
        'Le statut doit être actif, inactif ou suspendu'
      );
    });
  });

  describe('params schema', () => {
    it('should validate a valid abmId', () => {
      const validParams = { abmId: 1 };

      const { error } = abonnementSchema.params.validate(validParams);
      expect(error).toBeUndefined(); // Pas d'erreur attendue
    });

    it('should return an error if abmId is missing', () => {
      const invalidParams = {};

      const { error } = abonnementSchema.params.validate(invalidParams);
      expect(error).toBeDefined();
      expect(error.details[0].message).toBe("L'ID de l'abonnement est requis");
    });

    it('should return an error if abmId is not a number', () => {
      const invalidParams = { abmId: 'abc' };

      const { error } = abonnementSchema.params.validate(invalidParams);
      expect(error).toBeDefined();
      expect(error.details[0].message).toBe("L'ID de l'abonnement doit être un nombre entier");
    });
  });

  describe('userParams schema', () => {
    it('should validate a valid usrId', () => {
      const validParams = { usrId: 1 };

      const { error } = abonnementSchema.userParams.validate(validParams);
      expect(error).toBeUndefined(); // Pas d'erreur attendue
    });

    it('should return an error if usrId is missing', () => {
      const invalidParams = {};

      const { error } = abonnementSchema.userParams.validate(invalidParams);
      expect(error).toBeDefined();
      expect(error.details[0].message).toBe("L'ID de l'utilisateur est requis");
    });

    it('should return an error if usrId is not a number', () => {
      const invalidParams = { usrId: 'abc' };

      const { error } = abonnementSchema.userParams.validate(invalidParams);
      expect(error).toBeDefined();
      expect(error.details[0].message).toBe("L'ID de l'utilisateur doit être un nombre entier");
    });
  });
});
