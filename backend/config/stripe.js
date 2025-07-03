import Stripe from 'stripe';
import dotenv from 'dotenv';

// S'assurer que dotenv est chargé
dotenv.config();

if (!process.env.STRIPE_SECRET_KEY) {
  console.error('❌ STRIPE_SECRET_KEY non trouvée dans les variables d\'environnement');
  console.log('Variables d\'environnement disponibles:', Object.keys(process.env).filter(key => key.includes('STRIPE')));
  throw new Error('STRIPE_SECRET_KEY is required');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export default stripe;