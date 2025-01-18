const { sequelize, USR, ENFA, SES, ANI, ABM, PAI, ACCES, STAT } = require('./models');

async function testDatabase() {
  try {
    // Test de connexion
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données réussie!');

    // Vérification des modèles
    await sequelize.sync({ alter: false }); // N'altère pas la base, vérifie juste
    console.log('✅ Les modèles sont synchronisés avec la base de données');

    // Vérification des associations
    const models = {
      USR: USR.associations,
      ENFA: ENFA.associations,
      SES: SES.associations,
      ANI: ANI.associations,
      ABM: ABM.associations,
      PAI: PAI.associations,
      ACCES: ACCES.associations,
      STAT: STAT.associations
    };

    // Afficher les associations pour chaque modèle
    for (const [modelName, associations] of Object.entries(models)) {
      console.log(`\n📊 Associations pour ${modelName}:`);
      for (const [key, association] of Object.entries(associations)) {
        console.log(`  - ${key}: ${association.associationType} avec ${association.target.name}`);
      }
    }

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error);
  } finally {
    await sequelize.close();
  }
}

testDatabase();