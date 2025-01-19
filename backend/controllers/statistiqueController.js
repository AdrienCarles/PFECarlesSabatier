const { STAT, ENFA, SES } = require('../models');

const statistiqueController = {
  // Obtenir la liste complète des statistiques
  getAllStats: async (req, res) => {
    try {
      const stats = await STAT.findAll({
        include: [
          { model: ENFA, as: 'enfant' },
          { model: SES, as: 'serie' }
        ]
      });
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Obtenir une statistique par ID
  getStatById: async (req, res) => {
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
        return res.status(404).json({ message: 'Statistique non trouvée' });
      }
      res.json(stat);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Créer une statistique
  createStat: async (req, res) => {
    try {
      const stat = await STAT.create({
        ...req.body,
        STAT_dernierAcces: new Date()
      });
      res.status(201).json(stat);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Mettre à jour une statistique
  updateStat: async (req, res) => {
    try {
      const { enfaId, sesId } = req.params;
      const stat = await STAT.findOne({
        where: { ENFA_id: enfaId, SES_id: sesId }
      });
      if (!stat) {
        return res.status(404).json({ message: 'Statistique non trouvée' });
      }
      await stat.update({
        ...req.body,
        STAT_dernierAcces: new Date()
      });
      res.json(stat);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Obtenir les statistiques par enfant
  getStatsByEnfant: async (req, res) => {
    try {
      const stats = await STAT.findAll({
        where: { ENFA_id: req.params.enfaId },
        include: [{ model: SES, as: 'serie' }]
      });
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Obtenir les statistiques par série
  getStatsBySerie: async (req, res) => {
    try {
      const stats = await STAT.findAll({
        where: { SES_id: req.params.sesId },
        include: [{ model: ENFA, as: 'enfant' }]
      });
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = statistiqueController;