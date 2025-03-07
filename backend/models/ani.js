import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class ANI extends Model {
    static associate(models) {
      // ANI appartient à un utilisateur (créateur)
      ANI.belongsTo(models.USR, {
        foreignKey: 'USR_creator_id',
        as: 'createur',
      });

      // ANI appartient à une série
      ANI.belongsTo(models.SES, {
        foreignKey: 'SES_id',
        as: 'serie',
      });
    }
  }

  ANI.init(
    {
      ANI_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      ANI_titre: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      ANI_description: {
        type: DataTypes.STRING(255),
      },
      ANI_type: {
        type: DataTypes.STRING(50),
      },
      ANI_urlAnimation: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          isUrl: true,
        },
      },
      ANI_urlAudio: {
        type: DataTypes.STRING(255),
        validate: {
          isUrl: true,
        },
      },
      ANI_duree: {
        type: DataTypes.DECIMAL(15, 2),
      },
      ANI_taille: {
        type: DataTypes.INTEGER,
      },
      ANI_valider: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      ANI_date_creation: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      ANI_dateValidation: {
        type: DataTypes.DATE,
      },
      USR_creator_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'USR',
          key: 'USR_id',
        },
      },
      SES_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'SES',
          key: 'SES_id',
        },
      },
    },
    {
      sequelize,
      modelName: 'ANI',
      tableName: 'ANI',
      timestamps: false
    }
  );

  return ANI;
};