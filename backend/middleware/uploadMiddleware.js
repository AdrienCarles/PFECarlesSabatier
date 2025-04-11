import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Créer le dossier pour les uploads s'il n'existe pas
const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'series');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configuration du stockage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Créer un nom de fichier unique avec date et extension d'origine
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'serie-' + uniqueSuffix + ext);
  }
});

// Filtre pour vérifier le type de fichier
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|svg/;
  const isValidType = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const isValidMimetype = allowedTypes.test(file.mimetype.split('/')[1]);
  
  if (isValidType && isValidMimetype) {
    cb(null, true);
  } else {
    cb(new Error("Format de fichier non pris en charge. Utilisez JPG, PNG, GIF ou SVG."), false);
  }
};

// Middleware d'upload avec configuration
const upload = multer({ 
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});

export const uploadSeriesIcon = upload.single('SES_icone');