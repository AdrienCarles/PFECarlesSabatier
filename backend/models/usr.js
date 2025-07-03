import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class USR extends Model {
    static associate(models) {
      // Un utilisateur peut avoir plusieurs abonnements
      USR.hasMany(models.ABM, {
        foreignKey: 'USR_id',
        as: 'abonnements',
      });
      // Un utilisateur peut avoir plusieurs accès
      USR.hasMany(models.ACCES, {
        foreignKey: 'USR_id',
        as: 'acces',
      });
      // Un utilisateur peut créer plusieurs animations
      USR.hasMany(models.ANI, {
        foreignKey: 'USR_creator_id',
        as: 'animations',
      });
      // Un utilisateur peut accéder à plusieurs séries (through ACCES)
      USR.belongsToMany(models.SES, {
        through: models.ACCES,
        foreignKey: 'USR_id',
        otherKey: 'SES_id',
        as: 'series',
      });
      // Un utilisateur peut être parent de plusieurs enfants
      USR.hasMany(models.ENFA, {
        foreignKey: 'USR_parent_id',
        as: 'enfantsParent',
      });
      // Un utilisateur peut être orthophoniste de plusieurs enfants
      USR.hasMany(models.ENFA, {
        foreignKey: 'USR_orthophoniste_id',
        as: 'enfantsOrthophoniste',
      });
      USR.hasMany(models.RefreshToken, {
        foreignKey: 'USR_id',
        sourceKey: 'USR_id',
        as: 'refreshTokens',
      });
      USR.hasOne(models.OrthophonisteConfig, {
        foreignKey: 'USR_orthophoniste_id',
        as: 'config',
      });
    }
  }
  USR.init(
    {
      USR_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      USR_email: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      USR_pass: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      USR_prenom: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      USR_nom: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      USR_role: {
        type: DataTypes.ENUM('admin', 'parent', 'orthophoniste'),
        allowNull: false,
        defaultValue: 'parent',
      },
      USR_telephone: {
        type: DataTypes.STRING(15),
        validate: {
          is: /^[0-9+\s-]+$/,
        },
      },
      USR_dateCreation: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      USR_derniereConnexion: {
        type: DataTypes.DATE,
      },
      USR_statut: {
        type: DataTypes.ENUM('actif', 'inactif', 'suspendu'),
        allowNull: false,
        defaultValue: 'actif',
      },
      USR_activationToken: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      USR_tokenExpiry: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      USR_stripe_customer_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: 'USR',
      tableName: 'USR',
      timestamps: false,
      indexes: [
        {
          fields: ['USR_stripe_customer_id'],
          unique: true,
        },
      ],
    }
  );
  return USR;
};

