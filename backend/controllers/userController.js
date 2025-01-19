const { USR, ENFA, ABM, ACCES, ANI, SES } = require('../models');
const AppError = require('../utils/AppError');

const userController = {
  getAllUsers: async (req, res, next) => {
    try {
      const users = await USR.findAll();
      res.json(users);
    } catch (error) {
      next(new AppError(500, 'Erreur lors de la récupération des utilisateurs'));
    }
  },

  getUserById: async (req, res, next) => {
    try {
      const user = await USR.findByPk(req.params.id, {
        include: [
          { model: ENFA, as: 'enfantsParent' },
          { model: ENFA, as: 'enfantsOrthophoniste' },
          { model: ABM, as: 'abonnements' },
          { model: SES, as: 'series' },
          { model: ANI, as: 'animations' }
        ]
      });
      if (!user) {
        return next(new AppError(404, 'Utilisateur non trouvé'));
      }
      res.json(user);
    } catch (error) {
      next(new AppError(500, 'Erreur lors de la récupération de l\'utilisateur'));
    }
  },

  createUser: async (req, res, next) => {
    try {
      const { USR_email, USR_pass, USR_role, ...otherData } = req.body;
      
      if (!USR_email || !USR_pass || !USR_role) {
        return next(new AppError(400, 'Email, mot de passe et rôle requis'));
      }

      const user = await USR.create({
        USR_email,
        USR_pass,
        USR_role,
        USR_dateCreation: new Date(),
        ...otherData
      });
      res.status(201).json(user);
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        return next(new AppError(400, 'Données utilisateur invalides'));
      }
      next(new AppError(500, 'Erreur lors de la création de l\'utilisateur'));
    }
  },

  updateUser: async (req, res, next) => {
    try {
      const user = await USR.findByPk(req.params.id);
      if (!user) {
        return next(new AppError(404, 'Utilisateur non trouvé'));
      }
      await user.update(req.body);
      res.json(user);
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        return next(new AppError(400, 'Données de mise à jour invalides'));
      }
      next(new AppError(500, 'Erreur lors de la mise à jour de l\'utilisateur'));
    }
  },

  deleteUser: async (req, res, next) => {
    try {
      const user = await USR.findByPk(req.params.id);
      if (!user) {
        return next(new AppError(404, 'Utilisateur non trouvé'));
      }
      await user.destroy();
      res.json({ message: 'Utilisateur supprimé avec succès' });
    } catch (error) {
      next(new AppError(500, 'Erreur lors de la suppression de l\'utilisateur'));
    }
  },

  getParentChildren: async (req, res, next) => {
    try {
      const children = await ENFA.findAll({
        where: { USR_parent_id: req.params.id }
      });
      res.json(children);
    } catch (error) {
      next(new AppError(500, 'Erreur lors de la récupération des enfants du parent'));
    }
  },

  getOrthophonisteChildren: async (req, res, next) => {
    try {
      const children = await ENFA.findAll({
        where: { USR_orthophoniste_id: req.params.id }
      });
      res.json(children);
    } catch (error) {
      next(new AppError(500, 'Erreur lors de la récupération des enfants de l\'orthophoniste'));
    }
  }
};

module.exports = userController;