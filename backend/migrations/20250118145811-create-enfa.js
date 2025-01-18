'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ENFA', {
      ENFA_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ENFA_prenom: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      ENFA_nom: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      ENFA_dateNaissance: {
        type: Sequelize.DATE,
        allowNull: false
      },
      ENFA_niveauAudition: {
        type: Sequelize.STRING(50)
      },
      ENFA_dateCreation: {
        type: Sequelize.DATE,
        allowNull: false
      },
      ENFA_dateDebutSuivi: {
        type: Sequelize.DATE
      },
      ENFA_dateFinSuivi: {
        type: Sequelize.DATE
      },
      ENFA_notesSuivi: {
        type: Sequelize.STRING(255)
      },
      USR_parent_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'USR',
          key: 'USR_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      USR_orthophoniste_id: {
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
    await queryInterface.dropTable('ENFA');
  }
};