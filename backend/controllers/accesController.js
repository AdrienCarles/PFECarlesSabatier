const { ACCES, USR, SES } = require('../models');

const accesController = {
  // Obtenir la liste complète des accès
  getAllAcces: async (req, res) => {
    try {
      const acces = await ACCES.findAll({
        include: [
          { model: USR, as: 'utilisateur' },
          { model: SES, as: 'serie' }
        ]
      });
      res.json(acces);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Obtenir un accès par ID
  getAccesById: async (req, res) => {
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
        return res.status(404).json({ message: 'Accès non trouvé' });
      }
      res.json(acces);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Créer un accès
  createAcces: async (req, res) => {
    try {
      const { USR_id, SES_id } = req.body;
      
      if (!USR_id || !SES_id) {
        return res.status(400).json({ message: 'Utilisateur et série requis' });
      }

      const acces = await ACCES.create({
        USR_id,
        SES_id
      });
      res.status(201).json(acces);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Supprimer un accès
  deleteAcces: async (req, res) => {
    try {
      const { userId, serieId } = req.params;
      const deleted = await ACCES.destroy({
        where: {
          USR_id: userId,
          SES_id: serieId
        }
      });
      if (!deleted) {
        return res.status(404).json({ message: 'Accès non trouvé' });
      }
      res.json({ message: 'Accès supprimé avec succès' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Obtenir les accès par utilisateur
  getUserAcces: async (req, res) => {
    try {
      const acces = await ACCES.findAll({
        where: { USR_id: req.params.userId },
        include: [{ model: SES, as: 'serie' }]
      });
      res.json(acces);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = accesController;