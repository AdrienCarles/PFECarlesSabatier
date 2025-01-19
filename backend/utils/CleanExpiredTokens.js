const cleanExpiredTokens = async () => {
    const currentDate = new Date();
    await RefreshToken.destroy({
      where: {
        created_at: { [Sequelize.Op.lt]: new Date(currentDate - 7 * 24 * 60 * 60 * 1000) }, // Tokens expirés après 7 jours
      },
    });
  };