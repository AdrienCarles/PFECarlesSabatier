const { STAT, ENFA, SES } = require('../models');
const AppError = require('../utils/AppError');

const statistiqueController = {
  getAllStats: async (req, res, next) => {
    try {
      const stats = await STAT.findAll({
        include: [
          { model: ENFA, as: 'enfant' },
          { model: SES, as: 'serie' }
        ]
      });
      res.json(stats);
    } catch (error) {
      next(new AppError(500, 'Erreur lors de la récupération des statistiques'));
    }
  },

  getStatById: async (req, res, next) => {
    try {
      const { enfaId, sesId } = req.params;
      const stat = await STAT.findOne({
        where: { ENFA_id: enfaId, SES_id: sesId },
        include: [
          { model: ENFA, as: 'enfant' },
          { model: SES, as: 'serie' }
        ]
      });
      if (!stat) {
        return next(new AppError(404, 'Statistique non trouvée'));
      }
      res.json(stat);
    } catch (error) {
      next(new AppError(500, 'Erreur lors de la récupération de la statistique'));
    }
  },

  createStat: async (req, res, next) => {
    try {
      const stat = await STAT.create({
        ...req.body,
        STAT_dernierAcces: new Date()
      });
      res.status(201).json(stat);
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        return next(new AppError(400, 'Données de statistique invalides'));
      }
      next(new AppError(500, 'Erreur lors de la création de la statistique'));
    }
  },

  updateStat: async (req, res, next) => {
    try {
      const { enfaId, sesId } = req.params;
      const stat = await STAT.findOne({
        where: { ENFA_id: enfaId, SES_id: sesId }
      });
      if (!stat) {
        return next(new AppError(404, 'Statistique non trouvée'));
      }
      await stat.update({
        ...req.body,
        STAT_dernierAcces: new Date()
      });
      res.json(stat);
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        return next(new AppError(400, 'Données de mise à jour invalides'));
      }
      next(new AppError(500, 'Erreur lors de la mise à jour de la statistique'));
    }
  },

  getStatsByEnfant: async (req, res, next) => {
    try {
      const stats = await STAT.findAll({
        where: { ENFA_id: req.params.enfaId },
        include: [{ model: SES, as: 'serie' }]
      });
      res.json(stats);
    } catch (error) {
      next(new AppError(500, 'Erreur lors de la récupération des statistiques de l\'enfant'));
    }
  },

  getStatsBySerie: async (req, res, next) => {
    try {
      const stats = await STAT.findAll({
        where: { SES_id: req.params.sesId },
        include: [{ model: ENFA, as: 'enfant' }]
      });
      res.json(stats);
    } catch (error) {
      next(new AppError(500, 'Erreur lors de la récupération des statistiques de la série'));
    }
  }
};

module.exports = statistiqueController;