const { ANI, USR, SES } = require('../models');

const animationController = {
  // Obtenir la liste complète des animations
  getAllAnimations: async (req, res) => {
    try {
      const animations = await ANI.findAll({
        include: [
          { model: USR, as: 'createur' },
          { model: SES, as: 'serie' }
        ]
      });
      res.json(animations);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Obtenir une animation par ID
  getAnimationById: async (req, res) => {
    try {
      const animation = await ANI.findByPk(req.params.id, {
        include: [
          { model: USR, as: 'createur' },
          { model: SES, as: 'serie' }
        ]
      });
      if (!animation) {
        return res.status(404).json({ message: 'Animation non trouvée' });
      }
      res.json(animation);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Créer une animation
  createAnimation: async (req, res) => {
    try {
      const {
        ANI_titre,
        ANI_urlAnimation,
        USR_creator_id,
        SES_id,
        ...otherData
      } = req.body;

      if (!ANI_titre || !ANI_urlAnimation || !USR_creator_id || !SES_id) {
        return res.status(400).json({ message: 'Champs requis manquants' });
      }

      const animation = await ANI.create({
        ANI_titre,
        ANI_urlAnimation,
        USR_creator_id,
        SES_id,
        ANI_date_creation: new Date(),
        ...otherData
      });

      res.status(201).json(animation);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Mettre à jour une animation
  updateAnimation: async (req, res) => {
    try {
      const animation = await ANI.findByPk(req.params.id);
      if (!animation) {
        return res.status(404).json({ message: 'Animation non trouvée' });
      }
      await animation.update(req.body);
      res.json(animation);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Supprimer une animation
  deleteAnimation: async (req, res) => {
    try {
      const animation = await ANI.findByPk(req.params.id);
      if (!animation) {
        return res.status(404).json({ message: 'Animation non trouvée' });
      }
      await animation.destroy();
      res.json({ message: 'Animation supprimée' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Obtenir les animations par série
  getAnimationsBySeries: async (req, res) => {
    try {
      const animations = await ANI.findAll({
        where: { SES_id: req.params.serieId },
        include: [{ model: USR, as: 'createur' }]
      });
      res.json(animations);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = animationController;