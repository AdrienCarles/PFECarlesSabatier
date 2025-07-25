import { USR, } from '../../models/index.js';
import bcrypt from 'bcrypt';

async function testUsrData() {
  try {
    console.log('Test des données USR...');
    
    // Compter les utilisateurs
    const totalUsers = await USR.count();
    console.log(`Total utilisateurs: ${totalUsers}`);
    
    // Compter par rôle
    const adminCount = await USR.count({ where: { USR_role: 'admin' } });
    const orthoCount = await USR.count({ where: { USR_role: 'orthophoniste' } });
    const parentCount = await USR.count({ where: { USR_role: 'parent' } });
    
    console.log(`Admins: ${adminCount}`);
    console.log(`Orthophonistes: ${orthoCount}`);
    console.log(`Parents: ${parentCount}`);
    
    // Compter par statut
    const activeCount = await USR.count({ where: { USR_statut: 'actif' } });
    const inactiveCount = await USR.count({ where: { USR_statut: 'inactif' } });
    
    console.log(`Actifs: ${activeCount}`);
    console.log(`Inactifs: ${inactiveCount}`);
    
    // Tester la connexion d'un utilisateur
    const testUser = await USR.findOne({ where: { USR_email: 'admin@mfe.com' } });
    if (testUser) {
      const passwordMatch = await bcrypt.compare('Azertyui1', testUser.USR_pass);
      console.log(`Test connexion admin: ${passwordMatch ? 'Succès' : 'Échec'}`);
    }
    
    // Lister quelques utilisateurs
    const sampleUsers = await USR.findAll({
      limit: 5,
      attributes: ['USR_nom', 'USR_prenom', 'USR_email', 'USR_role', 'USR_statut']
    });
    
    console.log('\nExemples d\'utilisateurs:');
    sampleUsers.forEach(user => {
      console.log(`   ${user.USR_prenom} ${user.USR_nom} (${user.USR_email}) - ${user.USR_role} - ${user.USR_statut}`);
    });
    
    console.log('\nTest terminé');
    process.exit(0);
    
  } catch (error) {
    console.error('Erreur lors du test:', error);
    process.exit(1);
  }
}

testUsrData();