'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Ajouter la colonne Stripe customer ID
    await queryInterface.addColumn('USR', 'USR_stripe_customer_id', {
      type: Sequelize.STRING(255),
      allowNull: true,
      unique: true
    });

    // Ajouter un index pour améliorer les performances
    await queryInterface.addIndex('USR', ['USR_stripe_customer_id'], {
      name: 'idx_usr_stripe_customer_id'
    });
  },

  async down(queryInterface, Sequelize) {
    // Supprimer l'index et la colonne
    await queryInterface.removeIndex('USR', 'idx_usr_stripe_customer_id');
    await queryInterface.removeColumn('USR', 'USR_stripe_customer_id');
  }
};