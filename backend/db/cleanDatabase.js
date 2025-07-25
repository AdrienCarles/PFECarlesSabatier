import { sequelize } from '../models/index.js';
import {
  USR,
  ENFA,
  SES,
  ANI,
  ABM,
  ACCES,
  OrthophonisteConfig
} from '../models/index.js';

async function cleanDatabase() {
  try {
    console.log('Nettoyage de la base de donnees...');
    
    await sequelize.authenticate();
    console.log('Connexion a la base de donnees etablie');
    
    // Desactiver les contraintes de cles etrangeres temporairement
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    
    // Liste des tables dans l'ordre inverse des dependances
    const tablesToClean = [
      { model: ABM, name: 'ABM' },
      { model: ACCES, name: 'ACCES' },
      { model: ANI, name: 'ANI' },
      { model: SES, name: 'SES' },
      { model: OrthophonisteConfig, name: 'OrthophonisteConfig' },
      { model: ENFA, name: 'ENFA' },
      { model: USR, name: 'USR' }
    ];
    
    for (const { model, name } of tablesToClean) {
      try {
        const deletedCount = await model.destroy({ where: {} });
        console.log(`Table ${name}: ${deletedCount} enregistrements supprimes`);
      } catch (error) {
        console.log(`Table ${name}: aucun enregistrement (table peut-etre vide)`);
      }
    }
    
    // Retablir les contraintes de cles etrangeres
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    
    console.log('Base de donnees nettoyee avec succes');
    process.exit(0);
    
  } catch (error) {
    console.error('Erreur lors du nettoyage:', error);
    process.exit(1);
  }
}

cleanDatabase();