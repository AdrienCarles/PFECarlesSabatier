const { PAI, ABM } = require('../models');
const AppError = require('../utils/AppError');

const paiementController = {
  getAllPaiements: async (req, res, next) => {
    try {
      const paiements = await PAI.findAll({
        include: [{ model: ABM, as: 'abonnements' }]
      });
      res.json(paiements);
    } catch (error) {
      next(new AppError(500, 'Erreur lors de la récupération des paiements'));
    }
  },

  getPaiementById: async (req, res, next) => {
    try {
      const paiement = await PAI.findByPk(req.params.id, {
        include: [{ model: ABM, as: 'abonnements' }]
      });
      if (!paiement) {
        return next(new AppError(404, 'Paiement non trouvé'));
      }
      res.json(paiement);
    } catch (error) {
      next(new AppError(500, 'Erreur lors de la récupération du paiement'));
    }
  },

  createPaiement: async (req, res, next) => {
    try {
      const paiement = await PAI.create(req.body);
      res.status(201).json(paiement);
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        return next(new AppError(400, 'Données de paiement invalides'));
      }
      next(new AppError(500, 'Erreur lors de la création du paiement'));
    }
  },
  
  updatePaiement: async (req, res, next) => {
    try {
      const paiement = await PAI.findByPk(req.params.id);
      if (!paiement) {
        return next(new AppError(404, 'Paiement non trouvé'));
      }
      await paiement.update(req.body);
      res.json(paiement);
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        return next(new AppError(400, 'Données de mise à jour invalides'));
      }
      next(new AppError(500, 'Erreur lors de la mise à jour du paiement'));
    }
  },

  deletePaiement: async (req, res, next) => {
    try {
      const paiement = await PAI.findByPk(req.params.id);
      if (!paiement) {
        return next(new AppError(404, 'Paiement non trouvé'));
      }
      await paiement.destroy();
      res.json({ message: 'Paiement supprimé avec succès' });
    } catch (error) {
      next(new AppError(500, 'Erreur lors de la suppression du paiement'));
    }
  }
};

module.exports = paiementController;