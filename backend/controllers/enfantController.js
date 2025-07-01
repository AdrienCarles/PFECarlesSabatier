import { ENFA, USR, STAT, SES, ANI, ACCES } from '../models/index.js';
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
          USR_parent_id: parentId
        },
        attributes: [
          'ENFA_id',
          'ENFA_prenom',
          'ENFA_nom',
          'ENFA_dateNaissance',
          'ENFA_niveauAudition',
          'ENFA_dateDebutSuivi'
        ],
        include: [
          {
            model: USR,
            as: 'orthophoniste',
            attributes: ['USR_nom', 'USR_prenom']
          }
        ],
        order: [['ENFA_dateCreation', 'DESC']]
      });
      res.json(enfants);
    } catch (error) {
      next(new AppError(500, "Erreur lors de la récupération des enfants"));
    }
  },

  getEnfantSeries: async (req, res) => {
    try {
      const { enfaId } = req.params;
      const enfant = await ENFA.findByPk(enfaId, {
        include: [{
          model: SES,
          through: ACCES,
          as: 'series'
        }]
      });

      if (!enfant) {
        return res.status(404).json({ message: 'Enfant non trouvé' });
      }

      res.json(enfant.series);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des séries' });
    }
  },

  assignSeries: async (req, res) => {
    try {
      const { enfaId } = req.params;
      const { serieId } = req.body;

      await ACCES.create({
        ENFA_id: enfaId,
        SES_id: serieId
      });

      res.status(201).json({ message: 'Série assignée avec succès' });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de l\'assignation de la série' });
    }
  },

  removeSerie: async (req, res) => {
    try {
      const { enfaId, serieId } = req.params;

      await ACCES.destroy({
        where: {
          ENFA_id: enfaId,
          SES_id: serieId
        }
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
        attributes: ['SES_id']
      });

      const seriesIds = accesList.map(acces => acces.SES_id);

      if (!seriesIds.length) {
        return res.json([]); // Aucun accès, donc aucune animation
      }

      // 2. Récupérer toutes les animations des séries trouvées
      const animations = await ANI.findAll({
        where: { SES_id: seriesIds },
        include: [{
          model: SES,
          as: 'serie',
          attributes: ['SES_icone', 'SES_titre']
        }]
      });
      res.json(animations);
    } catch (error) {
      console.error("Erreur lors de la récupération des animations :", error);
      res.status(500).json({ message: "Erreur lors de la récupération des animations" });
    }
  },

};

export default enfantController;