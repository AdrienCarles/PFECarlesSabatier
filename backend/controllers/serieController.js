import fs from 'fs';
import path from 'path';
import { SES, ANI, ACCES, USR } from '../models/index.js';
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

  getSerieById: async (req, res, next) => {
    try {
      const serie = await SES.findByPk(req.params.sesId, {
        include: [
          { model: ANI, as: 'animations' },
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
};

export default serieController;
