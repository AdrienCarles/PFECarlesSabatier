'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('STAT', {
      ENFA_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'ENFA',
          key: 'ENFA_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      SES_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'SES',
          key: 'SES_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      STAT_dernierAcces: {
        type: Sequelize.DATE
      },
      STAT_tempUtil: {
        type: Sequelize.TIME
      }
    }, {
      timestamps: false
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('STAT');
  }
};