import db, {
  sequelize,
  USR,
  ENFA,
  SES,
  ANI,
  ABM,
  PAI,
  ACCES,
  STAT,
  OrthophonisteConfig,
} from './models/index.js';

async function testDatabase() {
  try {
    // Test de connexion
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données réussie!');

    // Vérification des modèles
    await sequelize.sync({ alter: false }); // N'altère pas la base, vérifie juste
    console.log('✅ Les modèles sont synchronisés avec la base de données');

    // Test des nouveaux champs ABM
    console.log('\n🔍 Vérification des nouveaux champs ABM:');
    const abmModel = ABM.getTableName ? ABM.getTableName() : ABM.tableName;
    console.log(`  - Table: ${abmModel}`);

    // Afficher les attributs ABM
    const abmAttributes = Object.keys(ABM.rawAttributes);
    console.log('  - Attributs ABM:', abmAttributes);

    // Vérifier les nouveaux champs spécifiquement
    const nouveauxChamps = [
      'ENFA_id',
      'ABM_stripe_subscription_id',
      'ABM_mode_paiement',
    ];
    nouveauxChamps.forEach((champ) => {
      if (abmAttributes.includes(champ)) {
        console.log(`    ✅ ${champ} présent`);
      } else {
        console.log(`    ❌ ${champ} manquant`);
      }
    });

    // Test des nouveaux champs USR
    console.log('\n🔍 Vérification des nouveaux champs USR:');
    const usrAttributes = Object.keys(USR.rawAttributes);
    if (usrAttributes.includes('USR_stripe_customer_id')) {
      console.log('    ✅ USR_stripe_customer_id présent');
    } else {
      console.log('    ❌ USR_stripe_customer_id manquant');
    }

    // Test du nouveau modèle OrthophonisteConfig
    console.log('\n🔍 Vérification du modèle OrthophonisteConfig:');
    if (OrthophonisteConfig) {
      console.log('    ✅ Modèle OrthophonisteConfig chargé');
      const configAttributes = Object.keys(OrthophonisteConfig.rawAttributes);
      console.log('    - Attributs:', configAttributes);
    } else {
      console.log('    ❌ Modèle OrthophonisteConfig manquant');
    }

    // Vérification des associations
    const models = {
      USR: USR.associations,
      ENFA: ENFA.associations,
      SES: SES.associations,
      ANI: ANI.associations,
      ABM: ABM.associations,
      PAI: PAI.associations,
      ACCES: ACCES.associations,
      STAT: STAT.associations,
    };

    // Ajouter OrthophonisteConfig si présent
    if (OrthophonisteConfig) {
      models.OrthophonisteConfig = OrthophonisteConfig.associations;
    }

    // Afficher les associations pour chaque modèle
    for (const [modelName, associations] of Object.entries(models)) {
      console.log(`\n📊 Associations pour ${modelName}:`);
      if (Object.keys(associations).length === 0) {
        console.log('  - Aucune association');
      } else {
        for (const [key, association] of Object.entries(associations)) {
          console.log(
            `  - ${key}: ${association.associationType} avec ${association.target.name}`
          );
        }
      }
    }

    // Test de création d'un enregistrement OrthophonisteConfig (pour vérifier que tout fonctionne)
    if (OrthophonisteConfig) {
      console.log('\n🧪 Test de création OrthophonisteConfig...');
      try {
        // Vérifier s'il y a des orthophonistes
        const orthophonistes = await USR.findAll({
          where: { USR_role: 'orthophoniste' },
          limit: 1,
        });

        if (orthophonistes.length > 0) {
          const orthoId = orthophonistes[0].USR_id;

          // Vérifier si la config existe déjà
          const existingConfig = await OrthophonisteConfig.findOne({
            where: { USR_orthophoniste_id: orthoId },
          });

          if (!existingConfig) {
            const testConfig = await OrthophonisteConfig.create({
              USR_orthophoniste_id: orthoId,
              CONFIG_paiement_obligatoire: false,
              CONFIG_prix_par_enfant: 9.99,
            });
            console.log(
              '    ✅ Configuration test créée:',
              testConfig.CONFIG_id
            );

            // Supprimer la config test
            await testConfig.destroy();
            console.log('    ✅ Configuration test supprimée');
          } else {
            console.log(
              '    ✅ Configuration existante trouvée pour cet orthophoniste'
            );
          }
        } else {
          console.log('    ⚠️ Aucun orthophoniste trouvé pour tester');
        }
      } catch (error) {
        console.log('    ❌ Erreur lors du test:', error.message);
      }
    }

    console.log('\n🎉 Tests terminés avec succès!');
  } catch (error) {
    console.error('❌ Erreur lors des tests:', error);
    console.error('Stack trace:', error.stack);
  } finally {
    try {
      await sequelize.close();
      console.log('✅ Connexion fermée');
    } catch (error) {
      console.error('❌ Erreur lors de la fermeture:', error.message);
    }
  }
}

testDatabase();
