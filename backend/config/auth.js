import dotenv from 'dotenv';

dotenv.config();

export default {
    jwtSecret: process.env.JWT_SECRET,
    jwtAccessExpiration: '15m',
    jwtRefreshExpiration: '7d',
};