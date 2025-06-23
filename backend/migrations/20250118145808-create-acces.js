'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ACCES', {
      USR_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'USR',
          key: 'USR_id'
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
      ENFA_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'ENFA',
          key: 'ENFA_id'
        },
        onUpdate: 'NO ACTION',
        onDelete: 'NO ACTION'
      }
    }, {
      timestamps: false
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ACCES');
  }
};