'use strict';
const { Model } = require('sequelize');

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
    ANI_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    ANI_titre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    ANI_description: {
      type: DataTypes.TEXT
    },
    ANI_urlAnimation: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        isUrl: true
      }
    },
    ANI_date_creation: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    USR_creator_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'USR',
        key: 'USR_id'
      }
    },
    SES_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'SES',
        key: 'SES_id'
      }
    }
  }, {
    sequelize,
    modelName: 'ANI',
    tableName: 'ANI'
  });
  return ANI;
};