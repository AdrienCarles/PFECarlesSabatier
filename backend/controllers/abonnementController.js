import { ABM, USR, PAI } from '../models/index.js';
import AppError from '../utils/AppError.js';

const abonnementController = {
  getAllAbonnements: async (req, res, next) => {
    try {
      const abonnements = await ABM.findAll({
        include: [
          { model: USR, as: 'utilisateur' },
          { model: PAI, as: 'paiement' }
        ]
      });
      res.json(abonnements);
    } catch (error) {
      next(new AppError(500, error.message));
    }
  },

  getAbonnementById: async (req, res, next) => {
    try {
      const abonnement = await ABM.findByPk(req.params.id, {
        include: [
          { model: USR, as: 'utilisateur' },
          { model: PAI, as: 'paiement' }
        ]
      });
      if (!abonnement) {
        return next(new AppError(404, 'Abonnement non trouvé'));
      }
      res.json(abonnement);
    } catch (error) {
      next(new AppError(500, error.message));
    }
  },

  createAbonnement: async (req, res, next) => {
    try {
      const abonnement = await ABM.create(req.body);
      res.status(201).json(abonnement);
    } catch (error) {
      next(new AppError(400, error.message));
    }
  },

  updateAbonnement: async (req, res, next) => {
    try {
      const abonnement = await ABM.findByPk(req.params.id);
      if (!abonnement) {
        return next(new AppError(404, 'Abonnement non trouvé'));
      }
      await abonnement.update(req.body);
      res.json(abonnement);
    } catch (error) {
      next(new AppError(400, error.message));
    }
  },

  deleteAbonnement: async (req, res, next) => {
    try {
      const abonnement = await ABM.findByPk(req.params.id);
      if (!abonnement) {
        return next(new AppError(404, 'Abonnement non trouvé'));
      }
      await abonnement.destroy();
      res.json({ message: 'Abonnement supprimé avec succès' });
    } catch (error) {
      next(new AppError(500, error.message));
    }
  },

  getAbonnementsByUser: async (req, res, next) => {
    try {
      const abonnements = await ABM.findAll({
        where: { USR_id: req.params.userId },
        include: [{ model: PAI, as: 'paiement' }]
      });
      res.json(abonnements);
    } catch (error) {
      next(new AppError(500, error.message));
    }
  }
};

export default abonnementController;