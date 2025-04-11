import jwt from 'jsonwebtoken';
import AppError from '../utils/AppError.js';

export const authenticateToken = (req, res, next) => {
  try {
    // Essayer d'obtenir le token à partir des cookies d'abord
    let token = req.cookies.accessToken;
    
    // Si pas dans les cookies, vérifier l'en-tête Authorization
    if (!token) {
      const authHeader = req.headers['authorization'];
      token = authHeader && authHeader.split(' ')[1];
    }
    
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
      req.user = { 
        id: decoded.id,
        role: decoded.role
      };
      next();
    });
  } catch (error) {
    console.error('Erreur dans le middleware d\'authentification:', error);
    next(new AppError(500, 'Erreur d\'authentification'));
  }
};

export const optionalAuthenticateToken = (req, res, next) => {
  try {
    let token = req.cookies.accessToken;
    
    if (!token && req.headers.authorization) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    // Si aucun token n'est trouvé, continuer sans authentification
    if (!token) {
      return next();
    }
    
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        // Ne pas bloquer, simplement ne pas définir req.user
        return next();
      }
      
      req.user = { 
        id: decoded.id,
        role: decoded.role 
      };
      next();
    });
  } catch {
    next();
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