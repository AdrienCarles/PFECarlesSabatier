import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
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
    ABM_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    ABM_dateDebut: {
      type: DataTypes.DATE,
      allowNull: false
    },
    ABM_dateFin: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isAfterDebut(value) {
          if (value <= this.ABM_dateDebut) {
            throw new Error('La date de fin doit être postérieure à la date de début');
          }
        }
      }
    },
    ABM_prix: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    ABM_statut: {
      type: DataTypes.ENUM('actif', 'inactif', 'suspendu'),
      allowNull: false,
      defaultValue: 'actif'
    },
    PAI_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'PAI',
        key: 'PAI_id'
      }
    },
    USR_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'USR',
        key: 'USR_id'
      }
    }
  }, {
    sequelize,
    modelName: 'ABM',
    tableName: 'ABM'
  });
  
  return ABM;
};