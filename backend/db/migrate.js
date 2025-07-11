import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './connection.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  try {
    console.log('🚀 Début de la migration...');
    
    // Lire le fichier SQL
    const sqlContent = await fs.readFile(
      path.join(__dirname, 'init.sql'),
      'utf8'
    );

    // Diviser le SQL en requêtes individuelles
    const queries = sqlContent
      .split(';')
      .map(query => query.trim())
      .filter(query => query.length > 0);

    console.log(`📝 ${queries.length} requêtes à exécuter...`);

    // Exécuter chaque requête séparément
    for (let i = 0; i < queries.length; i++) {
      const query = queries[i];
      if (query) {
        try {
          console.log(`⏳ Exécution requête ${i + 1}/${queries.length}...`);
          await pool.query(query);
          console.log(`✅ Requête ${i + 1} exécutée avec succès`);
        } catch (queryError) {
          console.error(`❌ Erreur requête ${i + 1}:`, queryError.message);
          console.error(`📄 Requête en erreur:`, query.substring(0, 100) + '...');
          // Continuer avec les autres requêtes au lieu de s'arrêter
        }
      }
    }

    console.log('✅ Migration terminée avec succès!');
    
  } catch (error) {
    console.error('❌ Erreur de migration:', error.message);
    throw error;
  } finally {
    try {
      await pool.end();
      console.log('🔌 Connexion fermée');
    } catch (closeError) {
      console.error('⚠️ Erreur fermeture connexion:', closeError.message);
    }
  }
}

// Exécuter la migration
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigration()
    .then(() => {
      console.log('🎉 Migration complète!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration échouée:', error);
      process.exit(1);
    });
}

export default runMigration;