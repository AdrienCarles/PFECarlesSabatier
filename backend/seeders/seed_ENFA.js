import { ENFA, USR } from '../models/index.js';

export default class EnfaSeeder {
  constructor() {
    this.enfants = [];
    this.parents = [];
    this.orthophonistes = [];
  }

  async seed() {
    try {
      console.log('Seeding table ENFA...');
      
      // Charger les utilisateurs existants
      await this.loadUsers();
      
      // Nettoyer la table ENFA
      await this.clear();
      
      // Créer les enfants
      await this.createEnfants();
      
      console.log(`Table ENFA seedée avec succès : ${this.enfants.length} enfants créés`);
      return this.enfants;
      
    } catch (error) {
      console.error('Erreur lors du seeding de la table ENFA:', error);
      throw error;
    }
  }

  async loadUsers() {
    console.log('Chargement des utilisateurs existants...');
    
    // Charger tous les parents
    this.parents = await USR.findAll({
      where: { USR_role: 'parent' },
      order: [['USR_id', 'ASC']]
    });
    
    // Charger tous les orthophonistes
    this.orthophonistes = await USR.findAll({
      where: { USR_role: 'orthophoniste' },
      order: [['USR_id', 'ASC']]
    });

    console.log(`${this.parents.length} parents trouvés`);
    console.log(`${this.orthophonistes.length} orthophonistes trouvés`);

    if (this.parents.length === 0 || this.orthophonistes.length === 0) {
      throw new Error('Aucun parent ou orthophoniste trouvé. Veuillez d\'abord exécuter le seeder USR.');
    }
  }

  async clear() {
    console.log('Nettoyage de la table ENFA...');
    await ENFA.destroy({ where: {} });
    console.log('Table ENFA nettoyée');
  }

  async createEnfants() {
    const enfantsData = [];
    
    // Noms et prénoms variés pour les enfants
    const prenoms = [
      'Emma', 'Gabriel', 'Louise', 'Raphaël', 'Jade', 'Arthur', 'Alice', 'Louis',
      'Lina', 'Jules', 'Chloé', 'Adam', 'Rose', 'Hugo', 'Anna', 'Maël',
      'Léa', 'Lucas', 'Zoé', 'Nathan', 'Inès', 'Élio', 'Manon', 'Noah',
      'Camille', 'Ethan', 'Sarah', 'Mathis', 'Eva', 'Tom'
    ];

    const niveauxAudition = ['leger', 'modere', 'severe', 'profond'];
    
    // Créer 2-3 enfants par parent
    this.parents.forEach((parent, parentIndex) => {
      const nombreEnfants = Math.floor(Math.random() * 2) + 1; // 1 ou 2 enfants par parent
      
      for (let i = 0; i < nombreEnfants; i++) {
        // Sélectionner un orthophoniste aléatoirement
        const orthophoniste = this.orthophonistes[Math.floor(Math.random() * this.orthophonistes.length)];
        
        // Générer une date de naissance (entre 2 et 15 ans)
        const ageEnAnnees = Math.floor(Math.random() * 14) + 2;
        const dateNaissance = new Date();
        dateNaissance.setFullYear(dateNaissance.getFullYear() - ageEnAnnees);
        dateNaissance.setMonth(Math.floor(Math.random() * 12));
        dateNaissance.setDate(Math.floor(Math.random() * 28) + 1);

        // Date de début de suivi (entre 6 mois et 2 ans après la création du compte parent)
        const dateDebutSuivi = new Date(parent.USR_dateCreation);
        dateDebutSuivi.setMonth(dateDebutSuivi.getMonth() + Math.floor(Math.random() * 18) + 6);

        // Date de fin de suivi (optionnelle, seulement pour certains enfants)
        let dateFinSuivi = null;
        if (Math.random() > 0.7) { // 30% des enfants ont une date de fin
          dateFinSuivi = new Date(dateDebutSuivi);
          dateFinSuivi.setMonth(dateFinSuivi.getMonth() + Math.floor(Math.random() * 12) + 6);
        }

        // Notes de suivi variées
        const notesOptions = [
          'Progression régulière, enfant motivé',
          'Difficultés avec les sons aigus, travail sur la discrimination auditive',
          'Excellente participation aux exercices, résultats encourageants',
          'Besoin de renforcement sur la compréhension en milieu bruyant',
          'Adaptation rapide aux appareils auditifs',
          'Travail sur l\'articulation et la prononciation',
          'Enfant timide au début, maintenant plus confiant',
          'Progrès notables en lecture labiale',
          'Collaboration étroite avec l\'école nécessaire',
          null // Certains enfants n'ont pas de notes
        ];

        const enfantData = {
          ENFA_prenom: prenoms[Math.floor(Math.random() * prenoms.length)],
          ENFA_nom: parent.USR_nom, // L'enfant porte le nom du parent
          ENFA_dateNaissance: dateNaissance,
          ENFA_niveauAudition: niveauxAudition[Math.floor(Math.random() * niveauxAudition.length)],
          ENFA_dateCreation: new Date(),
          ENFA_dateDebutSuivi: dateDebutSuivi,
          ENFA_dateFinSuivi: dateFinSuivi,
          ENFA_notesSuivi: notesOptions[Math.floor(Math.random() * notesOptions.length)],
          USR_parent_id: parent.USR_id,
          USR_orthophoniste_id: orthophoniste.USR_id
        };

        enfantsData.push(enfantData);
      }
    });

    this.enfants = await ENFA.bulkCreate(enfantsData);
    
    // Afficher un résumé
    const stats = this.getStats();
    console.log('Enfants créés:');
    console.log(`   - Total: ${stats.total}`);
    console.log(`   - Par niveau d'audition:`);
    Object.entries(stats.byNiveauAudition).forEach(([niveau, count]) => {
      console.log(`     * ${niveau}: ${count}`);
    });
    console.log(`   - Suivis actifs: ${stats.suivisActifs}`);
    console.log(`   - Suivis terminés: ${stats.suivisTermines}`);

    return this.enfants;
  }

  // Méthode pour obtenir les enfants d'un parent
  getEnfantsByParent(parentId) {
    return this.enfants.filter(enfant => enfant.USR_parent_id === parentId);
  }

  // Méthode pour obtenir les enfants d'un orthophoniste
  getEnfantsByOrthophoniste(orthophonisteId) {
    return this.enfants.filter(enfant => enfant.USR_orthophoniste_id === orthophonisteId);
  }

  // Méthode pour obtenir les enfants par niveau d'audition
  getEnfantsByNiveauAudition(niveau) {
    return this.enfants.filter(enfant => enfant.ENFA_niveauAudition === niveau);
  }

  // Méthode pour obtenir les statistiques
  getStats() {
    const stats = {
      total: this.enfants.length,
      byNiveauAudition: {},
      byParent: {},
      byOrthophoniste: {},
      suivisActifs: this.enfants.filter(e => !e.ENFA_dateFinSuivi).length,
      suivisTermines: this.enfants.filter(e => e.ENFA_dateFinSuivi).length,
      ageStats: {
        min: 0,
        max: 0,
        moyenne: 0
      }
    };

    // Statistiques par niveau d'audition
    this.enfants.forEach(enfant => {
      stats.byNiveauAudition[enfant.ENFA_niveauAudition] = 
        (stats.byNiveauAudition[enfant.ENFA_niveauAudition] || 0) + 1;
      
      stats.byParent[enfant.USR_parent_id] = 
        (stats.byParent[enfant.USR_parent_id] || 0) + 1;
      
      stats.byOrthophoniste[enfant.USR_orthophoniste_id] = 
        (stats.byOrthophoniste[enfant.USR_orthophoniste_id] || 0) + 1;
    });

    // Calcul des statistiques d'âge
    if (this.enfants.length > 0) {
      const ages = this.enfants.map(enfant => {
        const today = new Date();
        const birthDate = new Date(enfant.ENFA_dateNaissance);
        return Math.floor((today - birthDate) / (365.25 * 24 * 60 * 60 * 1000));
      });
      
      stats.ageStats.min = Math.min(...ages);
      stats.ageStats.max = Math.max(...ages);
      stats.ageStats.moyenne = Math.round(ages.reduce((sum, age) => sum + age, 0) / ages.length * 10) / 10;
    }

    return stats;
  }

  // Méthode pour obtenir un enfant par ID
  getEnfantById(id) {
    return this.enfants.find(enfant => enfant.ENFA_id === id);
  }

  // Méthode pour obtenir des statistiques détaillées par parent
  getDetailsByParent() {
    const details = {};
    
    this.enfants.forEach(enfant => {
      if (!details[enfant.USR_parent_id]) {
        details[enfant.USR_parent_id] = {
          nombreEnfants: 0,
          enfants: []
        };
      }
      
      details[enfant.USR_parent_id].nombreEnfants++;
      details[enfant.USR_parent_id].enfants.push({
        id: enfant.ENFA_id,
        prenom: enfant.ENFA_prenom,
        nom: enfant.ENFA_nom,
        niveau: enfant.ENFA_niveauAudition,
        suivi_actif: !enfant.ENFA_dateFinSuivi
      });
    });

    return details;
  }
}