'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class LoginAttempt extends Model {}
  
  LoginAttempt.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    ip_address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    success: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'LoginAttempt',
    tableName: 'login_attempts'
  });
  
  return LoginAttempt;
};