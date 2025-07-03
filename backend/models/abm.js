import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class ABM extends Model {
    static associate(models) {
      // ABM appartient à un utilisateur
      ABM.belongsTo(models.USR, {
        foreignKey: 'USR_id',
        as: 'utilisateur',
      });
      ABM.belongsTo(models.ENFA, {
        foreignKey: 'ENFA_id',
        as: 'enfant',
      });
    }

    isActif() {
      const maintenant = new Date();
      return (
        this.ABM_statut === 'actif' &&
        new Date(this.ABM_dateDebut) <= maintenant &&
        new Date(this.ABM_dateFin) > maintenant
      );
    }

    isPaiementGratuit() {
      return this.ABM_mode_paiement === 'gratuit';
    }

    isPaiementTest() {
      return this.ABM_mode_paiement === 'test';
    }
  }
  ABM.init(
    {
      ABM_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      ABM_dateDebut: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      ABM_dateFin: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isAfterDebut(value) {
            if (value <= this.ABM_dateDebut) {
              throw new Error(
                'La date de fin doit être postérieure à la date de début'
              );
            }
          },
        },
      },
      ABM_prix: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      ABM_statut: {
        type: DataTypes.ENUM('actif', 'inactif', 'suspendu'),
        allowNull: false,
        defaultValue: 'actif',
      },
      ENFA_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'ENFA',
          key: 'ENFA_id',
        },
      },
      ABM_stripe_subscription_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
      ABM_mode_paiement: {
        type: DataTypes.ENUM('stripe', 'gratuit', 'test'),
        defaultValue: 'stripe',
        allowNull: false,
        validate: {
          isIn: [['stripe', 'gratuit', 'test']],
        },
      },
      USR_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'USR',
          key: 'USR_id',
        },
      },
    },
    {
      sequelize,
      modelName: 'ABM',
      tableName: 'ABM',
      timestamps: false,
      indexes: [
        {
          fields: ['ENFA_id'],
        },
        {
          fields: ['ABM_stripe_subscription_id'],
          unique: true,
        },
      ],
    }
  );

  return ABM;
};

