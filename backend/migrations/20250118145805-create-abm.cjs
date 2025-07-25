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
      },
      ENFA_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'ENFA',
          key: 'ENFA_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      ABM_stripe_subscription_id: {
        type: Sequelize.STRING(255),
        allowNull: true,
        unique: true
      },
      ABM_mode_paiement: {
        type: Sequelize.ENUM('stripe', 'gratuit', 'test'),
        allowNull: false,
        defaultValue: 'stripe'
      }
    }, {
      timestamps: false
    });

    // Ajout des index
    await queryInterface.addIndex('ABM', ['ENFA_id'], {
      name: 'idx_abm_enfa_id'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ABM');
  }
};