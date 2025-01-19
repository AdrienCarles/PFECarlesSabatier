require('dotenv').config();

module.exports = {
    jwtSecret: process.env.JWT_SECRET,
    jwtAccessExpiration: '15m',
    jwtRefreshExpiration: '7d',
};
