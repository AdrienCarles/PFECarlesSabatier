import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
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
    ENFA_prenom: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    ENFA_nom: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    ENFA_dateNaissance: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true,
        isBefore: new Date().toISOString()
      }
    },
    ENFA_niveauAudition: {
      type: DataTypes.ENUM('leger', 'modere', 'severe', 'profond'),
      allowNull: false
    },
    ENFA_dateCreation: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    ENFA_dateDebutSuivi: {
      type: DataTypes.DATE,
      allowNull: false
    },
    ENFA_dateFinSuivi: {
      type: DataTypes.DATE,
      validate: {
        isAfterDebutSuivi(value) {
          if (value && value <= this.ENFA_dateDebutSuivi) {
            throw new Error('La date de fin doit être postérieure à la date de début');
          }
        }
      }
    },
    ENFA_notesSuivi: {
      type: DataTypes.TEXT
    },
    USR_parent_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'USR',
        key: 'USR_id'
      }
    },
    USR_orthophoniste_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'USR',
        key: 'USR_id'
      }
    }
  }, {
    sequelize,
    modelName: 'ENFA',
    tableName: 'ENFA',
    timestamps: false
  });
  return ENFA;
};