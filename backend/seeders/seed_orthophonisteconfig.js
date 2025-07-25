import { OrthophonisteConfig, USR } from '../models/index.js';

export default class OrthophonisteConfigSeeder {
  constructor() {
    this.configs = [];
    this.orthophonistes = [];
  }

  async seed() {
    try {
      console.log('Seeding table ORTHOPHONISTECONFIG...');
      
      // Charger les orthophonistes existants
      await this.loadOrthophonistes();
      
      // Nettoyer la table ORTHOPHONISTECONFIG
      await this.clear();
      
      // Créer les configurations
      await this.createConfigs();
      
      console.log(`Table ORTHOPHONISTECONFIG seedée avec succès : ${this.configs.length} configurations créées`);
      return this.configs;
      
    } catch (error) {
      console.error('Erreur lors du seeding de la table ORTHOPHONISTECONFIG:', error);
      throw error;
    }
  }

  async loadOrthophonistes() {
    console.log('Chargement des orthophonistes existants...');
    
    // Charger tous les orthophonistes
    this.orthophonistes = await USR.findAll({
      where: { USR_role: 'orthophoniste' },
      order: [['USR_id', 'ASC']]
    });

    console.log(`${this.orthophonistes.length} orthophonistes trouvés`);

    if (this.orthophonistes.length === 0) {
      throw new Error('Aucun orthophoniste trouvé. Veuillez d\'abord exécuter le seeder USR.');
    }
  }

  async clear() {
    console.log('Nettoyage de la table ORTHOPHONISTECONFIG...');
    await OrthophonisteConfig.destroy({ where: {} });
    console.log('Table ORTHOPHONISTECONFIG nettoyée');
  }

  async createConfigs() {
    const configsData = [];
    
    // Configuration variée pour chaque orthophoniste
    const configurationTypes = [
      {
        type: 'gratuit',
        paiement_obligatoire: false,
        prix: 0.00,
        description: 'Service gratuit - financement public'
      },
      {
        type: 'standard',
        paiement_obligatoire: true,
        prix: 9.99,
        description: 'Tarif standard'
      },
      {
        type: 'premium',
        paiement_obligatoire: true,
        prix: 15.99,
        description: 'Service premium avec suivi renforcé'
      },
      {
        type: 'economique',
        paiement_obligatoire: true,
        prix: 5.99,
        description: 'Tarif réduit pour familles nombreuses'
      },
      {
        type: 'liberal',
        paiement_obligatoire: true,
        prix: 12.50,
        description: 'Pratique libérale classique'
      }
    ];

    // Créer une configuration pour chaque orthophoniste
    this.orthophonistes.forEach((orthophoniste, index) => {
      // Distribuer les types de configuration de manière variée
      let configType;
      
      if (index === 0) {
        // Premier orthophoniste avec service gratuit
        configType = configurationTypes[0]; // gratuit
      } else {
        // Répartition aléatoire pondérée pour les autres
        const rand = Math.random();
        if (rand < 0.4) {
          configType = configurationTypes[1]; // standard (40%)
        } else if (rand < 0.6) {
          configType = configurationTypes[4]; // liberal (20%)
        } else if (rand < 0.8) {
          configType = configurationTypes[2]; // premium (20%)
        } else {
          configType = configurationTypes[3]; // economique (20%)
        }
      }

      const configData = {
        USR_orthophoniste_id: orthophoniste.USR_id,
        CONFIG_paiement_obligatoire: configType.paiement_obligatoire,
        CONFIG_prix_par_enfant: configType.prix,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      configsData.push(configData);
    });

    this.configs = await OrthophonisteConfig.bulkCreate(configsData);
    
    // Afficher un résumé
    const stats = this.getStats();
    console.log('Configurations créées:');
    console.log(`   - Total: ${stats.total}`);
    console.log(`   - Paiement obligatoire: ${stats.paiementObligatoire}`);
    console.log(`   - Service gratuit: ${stats.serviceGratuit}`);
    console.log(`   - Prix moyen: ${stats.prixMoyen}€`);
    console.log(`   - Prix min: ${stats.prixMin}€`);
    console.log(`   - Prix max: ${stats.prixMax}€`);

    // Afficher la répartition des tarifs
    console.log('   - Répartition des tarifs:');
    Object.entries(stats.repartitionTarifs).forEach(([tarif, count]) => {
      console.log(`     * ${tarif}€: ${count} orthophoniste(s)`);
    });

    return this.configs;
  }

  // Méthode pour obtenir la configuration d'un orthophoniste
  getConfigByOrthophoniste(orthophonisteId) {
    return this.configs.find(config => config.USR_orthophoniste_id === orthophonisteId);
  }

  // Méthode pour obtenir les configurations avec paiement obligatoire
  getConfigsAvecPaiement() {
    return this.configs.filter(config => config.CONFIG_paiement_obligatoire === true);
  }

  // Méthode pour obtenir les configurations gratuites
  getConfigsGratuites() {
    return this.configs.filter(config => config.CONFIG_paiement_obligatoire === false);
  }

  // Méthode pour obtenir les configurations par prix
  getConfigsByPrix(prix) {
    return this.configs.filter(config => parseFloat(config.CONFIG_prix_par_enfant) === prix);
  }

  // Méthode pour obtenir les statistiques
  getStats() {
    const stats = {
      total: this.configs.length,
      paiementObligatoire: this.configs.filter(c => c.CONFIG_paiement_obligatoire === true).length,
      serviceGratuit: this.configs.filter(c => c.CONFIG_paiement_obligatoire === false).length,
      prixMoyen: 0,
      prixMin: 0,
      prixMax: 0,
      repartitionTarifs: {},
      repartitionPaiement: {
        obligatoire: 0,
        gratuit: 0
      }
    };

    if (this.configs.length > 0) {
      const prix = this.configs.map(config => parseFloat(config.CONFIG_prix_par_enfant));
      
      stats.prixMoyen = Math.round((prix.reduce((sum, p) => sum + p, 0) / prix.length) * 100) / 100;
      stats.prixMin = Math.min(...prix);
      stats.prixMax = Math.max(...prix);

      // Répartition des tarifs
      this.configs.forEach(config => {
        const tarif = parseFloat(config.CONFIG_prix_par_enfant);
        stats.repartitionTarifs[tarif] = (stats.repartitionTarifs[tarif] || 0) + 1;
      });

      // Répartition paiement obligatoire vs gratuit
      stats.repartitionPaiement.obligatoire = stats.paiementObligatoire;
      stats.repartitionPaiement.gratuit = stats.serviceGratuit;
    }

    return stats;
  }

  // Méthode pour obtenir une configuration par ID
  getConfigById(id) {
    return this.configs.find(config => config.CONFIG_id === id);
  }

  // Méthode pour obtenir des statistiques détaillées par orthophoniste
  getDetailsByOrthophoniste() {
    const details = {};
    
    this.configs.forEach(config => {
      const orthophoniste = this.orthophonistes.find(o => o.USR_id === config.USR_orthophoniste_id);
      
      details[config.USR_orthophoniste_id] = {
        orthophoniste: {
          id: orthophoniste?.USR_id,
          nom: orthophoniste?.USR_nom,
          prenom: orthophoniste?.USR_prenom,
          email: orthophoniste?.USR_email
        },
        configuration: {
          id: config.CONFIG_id,
          paiement_obligatoire: config.CONFIG_paiement_obligatoire,
          prix_par_enfant: parseFloat(config.CONFIG_prix_par_enfant),
          type_service: config.CONFIG_paiement_obligatoire ? 'payant' : 'gratuit'
        }
      };
    });

    return details;
  }

  // Méthode pour obtenir les configurations par type de service
  getConfigsByTypeService() {
    return {
      gratuit: this.configs.filter(c => c.CONFIG_paiement_obligatoire === false),
      payant: this.configs.filter(c => c.CONFIG_paiement_obligatoire === true)
    };
  }

  // Méthode pour obtenir les statistiques de tarification
  getTarificationStats() {
    const payantes = this.configs.filter(c => c.CONFIG_paiement_obligatoire === true);
    
    if (payantes.length === 0) {
      return {
        nombreConfigsPayantes: 0,
        tarifMoyen: 0,
        tarifMin: 0,
        tarifMax: 0
      };
    }

    const tarifs = payantes.map(c => parseFloat(c.CONFIG_prix_par_enfant));
    
    return {
      nombreConfigsPayantes: payantes.length,
      tarifMoyen: Math.round((tarifs.reduce((sum, t) => sum + t, 0) / tarifs.length) * 100) / 100,
      tarifMin: Math.min(...tarifs),
      tarifMax: Math.max(...tarifs),
      ecartType: this.calculateStandardDeviation(tarifs)
    };
  }

  // Méthode utilitaire pour calculer l'écart-type
  calculateStandardDeviation(values) {
    const moyenne = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - moyenne, 2), 0) / values.length;
    return Math.round(Math.sqrt(variance) * 100) / 100;
  }
}