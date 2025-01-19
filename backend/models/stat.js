'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class STAT extends Model {
    static associate(models) {
      STAT.belongsTo(models.ENFA, {
        foreignKey: 'ENFA_id',
        as: 'enfant'
      });

      STAT.belongsTo(models.SES, {
        foreignKey: 'SES_id',
        as: 'serie'
      });
    }
  }

  STAT.init({
ENFA_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'ENFA',
        key: 'ENFA_id'
      }
    },
    SES_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'SES',
        key: 'SES_id'
      }
    },
    STAT_dernierAcces: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    STAT_tempUtil: {
      type: DataTypes.INTEGER, // Temps en secondes
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
  }, {
    sequelize,
    modelName: 'STAT',
    tableName: 'STAT',
    timestamps: false
  });

  return STAT;
};