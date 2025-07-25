import { readdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

// Créer require pour CommonJS
const require = createRequire(import.meta.url);

// Charger les variables d'environnement
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration de la base de données
const sequelize = new Sequelize(
  process.env.DB_NAME || 'pfe',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: console.log,
  }
);

// Créer la table des métadonnées de migration si elle n'existe pas
async function createSequelizeMetaTable() {
  await sequelize.query(`
    CREATE TABLE IF NOT EXISTS SequelizeMeta (
      name VARCHAR(255) NOT NULL PRIMARY KEY
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
  `);
}

// Obtenir les migrations déjà exécutées
async function getExecutedMigrations() {
  try {
    const [results] = await sequelize.query(
      'SELECT name FROM SequelizeMeta ORDER BY name'
    );
    return results.map((row) => row.name);
  } catch (error) {
    console.log("Table SequelizeMeta n'existe pas encore, création...");
    await createSequelizeMetaTable();
    return [];
  }
}

// Obtenir toutes les migrations disponibles
async function getAvailableMigrations() {
  const migrationsDir = join(__dirname, '../migrations');
  const files = await readdir(migrationsDir);
  return files.filter((file) => file.endsWith('.js')).sort();
}

// Exécuter une migration
async function executeMigration(migrationFile) {
  try {
    console.log(`Exécution de la migration: ${migrationFile}`);

    // Importer la migration avec require (CommonJS)
    const migrationPath = join(__dirname, '../migrations', migrationFile);
    delete require.cache[require.resolve(migrationPath)]; // Clear cache
    const migration = require(migrationPath);

    // Créer un queryInterface
    const queryInterface = sequelize.getQueryInterface();

    // Exécuter la migration
    await migration.up(queryInterface, Sequelize);

    // Marquer la migration comme exécutée
    await sequelize.query('INSERT INTO SequelizeMeta (name) VALUES (?)', {
      replacements: [migrationFile],
    });

    console.log(`Migration ${migrationFile} exécutée avec succès`);
  } catch (error) {
    console.error(
      `Erreur lors de l'exécution de ${migrationFile}:`,
      error.message
    );
    console.error('Stack trace:', error.stack);
    throw error;
  }
}

// Script principal
async function runMigrations() {
  try {
    console.log("Début de l'exécution des migrations...\n");

    // Tester la connexion
    await sequelize.authenticate();
    console.log('Connexion à la base de données réussie\n');

    // Créer la table des métadonnées si nécessaire
    await createSequelizeMetaTable();

    // Obtenir les migrations
    const executedMigrations = await getExecutedMigrations();
    const availableMigrations = await getAvailableMigrations();

    console.log(`Migrations disponibles: ${availableMigrations.length}`);
    console.log(`Migrations déjà exécutées: ${executedMigrations.length}\n`);

    // Filtrer les migrations non exécutées
    const pendingMigrations = availableMigrations.filter(
      (migration) => !executedMigrations.includes(migration)
    );

    if (pendingMigrations.length === 0) {
      console.log('Aucune migration en attente');
      return;
    }

    console.log(`${pendingMigrations.length} migration(s) en attente:\n`);
    pendingMigrations.forEach((migration, index) => {
      console.log(`${index + 1}. ${migration}`);
    });
    console.log();

    // Exécuter les migrations en attente
    for (const migration of pendingMigrations) {
      await executeMigration(migration);
    }

    console.log('\nToutes les migrations ont été exécutées avec succès!');
  } catch (error) {
    console.error(
      "\nErreur lors de l'exécution des migrations:",
      error.message
    );
    console.error('Stack trace:', error.stack);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// Exécuter si appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigrations();
}

export default runMigrations;
