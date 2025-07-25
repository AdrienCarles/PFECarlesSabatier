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
        type: Sequelize.STRING(50),
        allowNull: true
      },
      ENFA_dateCreation: {
        type: Sequelize.DATE,
        allowNull: false
      },
      ENFA_dateDebutSuivi: {
        type: Sequelize.DATE,
        allowNull: true
      },
      ENFA_dateFinSuivi: {
        type: Sequelize.DATE,
        allowNull: true
      },
      ENFA_notesSuivi: {
        type: Sequelize.STRING(255),
        allowNull: true
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
      timestamps: false,
      engine: 'InnoDB',
      charset: 'utf8mb4',
      collate: 'utf8mb4_0900_ai_ci'
    });

    // Ajouter les index
    await queryInterface.addIndex('ENFA', ['USR_parent_id'], {
      name: 'USR_parent_id'
    });

    await queryInterface.addIndex('ENFA', ['USR_orthophoniste_id'], {
      name: 'USR_orthophoniste_id'
    });
  },
  
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ENFA');
  }
};