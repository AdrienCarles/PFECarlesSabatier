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
        references: {
          model: 'ENFA',
          key: 'ENFA_id'
        }
      }
    }, {
      timestamps: false
    });

    // Ajout des index
    await queryInterface.addIndex('ACCES', ['SES_id']);
    await queryInterface.addIndex('ACCES', ['ENFA_id'], {
      name: 'acces_ibfk_3'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ACCES');
  }
};