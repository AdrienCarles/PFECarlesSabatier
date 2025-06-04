import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { USR, RefreshToken } from '../models/index.js';
import AppError from '../utils/AppError.js';

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
  
      const accessToken = jwt.sign(
        { id: user.USR_id, role: user.USR_role }, 
        process.env.JWT_SECRET, 
        { expiresIn: '15m' }
      );
      const refreshToken = jwt.sign(
        { id: user.USR_id, role: user.USR_role }, 
        process.env.JWT_REFRESH_SECRET, 
        { expiresIn: '7d' }
      );
      
      await RefreshToken.create({ USR_id: user.USR_id, token: refreshToken });      
  
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 15 * 60 * 1000,
        sameSite: 'Lax',
      });
  
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: 'Lax',
      });
  
      res.json({
        message: 'Connexion réussie',
        user: { id: user.USR_id, email: user.USR_email, role: user.USR_role },
        token: accessToken
      });
    } catch (error) {
      next(new AppError(500, 'Erreur lors de la connexion'));
    }
  },
  
  self: async (req, res, next) => {
    try {
      const user = await USR.findByPk(req.user.id, {
        attributes: ['USR_id', 'USR_email', 'USR_nom', 'USR_prenom', 'USR_role'],
      });
      
      if (!user) {
        return next(new AppError(404, 'Utilisateur non trouvé'));
      }
      
      res.json({
        id: user.USR_id,
        email: user.USR_email,
        nom: user.USR_nom,
        prenom: user.USR_prenom, 
        role: user.USR_role
      });
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
        where: { token: refreshToken, USR_id: decoded.id },
      });
  
      if (!tokenRecord || tokenRecord.used) {
        return next(new AppError(403, 'Token invalide ou déjà utilisé.'));
      }
  
      // Marquer le token comme utilisé
      await tokenRecord.update({ used: true });
  
      const newAccessToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
      const newRefreshToken = jwt.sign({ id: decoded.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
  
      await RefreshToken.create({ USR_id: decoded.id, token: newRefreshToken });
  
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
      const refreshToken = req.cookies.refreshToken;
      
      if (refreshToken) {
        await RefreshToken.destroy({ where: { token: refreshToken } });
      }
      
      res.clearCookie('accessToken', { 
        httpOnly: true, 
        sameSite: 'Strict', 
        secure: process.env.NODE_ENV === 'production' 
      });
      
      res.clearCookie('refreshToken', { 
        httpOnly: true, 
        sameSite: 'Strict', 
        secure: process.env.NODE_ENV === 'production' 
      });
      
      res.json({ message: 'Déconnexion réussie' });
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      next(new AppError(500, 'Erreur lors de la déconnexion'));
    }
  }
};

export default authController;