import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class OrthophonisteConfig extends Model {
    static associate(models) {
      // Configuration appartient à un orthophoniste
      OrthophonisteConfig.belongsTo(models.USR, {
        foreignKey: 'USR_orthophoniste_id',
        as: 'orthophoniste'
      });
    }

    // Méthode pour vérifier si le paiement est obligatoire
    isPaiementObligatoire() {
      return this.CONFIG_paiement_obligatoire === true;
    }

    // Méthode pour obtenir le prix formaté
    getPrixFormate() {
      return parseFloat(this.CONFIG_prix_par_enfant).toFixed(2);
    }

    // Méthode statique pour obtenir la config d'un orthophoniste
    static async getConfigByOrthophoniste(orthophonisteId) {
      return this.findOne({
        where: { USR_orthophoniste_id: orthophonisteId }
      });
    }

    // Méthode statique pour créer une config par défaut
    static async createDefaultConfig(orthophonisteId) {
      return this.create({
        USR_orthophoniste_id: orthophonisteId,
        CONFIG_paiement_obligatoire: false,
        CONFIG_prix_par_enfant: 9.99
      });
    }
  }
  
  OrthophonisteConfig.init({
    CONFIG_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    USR_orthophoniste_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'USR',
        key: 'USR_id'
      },
      validate: {
        notNull: {
          msg: 'L\'ID de l\'orthophoniste est requis'
        },
        isInt: {
          msg: 'L\'ID de l\'orthophoniste doit être un entier'
        }
      }
    },
    CONFIG_paiement_obligatoire: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
      validate: {
        isBoolean: {
          msg: 'Le statut de paiement obligatoire doit être un booléen'
        }
      }
    },
    CONFIG_prix_par_enfant: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 9.99,
      allowNull: false,
      validate: {
        min: {
          args: [0],
          msg: 'Le prix par enfant doit être positif'
        },
        isDecimal: {
          msg: 'Le prix par enfant doit être un nombre décimal'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'OrthophonisteConfig',
    tableName: 'OrthophonisteConfig',
    timestamps: true,
    indexes: [
      {
        fields: ['USR_orthophoniste_id'],
        unique: true
      }
    ]
  });
  
  return OrthophonisteConfig;
};