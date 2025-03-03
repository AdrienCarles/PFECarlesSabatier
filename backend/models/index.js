import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import process from 'process';
import { Sequelize, DataTypes } from 'sequelize';
import configFile from '../config/config.js';

// En ESM, __filename et __dirname n'existent pas, nous devons les créer
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basename = path.basename(__filename);

const env = process.env.NODE_ENV || 'development';
const config = configFile[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Utilisez Promise.all pour gérer les imports asynchrones
const files = fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  });

// Chargement dynamique des modèles en utilisant import() dynamique
for (const file of files) {
  const modelPath = path.join(__dirname, file);
  const modelModule = await import(modelPath);
  const model = modelModule.default(sequelize, DataTypes);
  db[model.name] = model;
}

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
export const { ABM, ACCES, ANI, ENFA, PAI, SES, STAT, USR, RefreshToken } = db;