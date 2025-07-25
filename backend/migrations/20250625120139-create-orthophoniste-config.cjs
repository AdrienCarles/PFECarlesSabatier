'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orthophonisteconfig', {
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
        allowNull: false
      },
      createdAt: {
        allowNull: true,
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: true,
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    }, {
      timestamps: false
    });

    // Ajouter un index pour améliorer les performances de recherche
    await queryInterface.addIndex('orthophonisteconfig', ['USR_orthophoniste_id'], {
      name: 'idx_config_orthophoniste_id'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('orthophonisteconfig');
  }
};