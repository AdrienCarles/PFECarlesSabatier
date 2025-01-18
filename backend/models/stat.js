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
      allowNull: false
    },
    SES_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    STAT_dernierAcces: DataTypes.DATE,
    STAT_tempUtil: DataTypes.TIME
  }, {
    sequelize,
    modelName: 'STAT',
    tableName: 'STAT',
    timestamps: false
  });

  return STAT;
};