'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('OrthophonisteConfig', {
      CONFIG_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      USR_orthophoniste_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: 'USR',
          key: 'USR_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      CONFIG_paiement_obligatoire: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      CONFIG_prix_par_enfant: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 9.99,
        allowNull: false,
        validate: {
          min: 0
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });

    // Ajouter un index pour améliorer les performances de recherche
    await queryInterface.addIndex('OrthophonisteConfig', ['USR_orthophoniste_id'], {
      name: 'idx_config_orthophoniste_id'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('OrthophonisteConfig');
  }
};