import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { SES } from '../models/index.js';

/**
 * Sanitize un titre pour l'utiliser comme nom de dossier
 */
const sanitizeDirectoryName = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')          // Remplace espaces par des tirets
    .replace(/[àáâãäå]/g, 'a')     // Remplace lettres accentuées
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9-]/g, '')    // Supprime les caractères non alphanumériques
    .replace(/-+/g, '-')           // Remplace plusieurs tirets par un seul
    .replace(/^-+/, '')            // Supprime les tirets au début
    .replace(/-+$/, '');           // Supprime les tirets à la fin
};

// Configuration du stockage
const animationStorage = multer.diskStorage({
  destination: async function(req, file, cb) {
    try {
      // Récupération des informations nécessaires
      const { ANI_titre, SES_id } = req.body;
      
      if (!ANI_titre) {
        return cb(new Error('Le titre de l\'animation est requis'), null);
      }
      
      if (!SES_id) {
        return cb(new Error('L\'identifiant de la série est requis'), null);
      }
      
      // Récupération des données de la série
      const serie = await SES.findByPk(SES_id);
      
      if (!serie) {
        return cb(new Error('Série non trouvée'), null);
      }
      
      // Création des noms de dossier sanitisés
      const serieDirName = sanitizeDirectoryName(serie.SES_titre);
      const animationDirName = sanitizeDirectoryName(ANI_titre);
      
      // Création du chemin complet
      const uploadDir = path.join(
        process.cwd(), 
        'public',
        'uploads',
        'animations',
        serieDirName,
        animationDirName
      );
      
      // Création des dossiers si nécessaire
      fs.mkdirSync(uploadDir, { recursive: true });
      
      // Stockage du chemin dans la requête pour utilisation dans le contrôleur
      req.animationUploadPath = uploadDir;
      req.animationRelativePath = path.join(
        '/uploads', 
        'animations', 
        serieDirName, 
        animationDirName
      ).replace(/\\/g, '/'); // Assurer une notation avec des slashes forward sur tous les OS
      
      cb(null, uploadDir);
    } catch (error) {
      cb(error, null);
    }
  },
  filename: function(req, file, cb) {
    // Création d'un nom de fichier avec le type et un suffixe unique
    const fileType = getFileType(file);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    
    cb(null, `${fileType}-${uniqueSuffix}${ext}`);
  }
});

// Déterminer le type de fichier
function getFileType(file) {
  const fieldname = file.fieldname;
  
  if (fieldname === 'dessinImage') return 'dessin';
  if (fieldname === 'imageReelle') return 'reel';
  if (fieldname === 'audioFile') return 'audio';
  
  return 'unknown';
}

// Configuration du filtre pour valider les types de fichiers
const fileFilter = (req, file, cb) => {
  const fieldname = file.fieldname;
  
  if (fieldname === 'dessinImage' || fieldname === 'imageReelle') {
    // Filtres pour les images
    const allowedImageTypes = /jpeg|jpg|png|gif|svg/;
    const isValidType = allowedImageTypes.test(path.extname(file.originalname).toLowerCase());
    const isValidMimetype = file.mimetype.startsWith('image/');
    
    if (isValidType && isValidMimetype) {
      return cb(null, true);
    }
    return cb(new Error('Format d\'image non supporté. Utilisez JPG, PNG, GIF ou SVG.'), false);
  } 
  else if (fieldname === 'audioFile') {
    // Filtres pour l'audio
    const allowedAudioTypes = /mp3|wav|ogg|m4a/;
    const isValidType = allowedAudioTypes.test(path.extname(file.originalname).toLowerCase());
    const isValidMimetype = file.mimetype.startsWith('audio/');
    
    if (isValidType && isValidMimetype) {
      return cb(null, true);
    }
    return cb(new Error('Format audio non supporté. Utilisez MP3, WAV ou OGG.'), false);
  }
  
  // Rejet par défaut
  return cb(new Error('Type de fichier non supporté.'), false);
};

// Configuration de multer pour l'upload
const upload = multer({ 
  storage: animationStorage,
  fileFilter: fileFilter,
  limits: { 
    fileSize: 10 * 1024 * 1024, // 10MB max
    files: 3  // Maximum 3 fichiers (2 images + 1 audio)
  }
});

// Middleware pour l'upload des fichiers d'animation
export const uploadAnimationFiles = upload.fields([
  { name: 'dessinImage', maxCount: 1 },
  { name: 'imageReelle', maxCount: 1 },
  { name: 'audioFile', maxCount: 1 }
]);