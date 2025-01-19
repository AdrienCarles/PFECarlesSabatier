const { USR, ENFA, ABM, ACCES, ANI, SES } = require('../models');

const userController = {
  // Obtenir la liste complète des utilisateurs
  getAllUsers: async (req, res) => {
    try {
      const users = await USR.findAll();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Obtenir un utilisateur par ID
  getUserById: async (req, res) => {
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
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Créer un utilisateur
  createUser: async (req, res) => {
    try {
      const { USR_email, USR_pass, USR_role, ...otherData } = req.body;
      
      if (!USR_email || !USR_pass || !USR_role) {
        return res.status(400).json({ message: 'Email, mot de passe et rôle requis' });
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
      res.status(400).json({ message: error.message });
    }
  },

  // Mettre à jour un utilisateur
  updateUser: async (req, res) => {
    try {
      const user = await USR.findByPk(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
      await user.update(req.body);
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Supprimer un utilisateur
  deleteUser: async (req, res) => {
    try {
      const user = await USR.findByPk(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
      await user.destroy();
      res.json({ message: 'Utilisateur supprimé' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Obtenir les enfants d'un parent
  getParentChildren: async (req, res) => {
    try {
      const children = await ENFA.findAll({
        where: { USR_parent_id: req.params.id }
      });
      res.json(children);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Obtenir les enfants d'un orthophoniste
  getOrthophonisteChildren: async (req, res) => {
    try {
      const children = await ENFA.findAll({
        where: { USR_orthophoniste_id: req.params.id }
      });
      res.json(children);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = userController;