import { Op } from 'sequelize';
import { RefreshToken } from '../models/index.js';

const cleanExpiredTokens = async () => {
  const currentDate = new Date();
  await RefreshToken.destroy({
    where: {
      created_at: { [Op.lt]: new Date(currentDate - 7 * 24 * 60 * 60 * 1000) }, // Tokens expirés après 7 jours
    },
  });
};

export default cleanExpiredTokens;