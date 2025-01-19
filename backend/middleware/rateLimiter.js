const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 tentatives max
    message: {
        error: 'Trop de tentatives de connexion. Veuillez réessayer dans 15 minutes.'
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