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
  
      const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
      const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
  
      await RefreshToken.create({ user_id: user.id, token: refreshToken });
  
      // Configuration des cookies sécurisés
      res.cookie('accessToken', accessToken, {
        httpOnly: true, // Empêche l'accès au cookie via JavaScript
        secure: process.env.NODE_ENV === 'production', // Utilise HTTPS en production
        maxAge: 15 * 60 * 1000, // 15 minutes
        sameSite: 'Strict', // Prévient les attaques CSRF
      });
  
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
        sameSite: 'Strict',
      });
  
      res.json({
        message: 'Connexion réussie',
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
      const { refreshToken } = req.cookies;
  
      if (!refreshToken) {
        return next(new AppError(400, 'Token de rafraîchissement manquant.'));
      }
  
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  
      const tokenRecord = await RefreshToken.findOne({
        where: { token: refreshToken, user_id: decoded.id },
      });
  
      if (!tokenRecord) {
        return next(new AppError(403, 'Token de rafraîchissement invalide.'));
      }
  
      const newAccessToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
      const newRefreshToken = jwt.sign({ id: decoded.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
  
      await RefreshToken.destroy({ where: { token: refreshToken } });
      await RefreshToken.create({ user_id: decoded.id, token: newRefreshToken });
  
      // Stocker les nouveaux tokens dans des cookies sécurisés
      res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 15 * 60 * 1000,
        sameSite: 'Strict',
      });
  
      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: 'Strict',
      });
  
      res.json({ message: 'Token renouvelé avec succès.' });
    } catch (error) {
      next(new AppError(401, 'Token invalide ou expiré.'));
    }
  },

  logout: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
  
      if (!refreshToken) {
        return next(new AppError(400, 'Token de rafraîchissement manquant'));
      }
  
      // Supprimer le token de rafraîchissement de la base
      const deleted = await RefreshToken.destroy({ where: { token: refreshToken } });
  
      if (!deleted) {
        return next(new AppError(403, 'Token de rafraîchissement invalide ou déjà révoqué'));
      }

      res.clearCookie('accessToken', { httpOnly: true, sameSite: 'Strict', secure: process.env.NODE_ENV === 'production' });
      res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'Strict', secure: process.env.NODE_ENV === 'production' });  
  
      res.json({ message: 'Déconnexion réussie' });
    } catch (error) {
      next(new AppError(500, 'Erreur lors de la déconnexion'));
    }
  },
};

export default authController;