import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SES, USR } from '../models/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class SesSeeder {
  constructor() {
    this.series = [];
    this.orthophonistes = [];
  }

  async seed() {
    try {
      console.log('Seeding table SES...');
      
      // Charger les orthophonistes existants
      await this.loadOrthophonistes();
      
      // Nettoyer la table SES
      await this.clear();
      
      // Créer les dossiers nécessaires
      await this.setupDirectories();
      
      // Créer les séries
      await this.createSeries();
      
      console.log(`Table SES seedée avec succès : ${this.series.length} séries créées`);
      return this.series;
      
    } catch (error) {
      console.error('Erreur lors du seeding de la table SES:', error);
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
    console.log('Nettoyage de la table SES...');
    await SES.destroy({ where: {} });
    console.log('Table SES nettoyée');
  }

  async setupDirectories() {
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'series');
    
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log('Dossier uploads/series créé');
    }
  }

  async createSeries() {
    const seriesData = [
      {
        SES_titre: 'Les Animaux Domestiques',
        SES_theme: 'Découverte',
        SES_description: 'Une série dédiée à la découverte des animaux domestiques. Parfait pour enrichir le vocabulaire et développer la reconnaissance auditive.',
        SES_statut: 'actif',
        SES_dateCreation: new Date(),
        SES_icone: '/uploads/series/animaux.png'
      },
      {
        SES_titre: 'Les Animaux de la savane',
        SES_theme: 'Apprentissage',
        SES_description: 'Une série dédiée à la découverte des animaux de la savane. Parfait pour enrichir le vocabulaire et développer la reconnaissance auditive.',
        SES_statut: 'actif',
        SES_dateCreation: new Date(),
        SES_icone: '/uploads/series/animaux_savane.png'
      },
      {
        SES_titre: 'Instruments de Musique',
        SES_theme: 'Musiques',
        SES_description: 'Découverte des instruments de musique',
        SES_statut: 'actif',
        SES_dateCreation: new Date(),
        SES_icone: '/uploads/series/instruments.png'
      },
      {
        SES_titre: 'Moyen de transport',
        SES_theme: 'transport',
        SES_description: 'Découverte des moyens de transports.',
        SES_statut: 'actif',
        SES_dateCreation: new Date(),
        SES_icone: '/uploads/series/transports.png'
      },
    ];

    this.series = await SES.bulkCreate(seriesData);
    
    // Afficher un résumé
    const stats = this.getStats();
    console.log('Séries créées:');
    console.log(`   - Total: ${stats.total}`);
    console.log(`   - Par statut:`);
    Object.entries(stats.byStatut).forEach(([statut, count]) => {
      console.log(`     * ${statut}: ${count}`);
    });
    console.log(`   - Par thème:`);
    Object.entries(stats.byTheme).forEach(([theme, count]) => {
      console.log(`     * ${theme}: ${count}`);
    });

    return this.series;
  }

  // Méthode pour obtenir les séries par statut
  getSeriesByStatut(statut) {
    return this.series.filter(serie => serie.SES_statut === statut);
  }

  // Méthode pour obtenir les séries par thème
  getSeriesByTheme(theme) {
    return this.series.filter(serie => serie.SES_theme === theme);
  }

  // Méthode pour obtenir une série par titre
  getSerieByTitle(titre) {
    return this.series.find(serie => serie.SES_titre === titre);
  }

  // Méthode pour obtenir les statistiques
  getStats() {
    const stats = {
      total: this.series.length,
      byStatut: {},
      byTheme: {},
      withIcon: this.series.filter(s => s.SES_icone).length,
      withoutIcon: this.series.filter(s => !s.SES_icone).length
    };

    this.series.forEach(serie => {
      stats.byStatut[serie.SES_statut] = (stats.byStatut[serie.SES_statut] || 0) + 1;
      stats.byTheme[serie.SES_theme] = (stats.byTheme[serie.SES_theme] || 0) + 1;
    });

    return stats;
  }

  // Méthode pour obtenir une série par ID
  getSerieById(id) {
    return this.series.find(serie => serie.SES_id === id);
  }

  // Méthode pour obtenir des statistiques détaillées
  getDetailedStats() {
    const now = new Date();
    const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));

    return {
      ...this.getStats(),
      recentSeries: this.series.filter(s => new Date(s.SES_dateCreation) > oneMonthAgo).length,
      averageDescriptionLength: Math.round(
        this.series.reduce((sum, s) => sum + (s.SES_description?.length || 0), 0) / this.series.length
      ),
      themesDistribution: this.getThemeDistribution()
    };
  }

  // Méthode pour obtenir la distribution des thèmes
  getThemeDistribution() {
    const distribution = {};
    const total = this.series.length;
    
    this.series.forEach(serie => {
      distribution[serie.SES_theme] = (distribution[serie.SES_theme] || 0) + 1;
    });

    // Convertir en pourcentages
    Object.keys(distribution).forEach(theme => {
      distribution[theme] = Math.round((distribution[theme] / total) * 100);
    });

    return distribution;
  }

  // Méthode pour obtenir les séries actives
  getActiveSeries() {
    return this.series.filter(serie => serie.SES_statut === 'actif');
  }

  // Méthode pour obtenir les séries en attente
  getPendingSeries() {
    return this.series.filter(serie => serie.SES_statut === 'en_attente');
  }
}