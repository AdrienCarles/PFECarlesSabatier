const { ABM, USR, PAI } = require('../models');

const abonnementController = {
  // Obtenir la liste complète des abonnements
  getAllAbonnements: async (req, res) => {
    try {
      const abonnements = await ABM.findAll({
        include: [
          { model: USR, as: 'utilisateur' },
          { model: PAI, as: 'paiement' }
        ]
      });
      res.json(abonnements);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Obtenir un abonnement par ID
  getAbonnementById: async (req, res) => {
    try {
      const abonnement = await ABM.findByPk(req.params.id, {
        include: [
          { model: USR, as: 'utilisateur' },
          { model: PAI, as: 'paiement' }
        ]
      });
      if (!abonnement) {
        return res.status(404).json({ message: 'Abonnement non trouvé' });
      }
      res.json(abonnement);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Créer un abonnement
  createAbonnement: async (req, res) => {
    try {
      const { USR_id, ABM_dateDebut, ABM_dateFin, ABM_prix, ABM_statut } = req.body;
      
      if (!USR_id || !ABM_dateDebut || !ABM_dateFin || !ABM_prix || !ABM_statut) {
        return res.status(400).json({ message: 'Tous les champs requis doivent être remplis' });
      }

      const abonnement = await ABM.create({
        USR_id,
        ABM_dateDebut,
        ABM_dateFin,
        ABM_prix,
        ABM_statut
      });

      res.status(201).json(abonnement);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Mettre à jour un abonnement
  updateAbonnement: async (req, res) => {
    try {
      const abonnement = await ABM.findByPk(req.params.id);
      if (!abonnement) {
        return res.status(404).json({ message: 'Abonnement non trouvé' });
      }
      await abonnement.update(req.body);
      res.json(abonnement);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Supprimer un abonnement
  deleteAbonnement: async (req, res) => {
    try {
      const abonnement = await ABM.findByPk(req.params.id);
      if (!abonnement) {
        return res.status(404).json({ message: 'Abonnement non trouvé' });
      }
      await abonnement.destroy();
      res.json({ message: 'Abonnement supprimé avec succès' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Obtenir les abonnements par utilisateur
  getAbonnementsByUser: async (req, res) => {
    try {
      const abonnements = await ABM.findAll({
        where: { USR_id: req.params.userId },
        include: [{ model: PAI, as: 'paiement' }]
      });
      res.json(abonnements);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = abonnementController;