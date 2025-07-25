import bcrypt from 'bcrypt';
import { USR } from '../models/index.js';

export default class UsrSeeder {
  constructor() {
    this.users = [];
  }

  async seed() {
    try {
      console.log('Seeding table USR...');
      
      // Nettoyer la table USR
      await this.clear();
      
      // Créer les utilisateurs
      await this.createUsers();
      
      console.log(`Table USR seedée avec succès : ${this.users.length} utilisateurs créés`);
      return this.users;
      
    } catch (error) {
      console.error('Erreur lors du seeding de la table USR:', error);
      throw error;
    }
  }

  async clear() {
    console.log('Nettoyage de la table USR...');
    await USR.destroy({ where: {} });
    console.log('Table USR nettoyée');
  }

  async createUsers() {
    const hashedPassword = await bcrypt.hash('Azertyui1', 10);
    
    const usersData = [
      // Administrateur système
      {
        USR_nom: 'Admin',
        USR_prenom: 'Système',
        USR_email: 'admin@mfe.com',
        USR_pass: hashedPassword,
        USR_role: 'admin',
        USR_statut: 'actif',
        USR_telephone: '0123456789',
        USR_dateCreation: new Date(),
        USR_activationToken: null,
        USR_tokenExpiry: null
      },

      // Orthophonistes
      {
        USR_nom: 'Dubois',
        USR_prenom: 'Marie',
        USR_email: 'marie.dubois@ortho.com',
        USR_pass: hashedPassword,
        USR_role: 'orthophoniste',
        USR_statut: 'actif',
        USR_telephone: '0147258369',
        USR_dateCreation: new Date(),
        USR_activationToken: null,
        USR_tokenExpiry: null
      },
      {
        USR_nom: 'Martin',
        USR_prenom: 'Pierre',
        USR_email: 'pierre.martin@ortho.com',
        USR_pass: hashedPassword,
        USR_role: 'orthophoniste',
        USR_statut: 'actif',
        USR_telephone: '0987654321',
        USR_dateCreation: new Date(),
        USR_activationToken: null,
        USR_tokenExpiry: null
      },
      {
        USR_nom: 'Lambert',
        USR_prenom: 'Julie',
        USR_email: 'julie.lambert@ortho.com',
        USR_pass: hashedPassword,
        USR_role: 'orthophoniste',
        USR_statut: 'actif',
        USR_telephone: '0159753486',
        USR_dateCreation: new Date(),
        USR_activationToken: null,
        USR_tokenExpiry: null
      },

      // Parents actifs
      {
        USR_nom: 'Dupont',
        USR_prenom: 'Sophie',
        USR_email: 'sophie.dupont@parent.com',
        USR_pass: hashedPassword,
        USR_role: 'parent',
        USR_statut: 'actif',
        USR_telephone: '0142857693',
        USR_dateCreation: new Date(),
        USR_activationToken: null,
        USR_tokenExpiry: null
      },
      {
        USR_nom: 'Bernard',
        USR_prenom: 'Jean',
        USR_email: 'jean.bernard@parent.com',
        USR_pass: hashedPassword,
        USR_role: 'parent',
        USR_statut: 'actif',
        USR_telephone: '0156234789',
        USR_dateCreation: new Date(),
        USR_activationToken: null,
        USR_tokenExpiry: null
      },
      {
        USR_nom: 'Rousseau',
        USR_prenom: 'Claire',
        USR_email: 'claire.rousseau@parent.com',
        USR_pass: hashedPassword,
        USR_role: 'parent',
        USR_statut: 'actif',
        USR_telephone: '0163927485',
        USR_dateCreation: new Date(),
        USR_activationToken: null,
        USR_tokenExpiry: null
      },
      {
        USR_nom: 'Moreau',
        USR_prenom: 'David',
        USR_email: 'david.moreau@parent.com',
        USR_pass: hashedPassword,
        USR_role: 'parent',
        USR_statut: 'actif',
        USR_telephone: '0174185296',
        USR_dateCreation: new Date(),
        USR_activationToken: null,
        USR_tokenExpiry: null
      },
      {
        USR_nom: 'Leroy',
        USR_prenom: 'Amélie',
        USR_email: 'amelie.leroy@parent.com',
        USR_pass: hashedPassword,
        USR_role: 'parent',
        USR_statut: 'actif',
        USR_telephone: '0185296374',
        USR_dateCreation: new Date(),
        USR_activationToken: null,
        USR_tokenExpiry: null
      },
    ];

    this.users = await USR.bulkCreate(usersData);
    
    // Afficher un résumé
    const roleCount = this.users.reduce((acc, user) => {
      acc[user.USR_role] = (acc[user.USR_role] || 0) + 1;
      return acc;
    }, {});

    console.log('Utilisateurs créés par rôle:');
    Object.entries(roleCount).forEach(([role, count]) => {
      console.log(`   - ${role}: ${count}`);
    });

    return this.users;
  }

  // Méthode pour obtenir des utilisateurs par rôle
  getUsersByRole(role) {
    return this.users.filter(user => user.USR_role === role);
  }

  // Méthode pour obtenir un utilisateur par email
  getUserByEmail(email) {
    return this.users.find(user => user.USR_email === email);
  }

  // Méthode pour obtenir les statistiques
  getStats() {
    const stats = {
      total: this.users.length,
      byRole: {},
      byStatus: {},
      activeUsers: this.users.filter(u => u.USR_statut === 'actif').length,
      inactiveUsers: this.users.filter(u => u.USR_statut === 'inactif').length
    };

    this.users.forEach(user => {
      stats.byRole[user.USR_role] = (stats.byRole[user.USR_role] || 0) + 1;
      stats.byStatus[user.USR_statut] = (stats.byStatus[user.USR_statut] || 0) + 1;
    });

    return stats;
  }
}