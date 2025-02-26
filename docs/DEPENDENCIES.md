# Liste des Dépendances du Backend TiketsV3

## Dépendances de Production

### Essentielles
- **express** : Framework web pour Node.js qui gère les routes et les requêtes HTTP.
- **sequelize** : ORM pour interagir avec la base de données MySQL de façon structurée.
- **mysql2** : Pilote MySQL pour Sequelize.
- **tedious** : Pilote pour SQL Server (utilisé pour la connexion Batigest).
- **dotenv** : Chargement des variables d'environnement depuis le fichier .env.

### Sécurité
- **bcryptjs** : Hachage sécurisé des mots de passe (version 3.0.1).
- **jsonwebtoken** : Génération et validation des tokens JWT pour l'authentification.
- **express-rate-limit** : Protection contre les attaques par force brute.
- **sanitize-html** : Nettoyage des entrées HTML pour prévenir les attaques XSS.
- **joi** : Validation robuste des données entrantes.
- **helmet** : Middleware qui sécurise l'application Express en configurant divers en-têtes HTTP.
- **csurf** : Protection contre les attaques CSRF (Cross-Site Request Forgery).

### Middleware et Optimisation
- **body-parser** : Analyse des corps de requêtes HTTP.
- **compression** : Compression des réponses HTTP pour améliorer les performances.
- **cookie-parser** : Gestion des cookies HTTP.
- **cors** : Configuration des règles CORS pour les requêtes cross-origin.
- **morgan** : Journalisation des requêtes HTTP.
- **express-validator** : Alternative ou complément à Joi pour la validation des données.

### Gestion du Cache
- **redis** : Store de données en mémoire pour la mise en cache avancée.

### Gestion des Logs
- **winston** : Système avancé de journalisation.
- **winston-daily-rotate-file** : Rotation automatique des fichiers de logs.

### Utilitaires
- **node-cache** : Cache en mémoire pour les données fréquemment accédées.
- **node-cron** : Planification de tâches récurrentes (synchronisation Batigest, nettoyage).
- **nodemailer** : Envoi d'e-mails depuis l'application.
- **juice** : Intégration des styles CSS dans les e-mails HTML.
- **cross-spawn** : Exécution de processus externes de manière sécurisée.
- **npm-force-resolutions** : Résolution des conflits de dépendances.

## Dépendances de Développement

### Outils de Développement
- **nodemon** : Redémarrage automatique du serveur lors des modifications.
- **sequelize-cli** : Outils en ligne de commande pour Sequelize (migrations, seeders).

### Outils de Développement et Automatisation
- **husky** : Permet d'utiliser les hooks Git (pre-commit, pre-push).
- **lint-staged** : Exécute des linters sur les fichiers en cours de commit.
- **eslint-plugin-security** : Extension ESLint pour détecter les vulnérabilités de sécurité.

### Qualité de Code
- **eslint** : Analyse statique pour la détection des problèmes de code.
- **eslint-config-prettier** : Configuration ESLint compatible avec Prettier.
- **eslint-plugin-prettier** : Intégration de Prettier avec ESLint.
- **eslint-plugin-security** : Extension ESLint pour détecter les vulnérabilités de sécurité.
- **eslint-plugin-import** : Organisation et validation des imports/exports.
- **eslint-plugin-jsdoc** : Validation de la documentation JSDoc.
- **eslint-plugin-no-unsanitized** : Prévention des injections XSS.
- **eslint-plugin-node** : Règles spécifiques à l'environnement Node.js.
- **eslint-plugin-promise** : Bonnes pratiques pour les promesses et async/await.
- **prettier** : Formatage automatique du code.
- **husky** : Permet d'utiliser les hooks Git (pre-commit, pre-push).
- **lint-staged** : Exécute des linters sur les fichiers en cours de commit.

### Documentation
- **jsdoc** : Génération de documentation à partir des commentaires dans le code.
- **docdash** : Thème pour JSDoc.
- **better-docs** : Extensions améliorées pour JSDoc.
- **swagger-jsdoc** ou **swagger-ui-express** : Pour générer une documentation OpenAPI/Swagger.

### Tests
- **supertest** : Tests d'intégration pour les API Express.
- **expect.js** : Assertions enrichies pour les tests.
- **sinon** : Création de mocks, stubs et spies pour les tests.
- **jest** : Framework de test JavaScript complet.
- **mocha** : Framework de test alternatif mentionné dans vos documents.

## Structure d'Organisation

Votre backend suit une architecture MVC améliorée avec les composants suivants:

```
/project-root
├── /src
│   ├── /config        # Configurations (express, db, security)
│   ├── /controllers   # Gestion des requêtes HTTP
│   ├── /middlewares   # Intercepteurs de requêtes
│   ├── /models        # Modèles Sequelize
│   ├── /repositories  # Accès aux données
│   ├── /services      # Logique métier
│   ├── /routes        # Définition des endpoints API
│   ├── /utils         # Fonctions utilitaires
│   └── /cron          # Tâches planifiées
├── /docs              # Documentation technique
├── /logs              # Fichiers de logs
├── /migrations        # Migrations Sequelize
└── /seeders           # Données de test
```

## Commandes NPM Principales

```bash
# Démarrage et développement
npm start              # Lancement en production
npm run dev            # Lancement en développement (via nodemon)

# Qualité de code
npm run lint           # Vérification ESLint
npm run lint:report    # Génération rapport ESLint HTML
npm run format         # Formatage du code via Prettier

# Tests et documentation
npm test               # Exécution des tests Jest
npm run generate-docs  # Génération de la documentation JSDoc

# Utilitaires
npm run backup-db      # Sauvegarde de la base de données
```