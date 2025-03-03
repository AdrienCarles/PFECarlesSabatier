Mary a créer une fork comment peut t'elle avoir les droits de push sur main 

# Configuration du Backend et Migration des Tables

## Prérequis
1. **Extension VS Code** :
   - Installer l'extension [Database Client JDBC](https://marketplace.visualstudio.com/items?itemName=cweijan.vscode-database-client).
   - Cette extension vous permet de gérer les bases de données MySQL directement dans VS Code (similaire à phpMyAdmin).

2. **Fichier `.env`** :
   - Créez un fichier `.env` à la racine du dossier `backend` avec les variables suivantes :
     ```env
     PORT=5000          # Port pour la connexion au backend en développement
     DB_USER=           # Votre utilisateur MySQL
     DB_PASSWORD=       # Mot de passe MySQL
     DB_HOST=localhost  # Hôte MySQL
     DB_PORT=3306       # Port MySQL (par défaut 3306)
     DB_NAME=pfe        # Nom de la base de données
     ```

---

## Étapes de Configuration

### 1. **Connexion à la Base de Données**
   - Ouvrez l'extension "Database Client JDBC" dans VS Code.
   - Ajoutez une connexion en utilisant les mêmes informations que celles du fichier `.env`.
   - Si la base de données `pfe` n'apparaît pas, elle doit être créée au préalable.

   #### Création de la Base de Données
   - Ouvrez un terminal et connectez-vous à MySQL :
     ```bash
     mysql -u [votre utilisateur MySQL] -p
     ```
   - Entrez votre mot de passe, puis exécutez la commande suivante :
     ```sql
     CREATE DATABASE pfe;
     ```
   - Une fois la base créée, réessayez la connexion dans l'extension.

---

### 2. **Migration des Tables**
   - Ouvrez un terminal dans VS Code.
   - Placez-vous dans le dossier `backend` :
     ```bash
     cd backend
     ```
   - Exécutez la commande suivante :
     ```bash
     npm run migrate
     ```
   - Vérifiez dans le gestionnaire de base de données (via l'extension ou un autre outil) que les tables ont été créées.

---

### 3. **Test de la Connexion**
   - Dans le dossier `backend`, exécutez le fichier `test-db.js` pour valider la connexion :
     ```bash
     node test-db.js
     ```
   - Si tout est correctement configuré, vous devriez voir un message confirmant la connexion à la base de données.

---

## Utilisation de NPM

### 1. **Mise à Jour des Dépendances**
   - Assurez-vous d'avoir installé toutes les dépendances nécessaires pour le backend et le frontend :
     ```bash
     # Dans le dossier backend
     cd backend
     npm install

     # Dans le dossier frontend
     cd ../frontend
     npm install
     ```

### 2. **Lancer le Backend**
   - Depuis le dossier `backend`, démarrez le serveur :
     ```bash
     npm run dev
     ```
   - Le backend sera accessible sur le port défini dans le fichier `.env` (par défaut : `http://localhost:5000`).

### 3. **Lancer le Frontend**
   - Depuis le dossier `frontend`, démarrez le serveur de développement :
     ```bash
     npm start
     ```
   - Une fois démarré, le frontend sera accessible sur `http://localhost:3000`.

---

## Notes
- Assurez-vous que MySQL est installé et accessible sur votre machine.
- Si vous rencontrez des problèmes avec les étapes ci-dessus, vérifiez vos identifiants MySQL et les configurations réseau.


## To Do 19/01

# Authentication Middleware

const protect = async (req, res, next) => {
  try {
    // Add authentication check
    if (!req.headers.authorization) {
      return next(new AppError(401, 'Non autorisé'));
    }
    next();
  } catch (error) {
    next(new AppError(401, 'Non autorisé'));
  }
};


4. Réinitialisation de mot de passe
Implémentez un système de réinitialisation avec un token temporaire envoyé par e-mail :
Endpoint : POST /api/auth/reset-password.
Lien envoyé par e-mail avec un token JWT à usage unique.

Mettre en place un suivi des connexions et des logs pour les tentatives réussies/échouées.
Configurer un limiteur de connexion pour prévenir les attaques par force brute.
Ajouter la gestion de la déconnexion avec invalidation des tokens.


Logs et monitoring :

Intégrer un outil de monitoring (ex. Prometheus, Grafana) pour suivre les performances du serveur.
Configurer des logs structurés pour faciliter le debugging.
Documentation :

Générer automatiquement une documentation d’API avec Swagger ou Redoc.
Refactorisation :

Adopter une architecture basée sur des services pour mieux isoler les responsabilités.
Centraliser les constantes (ex. statuts d'erreur) pour éviter la duplication.

Performance : Si possible, limitez les validations create et update aux seuls champs modifiés pour améliorer les performances.



3. Tests unitaires pour les principaux composants
A. Contrôleurs (controllers/)

  Fichiers nécessaires
Fichiers de contrôleurs :

Les fichiers *.js dans backend/controllers/ (par exemple, authController.js, userController.js).
Modèles :

Les fichiers *.js dans backend/models/, comme usr.js, refreshtoken.js, etc., qui sont utilisés dans les contrôleurs.
Middlewares (facultatif) :

Les middlewares utilisés dans vos routes (ex. authMiddleware.js pour la vérification des tokens).
Fichiers de routes :

Les fichiers *.js dans backend/routes/, afin de savoir comment les routes sont connectées aux contrôleurs.
Fichier server.js ou le point d'entrée de l'application :

Ce fichier est nécessaire pour initialiser l'application avec supertest afin de tester les routes et les contrôleurs.
Utilitaires :

Fichiers comme AppError.js, qui pourraient être utilisés dans vos contrôleurs pour la gestion des erreurs.


B. Middleware (middleware/)
Les middlewares doivent être testés pour leur comportement sous différentes conditions.

authMiddleware.js

Scénarios à tester :
Authentification réussie avec un token valide.
Échec d'authentification avec un token invalide ou expiré.
Exemple de test :

javascript
Copier
Modifier
const { authenticateToken } = require('../../middleware/authMiddleware');
const jwt = require('jsonwebtoken');

jest.mock('jsonwebtoken');

describe('authenticateToken middleware', () => {
  it('should call next() for valid token', () => {
    jwt.verify.mockImplementation(() => ({ id: 1 }));
    const req = { headers: { authorization: 'Bearer validToken' } };
    const res = {};
    const next = jest.fn();

    authenticateToken(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toEqual({ id: 1 });
  });

  it('should return 401 for invalid token', () => {
    jwt.verify.mockImplementation(() => { throw new Error('Invalid token'); });
    const req = { headers: { authorization: 'Bearer invalidToken' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token invalide ou expiré' });
  });
});
C. Modèles (models/)
Les modèles doivent être testés pour leurs validations et relations.

Tests pour RefreshToken :

Vérifiez que les champs requis (user_id, token, used) sont correctement validés.
Testez les associations avec USR.
Exemple de test pour les validations :

javascript
Copier
Modifier
const { RefreshToken } = require('../../models');

describe('RefreshToken model', () => {
  it('should fail if required fields are missing', async () => {
    try {
      await RefreshToken.create({});
    } catch (error) {
      expect(error.name).toBe('SequelizeValidationError');
    }
  });

  it('should create a valid refresh token', async () => {
    const token = await RefreshToken.create({ user_id: 1, token: 'sampleToken', used: false });
    expect(token).toHaveProperty('id');
    expect(token).toHaveProperty('token', 'sampleToken');
  });
});
D. Routes (routes/)
Testez que les routes mappent correctement les contrôleurs et que les middlewares fonctionnent.

Utilisez supertest pour tester les réponses HTTP.
Vérifiez que les endpoints répondent avec les statuts attendus (200, 401, etc.).
E. Validation (validations/)
Testez les schémas Joi pour différents scénarios :

Entrées valides.
Champs manquants.
Valeurs invalides.
4. Automatisation des tests
Ajoutez des scripts dans package.json :

json
Copier
Modifier
"scripts": {
  "test": "jest --coverage",
  "test:watch": "jest --watch"
}
Exécutez les tests :

bash
Copier
Modifier
npm test


