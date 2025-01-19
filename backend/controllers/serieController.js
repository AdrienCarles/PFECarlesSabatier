const { SES, ANI, ACCES, USR } = require('../models');

const serieController = {
  // Obtenir la liste complète des séries
  getAllSeries: async (req, res) => {
    try {
      const series = await SES.findAll({
        include: [
          { model: ANI, as: 'animations' },
          { model: USR, as: 'utilisateurs' }
        ]
      });
      res.json(series);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Obtenir une série par ID
  getSerieById: async (req, res) => {
    try {
      const serie = await SES.findByPk(req.params.id, {
        include: [
          { model: ANI, as: 'animations' },
          { model: USR, as: 'utilisateurs' }
        ]
      });
      if (!serie) {
        return res.status(404).json({ message: 'Série non trouvée' });
      }
      res.json(serie);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Créer une série
  createSerie: async (req, res) => {
    try {
      const { SES_titre, SES_statut, ...otherData } = req.body;
      
      if (!SES_titre || !SES_statut) {
        return res.status(400).json({ message: 'Titre et statut requis' });
      }

      const serie = await SES.create({
        SES_titre,
        SES_statut,
        ...otherData
      });
      res.status(201).json(serie);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Mettre à jour une série
  updateSerie: async (req, res) => {
    try {
      const serie = await SES.findByPk(req.params.id);
      if (!serie) {
        return res.status(404).json({ message: 'Série non trouvée' });
      }
      await serie.update(req.body);
      res.json(serie);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Supprimer une série
  deleteSerie: async (req, res) => {
    try {
      const serie = await SES.findByPk(req.params.id);
      if (!serie) {
        return res.status(404).json({ message: 'Série non trouvée' });
      }
      await serie.destroy();
      res.json({ message: 'Série supprimée' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = serieController;