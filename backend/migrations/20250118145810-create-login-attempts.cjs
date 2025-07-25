'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('login_attempts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      USR_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'USR',
          key: 'USR_id'
        }
      },
      attempt_time: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      success: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      ip_address: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    }, {
      timestamps: false
    });

    // Ajout de l'index sur USR_id
    await queryInterface.addIndex('login_attempts', ['USR_id']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('login_attempts');
  }
};