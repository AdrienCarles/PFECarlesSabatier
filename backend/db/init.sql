-- Script SQL pour le MLD fourni avec ajustements

-- Table : USR (Utilisateurs)
CREATE TABLE USR (
    USR_id INT AUTO_INCREMENT PRIMARY KEY,
    USR_email VARCHAR(50) NOT NULL UNIQUE,
    USR_pass VARCHAR(255) NOT NULL,
    USR_prenom VARCHAR(50) NOT NULL,
    USR_nom VARCHAR(50) NOT NULL,
    USR_role VARCHAR(50) NOT NULL,
    USR_telephone VARCHAR(15),
    USR_dateCreation DATE NOT NULL,
    USR_derniereConnexion DATETIME,
    USR_statut VARCHAR(50) NOT NULL
);

-- Table : PAI (Paiements)
CREATE TABLE PAI (
    PAI_id INT AUTO_INCREMENT PRIMARY KEY
    -- Ajouter les colonnes nécessaires
);

-- Table : ENFA (Enfants)
CREATE TABLE ENFA (
    ENFA_id INT AUTO_INCREMENT PRIMARY KEY,
    ENFA_prenom VARCHAR(50) NOT NULL,
    ENFA_nom VARCHAR(50) NOT NULL,
    ENFA_dateNaissance DATE NOT NULL,
    ENFA_niveauAudition VARCHAR(50),
    ENFA_dateCreation DATE NOT NULL,
    ENFA_dateDebutSuivi DATE,
    ENFA_dateFinSuivi DATE,
    ENFA_notesSuivi VARCHAR(255),
    USR_parent_id INT NOT NULL,
    USR_orthophoniste_id INT NOT NULL,
    FOREIGN KEY (USR_parent_id) REFERENCES USR(USR_id),
    FOREIGN KEY (USR_orthophoniste_id) REFERENCES USR(USR_id)
);

-- Table : SES (Series)
CREATE TABLE SES (
    SES_id INT AUTO_INCREMENT PRIMARY KEY,
    SES_titre VARCHAR(50) NOT NULL,
    SES_theme VARCHAR(50),
    SES_description VARCHAR(255),
    SES_statut VARCHAR(50) NOT NULL
);

-- Table : ANI (Animations)
CREATE TABLE ANI (
    ANI_id INT AUTO_INCREMENT PRIMARY KEY,
    ANI_titre VARCHAR(50) NOT NULL,
    ANI_description VARCHAR(255),
    ANI_type VARCHAR(50),
    ANI_urlAnimation VARCHAR(255) NOT NULL,
    ANI_urlAudio VARCHAR(255),
    ANI_duree DECIMAL(15,2),
    ANI_taille INT,
    ANI_valider BOOLEAN DEFAULT FALSE,
    ANI_date_creation DATE NOT NULL,
    ANI_dateValidation DATE,
    USR_creator_id INT NOT NULL,
    SES_id INT NOT NULL,
    FOREIGN KEY (USR_creator_id) REFERENCES USR(USR_id),
    FOREIGN KEY (SES_id) REFERENCES SES(SES_id)
);

-- Table : ABM (Abonnements)
CREATE TABLE ABM (
    ABM_id INT AUTO_INCREMENT PRIMARY KEY,
    ABM_dateDebut DATE NOT NULL,
    ABM_dateFin DATE NOT NULL,
    ABM_prix DECIMAL(15,2) NOT NULL,
    ABM_statut VARCHAR(50) NOT NULL,
    PAI_id INT,
    USR_id INT NOT NULL,
    FOREIGN KEY (PAI_id) REFERENCES PAI(PAI_id),
    FOREIGN KEY (USR_id) REFERENCES USR(USR_id)
);

-- Table : ACCES (Droits d'accès)
CREATE TABLE ACCES (
    USR_id INT NOT NULL,
    SES_id INT NOT NULL,
    PRIMARY KEY (USR_id, SES_id),
    FOREIGN KEY (USR_id) REFERENCES USR(USR_id),
    FOREIGN KEY (SES_id) REFERENCES SES(SES_id)
);

-- Table : STAT (Statistiques)
CREATE TABLE STAT (
    ENFA_id INT NOT NULL,
    SES_id INT NOT NULL,
    STAT_dernierAcces DATE,
    STAT_tempUtil TIME,
    PRIMARY KEY (ENFA_id, SES_id),
    FOREIGN KEY (ENFA_id) REFERENCES ENFA(ENFA_id),
    FOREIGN KEY (SES_id) REFERENCES SES(SES_id)
);