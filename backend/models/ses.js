'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SES extends Model {
    static associate(models) {
      // Une série peut avoir plusieurs accès
      SES.hasMany(models.ACCES, {
        foreignKey: 'SES_id',
        as: 'acces'
      });
      // Une série peut avoir plusieurs animations
      SES.hasMany(models.ANI, {
        foreignKey: 'SES_id',
        as: 'animations'
      });
      // Une série peut être accessible par plusieurs utilisateurs (through ACCES)
      SES.belongsToMany(models.USR, {
        through: models.ACCES,
        foreignKey: 'SES_id',
        otherKey: 'USR_id',
        as: 'utilisateurs'
      });
    }
  }
  SES.init({
    SES_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    SES_titre: DataTypes.STRING(50),
    SES_theme: DataTypes.STRING(50),
    SES_description: DataTypes.STRING(255),
    SES_statut: DataTypes.STRING(50)
  }, {
    sequelize,
    modelName: 'SES',
    tableName: 'SES'
  });
  return SES;
};