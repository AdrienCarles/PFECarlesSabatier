'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ENFA extends Model {
    static associate(models) {
      // ENFA appartient à un utilisateur (parent)
      ENFA.belongsTo(models.USR, {
        foreignKey: 'USR_parent_id',
        as: 'parent'
      });

      // ENFA appartient à un utilisateur (orthophoniste)
      ENFA.belongsTo(models.USR, {
        foreignKey: 'USR_orthophoniste_id',
        as: 'orthophoniste'
      });

      // ENFA peut avoir plusieurs statistiques
      ENFA.hasMany(models.STAT, {
        foreignKey: 'ENFA_id',
        as: 'statistiques'
      });
    }
  }
  ENFA.init({
    ENFA_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    ENFA_prenom: DataTypes.STRING(50),
    ENFA_nom: DataTypes.STRING(50),
    ENFA_dateNaissance: DataTypes.DATE,
    ENFA_niveauAudition: DataTypes.STRING(50),
    ENFA_dateCreation: DataTypes.DATE,
    ENFA_dateDebutSuivi: DataTypes.DATE,
    ENFA_dateFinSuivi: DataTypes.DATE,
    ENFA_notesSuivi: DataTypes.STRING(255),
    USR_parent_id: DataTypes.INTEGER,
    USR_orthophoniste_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ENFA',
    tableName: 'ENFA'
  });
  return ENFA;
};