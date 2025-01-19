const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { USR } = require('../models');
const AppError = require('../utils/AppError');

const authController = {
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      // 1. Rechercher l'utilisateur
      const user = await USR.findOne({ where: { USR_email: email } });
      if (!user) {
        return next(new AppError(401, 'Email ou mot de passe incorrect'));
      }

      // 2. Vérifier le mot de passe
      const isMatch = await bcrypt.compare(password, user.USR_pass);
      if (!isMatch) {
        return next(new AppError(401, 'Email ou mot de passe incorrect'));
      }

      // 3. Générer un token JWT
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });

      res.json({ token, user: { id: user.id, email: user.USR_email, role: user.USR_role } });
    } catch (error) {
      next(new AppError(500, 'Erreur lors de la connexion'));
    }
  },

  self: async (req, res, next) => {
    try {
      const user = await USR.findByPk(req.user.id, {
        attributes: ['id', 'USR_email', 'USR_nom', 'USR_prenom', 'USR_role'],
      });
      if (!user) {
        return next(new AppError(404, 'Utilisateur non trouvé'));
      }
      res.json(user);
    } catch (error) {
      next(new AppError(500, 'Erreur lors de la récupération du profil'));
    }
  },
};

module.exports = authController;
