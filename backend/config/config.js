import { createRequire } from 'module';

// Créer require pour pouvoir importer le fichier CommonJS
const require = createRequire(import.meta.url);

// Importer la configuration CommonJS
const config = require('./config.cjs');

export default config;