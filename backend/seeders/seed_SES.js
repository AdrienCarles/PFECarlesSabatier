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
      
      // Créer les images d'exemple
      await this.createSampleImages();
      
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

  async createSampleImages() {
    console.log('Création des images d\'exemple pour les séries...');
    
    // Créer des images SVG simples pour les séries
    const svgTemplates = [
      {
        name: 'animaux.svg',
        content: `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="40" fill="#FFB366" stroke="#E8941E" stroke-width="2"/>
          <circle cx="40" cy="40" r="5" fill="#333"/>
          <circle cx="60" cy="40" r="5" fill="#333"/>
          <ellipse cx="50" cy="55" rx="8" ry="5" fill="#E8941E"/>
          <text x="50" y="85" text-anchor="middle" font-family="Arial" font-size="8" fill="#333">🐶</text>
        </svg>`
      },
      {
        name: 'couleurs.svg',
        content: `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="10" width="35" height="35" fill="#FF6B6B"/>
          <rect x="55" y="10" width="35" height="35" fill="#4ECDC4"/>
          <rect x="10" y="55" width="35" height="35" fill="#45B7D1"/>
          <rect x="55" y="55" width="35" height="35" fill="#96CEB4"/>
        </svg>`
      },
      {
        name: 'lettres.svg',
        content: `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="10" width="80" height="80" fill="#E8F4FD" stroke="#45B7D1" stroke-width="2" rx="10"/>
          <text x="50" y="40" text-anchor="middle" font-family="Arial Black" font-size="24" fill="#2C3E50">A</text>
          <text x="30" y="70" text-anchor="middle" font-family="Arial Black" font-size="18" fill="#7F8C8D">B</text>
          <text x="70" y="70" text-anchor="middle" font-family="Arial Black" font-size="18" fill="#7F8C8D">C</text>
        </svg>`
      },
      {
        name: 'chiffres.svg',
        content: `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="10" width="80" height="80" fill="#FFF2E8" stroke="#FF9F43" stroke-width="2" rx="10"/>
          <text x="50" y="45" text-anchor="middle" font-family="Arial Black" font-size="28" fill="#E55039">1</text>
          <text x="30" y="75" text-anchor="middle" font-family="Arial Black" font-size="20" fill="#FA8231">2</text>
          <text x="70" y="75" text-anchor="middle" font-family="Arial Black" font-size="20" fill="#FA8231">3</text>
        </svg>`
      },
      {
        name: 'formes.svg',
        content: `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
          <circle cx="30" cy="30" r="15" fill="#A55EEA"/>
          <rect x="55" y="15" width="30" height="30" fill="#26C281"/>
          <polygon points="30,85 15,65 45,65" fill="#FD6C6C"/>
          <rect x="55" y="65" width="20" height="20" fill="#778CA3" transform="rotate(45 65 75)"/>
        </svg>`
      },
      {
        name: 'metiers.svg',
        content: `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="10" width="80" height="80" fill="#F8F9FA" stroke="#6C757D" stroke-width="2" rx="10"/>
          <rect x="30" y="25" width="40" height="25" fill="#007BFF" rx="5"/>
          <circle cx="50" cy="60" r="8" fill="#FFC107"/>
          <rect x="46" y="68" width="8" height="20" fill="#6C757D"/>
          <text x="50" y="95" text-anchor="middle" font-family="Arial" font-size="8" fill="#333">👷</text>
        </svg>`
      }
    ];

    for (const template of svgTemplates) {
      const filePath = path.join(process.cwd(), 'public', 'uploads', 'series', template.name);
      fs.writeFileSync(filePath, template.content);
    }

    console.log(`${svgTemplates.length} images d'exemple créées`);
  }

  async createSeries() {
    const seriesData = [
      {
        SES_titre: 'Les Animaux',
        SES_theme: 'Découverte',
        SES_description: 'Une série dédiée à la découverte des animaux de la ferme, de la savane et de la forêt. Parfait pour enrichir le vocabulaire et développer la reconnaissance auditive.',
        SES_statut: 'actif',
        SES_dateCreation: new Date(),
        SES_icone: '/uploads/series/animaux.svg'
      },
      {
        SES_titre: 'Les Couleurs',
        SES_theme: 'Apprentissage',
        SES_description: 'Apprenez les couleurs primaires et secondaires à travers des animations colorées et interactives. Idéal pour stimuler la perception visuelle.',
        SES_statut: 'actif',
        SES_dateCreation: new Date(),
        SES_icone: '/uploads/series/couleurs.svg'
      },
      {
        SES_titre: 'L\'Alphabet',
        SES_theme: 'Lettres',
        SES_description: 'Découverte progressive de l\'alphabet avec des animations ludiques. Chaque lettre est associée à des mots et des sons pour faciliter l\'apprentissage.',
        SES_statut: 'actif',
        SES_dateCreation: new Date(),
        SES_icone: '/uploads/series/lettres.svg'
      },
      {
        SES_titre: 'Les Chiffres',
        SES_theme: 'Mathématiques',
        SES_description: 'Introduction aux chiffres de 1 à 10 avec des exercices de comptage et de reconnaissance. Développe les compétences mathématiques de base.',
        SES_statut: 'actif',
        SES_dateCreation: new Date(),
        SES_icone: '/uploads/series/chiffres.svg'
      },
      {
        SES_titre: 'Les Formes Géométriques',
        SES_theme: 'Géométrie',
        SES_description: 'Exploration des formes de base : cercle, carré, triangle, rectangle. Aide à développer la reconnaissance spatiale et géométrique.',
        SES_statut: 'en_attente',
        SES_dateCreation: new Date(),
        SES_icone: '/uploads/series/formes.svg'
      },
      {
        SES_titre: 'Les Métiers',
        SES_theme: 'Société',
        SES_description: 'Découverte des différents métiers et professions. Enrichit le vocabulaire social et aide à comprendre le monde du travail.',
        SES_statut: 'en_attente',
        SES_dateCreation: new Date(),
        SES_icone: '/uploads/series/metiers.svg'
      }
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