import UsrSeeder from './seed_USR.js';
import SesSeeder from './seed_SES.js';
import EnfaSeeder from './seed_ENFA.js';
import OrthophonisteConfigSeeder from './seed_orthophonisteconfig.js';
// Ajoutez ici vos autres seeders quand vous les créerez
// import AniSeeder from './seed_ANI.js';

export default class MasterSeeder {
  constructor() {
    this.results = {};
    this.executionOrder = [
      'USR',           // D'abord les utilisateurs (base)
      'SES',           // Ensuite les séries
      'ENFA',          // Puis les enfants (dépendent des utilisateurs)
      'ORTHOPHONISTECONFIG', // Configurations (dépendent des orthophonistes)
    ];
  }

  async seedAll(options = {}) {
    const { 
      clearFirst = true, 
      verbose = true,
      stopOnError = true,
      only = null,        
      exclude = []        
    } = options;

    console.log('Début du seeding complet de la base de données...\n');
    const startTime = Date.now();

    try {
      let tablesToSeed = this.executionOrder;

      // Filtrer les tables si nécessaire
      if (only && Array.isArray(only)) {
        tablesToSeed = this.executionOrder.filter(table => only.includes(table));
      }
      if (exclude && Array.isArray(exclude)) {
        tablesToSeed = tablesToSeed.filter(table => !exclude.includes(table));
      }

      console.log(`Tables à seeder dans l'ordre: ${tablesToSeed.join(' → ')}\n`);

      for (const tableName of tablesToSeed) {
        await this.seedTable(tableName, { verbose, stopOnError });
      }

      const endTime = Date.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);

      console.log('\nSeeding complet terminé avec succès!');
      console.log(`Durée totale: ${duration}s`);
      
      this.displaySummary();
      
      return this.results;

    } catch (error) {
      console.error('\nErreur lors du seeding:', error.message);
      console.error('Stack:', error.stack);
      
      if (stopOnError) {
        process.exit(1);
      }
      throw error;
    }
  }

  async seedTable(tableName, options = {}) {
    const { verbose = true, stopOnError = true } = options;
    
    try {
      if (verbose) {
        console.log(`\nSeeding table: ${tableName}`);
        console.log('─'.repeat(50));
      }

      let seeder;
      let result;

      switch (tableName) {
        case 'USR':
          seeder = new UsrSeeder();
          result = await seeder.seed();
          this.results.USR = {
            count: result.length,
            stats: seeder.getStats(),
            seeder: seeder
          };
          break;

        case 'SES':
          seeder = new SesSeeder();
          result = await seeder.seed();
          this.results.SES = {
            count: result.length,
            stats: seeder.getStats(),
            seeder: seeder
          };
          break;

        case 'ENFA':
          seeder = new EnfaSeeder();
          result = await seeder.seed();
          this.results.ENFA = {
            count: result.length,
            stats: seeder.getStats(),
            seeder: seeder
          };
          break;

        case 'ORTHOPHONISTECONFIG':
          seeder = new OrthophonisteConfigSeeder();
          result = await seeder.seed();
          this.results.ORTHOPHONISTECONFIG = {
            count: result.length,
            stats: seeder.getStats(),
            seeder: seeder
          };
          break;

        // case 'ANI':
        //   seeder = new AniSeeder();
        //   result = await seeder.seed();
        //   break;

        default:
          throw new Error(`Seeder non trouvé pour la table: ${tableName}`);
      }

      if (verbose) {
        console.log(`${tableName}: ${result.length} enregistrements créés`);
      }

    } catch (error) {
      console.error(`Erreur lors du seeding de ${tableName}:`, error.message);
      
      if (stopOnError) {
        throw error;
      } else {
        this.results[tableName] = { error: error.message };
      }
    }
  }

  displaySummary() {
    console.log('\nRÉSUMÉ DU SEEDING');
    console.log('═'.repeat(60));

    let totalRecords = 0;
    Object.entries(this.results).forEach(([tableName, data]) => {
      if (data.error) {
        console.log(`${tableName}: ERREUR - ${data.error}`);
      } else {
        console.log(`${tableName}: ${data.count} enregistrements`);
        totalRecords += data.count;
      }
    });

    console.log('─'.repeat(60));
    console.log(`TOTAL: ${totalRecords} enregistrements créés`);

    // Afficher des statistiques détaillées si disponibles
    if (this.results.USR?.stats) {
      console.log('\nUTILISATEURS:');
      Object.entries(this.results.USR.stats.byRole).forEach(([role, count]) => {
        console.log(`   • ${role}: ${count}`);
      });
    }

    if (this.results.SES?.stats) {
      console.log('\nSÉRIES:');
      Object.entries(this.results.SES.stats.byStatut).forEach(([statut, count]) => {
        console.log(`   • ${statut}: ${count}`);
      });
    }

    if (this.results.ENFA?.stats) {
      console.log('\nENFANTS:');
      console.log(`   • Suivis actifs: ${this.results.ENFA.stats.suivisActifs}`);
      console.log(`   • Suivis terminés: ${this.results.ENFA.stats.suivisTermines}`);
    }
  }

  // Méthodes utilitaires pour accéder aux données seedées
  getUserSeeder() {
    return this.results.USR?.seeder;
  }

  getSeriesSeeder() {
    return this.results.SES?.seeder;
  }

  getEnfantSeeder() {
    return this.results.ENFA?.seeder;
  }

  getConfigSeeder() {
    return this.results.ORTHOPHONISTECONFIG?.seeder;
  }

  // Méthode pour nettoyer toutes les tables dans l'ordre inverse
  async clearAll() {
    console.log('Nettoyage de toutes les tables...');
    
    const reversedOrder = [...this.executionOrder].reverse();
    
    for (const tableName of reversedOrder) {
      try {
        let seeder;
        switch (tableName) {
          case 'USR':
            seeder = new UsrSeeder();
            break;
          case 'SES':
            seeder = new SesSeeder();
            break;
          case 'ENFA':
            seeder = new EnfaSeeder();
            break;
          case 'ORTHOPHONISTECONFIG':
            seeder = new OrthophonisteConfigSeeder();
            break;
        }
        
        if (seeder && typeof seeder.clear === 'function') {
          await seeder.clear();
        }
      } catch (error) {
        console.warn(`Erreur lors du nettoyage de ${tableName}:`, error.message);
      }
    }
    
    console.log('Nettoyage terminé');
  }
}