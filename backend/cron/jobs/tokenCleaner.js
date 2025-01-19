const { RefreshToken } = require('../../models');
const { Op } = require('sequelize');

const cleanExpiredTokens = async () => {
  try {
    const deleted = await RefreshToken.destroy({
      where: {
        created_at: {
          [Op.lt]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      }
    });
    console.log(`${deleted} tokens expirés nettoyés`);
  } catch (error) {
    console.error('Erreur lors du nettoyage des tokens:', error);
  }
};

module.exports = cleanExpiredTokens;