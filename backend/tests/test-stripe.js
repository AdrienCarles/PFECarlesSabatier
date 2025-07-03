import stripe from '../config/stripe.js';

async function testStripeConnection() {
  try {
    console.log('Test de la connexion Stripe...');
    
    // Test création d'un prix avec produit intégré (sans description)
    const price = await stripe.prices.create({
      unit_amount: 999, // 9.99€ en centimes
      currency: 'eur',
      recurring: {
        interval: 'month',
      },
      product_data: {
        name: 'Abonnement Enfant Test'
        // Pas de description ici
      },
    });
    console.log(`Prix d'abonnement créé: ${price.id} - ${price.unit_amount/100}€/mois`);
    
    // Test création session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{
        price: price.id,
        quantity: 1,
      }],
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel',
    });
    console.log(`Session créée: ${session.url}`);
    
  } catch (error) {
    console.error('Erreur:', error.message);
  }
}

testStripeConnection();