import { Op } from 'sequelize';
import {
  ENFA,
  USR,
  SES,
  ANI,
  ACCES,
  ABM,
  OrthophonisteConfig,
} from '../models/index.js';
import AppError from '../utils/AppError.js';

const enfantController = {
  getAllEnfants: async (req, res, next) => {
    try {
      const enfants = await ENFA.findAll({
        include: [
          {
            model: USR,
            as: 'parent',
            attributes: [
              'USR_id',
              'USR_nom',
              'USR_prenom',
              'USR_email',
              'USR_telephone',
            ],
          },
          {
            model: USR,
            as: 'orthophoniste',
            attributes: ['USR_id', 'USR_nom', 'USR_prenom'],
          },
        ],
      });
      res.json(enfants);
    } catch (error) {
      next(new AppError(500, error.message));
    }
  },

  getEnfantById: async (req, res, next) => {
    try {
      const enfant = await ENFA.findByPk(req.params.enfaId, {
        include: [
          {
            model: USR,
            as: 'parent',
            attributes: [
              'USR_id',
              'USR_nom',
              'USR_prenom',
              'USR_email',
              'USR_telephone',
              'USR_statut',
            ],
          },
          {
            model: USR,
            as: 'orthophoniste',
            attributes: ['USR_id', 'USR_nom', 'USR_prenom'],
          },
        ],
      });
      if (!enfant) {
        return next(new AppError(404, 'Enfant non trouvé'));
      }
      res.json(enfant);
    } catch (error) {
      next(new AppError(500, error.message));
    }
  },

  createEnfant: async (req, res, next) => {
    try {
      const enfant = await ENFA.create(req.body);

      const enfantWithParent = await ENFA.findByPk(enfant.ENFA_id, {
        include: [
          {
            model: USR,
            as: 'parent',
            attributes: [
              'USR_id',
              'USR_nom',
              'USR_prenom',
              'USR_email',
              'USR_telephone',
            ],
          },
        ],
      });

      res.status(201).json(enfantWithParent);
    } catch (error) {
      next(new AppError(500, error?.original?.sqlMessage || error.message));
    }
  },

  updateEnfant: async (req, res, next) => {
    try {
      const enfant = await ENFA.findByPk(req.params.enfaId);
      if (!enfant) {
        return next(new AppError(404, 'Enfant non trouvé'));
      }

      await enfant.update(req.body);

      const enfantUpdated = await ENFA.findByPk(req.params.enfaId, {
        include: [
          {
            model: USR,
            as: 'parent',
            attributes: [
              'USR_id',
              'USR_nom',
              'USR_prenom',
              'USR_email',
              'USR_telephone',
            ],
          },
        ],
      });

      res.json(enfantUpdated);
    } catch (error) {
      next(new AppError(400, error.message));
    }
  },

  deleteEnfant: async (req, res, next) => {
    try {
      const enfant = await ENFA.findByPk(req.params.enfaId);
      if (!enfant) {
        return next(new AppError(404, 'Enfant non trouvé'));
      }
      await enfant.destroy();
      res.json({ message: 'Enfant supprimé avec succès' });
    } catch (error) {
      next(new AppError(500, error.message));
    }
  },

  getEnfantsByOrthophoniste: async (req, res, next) => {
    try {
      const enfants = await ENFA.findAll({
        where: { USR_orthophoniste_id: req.params.orthophonisteId },
        include: [
          {
            model: USR,
            as: 'parent',
            attributes: [
              'USR_id',
              'USR_nom',
              'USR_prenom',
              'USR_email',
              'USR_telephone',
              'USR_statut',
              'USR_dateCreation',
            ],
          },
        ],
        order: [['ENFA_dateCreation', 'DESC']],
      });

      res.json(enfants);
    } catch (error) {
      next(new AppError(500, error.message));
    }
  },

  getParentsByOrthophoniste: async (req, res, next) => {
    try {
      const orthophonisteId = req.params.orthophonisteId;

      const parents = await USR.findAll({
        where: { USR_role: 'parent' },
        attributes: [
          'USR_id',
          'USR_nom',
          'USR_prenom',
          'USR_email',
          'USR_telephone',
          'USR_statut',
          'USR_dateCreation',
        ],
        include: [
          {
            model: ENFA,
            as: 'enfantsParent',
            where: { USR_orthophoniste_id: orthophonisteId },
            required: true, // Seulement les parents qui ONT des enfants chez cet orthophoniste
            attributes: [
              'ENFA_id',
              'ENFA_nom',
              'ENFA_prenom',
              'ENFA_dateNaissance',
              'ENFA_niveauAudition',
              'ENFA_dateDebutSuivi',
              'ENFA_notesSuivi',
              'ENFA_dateCreation',
            ],
          },
        ],
        order: [
          ['USR_dateCreation', 'DESC'],
          [{ model: ENFA, as: 'enfantsParent' }, 'ENFA_dateCreation', 'DESC'],
        ],
      });

      res.json(parents);
    } catch (error) {
      next(new AppError(500, error.message));
    }
  },

  getMesEnfants: async (req, res, next) => {
    try {
      const parentId = req.params.parentId;
      const enfants = await ENFA.findAll({
        where: {
          USR_parent_id: parentId,
        },
        attributes: [
          'ENFA_id',
          'ENFA_prenom',
          'ENFA_nom',
          'ENFA_dateNaissance',
          'ENFA_niveauAudition',
          'ENFA_dateDebutSuivi',
        ],
        include: [
          {
            model: USR,
            as: 'orthophoniste',
            attributes: ['USR_id', 'USR_nom', 'USR_prenom'],
            include: [
              {
                model: OrthophonisteConfig,
                as: 'config',
                attributes: [
                  'CONFIG_paiement_obligatoire',
                  'CONFIG_prix_par_enfant',
                ],
                required: false,
              },
            ],
          },
          {
            model: ABM,
            as: 'abonnements',
            where: {
              ABM_statut: 'actif',
              ABM_dateFin: { [Op.gt]: new Date() }, // Seulement les abonnements non expirés
            },
            attributes: [
              'ABM_id',
              'ABM_dateDebut',
              'ABM_dateFin',
              'ABM_prix',
              'ABM_statut',
              'ABM_mode_paiement',
            ],
            required: false, // LEFT JOIN pour avoir tous les enfants même sans abonnement
          },
        ],
        order: [['ENFA_dateCreation', 'DESC']],
      });

      // Enrichir les données avec les informations calculées
      const enfantsEnrichis = enfants.map((enfant) => {
        const enfantData = enfant.toJSON();

        // Calculer l'âge
        const today = new Date();
        const birthDate = new Date(enfantData.ENFA_dateNaissance);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (
          monthDiff < 0 ||
          (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ) {
          age--;
        }

        // Déterminer le statut d'abonnement
        const abonnementActif = enfantData.abonnements?.[0]; // Premier abonnement actif
        const hasActiveSubscription = !!abonnementActif;

        // Configuration de l'orthophoniste
        const orthoConfig = enfantData.orthophoniste?.config;
        const paiementObligatoire =
          orthoConfig?.CONFIG_paiement_obligatoire || false;
        const prixOrthophoniste = orthoConfig?.CONFIG_prix_par_enfant || 9.99;

        // Prix à afficher (prix de l'abonnement actif ou prix configuré par l'orthophoniste)
        const prixAffiche = hasActiveSubscription
          ? abonnementActif.ABM_prix
          : paiementObligatoire
            ? prixOrthophoniste
            : null;

        // Statut global
        let statut = 'Gratuit';
        if (hasActiveSubscription) {
          statut = 'Abonné';
        } else if (paiementObligatoire) {
          statut = 'En attente de paiement';
        }

        return {
          ...enfantData,
          ENFA_age: age,
          subscriptionStatus: {
            hasActiveSubscription,
            statut,
            abonnement: abonnementActif || null,
          },
          paymentInfo: {
            required: paiementObligatoire,
            prix: prixOrthophoniste,
            orthophoniste: enfantData.orthophoniste,
          },
          affichage: {
            prix: prixAffiche,
            statut,
            dateDebut: abonnementActif?.ABM_dateDebut || null,
            dateFin: abonnementActif?.ABM_dateFin || null,
            modePaiement: abonnementActif?.ABM_mode_paiement || null,
          },
        };
      });

      res.json(enfantsEnrichis);
    } catch (error) {
      console.error('Erreur getMesEnfants:', error);
      next(new AppError(500, 'Erreur lors de la récupération des enfants'));
    }
  },

  getEnfantSeries: async (req, res) => {
    try {
      const { enfaId } = req.params;

      // 1. Récupérer les accès (ACCES) pour cet enfant
      const accesList = await ACCES.findAll({
        where: { ENFA_id: enfaId },
        attributes: ['SES_id'],
      });

      const seriesIds = accesList.map((acces) => acces.SES_id);

      if (!seriesIds.length) {
        return res.json([]); // Aucun accès, donc aucune série
      }

      // 2. Récupérer toutes les séries trouvées
      const series = await SES.findAll({
        where: { SES_id: seriesIds },
      });

      res.json(series);
    } catch (error) {
      console.error('Erreur lors de la récupération des séries :', error);
      res
        .status(500)
        .json({ message: 'Erreur lors de la récupération des séries' });
    }
  },

  assignSeries: async (req, res) => {
    try {
      const { enfaId } = req.params;
      const { serieId } = req.body;

      await ACCES.create({
        ENFA_id: enfaId,
        SES_id: serieId,
      });

      res.status(201).json({ message: 'Série assignée avec succès' });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erreur lors de l'assignation de la série" });
    }
  },

  removeSerie: async (req, res) => {
    try {
      const { enfaId, serieId } = req.params;

      await ACCES.destroy({
        where: {
          ENFA_id: enfaId,
          SES_id: serieId,
        },
      });

      res.json({ message: 'Série retirée avec succès' });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors du retrait de la série' });
    }
  },

  getEnfantAnimations: async (req, res) => {
    try {
      const { enfaId } = req.params;

      // 1. Récupérer les accès (ACCES) pour cet enfant
      const accesList = await ACCES.findAll({
        where: { ENFA_id: enfaId },
        attributes: ['SES_id'],
      });

      const seriesIds = accesList.map((acces) => acces.SES_id);

      if (!seriesIds.length) {
        return res.json([]); // Aucun accès, donc aucune animation
      }

      // 2. Récupérer toutes les animations des séries trouvées
      const animations = await ANI.findAll({
        where: { SES_id: seriesIds },
        include: [
          {
            model: SES,
            as: 'serie',
            attributes: ['SES_icone', 'SES_titre'],
          },
        ],
      });
      res.json(animations);
    } catch (error) {
      console.error('Erreur lors de la récupération des animations :', error);
      res
        .status(500)
        .json({ message: 'Erreur lors de la récupération des animations' });
    }
  },
};

export default enfantController;
