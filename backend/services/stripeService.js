import stripe from '../config/stripe.js';
import { ABM, USR, ENFA, OrthophonisteConfig } from '../models/index.js';

export const stripeService = {
  // Créer un customer Stripe
  async createCustomer(user) {
    try {
      const customer = await stripe.customers.create({
        email: user.USR_email,
        name: `${user.USR_prenom} ${user.USR_nom}`,
        metadata: {
          user_id: user.USR_id.toString(),
          role: 'parent'
        }
      });

      // Mettre à jour l'utilisateur avec le customer ID
      await user.update({ USR_stripe_customer_id: customer.id });
      
      return customer;
    } catch (error) {
      throw new Error(`Erreur création customer Stripe: ${error.message}`);
    }
  },

  // Vérifier si le paiement est obligatoire pour un enfant
  async checkPaymentRequired(enfantId) {
    try {
      const enfant = await ENFA.findByPk(enfantId, {
        include: [{
          model: USR,
          as: 'orthophoniste',
          include: [{
            model: OrthophonisteConfig,
            as: 'config'
          }]
        }]
      });

      if (!enfant) {
        throw new Error('Enfant non trouvé');
      }

      const config = enfant.orthophoniste?.config;
      return {
        required: config?.CONFIG_paiement_obligatoire || false,
        prix: config?.CONFIG_prix_par_enfant || 9.99,
        orthophoniste: enfant.orthophoniste,
        config
      };
    } catch (error) {
      throw new Error(`Erreur vérification paiement: ${error.message}`);
    }
  },

  // Créer une session de paiement Stripe
  async createCheckoutSession(parentId, enfantId, prix) {
    try {
      const parent = await USR.findByPk(parentId);
      const enfant = await ENFA.findByPk(enfantId);

      if (!parent || !enfant) {
        throw new Error('Parent ou enfant non trouvé');
      }

      // S'assurer que le parent a un customer ID
      let customerId = parent.USR_stripe_customer_id;
      if (!customerId) {
        const customer = await this.createCustomer(parent);
        customerId = customer.id;
      }

      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        mode: 'payment', // Paiement unique
        line_items: [{
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Abonnement pour ${enfant.ENFA_prenom} ${enfant.ENFA_nom}`,
              description: 'Accès aux exercices d\'orthophonie'
            },
            unit_amount: Math.round(prix * 100) // Stripe utilise les centimes
          },
          quantity: 1,
        }],
        success_url: `${process.env.FRONTEND_URL}/parent/abonnement/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/parent/abonnement/cancel`,
        metadata: {
          parent_id: parentId.toString(),
          enfant_id: enfantId.toString(),
          prix: prix.toString()
        }
      });

      return session;
    } catch (error) {
      throw new Error(`Erreur création session Stripe: ${error.message}`);
    }
  },

  // Simuler un paiement réussi
  async simulateSuccessfulPayment(parentId, enfantId, prix) {
    try {
      const dateDebut = new Date();
      const dateFin = new Date();
      dateFin.setMonth(dateFin.getMonth() + 1); // 1 mois

      const abonnement = await ABM.create({
        USR_id: parentId,
        ENFA_id: enfantId,
        ABM_dateDebut: dateDebut,
        ABM_dateFin: dateFin,
        ABM_prix: prix,
        ABM_statut: 'actif',
        ABM_stripe_subscription_id: `sim_${Date.now()}_${enfantId}`,
        ABM_mode_paiement: 'test'
      });

      return abonnement;
    } catch (error) {
      throw new Error(`Erreur simulation paiement: ${error.message}`);
    }
  },

  // Vérifier le statut d'un paiement Stripe
  async verifyPayment(sessionId) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      return session;
    } catch (error) {
      throw new Error(`Erreur vérification paiement: ${error.message}`);
    }
  }
};