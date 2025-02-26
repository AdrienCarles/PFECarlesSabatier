# Standards de Code et Bonnes Pratiques – Projet TiketsV3

**Objectif :** Assurer un code propre, lisible et maintenable pour une collaboration efficace et un développement sécurisé et performant.

---

## Table des Matières
1. [Introduction](#1-introduction)
2. [Style de Code](#2-style-de-code)
   - 2.1 [Linting et Formatage Automatique](#21-linting-et-formatage-automatique)
   - 2.2 [Conventions d’Écriture Améliorées](#22-conventions-décriture-améliorées)
3. [Commentaires et Documentation](#3-commentaires-et-documentation)
4. [Conventions de Nommage](#4-conventions-de-nommage)
5. [Organisation des Modules](#5-organisation-des-modules)
6. [Gestion des Erreurs](#6-gestion-des-erreurs)
7. [Sécurité et Bonnes Pratiques](#7-securite-et-bonnes-pratiques)
8. [Performances et Optimisations](#8-performances-et-optimisations)
9. [Tests et Assurance Qualité](#9-tests-et-assurance-qualite)
10. [Automatisation et CI/CD](#10-automatisation-et-ci-cd)
11. [Documentation API](#11-documentation-api)
12. [Glossaire](#12-glossaire)
13. [Version Résumée](#13-version-resumée)
14. [Script de Vérification Automatique](#14-script-de-vérification-automatique)

---

## 1. Introduction

**Règles Prioritaires :**
1. **Lisibilité (Critique)** – Facilite la compréhension pour tous les membres de l’équipe.
2. **Maintenabilité (Critique)** – Permet des évolutions fluides.
3. **Collaboration (Important)** – Assure une cohérence entre les développeurs.
4. **Performance et Sécurité (Critique)** – Optimise le backend pour une application stable et scalable.

---

## 2. Style de Code

Chaque partie de cette section présente d’abord un court objectif, suivie de règles numérotées et priorisées, d’exemples concrets et d’une checklist finale.

### 2.1 Linting et Formatage Automatique

**Objectif :**  
Uniformiser le style de code et prévenir les erreurs courantes grâce à des outils automatisés.

**Règles (Niveau de priorité indiqué) :**
1. **(Critique)** Utiliser **ESLint (Airbnb config)** et **Prettier**.
2. **(Important)** Activer **Husky** pour exécuter ESLint avant chaque commit.
3. **(Important)** Mettre en place un fichier **`.editorconfig`** pour standardiser les espaces et les retours à la ligne.
4. **(Critique)** Pour le backend :
   - Désactiver `console.log()` en production (obligation d’utiliser `logger.js`).
   - Vérifier strictement les imports et variables inutilisés.
   - Activer `eslint-plugin-security` pour contrer les failles (ex. injections).
   - Préférer **async/await** à `.then/.catch`.
   - Enforcer un formatage cohérent pour objets et tableaux.
   - **Spécifique à Sequelize :**
     - Respecter la convention `PascalCase.js` pour les modèles dans `src/models/` et activer `timestamps: true`.
     - Interdire les requêtes SQL brutes (`db.query`) sauf en cas de nécessité justifiée.

### 2.2 Conventions d’Écriture

**Objectif :**  
Favoriser une syntaxe claire et prévisible pour améliorer la compréhension du code.

**Règles (Niveau de priorité) :**
1. **(Critique)** Utiliser le strict mode (ES6+ via import/export).
2. **(Important)** Déclarer les variables en haut des blocs.
3. **(Important)** Éviter les "magic numbers" en utilisant des constantes nommées.
4. **(Important)** Déstructurer les objets autant que possible.
4. **(Critique)** Ne jamais utiliser `await` dans une boucle, utiliser `Promise.all()` à la place.

---

## 3. Commentaires et Documentation

**Objectif :**  
Assurer une documentation complète et à jour pour faciliter la compréhension et la maintenance.

**Règles :**
1. **(Critique)** Utiliser JSDoc pour annoter services, repositories et middlewares.
2. **(Important)** Documenter les routes avec `@route`, `@method`, `@queryparam` et `@bodyparam`.
3. **(Important)** Standardiser les commentaires courts (`//`) et longs (`/* … */`).

---

## 4. Conventions de Nommage

**Objectif :**  
Standardiser les noms des variables, fonctions, classes et fichiers pour une meilleure lisibilité.

**Règles :**
1. **(Critique)** Variables et fonctions en `camelCase`.
2. **(Critique)** Classes et modèles Sequelize en `PascalCase`.
3. **(Important)** Constantes globales en `UPPER_SNAKE_CASE`.
4. **(Important)** Respecter les conventions de nommage pour les fichiers (ex. utilitaires en `kebab-case.js`).

**Exemple de Tableau de Référence :**

| Type de fichier          | Convention         | Exemple                 |
|--------------------------|--------------------|-------------------------|
| Utilitaires              | kebab-case.js      | `date-utils.js`         |
| Classes / Services       | PascalCase.js      | `UserService.js`        |
| Modèles Sequelize        | PascalCase.js      | `User.js`               |
| Fichiers de migration SQL| snake_case.sql     | `create_users_table.sql`|

---

## 5. Organisation des Modules

**Objectif :**  
Maintenir une architecture claire en suivant le modèle MVC amélioré.

**Structure recommandée :**
1. **(Critique)** `controllers/` – Gestion des requêtes HTTP.
2. **(Critique)** `services/` – Logique métier et appels aux repositories.
3. **(Critique)** `repositories/` – Accès à la base de données via Sequelize.
4. **(Important)** `middlewares/` – Gestion des validations, authentification et erreurs.
5. **(Important)** `models/` – Définition des entités avec timestamps activés.
6. **(Important)** `routes/` – Définition des endpoints et usage des middlewares.
7. **(Souhaitable)** `utils/`, `config/`, `cron/` – Pour fonctions génériques, configurations et tâches planifiées.

**Exemple d’Ordre des Imports :**

```javascript
// 1. Modules natifs
const fs = require('fs');
const path = require('path');

// 2. Dépendances NPM
const express = require('express');
const jwt = require('jsonwebtoken');

// 3. Configuration
const { JWT_SECRET } = require('../config/server.config');

// 4. Middlewares
const authMiddleware = require('../middlewares/authMiddleware');

// 5. Services et utilitaires internes
const UserService = require('../services/UserService');
const { AppError } = require('../utils/AppError');
```

---

## 6. Gestion des Erreurs

**Objectif :**  
Centraliser la gestion des erreurs pour distinguer les erreurs attendues (opérationnelles) des erreurs système.

**Règles :**
1. **(Critique)** Utiliser une classe dédiée (`AppError.js`) pour créer des erreurs applicatives.
2. **(Critique)** Mettre en place un middleware global (`gestionErreurs.js`) pour formater et envoyer les erreurs.
3. **(Important)** Utiliser `asyncHandler.js` pour éviter les répétitions de try/catch.
4. **(Important)** Enregistrer les erreurs via `logger.js` et gérer les erreurs 404 avec `notFound.js`.

**Exemple de Flux d’Erreur :**
1. Une requête GET `/api/users/9999` est reçue.
2. `UserController.js` appelle `UserService.getUserById(9999)`.
3. Le service renvoie `null` → `UserController.js` lève une erreur via `AppError`.
4. `asyncHandler.js` transmet l’erreur au middleware global.
5. Le middleware formate la réponse et log l’erreur.

---

## 7. Sécurité et Bonnes Pratiques

**Objectif :**  
Protéger l’application contre les attaques et garantir l’intégrité des données.

**Règles (Priorité indiquée) :**
1. **(Critique)** Valider les entrées avec `Joi` ou `express-validator`.
2. **(Critique)** Protéger contre les injections SQL/XSS via un middleware de sanitisation.
3. **(Critique)** Sécuriser les tokens JWT avec `authMiddleware.js`.
4. **(Important)** Limiter les tentatives de connexion avec `express-rate-limit`.
5. **(Important)** Désactiver les headers inutiles avec `helmet`.

**Tableau de Résumé :**

| Sécurité                         | Outil                         | Priorité    |
|----------------------------------|-------------------------------|-------------|
| Validation des entrées           | Joi / express-validator       | Critique    |
| Sanitisation des entrées         | express-sanitizer / DOMPurify | Critique    |
| Authentification sécurisée       | jsonwebtoken (JWT)            | Critique    |
| Protection Brute Force           | express-rate-limit            | Important   |
| Désactivation des headers        | helmet                        | Important   |

---

## 8. Performances et Optimisations

**Objectif :**  
Améliorer la réactivité et l’évolutivité du backend.

**Règles :**
1. **(Important)** Mettre en cache les requêtes fréquentes avec Redis.
2. **(Important)** Utiliser la pagination SQL (`limit` et `offset` ou pagination par curseur).
3. **(Important)** Compresser les réponses HTTP (Gzip ou Brotli).
4. **(Important)** Exploiter le multi-processus avec `Cluster` et `PM2`.
5. **(Souhaitable)** Optimiser les requêtes SQL avec indexation et jointures optimisées.
6. **(Souhaitable)** Planifier des tâches régulières avec `cron`.

---

## 9. Tests et Assurance Qualité

**Objectif :**  
Garantir la fiabilité du code par des tests unitaires et d’intégration.

**Règles :**
1. **(Critique)** Organiser les tests dans un dossier `tests/` avec une distinction entre tests unitaires et d’intégration.
2. **(Critique)** Utiliser Jest pour les tests unitaires.
3. **(Important)** Employer Supertest pour tester les routes API.
4. **(Important)** Vérifier une couverture de test minimale (ex. 80%).

---

## 10. Automatisation et CI/CD

**Objectif :**  
Automatiser le processus de développement pour garantir la qualité avant chaque déploiement.

**Règles :**
1. **(Critique)** Mettre en place un linting automatique (Husky + lint-staged) avant commit.
2. **(Critique)** Exécuter les tests via GitHub Actions avant chaque déploiement.
3. **(Important)** Configurer une pipeline CI/CD incluant `npm test && npm run lint`.
4. **(Important)** Analyser régulièrement les dépendances via `npm audit`.
---

## 11. Documentation API

**Objectif :**  
Fournir une documentation interactive et à jour pour l’API.

**Règles :**
1. **(Important)** Utiliser Swagger/OpenAPI pour décrire chaque endpoint (méthodes, paramètres, réponses).
2. **(Important)** Mettre en place un versioning (préfixe `/api/v1/`) pour assurer la compatibilité.

---

## 12. Glossaire

Voici un glossaire complet intégrant l'ensemble des termes techniques et outils mentionnés dans ton document :

---

## Glossaire
- **ESLint**  Outil d’analyse statique qui identifie et corrige les erreurs ainsi que les problèmes de style dans le code JavaScript.
- **Prettier**  Formateur de code permettant d’uniformiser le style du code en appliquant des règles de formatage prédéfinies.
- **Husky**  Outil qui exécute des scripts (ex. linting) avant des commits Git afin de garantir que le code respecte les standards définis.
- **.editorconfig**  Fichier de configuration qui permet d’harmoniser les règles de mise en forme (espaces, tabulations, retours à la ligne) entre différents éditeurs de texte.
- **eslint-plugin-security**  Plugin ESLint dédié à la détection des vulnérabilités de sécurité courantes dans le code.
- **async/await**  Syntaxe JavaScript facilitant l’écriture d’opérations asynchrones de manière plus lisible qu’en utilisant les chaînes de promesses (.then/.catch).
- **Sequelize**  ORM (Object-Relational Mapping) pour Node.js qui simplifie l’interaction avec une base de données SQL en manipulant des objets JavaScript.
- **Strict Mode**  Mode d’exécution de JavaScript qui impose des règles plus strictes pour éviter certaines erreurs de programmation courantes.
- **Magic Numbers**  Valeurs numériques utilisées directement dans le code sans explication. Il est préférable d’utiliser des constantes nommées pour améliorer la lisibilité et la maintenabilité.
- **Promise.all()**  Méthode JavaScript permettant d’exécuter plusieurs promesses en parallèle et d’attendre leur résolution collective.
- **JSDoc**  Système de documentation en commentaires qui permet de générer une documentation technique à partir du code JavaScript.
- **@route, @method, @queryparam, @bodyparam**  Annotations JSDoc utilisées pour documenter de manière précise les endpoints d’une API REST (définition de la route, méthode HTTP, paramètres de requête et du corps).
- **camelCase**  Convention de nommage dans laquelle le premier mot est en minuscule et les mots suivants commencent par une majuscule (ex. `userService`).
- **PascalCase**  Convention de nommage où chaque mot commence par une majuscule, utilisée pour nommer les classes et modèles (ex. `UserService`).
- **UPPER_SNAKE_CASE**  Convention de nommage utilisée pour les constantes globales où toutes les lettres sont en majuscules et séparées par des underscores (ex. `MAX_CONNECTIONS`).
- **kebab-case**  Convention de nommage des fichiers où tous les mots sont en minuscules et séparés par des tirets (ex. `date-utils.js`).
- **snake_case**  Convention de nommage où les mots sont en minuscules et séparés par des underscores (ex. `create_users_table.sql`).
- **MVC (Modèle-Vue-Contrôleur)**  Architecture logicielle qui sépare la présentation, la logique métier et la gestion des données afin de faciliter le développement et la maintenance.
- **Controllers**  Composants qui gèrent les requêtes HTTP et délèguent le traitement aux services sans contenir eux-mêmes de logique métier.
- **Services**  Composants regroupant la logique métier et les règles d’affaires de l’application.
- **Repositories**  Composants responsables de l’accès et de la manipulation des données, souvent via un ORM comme Sequelize.
- **Middlewares**  Fonctions intermédiaires dans le traitement des requêtes HTTP qui gèrent des tâches telles que l’authentification, la validation ou la gestion des erreurs.
- **Models**  Représentations des entités de la base de données, définies notamment via Sequelize, avec des attributs et des relations précises.
- **Routes**  Définition des endpoints de l’API et leur association avec les contrôleurs et middlewares.
- **Utils**  Ensemble de fonctions utilitaires réutilisables dans l’application pour des tâches communes.
- **Config**  Fichiers regroupant les variables d’environnement et les réglages globaux du projet.
- **Cron**  Système de tâches planifiées qui exécute automatiquement des scripts à des intervalles définis (souvent via `node-cron`).
- **AppError**  Classe personnalisée pour la gestion des erreurs applicatives, permettant de différencier les erreurs attendues (opérationnelles) des erreurs système.
- **asyncHandler.js**  Middleware qui capture automatiquement les erreurs dans les fonctions asynchrones, évitant ainsi la répétition de blocs try/catch.
- **logger.js**  Module destiné à l’enregistrement structuré des logs pour faciliter le suivi des événements et erreurs en production.
- **notFound.js**  Middleware qui gère les cas d’URL non trouvées en renvoyant une réponse 404 sans exposer d’informations sensibles.
- **Joi**  Bibliothèque de validation des données qui permet de définir des schémas et de valider de manière robuste les entrées utilisateur.
- **express-validator**  Middleware pour Express qui offre des fonctionnalités de validation des données issues des requêtes HTTP.
- **express-sanitizer**  Middleware qui nettoie les entrées utilisateur pour prévenir les attaques XSS et autres injections malveillantes.
- **DOMPurify**  Bibliothèque utilisée pour assainir les données HTML et empêcher l’injection de scripts malveillants (XSS).
- **JWT (JSON Web Token)**  Standard permettant de transmettre de manière sécurisée des informations d’authentification entre un client et un serveur.
- **express-rate-limit**  Middleware qui limite le nombre de requêtes qu’un utilisateur peut effectuer dans un laps de temps défini, afin de protéger contre les attaques par force brute.
- **helmet**  Middleware qui aide à sécuriser une application Express en configurant divers en-têtes HTTP pour prévenir certaines vulnérabilités.
- **Redis**  Système de cache en mémoire utilisé pour améliorer la rapidité des accès aux données et réduire la charge sur la base de données.
- **Pagination (limit & offset, pagination par curseur)**  Techniques permettant de diviser un grand ensemble de données en pages, facilitant ainsi la gestion et l’affichage de données volumineuses.
- **Gzip et Brotli**  Algorithmes de compression utilisés pour réduire la taille des réponses HTTP et accélérer leur transmission sur le réseau.
- **Cluster**  Module de Node.js qui permet de créer plusieurs processus pour exploiter pleinement les capacités multi-cœurs du serveur.
- **PM2**  Gestionnaire de processus pour Node.js qui facilite la gestion, le redémarrage automatique et la montée en charge des applications.
- **Indexation**  Technique d’optimisation des bases de données qui permet de créer des index sur des colonnes fréquemment utilisées afin d’accélérer les requêtes.
- **Jointures Optimisées**  Méthodes pour combiner plusieurs tables SQL de manière efficace, réduisant ainsi la charge sur la base de données.
- **Jest**  Framework de tests JavaScript permettant d’écrire et d’exécuter des tests unitaires de manière simple et efficace.
- **Supertest**  Bibliothèque permettant de tester les endpoints d’une API Express en simulant des requêtes HTTP.
- **CI/CD (Intégration Continue / Déploiement Continu)**  Pratiques visant à automatiser la validation, l’intégration et le déploiement du code pour améliorer la qualité et accélérer la mise en production.
- **GitHub Actions**  Plateforme d’automatisation intégrée à GitHub permettant de définir des workflows pour exécuter des tests, des déploiements et d’autres tâches automatisées.
- **lint-staged**  Outil qui permet d’exécuter des scripts (comme le linting) uniquement sur les fichiers modifiés avant un commit, afin d’assurer leur qualité.
- **npm audit**  Commande NPM qui analyse les dépendances d’un projet pour détecter et signaler les vulnérabilités de sécurité.
- **Swagger/OpenAPI**  Spécification et ensemble d’outils permettant de documenter, de décrire et de tester de manière interactive les API REST.
- **Versioning**  Pratique consistant à versionner une API (par exemple en utilisant un préfixe `/api/v1/`) pour gérer ses évolutions tout en maintenant la compatibilité avec les anciennes versions.
- **child_process (exec)**  Module Node.js permettant d’exécuter des commandes système depuis le code JavaScript, utilisé notamment pour automatiser des vérifications ou des scripts de déploiement.

---

## 13. Version Résumée

**Pour une référence rapide, voici les points essentiels :**

- **Linting & Formatage :** ESLint + Prettier avec Husky.
- **Conventions d’Écriture :** Utilisation du strict mode, déclaration en début de bloc, constantes pour valeurs fixes.
- **Documentation :** JSDoc pour tous les modules, Swagger pour l’API.
- **Nommage :** camelCase pour variables, PascalCase pour classes, UPPER_SNAKE_CASE pour constantes.
- **Architecture :** Structure MVC claire (controllers, services, repositories, middlewares).
- **Erreurs :** Gestion centralisée avec AppError, middleware global et asyncHandler.
- **Sécurité :** Validation (Joi/express-validator), sanitisation, JWT, rate limiting, helmet.
- **Performances :** Caching (Redis), pagination, compression, multi-processus (PM2).
- **Tests :** Jest et Supertest avec couverture minimale de 80%.
- **CI/CD :** Pipeline automatisé (lint, tests, audit).

---

## 14. Script de Vérification Automatique

**Objectif :**  
Proposer un script (en Node.js) permettant de vérifier rapidement si un projet respecte ces standards.

**Exemple de script :**

```javascript
// check-standards.js
const { exec } = require('child_process');

const commands = [
  'npm run lint',
  'npm test -- --coverage',
  'npm audit'
];

console.log('Vérification des standards du projet...');
commands.forEach(cmd => {
  exec(cmd, (err, stdout, stderr) => {
    console.log(`Commande: ${cmd}`);
    if (err) {
      console.error(`Erreur: ${stderr}`);
    } else {
      console.log(stdout);
    }
  });
});
```