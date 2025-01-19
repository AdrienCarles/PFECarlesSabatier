const { PAI, ABM } = require('../models');

const paiementController = {
  // Obtenir la liste complète des paiements
  getAllPaiements: async (req, res) => {
    try {
      const paiements = await PAI.findAll({
        include: [{ model: ABM, as: 'abonnements' }]
      });
      res.json(paiements);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Obtenir un paiement par ID
  getPaiementById: async (req, res) => {
    try {
      const paiement = await PAI.findByPk(req.params.id, {
        include: [{ model: ABM, as: 'abonnements' }]
      });
      if (!paiement) {
        return res.status(404).json({ message: 'Paiement non trouvé' });
      }
      res.json(paiement);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Créer un paiement
  createPaiement: async (req, res) => {
    try {
      const paiement = await PAI.create(req.body);
      res.status(201).json(paiement);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Mettre à jour un paiement
  updatePaiement: async (req, res) => {
    try {
      const paiement = await PAI.findByPk(req.params.id);
      if (!paiement) {
        return res.status(404).json({ message: 'Paiement non trouvé' });
      }
      await paiement.update(req.body);
      res.json(paiement);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Supprimer un paiement
  deletePaiement: async (req, res) => {
    try {
      const paiement = await PAI.findByPk(req.params.id);
      if (!paiement) {
        return res.status(404).json({ message: 'Paiement non trouvé' });
      }
      await paiement.destroy();
      res.json({ message: 'Paiement supprimé' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = paiementController;