'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ABM', {
      ABM_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ABM_dateDebut: {
        type: Sequelize.DATE,
        allowNull: false
      },
      ABM_dateFin: {
        type: Sequelize.DATE,
        allowNull: false
      },
      ABM_prix: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false
      },
      ABM_statut: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      USR_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'USR',
          key: 'USR_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      }
    }, {
      timestamps: false
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ABM');
  }
};