import { Op } from 'sequelize';

import { RefreshToken } from '../../models/index.js';

const cleanExpiredTokens = async () => {
  const expirationDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 jours
  await RefreshToken.destroy({
    where: {
      [Op.or]: [
        { used: true },
        { created_at: { [Op.lt]: expirationDate } },
      ],
    },
  });
};

export default cleanExpiredTokens;