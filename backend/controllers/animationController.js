import { ANI, USR, SES } from '../models/index.js';
import AppError from '../utils/AppError.js';
import fs from 'fs';
import path from 'path';

const animationController = {
  getAllAnimations: async (req, res, next) => {
    try {
      const animations = await ANI.findAll({
        include: [
          { model: USR, as: 'createur' },
          { model: SES, as: 'serie' }
        ]
      });
      res.json(animations);
    } catch (error) {
      next(new AppError(500, error.message));
    }
  },

  getAnimationById: async (req, res, next) => {
    try {
      const animation = await ANI.findByPk(req.params.id, {
        include: [
          { model: USR, as: 'createur' },
          { model: SES, as: 'serie' }
        ]
      });
      if (!animation) {
        return next(new AppError(404, 'Animation non trouvée'));
      }
      res.json(animation);
    } catch (error) {
      next(new AppError(500, error.message));
    }
  },

  createAnimation: async (req, res, next) => {
    try {
      const { 
        ANI_titre, 
        ANI_description, 
        ANI_type, 
        SES_id, 
        USR_creator_id,
        dessinType,
        imageReelleType
      } = req.body;
      
      // Vérification des fichiers requis
      if (!req.files || !req.files.dessinImage || !req.files.imageReelle || !req.files.audioFile) {
        return next(new AppError(400, 'Tous les fichiers (dessin, image réelle et audio) sont requis'));
      }
      
      // Récupération des fichiers
      const dessinFile = req.files.dessinImage[0];
      const imageReelleFile = req.files.imageReelle[0];
      const audioFile = req.files.audioFile[0];
      
      // Création des chemins relatifs pour stockage dans la BDD
      // Path est de la forme /uploads/animations/[serie-nom]/[animation-nom]/[type-timestamp.ext]
      const dessinRelativePath = `${req.animationRelativePath}/${dessinFile.filename}`;
      const imageReelleRelativePath = `${req.animationRelativePath}/${imageReelleFile.filename}`;
      const audioRelativePath = `${req.animationRelativePath}/${audioFile.filename}`;
      
      // Calcul de la taille totale en octets
      const totalSize = dessinFile.size + imageReelleFile.size + audioFile.size;
      
      // Création de l'entrée dans la base de données
      const animation = await ANI.create({
        ANI_titre,
        ANI_description,
        ANI_type,
        ANI_urlAnimationDessin: dessinRelativePath,
        ANI_urlAnimation: imageReelleRelativePath,
        ANI_urlAudio: audioRelativePath,
        ANI_taille: totalSize,
        ANI_valider: false,
        ANI_date_creation: new Date(),
        USR_creator_id,
        SES_id
      });
      
      // Récupération de l'animation avec ses relations
      const completeAnimation = await ANI.findByPk(animation.ANI_id, {
        include: [
          { model: USR, as: 'createur' },
          { model: SES, as: 'serie' }
        ]
      });
      
      res.status(201).json(completeAnimation);
    } catch (error) {
      // Si une erreur se produit, nettoyage des fichiers téléchargés
      if (req.animationUploadPath && fs.existsSync(req.animationUploadPath)) {
        try {
          fs.rmdirSync(req.animationUploadPath, { recursive: true });
        } catch (cleanupErr) {
          console.error('Erreur lors du nettoyage des fichiers:', cleanupErr);
        }
      }
      
      next(new AppError(500, `Erreur lors de la création de l'animation: ${error.message}`));
    }
  },

  updateAnimation: async (req, res, next) => {
    try {
      const animation = await ANI.findByPk(req.params.id);
      if (!animation) {
        return next(new AppError(404, 'Animation non trouvée'));
      }
      await animation.update(req.body);
      res.json(animation);
    } catch (error) {
      next(new AppError(500, error.message));
    }
  },

  deleteAnimation: async (req, res, next) => {
    try {
      const animation = await ANI.findByPk(req.params.id);
      if (!animation) {
        return next(new AppError(404, 'Animation non trouvée'));
      }
      
      // Suppression des fichiers associés si possible
      try {
        // Récupérer le dossier parent commun aux fichiers
        const commonPath = path.dirname(path.join(process.cwd(), 'public', animation.ANI_urlAnimationDessin));
        
        if (fs.existsSync(commonPath)) {
          fs.rmdirSync(commonPath, { recursive: true });
        }
      } catch (fileError) {
        console.error("Erreur lors de la suppression des fichiers:", fileError);
      }
      
      await animation.destroy();
      res.json({ message: 'Animation supprimée avec succès' });
    } catch (error) {
      next(new AppError(500, error.message));
    }
  },

  getAnimationsBySerie: async (req, res, next) => {
    try {
      const animations = await ANI.findAll({
        where: { SES_id: req.params.serieId },
        include: [{ model: USR, as: 'createur' }]
      });
      res.json(animations);
    } catch (error) {
      next(new AppError(500, error.message));
    }
  }
};

export default animationController;