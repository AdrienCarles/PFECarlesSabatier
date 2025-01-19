'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('SES', {
      SES_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      SES_titre: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      SES_theme: {
        type: Sequelize.STRING(50)
      },
      SES_description: {
        type: Sequelize.STRING(255)
      },
      SES_statut: {
        type: Sequelize.STRING(50),
        allowNull: false
      }
    }, {
      timestamps: false
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('SES');
  }
};