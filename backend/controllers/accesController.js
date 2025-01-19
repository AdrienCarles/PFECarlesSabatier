const { ACCES, USR, SES } = require('../models');
const AppError = require('../utils/AppError');

const accesController = {
  getAllAcces: async (req, res, next) => {
    try {
      const allAcces = await ACCES.findAll({
        include: [
          { model: USR, as: 'utilisateur' },
          { model: SES, as: 'serie' }
        ]
      });
      res.json(allAcces);
    } catch (error) {
      next(new AppError(500, error.message));
    }
  },

  getAccesById: async (req, res, next) => {
    try {
      const { userId, serieId } = req.params;
      const acces = await ACCES.findOne({
        where: {
          USR_id: userId,
          SES_id: serieId
        },
        include: [
          { model: USR, as: 'utilisateur' },
          { model: SES, as: 'serie' }
        ]
      });
      
      if (!acces) {
        return next(new AppError(404, 'Accès non trouvé'));
      }
      res.json(acces);
    } catch (error) {
      next(new AppError(500, error.message));
    }
  },

  createAcces: async (req, res, next) => {
    try {
      const { USR_id, SES_id } = req.body;
      
      if (!USR_id || !SES_id) {
        return next(new AppError(400, 'Utilisateur et série requis'));
      }

      const acces = await ACCES.create({
        USR_id,
        SES_id
      });
      res.status(201).json(acces);
    } catch (error) {
      next(new AppError(400, error.message));
    }
  },

  deleteAcces: async (req, res, next) => {
    try {
      const { userId, serieId } = req.params;
      const acces = await ACCES.findOne({
        where: {
          USR_id: userId,
          SES_id: serieId
        }
      });

      if (!acces) {
        return next(new AppError(404, 'Accès non trouvé'));
      }

      await acces.destroy();
      res.json({ message: 'Accès supprimé avec succès' });
    } catch (error) {
      next(new AppError(500, error.message));
    }
  },

  getUserAcces: async (req, res) => {
    try {
      const acces = await ACCES.findAll({
        where: { USR_id: req.params.userId },
        include: [{ model: SES, as: 'serie' }]
      });
      res.json(acces);
    } catch (error) {
      next(new AppError(500, error.message));
    }
  }
};

module.exports = accesController;