'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'USR',
      {
        USR_id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        USR_email: {
          type: Sequelize.STRING(50),
          allowNull: false,
          unique: true,
        },
        USR_pass: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        USR_prenom: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
        USR_nom: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
        USR_role: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
        USR_telephone: {
          type: Sequelize.STRING(15),
          allowNull: true,
        },
        USR_dateCreation: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        USR_derniereConnexion: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        USR_statut: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
        USR_activationToken: {
          type: Sequelize.STRING(255),
          allowNull: true,
        },
        USR_tokenExpiry: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        USR_stripe_customer_id: {
          type: Sequelize.STRING(255),
          allowNull: true,
          unique: true,
        },
      },
      {
        timestamps: false,
      }
    );
  },
  
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('USR');
  },
};