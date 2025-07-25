'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('refresh_tokens', {
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
        },
        onUpdate: 'CASCADE'
      },
      token: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      used: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'USR',
          key: 'USR_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      }
    }, {
      timestamps: false
    });

    // Ajout des index
    await queryInterface.addIndex('refresh_tokens', ['USR_id']);
    await queryInterface.addIndex('refresh_tokens', ['user_id']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('refresh_tokens');
  }
};