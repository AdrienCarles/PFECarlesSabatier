const { ENFA, USR, STAT } = require('../models');

const enfantController = {
  // Obtenir la liste complète des enfants
  getAllEnfants: async (req, res) => {
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
      res.status(500).json({ message: error.message });
    }
  },

  // Obtenir un enfant par ID
  getEnfantById: async (req, res) => {
    try {
      const enfant = await ENFA.findByPk(req.params.id, {
        include: [
          { model: USR, as: 'parent' },
          { model: USR, as: 'orthophoniste' },
          { model: STAT, as: 'statistiques' }
        ]
      });
      if (!enfant) {
        return res.status(404).json({ message: 'Enfant non trouvé' });
      }
      res.json(enfant);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Créer un enfant
  createEnfant: async (req, res) => {
    try {
      const {
        ENFA_prenom,
        ENFA_nom,
        ENFA_dateNaissance,
        USR_parent_id,
        USR_orthophoniste_id,
        ...otherData
      } = req.body;

      if (!ENFA_prenom || !ENFA_nom || !ENFA_dateNaissance || !USR_parent_id || !USR_orthophoniste_id) {
        return res.status(400).json({ message: 'Champs requis manquants' });
      }

      const enfant = await ENFA.create({
        ENFA_prenom,
        ENFA_nom,
        ENFA_dateNaissance,
        USR_parent_id,
        USR_orthophoniste_id,
        ENFA_dateCreation: new Date(),
        ...otherData
      });

      res.status(201).json(enfant);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Mettre à jour un enfant
  updateEnfant: async (req, res) => {
    try {
      const enfant = await ENFA.findByPk(req.params.id);
      if (!enfant) {
        return res.status(404).json({ message: 'Enfant non trouvé' });
      }
      await enfant.update(req.body);
      res.json(enfant);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Supprimer un enfant
  deleteEnfant: async (req, res) => {
    try {
      const enfant = await ENFA.findByPk(req.params.id);
      if (!enfant) {
        return res.status(404).json({ message: 'Enfant non trouvé' });
      }
      await enfant.destroy();
      res.json({ message: 'Enfant supprimé' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Obtenir les enfants par parent
  getEnfantsByParent: async (req, res) => {
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
      res.status(500).json({ message: error.message });
    }
  },

  // Obtenir les enfants par orthophoniste
  getEnfantsByOrthophoniste: async (req, res) => {
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
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = enfantController;