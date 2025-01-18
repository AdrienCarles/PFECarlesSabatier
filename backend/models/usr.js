'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class USR extends Model {
    static associate(models) {
      // Un utilisateur peut avoir plusieurs abonnements
      USR.hasMany(models.ABM, {
        foreignKey: 'USR_id',
        as: 'abonnements'
      });
      // Un utilisateur peut avoir plusieurs accès
      USR.hasMany(models.ACCES, {
        foreignKey: 'USR_id',
        as: 'acces'
      });
      // Un utilisateur peut créer plusieurs animations
      USR.hasMany(models.ANI, {
        foreignKey: 'USR_creator_id',
        as: 'animations'
      });
      // Un utilisateur peut accéder à plusieurs séries (through ACCES)
      USR.belongsToMany(models.SES, {
        through: models.ACCES,
        foreignKey: 'USR_id',
        otherKey: 'SES_id',
        as: 'series'
      });
      // Un utilisateur peut être parent de plusieurs enfants
      USR.hasMany(models.ENFA, {
        foreignKey: 'USR_parent_id',
        as: 'enfantsParent'
      });

      // Un utilisateur peut être orthophoniste de plusieurs enfants
      USR.hasMany(models.ENFA, {
        foreignKey: 'USR_orthophoniste_id',
        as: 'enfantsOrthophoniste'
      });
    }
  }
  USR.init({
    USR_email: DataTypes.STRING(50),
    USR_pass: DataTypes.STRING(255),
    USR_prenom: DataTypes.STRING(50),
    USR_nom: DataTypes.STRING(50),
    USR_role: DataTypes.STRING(50),
    USR_telephone: DataTypes.STRING(15),
    USR_dateCreation: DataTypes.DATE,
    USR_derniereConnexion: DataTypes.DATE,
    USR_statut: DataTypes.STRING(50)
  }, {
    sequelize,
    modelName: 'USR',
    tableName: 'USR'
  });
  return USR;
};