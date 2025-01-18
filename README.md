Push du 18/01/2025
  Création de le connexion avec la bdd : 
    extention vsCode Database Client JDBC (ca fait comme phpMy admin)
    Requis un fichier .env a la racine du backend avec les variables suivante 
    PORT=5000   ( connextion au backend  en dev )
    DB_USER=   ( votre mySQL  )
    DB_PASSWORD=  ( votre mySQL  )
    DB_HOST=localhost   
    DB_PORT=
    DB_NAME=pfe nom  que j'ai donnée 
    faire la connexion dans  l'extention e'n mettant les meme infos 
    vous devriez avoir une visue de vos autres bdd mySQL  si tt  vas bien et la bdd pfe sinon il faut la créer au  préalable 
      en ligne de commande faire mysql -u [votre user mysql] -p
      rentrez votre mdp puus dans l'invite faire 
      CREATE DATABASE PFE;
  rententer la creation de connextion  dans  vscode 

  Migration des tables 
    Dans un terminale de vscode deplacer vous dans le dossier Backend 
    Executer  le commande npm run migrate

    controller dans le gestionnaire de bdd que les tables ont bien étés crées 
  
    
