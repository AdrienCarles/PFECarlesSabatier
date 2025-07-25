'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ANI', {
      ANI_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ANI_titre: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      ANI_description: {
        type: Sequelize.STRING(255)
      },
      ANI_type: {
        type: Sequelize.STRING(50)
      },
      ANI_urlAnimation: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      ANI_urlAnimationDessin: {
        type: Sequelize.STRING(255)
      },
      ANI_urlAudio: {
        type: Sequelize.STRING(255)
      },
      ANI_duree: {
        type: Sequelize.DECIMAL(15, 2)
      },
      ANI_taille: {
        type: Sequelize.INTEGER
      },
      ANI_valider: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      ANI_date_creation: {
        type: Sequelize.DATE,
        allowNull: false
      },
      ANI_dateValidation: {
        type: Sequelize.DATE
      },
      USR_creator_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'USR',
          key: 'USR_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      SES_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'SES',
          key: 'SES_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      }
    }, {
      timestamps: false
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ANI');
  }
};