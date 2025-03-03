import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class PAI extends Model {
    static associate(models) {
      // Un paiement peut avoir plusieurs abonnements
      PAI.hasMany(models.ABM, {
        foreignKey: 'PAI_id',
        as: 'abonnements'
      });
    }
  }
  PAI.init({
    PAI_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'PAI',
    tableName: 'PAI'
  });
  return PAI;
};