import { ABM, USR, PAI, OrthophonisteConfig, ENFA } from '../models/index.js';
import { stripeService } from '../services/stripeService.js';
import AppError from '../utils/AppError.js';

const abonnementController = {
  getAllAbonnements: async (req, res, next) => {
    try {
      const abonnements = await ABM.findAll({
        include: [
          { model: USR, as: 'utilisateur' },
          { model: PAI, as: 'paiement' },
        ],
      });
      res.json(abonnements);
    } catch (error) {
      next(new AppError(500, error.message));
    }
  },

  getAbonnementById: async (req, res, next) => {
    try {
      const abonnement = await ABM.findByPk(req.params.id, {
        include: [
          { model: USR, as: 'utilisateur' },
          { model: PAI, as: 'paiement' },
        ],
      });
      if (!abonnement) {
        return next(new AppError(404, 'Abonnement non trouvé'));
      }
      res.json(abonnement);
    } catch (error) {
      next(new AppError(500, error.message));
    }
  },

  createSubscription: async (req, res, next) => {
    try {
      const { enfantId } = req.body;
      const parentId = req.user.id;

      // Vérifier si le paiement est obligatoire
      const paymentInfo = await stripeService.checkPaymentRequired(enfantId);

      if (!paymentInfo.required) {
        // Créer un abonnement gratuit
        const abonnement = await stripeService.simulateSuccessfulPayment(
          parentId,
          enfantId,
          0
        );
        await abonnement.update({ ABM_mode_paiement: 'gratuit' });

        return res.json({
          success: true,
          abonnement,
          paymentRequired: false,
          message: 'Abonnement activé gratuitement',
        });
      }

      // Si paiement requis
      if (process.env.NODE_ENV === 'development') {
        // En développement, simuler le paiement
        const abonnement = await stripeService.simulateSuccessfulPayment(
          parentId,
          enfantId,
          paymentInfo.prix
        );

        return res.json({
          success: true,
          abonnement,
          paymentRequired: true,
          simulated: true,
          prix: paymentInfo.prix,
          message: 'Paiement simulé avec succès',
        });
      } else {
        // En production, créer une vraie session Stripe
        const session = await stripeService.createCheckoutSession(
          parentId,
          enfantId,
          paymentInfo.prix
        );

        return res.json({
          success: true,
          paymentRequired: true,
          sessionId: session.id,
          sessionUrl: session.url,
          prix: paymentInfo.prix,
          message: 'Session de paiement créée',
        });
      }
    } catch (error) {
      console.error('Erreur création abonnement:', error);
      next(new AppError(500, error.message));
    }
  },

  updateAbonnement: async (req, res, next) => {
    try {
      const abonnement = await ABM.findByPk(req.params.id);
      if (!abonnement) {
        return next(new AppError(404, 'Abonnement non trouvé'));
      }
      await abonnement.update(req.body);
      res.json(abonnement);
    } catch (error) {
      next(new AppError(400, error.message));
    }
  },

  deleteAbonnement: async (req, res, next) => {
    try {
      const abonnement = await ABM.findByPk(req.params.id);
      if (!abonnement) {
        return next(new AppError(404, 'Abonnement non trouvé'));
      }
      await abonnement.destroy();
      res.json({ message: 'Abonnement supprimé avec succès' });
    } catch (error) {
      next(new AppError(500, error.message));
    }
  },

  getAbonnementsByUser: async (req, res, next) => {
    try {
      const abonnements = await ABM.findAll({
        where: { USR_id: req.params.userId },
        include: [{ model: PAI, as: 'paiement' }],
      });
      res.json(abonnements);
    } catch (error) {
      next(new AppError(500, error.message));
    }
  },

  checkSubscriptionStatus: async (req, res, next) => {
    try {
      const { enfantId } = req.params;
      const parentId = req.user.id;

      const abonnement = await ABM.findOne({
        where: {
          USR_id: parentId,
          ENFA_id: enfantId,
          ABM_statut: 'actif',
        },
        include: [
          {
            model: ENFA,
            as: 'enfant',
          },
        ],
      });

      if (!abonnement) {
        return res.json({ hasActiveSubscription: false });
      }

      const isExpired = new Date() > new Date(abonnement.ABM_dateFin);
      res.json({
        hasActiveSubscription: !isExpired,
        abonnement,
        isExpired,
      });
    } catch (error) {
      next(new AppError(500, error.message));
    }
  },

  checkPaymentRequired: async (req, res, next) => {
    try {
      const { enfantId } = req.params;

      const paymentInfo = await stripeService.checkPaymentRequired(enfantId);
      res.json(paymentInfo);
    } catch (error) {
      console.error('Erreur vérification paiement requis:', error);
      next(new AppError(500, error.message));
    }
  },

  confirmStripePayment: async (req, res, next) => {
    try {
      const { sessionId } = req.body;

      const session = await stripeService.verifyPayment(sessionId);

      if (session.payment_status === 'paid') {
        const { parent_id, enfant_id, prix } = session.metadata;

        const dateDebut = new Date();
        const dateFin = new Date();
        dateFin.setMonth(dateFin.getMonth() + 1);

        const abonnement = await ABM.create({
          USR_id: parseInt(parent_id),
          ENFA_id: parseInt(enfant_id),
          ABM_dateDebut: dateDebut,
          ABM_dateFin: dateFin,
          ABM_prix: parseFloat(prix),
          ABM_statut: 'actif',
          ABM_stripe_subscription_id: session.id,
          ABM_mode_paiement: 'stripe',
        });

        res.json({
          success: true,
          abonnement,
          message: 'Paiement confirmé et abonnement activé',
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'Paiement non confirmé',
        });
      }
    } catch (error) {
      next(new AppError(500, error.message));
    }
  },
};

export default abonnementController;
