'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ABM extends Model {
    static associate(models) {
      // ABM appartient à un utilisateur
      ABM.belongsTo(models.USR, {
        foreignKey: 'USR_id',
        as: 'utilisateur'
      });
      // ABM appartient à un paiement
      ABM.belongsTo(models.PAI, {
        foreignKey: 'PAI_id',
        as: 'paiement'
      });
    }
  }
  ABM.init({
    ABM_dateDebut: DataTypes.DATE,
    ABM_dateFin: DataTypes.DATE,
    ABM_prix: DataTypes.DECIMAL(15, 2),
    ABM_statut: DataTypes.STRING(50),
    PAI_id: DataTypes.INTEGER,
    USR_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ABM',
    tableName: 'ABM'
  });
  return ABM;
};