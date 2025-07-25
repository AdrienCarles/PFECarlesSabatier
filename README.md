# MFE Carles Sabatier - Application d'Orthophonie

Une application web complète pour la gestion d'exercices d'orthophonie destinée aux enfants malentendants, développée avec React.js (frontend) et Node.js/Express (backend).

## Fonctionnalités

- **Gestion Multi-Rôles** : Administrateurs, Orthophonistes, Parents
- **Séries d'Animations** : Création et gestion de contenus éducatifs
- **Suivi Personnalisé** : Suivi individuel des enfants par les orthophonistes
- **Système d'Abonnements** : Gestion des paiements via Stripe
- **Statistiques** : Tableaux de bord et rapports de progression
- **Upload de Fichiers** : Gestion des animations (images, audio)

## Prérequis Système

- [Node.js](https://nodejs.org/) (version 18+ recommandée)
- [MySQL](https://dev.mysql.com/downloads/) (version 8.0+)
- [Git](https://git-scm.com/)
- [VS Code](https://code.visualstudio.com/) (recommandé)

### Extensions VS Code Recommandées
- [Database Client JDBC](https://marketplace.visualstudio.com/items?itemName=cweijan.vscode-database-client) - Gestion MySQL dans VS Code
- [ES7+ React/Redux/React-Native snippets](https://marketplace.visualstudio.com/items?itemName=dsznajder.es7-react-js-snippets)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

## Installation Rapide

### 1. Cloner le Projet
```bash
git clone https://github.com/AdrienCarles/MFECarlesSabatier.git
cd MFECarlesSabatier
```

### 2. Installation des Dépendances
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Configuration de la Base de Données
```bash
# Se connecter à MySQL
mysql -u root -p

# Créer la base de données
CREATE DATABASE pfe CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit
```

### 4. Configuration de l'Environnement
Créez un fichier `.env` dans le dossier `backend/` :

```env
# Base de données
DB_USER=root
DB_PASSWORD=votre_mot_de_passe_mysql
DB_HOST=localhost
DB_PORT=3306
DB_NAME=pfe
DB_NAME_PROD=pfe_production

# Serveur
PORT=5000
NODE_ENV=development

# JWT & Sécurité
JWT_SECRET=votre_secret_jwt_tres_long_et_securise_min_32_caracteres
JWT_REFRESH_SECRET=votre_secret_refresh_jwt_different_min_32_caracteres
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Email (optionnel - pour réinitialisation de mot de passe)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre_email@gmail.com
EMAIL_PASS=votre_mot_de_passe_app

# Stripe (optionnel - pour les paiements)
STRIPE_SECRET_KEY=sk_test_votre_cle_secrete
STRIPE_PUBLISHABLE_KEY=pk_test_votre_cle_publique
STRIPE_WEBHOOK_SECRET=whsec_votre_secret_webhook
```

**Important** : Ne jamais commiter le fichier `.env` ! Il est déjà dans `.gitignore`.

### 5. Migration et Données de Test
```bash
cd backend

# Appliquer les migrations
npm run migrate

# Vérifier le statut
npm run migrate:status

# Peupler avec des données
npm run seed
```

### 6. Démarrage des Services
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm start
```

L'application sera accessible sur :
- **Frontend** : http://localhost:3000
- **Backend API** : http://localhost:5000

## Comptes de Test

Après le seeding, vous pouvez vous connecter avec :

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Administrateur | `admin@mfe.com` | `Azertyui1` |
| Orthophoniste | `marie.dubois@ortho.com` | `Azertyui1` |
| Orthophoniste | `pierre.martin@ortho.com` | `Azertyui1` |
| Parent | `sophie.dupont@parent.com` | `Azertyui1` |
| Parent | `jean.bernard@parent.com` | `Azertyui1` |

## Architecture du Projet

```
MFECarlesSabatier/
├── backend/
│   ├── config/              # Configuration DB (Sequelize)
│   ├── controllers/         # Logique métier des routes
│   ├── middleware/          # Middlewares Express (auth, upload, etc.)
│   ├── models/             # Modèles Sequelize (tables)
│   ├── routes/             # Définition des routes API
│   ├── seeders/            # Scripts de peuplement de données
│   ├── migrations/         # Migrations de base de données
│   ├── public/uploads/     # Fichiers uploadés (images, audio)
│   ├── services/           # Services (email, stripe)
│   ├── utils/              # Utilitaires (erreurs, helpers)
│   ├── tests/              # Tests unitaires et d'intégration
│   └── server.js           # Point d'entrée du serveur
├── frontend/
│   ├── public/             # Fichiers statiques
│   ├── src/
│   │   ├── components/     # Composants React réutilisables
│   │   ├── pages/         # Pages de l'application
│   │   ├── services/      # Services API (axios)
│   │   ├── context/       # Contextes React (auth, etc.)
│   │   ├── hooks/         # Hooks personnalisés
│   │   └── utils/         # Utilitaires frontend
│   └── package.json
├── docs/                   # Documentation technique
└── README.md
```

## 🛠️ Scripts NPM Disponibles

### Backend
```bash
# Développement
npm run dev              # Démarre avec nodemon (rechargement auto)
npm start               # Démarre en mode production

# Base de données
npm run migrate         # Applique toutes les migrations
npm run migrate:status  # Vérifie le statut des migrations
npm run migrate:undo    # Annule la dernière migration

# Seeding (données de test)
npm run seed           # Seeding de base (recommandé)
npm run seed:all       # Seeding complet de toutes les tables
npm run seed:clear     # Supprime toutes les données
npm run seed:users     # Seeding des utilisateurs uniquement
npm run seed:help      # Affiche toutes les commandes disponibles

# Tests et qualité de code
npm test              # Lance tous les tests
npm run test:watch    # Tests en mode watch
npm run lint          # Vérifie le code avec ESLint
npm run lint:fix      # Corrige automatiquement les erreurs ESLint
npm run format        # Formate le code avec Prettier
```

### Frontend
```bash
npm start            # Serveur de développement (port 3000)
npm run build        # Build de production
npm test            # Lance les tests React
```

## Configuration Avancée

### Gestion des Fichiers Upload
Les fichiers sont stockés dans `backend/public/uploads/` :
- **Séries** : `/uploads/series/` (icônes SVG)
- **Animations** : `/uploads/animations/[serie]/[animation]/` (images + audio)

### Base de Données
- **ORM** : Sequelize v6
- **Migrations** : Gérées par Sequelize CLI
- **Seeding** : Système personnalisé dans `seeders/`
- **Charset** : UTF8MB4 (support emojis et caractères spéciaux)

### API Endpoints Principaux
```
Auth:
POST   /api/auth/register      # Inscription
POST   /api/auth/login         # Connexion
POST   /api/auth/refresh       # Refresh token
POST   /api/auth/logout        # Déconnexion

Users:
GET    /api/users              # Liste des utilisateurs
POST   /api/users              # Créer utilisateur
PUT    /api/users/:id          # Modifier utilisateur

Series:
GET    /api/series             # Liste des séries
POST   /api/series             # Créer série
PUT    /api/series/:id         # Modifier série

Animations:
GET    /api/animations         # Liste des animations
POST   /api/animations         # Créer animation (avec upload)
PUT    /api/animations/:id     # Modifier animation
```

## Tests

### Lancer les Tests
```bash
# Backend
cd backend
npm test                    # Tous les tests
npm run test:controllers    # Tests des contrôleurs
npm run test:models        # Tests des modèles
npm run test:routes        # Tests des routes

# Frontend
cd frontend
npm test                   # Tests React/Jest
```

### Structure des Tests
```
backend/tests/
├── controllers/       # Tests des contrôleurs
├── middleware/        # Tests des middlewares
├── models/           # Tests des modèles Sequelize
├── routes/           # Tests d'intégration des routes
└── utils/            # Tests des utilitaires
```

## Dépannage

### Problèmes Courants

#### rreur de Connexion MySQL
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
**Solutions :**
- Vérifiez que MySQL est démarré : `sudo service mysql start` (Linux) ou via Services (Windows)
- Testez la connexion : `mysql -u root -p`
- Vérifiez les variables dans `.env`

#### Erreur de Migration
```
ERROR: Duplicate key name 'USR_email'
```
**Solutions :**
```bash
# Réinitialiser les migrations
npm run migrate:undo:all
npm run migrate
```

#### Erreur Module ES/CommonJS
```
ERR_MODULE_NOT_FOUND: Cannot find module 'config.js'
```
**Solutions :**
- Vérifiez que `backend/config/config.js` existe
- Recréez-le s'il manque :
```javascript
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
export default require('./config.cjs');
```

#### Port Déjà Utilisé
```
Error: listen EADDRINUSE :::5000
```
**Solutions :**
```bash
# Trouver et tuer le processus
npx kill-port 5000
# Ou changer le port dans .env
```

#### Problème de Permissions Upload
```
Error: EACCES: permission denied, mkdir '/uploads'
```
**Solutions :**
```bash
# Créer les dossiers manuellement
mkdir -p backend/public/uploads/series
mkdir -p backend/public/uploads/animations
chmod 755 backend/public/uploads
```

### Tests de Configuration
```bash
# Test connexion base de données
cd backend
node -e "import('./models/index.js').then(() => console.log('DB Connected'))"

# Test build frontend
cd frontend
npm run build && echo "Build OK"

# Test API
curl http://localhost:5000/api/health
```

## Déploiement

### Variables d'Environnement Production
```env
NODE_ENV=production
DB_HOST=votre_host_production
DB_NAME=pfe_production
JWT_SECRET=secret_production_tres_securise
```

### Build et Déploiement
```bash
# Frontend
cd frontend
npm run build

# Backend (PM2 recommandé)
cd backend
npm install -g pm2
pm2 start server.js --name "mfe-backend"
```

### Ajout de Nouvelles Fonctionnalités

#### Nouvelle Table/Model
```bash
# 1. Créer la migration
npx sequelize-cli migration:generate --name create-nouvelle-table

# 2. Éditer le fichier dans migrations/
# 3. Créer le modèle dans models/
# 4. Appliquer
npm run migrate

# 5. Créer un seeder (optionnel)
# 6. Ajouter aux tests
```

#### Nouvel Endpoint
1. Créer le contrôleur dans `controllers/`
2. Ajouter les routes dans `routes/`
3. Ajouter les validations (Joi)
4. Créer les tests
5. Documenter l'API

### Standards de Code
- **ESLint** : Configuration stricte
- **Prettier** : Formatage automatique
- **Commits** : Format conventionnel (`feat:`, `fix:`, `docs:`, etc.)
- **Tests** : Couverture minimale de 80%

---