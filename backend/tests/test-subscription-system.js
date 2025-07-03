import db, { USR, ENFA, OrthophonisteConfig, ABM } from '../models/index.js';
import { stripeService } from '../services/stripeService.js';

async function testSubscriptionSystem() {
  try {
    console.log('Test du système d\'abonnement complet');
    console.log('='.repeat(60));

    // 1. Trouver ou créer un orthophoniste
    let orthophoniste = await USR.findOne({
      where: { USR_role: 'orthophoniste' }
    });

    if (!orthophoniste) {
      console.log('Aucun orthophoniste trouvé. Créez-en un d\'abord.');
      return;
    }

    console.log(`Orthophoniste: ${orthophoniste.USR_prenom} ${orthophoniste.USR_nom}`);

    // 2. Configurer l'orthophoniste (paiement obligatoire)
    let config = await OrthophonisteConfig.findOne({
      where: { USR_orthophoniste_id: orthophoniste.USR_id }
    });

    if (!config) {
      config = await OrthophonisteConfig.create({
        USR_orthophoniste_id: orthophoniste.USR_id,
        CONFIG_paiement_obligatoire: true,
        CONFIG_prix_par_enfant: 12.99
      });
      console.log(`Configuration créée: Paiement obligatoire à ${config.CONFIG_prix_par_enfant}€`);
    } else {
      console.log(`Configuration existante: ${config.CONFIG_paiement_obligatoire ? 'Payant' : 'Gratuit'} - ${config.CONFIG_prix_par_enfant}€`);
    }

    // 3. Trouver un enfant
    const enfant = await ENFA.findOne({
      where: { USR_orthophoniste_id: orthophoniste.USR_id }
    });

    if (!enfant) {
      console.log('Aucun enfant trouvé pour cet orthophoniste.');
      return;
    }

    console.log(`Enfant trouvé: ${enfant.ENFA_prenom} ${enfant.ENFA_nom}`);

    // 4. Trouver le parent
    const parent = await USR.findByPk(enfant.USR_parent_id);
    if (!parent) {
      console.log('Parent non trouvé');
      return;
    }

    console.log(`Parent: ${parent.USR_prenom} ${parent.USR_nom}`);

    // 5. Test de vérification de paiement
    console.log('\nTest de vérification de paiement...');
    const paymentInfo = await stripeService.checkPaymentRequired(enfant.ENFA_id);
    console.log(`Paiement requis: ${paymentInfo.required ? 'OUI' : 'NON'}`);
    console.log(`Prix: ${paymentInfo.prix}€`);

    // 6. Test de création d'abonnement simulé
    console.log('\n Test de création d\'abonnement simulé...');
    const abonnement = await stripeService.simulateSuccessfulPayment(
      parent.USR_id,
      enfant.ENFA_id,
      paymentInfo.prix
    );

    console.log(`  Abonnement créé avec succès!`);
    console.log(`   ID: ${abonnement.ABM_id}`);
    console.log(`   Du: ${abonnement.ABM_dateDebut}`);
    console.log(`   Au: ${abonnement.ABM_dateFin}`);
    console.log(`   Prix: ${abonnement.ABM_prix}€`);
    console.log(`   Mode: ${abonnement.ABM_mode_paiement}`);

    // 7. Nettoyer le test
    console.log('\n Nettoyage...');
    await abonnement.destroy();
    console.log('Abonnement test supprimé');

    console.log('\n Test du système d\'abonnement réussi!');

  } catch (error) {
    console.error(' Erreur:', error.message);
    console.error(error.stack);
  } finally {
    await db.sequelize.close();
  }
}

testSubscriptionSystem();