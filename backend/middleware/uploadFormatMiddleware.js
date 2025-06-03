import path from 'path';
import fs from 'fs';
import multer from 'multer';
import sharp from 'sharp';
import { SES } from '../models/index.js';

// Configuration globale des images
const IMAGE_FORMAT = {
  width: 1000,
  height: 1000,
  format: 'webp',
  quality: 85, 
};

/**
 * Sanitize un titre pour l'utiliser comme nom de dossier
 */
const sanitizeDirectoryName = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Remplace espaces par des tirets
    .replace(/[àáâãäå]/g, 'a') // Remplace lettres accentuées
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9-]/g, '') // Supprime les caractères non alphanumériques
    .replace(/-+/g, '-') // Remplace plusieurs tirets par un seul
    .replace(/^-+/, '') // Supprime les tirets au début
    .replace(/-+$/, ''); // Supprime les tirets à la fin
};

// Créer les dossiers nécessaires
const setupDirectories = () => {
  const dirs = [
    path.join(process.cwd(), 'public', 'uploads', 'series'),
    path.join(process.cwd(), 'public', 'uploads', 'animations'),
  ];

  for (const dir of dirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
};

// Exécution au chargement du module
setupDirectories();

// Fonction de traitement d'image
const processImage = async (filePath) => {
  try {
    // Vérifier si c'est un GIF et s'il est animé
    const isGif = path.extname(filePath).toLowerCase() === '.gif';
    let isAnimated = false;

    if (isGif) {
      const metadata = await sharp(filePath, { animated: true }).metadata();
      isAnimated = metadata.pages && metadata.pages > 1;
    }

    const config = IMAGE_FORMAT;
    const originalExt = path.extname(filePath);
    const dir = path.dirname(filePath);
    const filename = path.basename(filePath, originalExt);
    const outputPath = path.join(dir, `${filename}.${config.format}`);

    if (isAnimated) {
      await sharp(filePath, { animated: true })
        .resize({
          width: config.width,
          height: config.height,
          fit: 'cover',
          position: 'center',
        })
        .webp({
          quality: config.quality,
          effort: 4,
          loop: 0,
          delay: 100,
        })
        .toFile(outputPath);
    } else {
      await sharp(filePath)
        .resize({
          width: config.width,
          height: config.height,
          fit: 'cover',
          position: 'center',
          fastShrinkOnLoad: true,
        })
        .sharpen()
        .toFormat(config.format, { 
          quality: config.quality,
          effort: 4,
        })
        .toFile(outputPath);
    }

    // Supprimer l'original
    if (outputPath !== filePath) {
      fs.unlinkSync(filePath);
    }

    return {
      path: outputPath,
      filename: path.basename(outputPath),
      format: config.format,
      animated: isAnimated,
    };
  } catch (error) {
    console.error("Erreur lors du traitement de l'image:", error);
    return {
      path: filePath,
      filename: path.basename(filePath),
      animated: false,
    };
  }
};

// Déterminer le type de fichier pour les animations
function getFileType(file) {
  const fieldname = file.fieldname;

  if (fieldname === 'dessinImage') return 'dessin';
  if (fieldname === 'imageReelle') return 'reel';
  if (fieldname === 'audioFile') return 'audio';

  return 'unknown';
}

// Configuration du filtre pour valider les types de fichiers
const fileFilter = (req, file, cb) => {
  // Déterminer les types de fichiers autorisés selon le champ
  if (
    file.fieldname === 'dessinImage' ||
    file.fieldname === 'imageReelle' ||
    file.fieldname === 'SES_icone'
  ) {
    // Filtres pour les images
    const allowedImageTypes = /jpeg|jpg|png|gif|svg|webp/;
    const isValidType = allowedImageTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const isValidMimetype = file.mimetype.startsWith('image/');

    if (isValidType && isValidMimetype) {
      return cb(null, true);
    }
    return cb(
      new Error(
        "Format d'image non supporté. Utilisez JPG, PNG, GIF, SVG ou WebP."
      ),
      false
    );
  } else if (file.fieldname === 'audioFile') {
    // Filtres pour l'audio
    const allowedAudioTypes = /mp3|wav|ogg|m4a/;
    const isValidType = allowedAudioTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const isValidMimetype = file.mimetype.startsWith('audio/');

    if (isValidType && isValidMimetype) {
      return cb(null, true);
    }
    return cb(
      new Error('Format audio non supporté. Utilisez MP3, WAV ou OGG.'),
      false
    );
  }

  // Rejet par défaut
  return cb(new Error('Type de fichier non supporté.'), false);
};

// ===== Configuration pour les icônes de séries =====
const seriesStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'series');
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, 'serie-' + uniqueSuffix + ext);
  },
});

const seriesUpload = multer({
  storage: seriesStorage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

// ===== Configuration pour les fichiers d'animation =====
const animationStorage = multer.diskStorage({
  destination: async function (req, file, cb) {
    try {
      // Récupération des informations nécessaires
      const { ANI_titre, SES_id } = req.body;

      if (!ANI_titre) {
        return cb(new Error("Le titre de l'animation est requis"), null);
      }

      if (!SES_id) {
        return cb(new Error("L'identifiant de la série est requis"), null);
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
      req.animationRelativePath = path
        .join('/uploads', 'animations', serieDirName, animationDirName)
        .replace(/\\/g, '/'); // Assurer une notation avec des slashes forward sur tous les OS

      cb(null, uploadDir);
    } catch (error) {
      cb(error, null);
    }
  },
  filename: function (req, file, cb) {
    // Création d'un nom de fichier avec le type et un suffixe unique
    const fileType = getFileType(file);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);

    cb(null, `${fileType}-${uniqueSuffix}${ext}`);
  },
});

const animationUpload = multer({
  storage: animationStorage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
    files: 3, // Maximum 3 fichiers
  },
});

// ===== Middlewares post-upload pour le traitement des images =====

// Traitement des icônes de séries
const processSeriesIcon = async (req, res, next) => {
  try {
    // Vérifier si un fichier a été uploadé
    if (!req.file) {
      return next();
    }

    // Vérifier si c'est une image
    if (req.file.mimetype.startsWith('image/')) {

      // Appliquer le traitement d'image
      const processed = await processImage(req.file.path);

      // Mettre à jour les propriétés du fichier
      req.file.path = processed.path;
      req.file.filename = processed.filename;
      req.file.mimetype = `image/${processed.format}`;
    }

    next();
  } catch (error) {
    next(error);
  }
};

// Traitement des images d'animation
const processAnimationImages = async (req, res, next) => {
  try {
    if (!req.files) return next();

    // Traiter les images (pas les fichiers audio)
    const imageFields = ['dessinImage', 'imageReelle'];

    for (const field of imageFields) {
      if (req.files[field] && req.files[field][0]) {
        const file = req.files[field][0];

        if (file.mimetype.startsWith('image/')) {
          const processed = await processImage(file.path);
          file.path = processed.path;
          file.filename = processed.filename;
          file.mimetype = `image/${processed.format}`;
        }
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

// ===== Exportation des middlewares =====

// Pour les icônes de séries
export const uploadSeriesIcon = [
  seriesUpload.single('SES_icone'),
  processSeriesIcon,
];

// Pour les fichiers d'animation
export const uploadAnimationFiles = [
  animationUpload.fields([
    { name: 'dessinImage', maxCount: 1 },
    { name: 'imageReelle', maxCount: 1 },
    { name: 'audioFile', maxCount: 1 },
  ]),
  processAnimationImages,
];
