import jwt from 'jsonwebtoken';
import AppError from '../utils/AppError.js';

export const authenticateToken = (req, res, next) => {
  try {
    // Essayer d'obtenir le token à partir des cookies d'abord
    let token = req.cookies.accessToken;
    
    // Si pas dans les cookies, vérifier l'en-tête Authorization
    if (!token) {
      const authHeader = req.headers['authorization'];
      token = authHeader && authHeader.split(' ')[1]; // Format "Bearer TOKEN"
    }
    
    console.log('Token reçu:', token ? 'Présent' : 'Absent');
    
    if (!token) {
      return next(new AppError(401, 'Token manquant'));
    }
    
    // Vérifier et décoder le token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error('Erreur de vérification du token:', err.message);
        return next(new AppError(401, 'Token invalide ou expiré'));
      }
      
      console.log('Token décodé avec succès:', decoded);
      req.user = decoded; // Stocke les données utilisateur décodées
      next();
    });
  } catch (error) {
    console.error('Erreur dans le middleware d\'authentification:', error);
    next(new AppError(500, 'Erreur d\'authentification'));
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError(401, 'Non autorisé - authentification requise'));
    }
    
    if (!roles.includes(req.user.role)) {
      return next(new AppError(403, 'Non autorisé - rôle insuffisant'));
    }
    
    next();
  };
};

export default {
  authenticateToken,
  authorizeRoles
};