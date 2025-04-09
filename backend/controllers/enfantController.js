import { ENFA, USR, STAT } from '../models/index.js';
import AppError from '../utils/AppError.js';

const enfantController = {
  getAllEnfants: async (req, res, next) => {
    try {
      const enfants = await ENFA.findAll({
        include: [
          { model: USR, as: 'parent' },
          { model: USR, as: 'orthophoniste' },
          { model: STAT, as: 'statistiques' }
        ]
      });
      res.json(enfants);
    } catch (error) {
      next(new AppError(500, error.message));
    }
  },

  getEnfantById: async (req, res, next) => {
    try {
      const enfant = await ENFA.findByPk(req.params.id, {
        include: [
          { model: USR, as: 'parent' },
          { model: USR, as: 'orthophoniste' },
          { model: STAT, as: 'statistiques' }
        ]
      });
      if (!enfant) {
        return next(new AppError(404, 'Enfant non trouvé'));
      }
      res.json(enfant);
    } catch (error) {
      next(new AppError(500, error.message));
    }
  },

  createEnfant: async (req, res, next) => {
    console.log("📥 Données reçues pour création d'enfant :", req.body); // ← on log ce qu’on reçoit
  
    try {
      const enfant = await ENFA.create(req.body);
      res.status(201).json(enfant);
    } catch (error) {
      console.error("❌ ERREUR SQL :", error); // ← on log l’erreur SQL détaillée
      next(new AppError(500, error?.original?.sqlMessage || error.message));
    }
  },

  updateEnfant: async (req, res, next) => {
    try {
      const enfant = await ENFA.findByPk(req.params.id);
      if (!enfant) {
        return next(new AppError(404, 'Enfant non trouvé'));
      }
      await enfant.update(req.body);
      res.json(enfant);
    } catch (error) {
      next(new AppError(400, error.message));
    }
  },

  deleteEnfant: async (req, res, next) => {
    try {
      const enfant = await ENFA.findByPk(req.params.id);
      if (!enfant) {
        return next(new AppError(404, 'Enfant non trouvé'));
      }
      await enfant.destroy();
      res.json({ message: 'Enfant supprimé avec succès' });
    } catch (error) {
      next(new AppError(500, error.message));
    }
  },

  getEnfantsByParent: async (req, res, next) => {
    try {
      const enfants = await ENFA.findAll({
        where: { USR_parent_id: req.params.parentId },
        include: [
          { model: USR, as: 'orthophoniste' },
          { model: STAT, as: 'statistiques' }
        ]
      });
      res.json(enfants);
    } catch (error) {
      next(new AppError(500, error.message));
    }
  },

  getEnfantsByOrthophoniste: async (req, res, next) => {
    try {
      const enfants = await ENFA.findAll({
        where: { USR_orthophoniste_id: req.params.orthophonisteId },
        include: [
          { model: USR, as: 'parent' },
          { model: STAT, as: 'statistiques' }
        ]
      });
      res.json(enfants);
    } catch (error) {
      next(new AppError(500, error.message));
    }
  }
};

export default enfantController;