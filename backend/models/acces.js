'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ACCES extends Model {
    static associate(models) {
      // ACCES appartient à un utilisateur
      ACCES.belongsTo(models.USR, {
        foreignKey: 'USR_id',
        as: 'utilisateur'
      });

      // ACCES appartient à une série
      ACCES.belongsTo(models.SES, {
        foreignKey: 'SES_id',
        as: 'serie'
      });
    }
  }
  
  ACCES.init({
    USR_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'USR',
        key: 'USR_id'
      }
    },
    SES_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'SES',
        key: 'SES_id'
      }
    }
  }, {
    sequelize,
    modelName: 'ACCES',
    tableName: 'ACCES',
    timestamps: false
  });
  
  return ACCES;
};