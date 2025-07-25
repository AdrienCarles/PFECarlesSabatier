import MasterSeeder from './index.js';

async function main() {
  const masterSeeder = new MasterSeeder();
  
  // Récupérer les arguments de ligne de commande
  const args = process.argv.slice(2);
  const command = args[0];
  
  try {
    switch (command) {
      case 'all':
        // Seeder toutes les tables
        await masterSeeder.seedAll({
          clearFirst: true,
          verbose: true,
          stopOnError: true
        });
        break;
        
      case 'only': {
        // Seeder seulement certaines tables
        // Exemple: npm run seed only USR SES
        const tables = args.slice(1);
        if (tables.length === 0) {
          console.error('Spécifiez les tables à seeder: npm run seed only USR SES');
          process.exit(1);
        }
        await masterSeeder.seedAll({
          only: tables,
          verbose: true
        });
        break;
      }
      case 'exclude': {
        // Seeder tout sauf certaines tables
        // Exemple: npm run seed exclude STAT
        const excludeTables = args.slice(1);
        await masterSeeder.seedAll({
          exclude: excludeTables,
          verbose: true
        });
        break;
      }
        
      case 'clear':
        // Nettoyer toutes les tables
        await masterSeeder.clearAll();
        break;
        
      case 'users-only':
        // Raccourci pour seeder seulement les utilisateurs
        await masterSeeder.seedAll({
          only: ['USR'],
          verbose: true
        });
        break;
        
      case 'basic':
        // Seeder de base: utilisateurs, séries, enfants
        await masterSeeder.seedAll({
          only: ['USR', 'SES', 'ENFA', 'ORTHOPHONISTECONFIG'],
          verbose: true
        });
        break;
        
      case 'help':
        console.log(`
            Seeder Commands:

              npm run seed              Seed toutes les tables
              npm run seed all          Seed toutes les tables  
              npm run seed only [tables]     Seed seulement les tables spécifiées
              npm run seed exclude [tables]  Seed tout sauf les tables spécifiées
              npm run seed clear        Nettoie toutes les tables
              npm run seed users-only   Seed seulement les utilisateurs
              npm run seed basic        Seed de base (USR, SES, ENFA, CONFIG)
              npm run seed help         Affiche cette aide

            Exemples:
              npm run seed only USR SES
              npm run seed exclude STAT ANI
        `);
        break;
        
      default:
        console.error(`Commande inconnue: ${command}`);
        console.log('Utilisez "npm run seed help" pour voir les commandes disponibles');
        process.exit(1);
    }
    
  } catch (error) {
    console.error('Erreur fatale:', error);
    process.exit(1);
  } finally {
    // Fermer la connexion à la base de données si nécessaire
    process.exit(0);
  }
}

// Exécuter le script
main();