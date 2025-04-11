import { ANI, USR, SES } from '../models/index.js';
import AppError from '../utils/AppError.js';

const animationController = {
  getAllAnimations: async (req, res, next) => {
    try {
      const animations = await ANI.findAll({
        include: [
          { model: USR, as: 'createur' },
          { model: SES, as: 'serie' }
        ]
      });
      res.json(animations);
    } catch (error) {
      next(new AppError(500, error.message));
    }
  },

  getAnimationById: async (req, res, next) => {
    try {
      const animation = await ANI.findByPk(req.params.id, {
        include: [
          { model: USR, as: 'createur' },
          { model: SES, as: 'serie' }
        ]
      });
      if (!animation) {
        return next(new AppError(404, 'Animation non trouvée'));
      }
      res.json(animation);
    } catch (error) {
      next(new AppError(500, error.message));
    }
  },

  createAnimation: async (req, res, next) => {
    try {
      const animation = await ANI.create({
        ...req.body,
        ANI_date_creation: new Date(),
      });
      res.status(201).json(animation);
    } catch (error) {
      next(new AppError(500, error.message));
    }
  },

  updateAnimation: async (req, res, next) => {
    try {
      const animation = await ANI.findByPk(req.params.id);
      if (!animation) {
        return next(new AppError(404, 'Animation non trouvée'));
      }
      await animation.update(req.body);
      res.json(animation);
    } catch (error) {
      next(new AppError(500, error.message));
    }
  },

  deleteAnimation: async (req, res, next) => {
    try {
      const animation = await ANI.findByPk(req.params.id);
      if (!animation) {
        return next(new AppError(404, 'Animation non trouvée'));
      }
      await animation.destroy();
      res.json({ message: 'Animation supprimée' });
    } catch (error) {
      next(new AppError(500, error.message));
    }
  },

  getAnimationsBySerie: async (req, res, next) => {
    try {
      const animations = await ANI.findAll({
        where: { SES_id: req.params.serieId },
        include: [{ model: USR, as: 'createur' }]
      });
      res.json(animations);
    } catch (error) {
      next(new AppError(500, error.message));
    }
  }
};

export default animationController;