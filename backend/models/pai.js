'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PAI extends Model {
    static associate(models) {
      // Un paiement peut avoir plusieurs abonnements
      PAI.hasMany(models.ABM, {
        foreignKey: 'PAI_id',
        as: 'abonnements'
      });
    }
  }
  PAI.init({
    PAI_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    }
  }, {
    sequelize,
    modelName: 'PAI',
    tableName: 'PAI'
  });
  return PAI;
};