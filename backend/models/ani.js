'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ANI extends Model {
    static associate(models) {
      // ANI appartient à un utilisateur (créateur)
      ANI.belongsTo(models.USR, {
        foreignKey: 'USR_creator_id',
        as: 'createur'
      });

      // ANI appartient à une série
      ANI.belongsTo(models.SES, {
        foreignKey: 'SES_id',
        as: 'serie'
      });
    }
  }
  ANI.init({
    ANI_titre: DataTypes.STRING(50),
    ANI_description: DataTypes.STRING(255),
    ANI_type: DataTypes.STRING(50),
    ANI_urlAnimation: DataTypes.STRING(255),
    ANI_urlAudio: DataTypes.STRING(255),
    ANI_duree: DataTypes.DECIMAL(15, 2),
    ANI_taille: DataTypes.INTEGER,
    ANI_valider: DataTypes.BOOLEAN,
    ANI_date_creation: DataTypes.DATE,
    ANI_dateValidation: DataTypes.DATE,
    USR_creator_id: DataTypes.INTEGER,
    SES_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ANI',
    tableName: 'ANI'
  });
  return ANI;
};