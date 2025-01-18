'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PAI', {
      PAI_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      PAI_type: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      PAI_montant: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false
      },
      PAI_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      PAI_statut: {
        type: Sequelize.STRING(50),
        allowNull: false
      }
    }, {
      timestamps: false
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('PAI');
  }
};