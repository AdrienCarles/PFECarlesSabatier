const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return next(new AppError(401, 'Token manquant'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return next(new AppError(401, 'Token invalide ou expiré'));
  }
};

module.exports = authenticateToken;
