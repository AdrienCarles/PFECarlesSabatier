'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('ABM', 'ENFA_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'ENFA',
        key: 'ENFA_id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    await queryInterface.addColumn('ABM', 'ABM_stripe_subscription_id', {
      type: Sequelize.STRING(255),
      allowNull: true,
      unique: true
    });

    await queryInterface.addColumn('ABM', 'ABM_mode_paiement', {
      type: Sequelize.ENUM('stripe', 'gratuit', 'test'),
      defaultValue: 'stripe',
      allowNull: false
    });

    // Ajouter l'index pour la clé étrangère ENFA_id
    await queryInterface.addIndex('ABM', ['ENFA_id'], {
      name: 'idx_abm_enfa_id'
    });
  },

  async down(queryInterface, Sequelize) {
    // Supprimer les colonnes ajoutées
    await queryInterface.removeIndex('ABM', 'idx_abm_enfa_id');
    await queryInterface.removeColumn('ABM', 'ABM_mode_paiement');
    await queryInterface.removeColumn('ABM', 'ABM_stripe_subscription_id');
    await queryInterface.removeColumn('ABM', 'ENFA_id');
  }
};