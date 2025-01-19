import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { USR, RefreshToken } from '../models';
import AppError from '../utils/AppError';

const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '7d',
  });
};

const authController = {
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
  
      const user = await USR.findOne({ where: { USR_email: email } });
      if (!user) {
        return next(new AppError(401, 'Email ou mot de passe incorrect'));
      }
  
      const isMatch = await bcrypt.compare(password, user.USR_pass);
      if (!isMatch) {
        return next(new AppError(401, 'Email ou mot de passe incorrect'));
      }
  
      const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      const refreshToken = generateRefreshToken(user.id);
  
      await RefreshToken.create({ user_id: user.id, token: refreshToken });
  
      res.json({
        accessToken,
        refreshToken,
        user: { id: user.id, email: user.USR_email, role: user.USR_role },
      });
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

  refreshToken: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
  
      if (!refreshToken) {
        return next(new AppError(400, 'Token de rafraîchissement manquant'));
      }
  
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  
      const tokenRecord = await RefreshToken.findOne({
        where: { token: refreshToken, user_id: decoded.id },
      });
  
      if (!tokenRecord) {
        return next(new AppError(403, 'Token de rafraîchissement invalide'));
      }
  
      const newAccessToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });
  
      res.json({ accessToken: newAccessToken });
    } catch (error) {
      next(new AppError(401, 'Token de rafraîchissement expiré ou invalide'));
    }
  }
};

export default authController;