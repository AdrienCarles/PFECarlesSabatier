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
        type: Sequelize.STRING(50),
        allowNull: true
      },
      SES_description: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      SES_statut: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      SES_dateCreation: {
        type: Sequelize.DATEONLY,  // DATE dans le SQL, pas DATETIME
        allowNull: true           // NULL autorisé selon le schéma
      },
      SES_icone: {
        type: Sequelize.STRING(255),
        allowNull: true
      }
    }, {
      timestamps: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_0900_ai_ci',
      engine: 'InnoDB'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('SES');
  }
};