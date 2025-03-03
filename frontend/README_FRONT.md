### **Dépendances**

1. **`axios`** :
   - **Rôle :** Bibliothèque utilisée pour effectuer des requêtes HTTP (GET, POST, etc.) vers des API.

2. **`bootstrap`** :
   - **Rôle :** Framework CSS pour créer des interfaces utilisateur réactives et élégantes.

3. **`cra-template-pwa`** :
   - **Rôle :** Template pour créer une Progressive Web App avec Create React App.

4. **`dotenv`** :
   - **Rôle :** Charge les variables d'environnement définies dans un fichier `.env`.

5. **`formik`** :
   - **Rôle :** Gestion des formulaires et validation dans React.

6. **`react` & `react-dom`** :
   - **Rôle :** Bibliothèque centrale pour construire l'interface utilisateur (`react`) et gérer le rendu dans le DOM (`react-dom`).

7. **`react-router-dom`** :
   - **Rôle :** Gestion des routes dans une application React (navigation entre pages).

8. **`react-scripts`** :
   - **Rôle :** Scripts et configuration pour un projet React (créer, construire et tester l'application).

9. **`react-toastify`** :
   - **Rôle :** Affichage de notifications élégantes.

10. **`web-vitals`** :
    - **Rôle :** Mesure des performances essentielles comme les temps de chargement et d'interactivité.

11. **Bibliothèques `workbox` (`workbox-core`, `workbox-precaching`, etc.)** :
    - **Rôle :** Permet la gestion du cache et des stratégies de service worker pour les PWA.

12. **`yup`** :
    - **Rôle :** Validation de schémas pour les formulaires.

### **Scripts**
- **`start`** : Lance l'application en mode développement.
- **`build`** : Compile l'application pour la production.
- **`test`** : Exécute les tests unitaires.
- **`eject`** : Extrait la configuration de React Scripts pour la personnalisation. NE JAMAIS FAIRE

### **PLAN**

frontend/
├── public/
│   ├── favicon.ico
│   ├── index.html
│   ├── manifest.json       # Fichier de configuration PWA
│   ├── robots.txt
│   └── logo192.png
│
├── src/
│   ├── assets/             # Images, icônes, etc.
│   │   ├── images/
│   │   └── styles/         # Styles globaux ou spécifiques
│   │       ├── main.css
│   │       └── variables.css
│   │
│   ├── components/         # Composants réutilisables
│   │   ├── Auth/           # Composants liés à l'authentification
│   │   │   ├── LoginForm.js
│   │   │   └── RegisterForm.js
│   │   ├── Layout/         # Layouts comme Header, Footer
│   │   │   ├── Header.js
│   │   │   └── Footer.js
│   │   └── UI/             # Composants UI génériques (boutons, modales, etc.)
│   │       ├── Button.js
│   │       └── Modal.js
│   │
│   ├── context/            # Gestion de l'état global avec Context ou React Query
│   │   └── AuthContext.js
│   │
│   ├── hooks/              # Hooks personnalisés
│   │   ├── useAuth.js
│   │   └── useFetch.js
│   │
│   ├── pages/              # Pages principales de l'application
│   │   ├── Home.js
│   │   ├── Login.js
│   │   ├── Register.js
│   │   └── Dashboard.js
│   │
│   ├── routes/             # Gestion des routes de l'application
│   │   └── AppRoutes.js
│   │
│   ├── services/           # Appels API (axios)
│   │   ├── api.js
│   │   ├── authService.js
│   │   └── userService.js
│   │
│   ├── utils/              # Fonctions utilitaires
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   └── validation.js   # Schémas Yup
│   │
│   ├── App.js              # Entrée principale de l'application
│   ├── index.js            # Point de départ pour React
│   ├── service-worker.js   # Fichier Workbox pour PWA
│   └── setupTests.js       # Configuration des tests unitaires
│
├── .env                    # Variables d'environnement
├── .gitignore              # Fichiers à ignorer dans Git
├── package.json            # Configuration des dépendances
├── README.md               # Documentation de votre projet
└── yarn.lock               # (ou package-lock.json) Gestionnaire de version des dépendances

### **Description des Dossiers**

#### **`public/`**
- Contient les fichiers statiques pour le PWA, comme le manifest et le fichier HTML principal.

#### **`src/assets/`**
- **Images et icônes** : Placez vos ressources graphiques ici.
- **Styles** : Fichiers CSS pour les variables globales ou spécifiques.

#### **`src/components/`**
- **Auth/** : Composants de connexion et d'inscription.
- **Layout/** : Header, Footer, ou tout autre composant global.
- **UI/** : Composants génériques et réutilisables.

#### **`src/context/`**
- Utilisez `AuthContext.js` pour gérer l'état d'authentification de manière centralisée.

#### **`src/hooks/`**
- Créez des hooks personnalisés pour la logique partagée (par exemple, `useAuth` pour vérifier l'état de connexion).

#### **`src/pages/`**
- Représente chaque vue ou page de l'application (par exemple, Login, Register, Dashboard).

#### **`src/routes/`**
- Gère les routes de votre application dans `AppRoutes.js`.

#### **`src/services/`**
- Contient les fonctions pour interagir avec l’API backend.
  - `authService.js` : Gestion des appels liés à l'authentification.
  - `userService.js` : Gestion des utilisateurs.

#### **`src/utils/`**
- **`constants.js`** : Stocke les constantes globales (par ex. : URL de l'API).
- **`validation.js`** : Schémas Yup pour la validation des formulaires.



