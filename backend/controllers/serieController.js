import fs from 'fs';
import path from 'path';
import { SES, ANI, ACCES, USR, ENFA } from '../models/index.js';
import AppError from '../utils/AppError.js';

const serieController = {
  getAllSeries: async (req, res, next) => {
    try {
      const series = await SES.findAll({
        include: [
          { model: ANI, as: 'animations' },
          { model: USR, as: 'utilisateurs' },
        ],
      });
      res.json(series);
    } catch (error) {
      next(new AppError(500, 'Erreur lors de la récupération des séries'));
    }
  },

  getActivesSeries: async (req, res, next) => {
    try {
      const series = await SES.findAll({
        where: {
          SES_statut: 'actif',
        },
        include: [
          { model: ANI, as: 'animations' },
          { model: USR, as: 'utilisateurs' },
        ],
        order: [['SES_titre', 'ASC']],
      });
      res.json(series);
    } catch (error) {
      next(
        new AppError(500, 'Erreur lors de la récupération des séries actives')
      );
    }
  },

  getSerieById: async (req, res, next) => {
    try {
      const serie = await SES.findByPk(req.params.sesId, {
        include: [
          {
            model: ANI,
            as: 'animations',
            include: [{ model: USR, as: 'createur' }],
          },
          { model: USR, as: 'utilisateurs' },
        ],
      });
      if (!serie) {
        return next(new AppError(404, 'Série non trouvée'));
      }
      res.json(serie);
    } catch (error) {
      next(new AppError(500, 'Erreur lors de la récupération de la série'));
    }
  },

  // Récupérer les séries assignées à un enfant
  getEnfantSeries: async (req, res, next) => {
    try {
      const { enfantId } = req.params;

      const series = await SES.findAll({
        include: [
          {
            model: ACCES,
            as: 'acces',
            where: { ENFA_id: enfantId },
            required: true,
          },
        ],
        where: { SES_statut: 'actif' },
      });

      res.json(series);
    } catch (error) {
      next(
        new AppError(
          500,
          "Erreur lors de la récupération des séries de l'enfant"
        )
      );
    }
  },

  getSerieAnimations: async (req, res, next) => {
    try {
      const { sesId } = req.params;

      // Vérifier que la série existe
      const serie = await SES.findByPk(sesId);
      if (!serie) {
        return next(new AppError(404, 'Série non trouvée'));
      }

      // Si c'est un parent, vérifier qu'il a accès à cette série
      if (req.user.role === 'parent') {
        const hasAccess = await ACCES.findOne({
          where: {
            USR_id: req.user.id,
            SES_id: sesId,
          },
        });

        if (!hasAccess) {
          return next(new AppError(403, 'Accès non autorisé à cette série'));
        }
      }

      // Récupérer les animations de la série
      const animations = await ANI.findAll({
        where: {
          SES_id: sesId,
          ANI_valider: true,
        },
        include: [
          {
            model: USR,
            as: 'createur',
            attributes: ['USR_id', 'USR_nom', 'USR_prenom'],
          },
        ],
        order: [['ANI_date_creation', 'ASC']],
      });

      res.json(animations);
    } catch (error) {
      console.error('Erreur récupération animations de la série:', error);
      next(
        new AppError(
          500,
          'Erreur lors de la récupération des animations de la série'
        )
      );
    }
  },

  createSerie: async (req, res, next) => {
    try {
      if (req.file) {
        req.body.SES_icone = `/uploads/series/${req.file.filename}`;
      }

      const serie = await SES.create(req.body);
      res.status(201).json(serie);
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        return next(new AppError(400, 'Données de série invalides'));
      }
      next(
        new AppError(
          500,
          `Erreur lors de la création de la série: ${error.message}`
        )
      );
    }
  },

  updateSerie: async (req, res, next) => {
    try {
      const serie = await SES.findByPk(req.params.sesId);
      if (!serie) {
        return next(new AppError(404, 'Série non trouvée'));
      }

      if (req.file) {
        if (serie.SES_icone) {
          try {
            const oldImagePath = path.join(
              process.cwd(),
              'public',
              serie.SES_icone
            );
            if (
              fs.existsSync(oldImagePath) &&
              serie.SES_icone !== '/images/default-series-icon.png'
            ) {
              fs.unlinkSync(oldImagePath);
            }
          } catch (err) {
            console.error(
              "Erreur lors de la suppression de l'ancienne image:",
              err
            );
          }
        }
        req.body.SES_icone = `/uploads/series/${req.file.filename}`;
      }

      await serie.update(req.body);
      res.json(serie);
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        return next(new AppError(400, 'Données de mise à jour invalides'));
      }
      next(new AppError(500, 'Erreur lors de la mise à jour de la série'));
    }
  },

  // Mettre à jour les séries assignées à un enfant
  updateEnfantSeries: async (req, res, next) => {
    try {
      const { enfantId } = req.params;
      const { seriesIds, parentId } = req.body;

      // Vérification de l'enfant et du parent
      const enfant = await ENFA.findByPk(enfantId);
      if (!enfant) {
        return next(new AppError(404, "Enfant non trouvé"));
      }
      if (enfant.USR_parent_id !== parentId) {
        return next(new AppError(400, "Le parent ne correspond pas à l'enfant"));
      }

      // Supprimer tous les accès existants pour cet enfant
      await ACCES.destroy({
        where: { ENFA_id: enfantId },
      });

      // Créer les nouveaux accès
      if (seriesIds && seriesIds.length > 0) {
        const newAccess = seriesIds.map((serieId) => ({
          USR_id: parentId,
          SES_id: serieId,
          ENFA_id: enfantId,
        }));

        await ACCES.bulkCreate(newAccess);
      }

      res.json({
        message: 'Séries mises à jour avec succès',
        assignedSeries: seriesIds?.length || 0,
      });
    } catch (error) {
      next(new AppError(500, 'Erreur lors de la mise à jour des séries'));
    }
  },

  deleteSerie: async (req, res, next) => {
    try {
      const serie = await SES.findByPk(req.params.sesId);
      if (!serie) {
        return next(new AppError(404, 'Série non trouvée'));
      }

      if (serie.SES_icone) {
        try {
          const filePath = path.join(process.cwd(), 'public', serie.SES_icone);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        } catch (fileError) {
          console.error(
            'Erreur lors de la suppression du fichier image:',
            fileError
          );
        }
      }

      await serie.destroy();
      res.json({ message: 'Série supprimée avec succès' });
    } catch (error) {
      next(new AppError(500, 'Erreur lors de la suppression de la série'));
    }
  },

  validerSerie: async (req, res, next) => {
    try {
      const { statut } = req.body;
      const { sesId } = req.params;

      // Vérification du rôle administrateur
      if (req.user.role !== 'admin') {
        return next(
          new AppError(
            403,
            'Seuls les administrateurs peuvent valider les séries'
          )
        );
      }

      // Vérification du statut valide
      if (statut !== 'valide' && statut !== 'refuse') {
        return next(
          new AppError(400, 'Le statut doit être "valide" ou "refuse"')
        );
      }

      const serie = await SES.findByPk(sesId);
      if (!serie) {
        return next(new AppError(404, 'Série non trouvée'));
      }

      // Mise à jour du statut
      const nouveauStatut = statut === 'valide' ? 'actif' : 'inactif';
      await serie.update({
        SES_statut: nouveauStatut,
      });

      // Récupération des données mises à jour
      const serieUpdated = await SES.findByPk(sesId, {
        include: [
          { model: ANI, as: 'animations' },
          { model: USR, as: 'utilisateurs' },
        ],
      });

      res.json({
        message: `Série ${nouveauStatut === 'actif' ? 'validée' : 'refusée'} avec succès`,
        serie: serieUpdated,
      });
    } catch (error) {
      next(
        new AppError(
          500,
          `Erreur lors de la validation de la série: ${error.message}`
        )
      );
    }
  },
};

export default serieController;
