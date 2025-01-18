const fs = require('fs').promises;
const path = require('path');
const pool = require('../db/connection');

async function runMigration() {
  try {
    // Lire le fichier SQL
    const sqlContent = await fs.readFile(
      path.join(__dirname, 'init.sql'),
      'utf8'
    );

    // Exécuter le script SQL
    const [results] = await pool.query(sqlContent);
    console.log('Base de données créée avec succès!');
    return results;
  } catch (error) {
    console.error('Erreur de migration:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigration();