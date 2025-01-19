const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 tentatives max
    message: {
      error: 'Vous avez dépassé la limite de tentatives. Veuillez réessayer dans 15 minutes.',
    },
    handler: (req, res, next, options) => {
      res.status(429).json({
        error: options.message.error,
        timeUntilReset: Math.ceil(options.windowMs / 1000) + ' secondes', // Temps avant réinitialisation
      });
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

const globalLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100, // 100 requêtes max par minute
    message: {
        error: 'Trop de requêtes. Veuillez réessayer plus tard.'
    }
});

module.exports = {
    loginLimiter,
    globalLimiter
};