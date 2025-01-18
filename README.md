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
     npm start
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
- Pour un environnement de production, adaptez les variables du fichier `.env` et configurez votre serveur de manière sécurisée.

---

Avec ces instructions, vous pourrez configurer, démarrer, et utiliser votre application complète. Besoin d'autres informations ? 😊
