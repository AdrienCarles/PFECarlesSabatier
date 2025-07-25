-- MySQL dump 10.13  Distrib 8.4.2, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: pfe
-- ------------------------------------------------------
-- Server version	8.4.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `abm`
--

DROP TABLE IF EXISTS `abm`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `abm` (
  `ABM_id` int NOT NULL AUTO_INCREMENT,
  `ABM_dateDebut` datetime NOT NULL,
  `ABM_dateFin` datetime NOT NULL,
  `ABM_prix` decimal(15,2) NOT NULL,
  `ABM_statut` varchar(50) NOT NULL,
  `USR_id` int NOT NULL,
  `ENFA_id` int DEFAULT NULL,
  `ABM_stripe_subscription_id` varchar(255) DEFAULT NULL,
  `ABM_mode_paiement` enum('stripe','gratuit','test') NOT NULL DEFAULT 'stripe',
  PRIMARY KEY (`ABM_id`),
  UNIQUE KEY `ABM_stripe_subscription_id` (`ABM_stripe_subscription_id`),
  KEY `USR_id` (`USR_id`),
  KEY `idx_abm_enfa_id` (`ENFA_id`),
  CONSTRAINT `abm_ibfk_1` FOREIGN KEY (`USR_id`) REFERENCES `usr` (`USR_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `abm_ibfk_2` FOREIGN KEY (`ENFA_id`) REFERENCES `enfa` (`ENFA_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `acces`
--

DROP TABLE IF EXISTS `acces`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `acces` (
  `USR_id` int NOT NULL,
  `SES_id` int NOT NULL,
  `ENFA_id` int NOT NULL,
  PRIMARY KEY (`USR_id`,`SES_id`),
  KEY `a_c_c_e_s__s_e_s_id` (`SES_id`),
  KEY `acces_ibfk_3` (`ENFA_id`),
  CONSTRAINT `acces_ibfk_1` FOREIGN KEY (`USR_id`) REFERENCES `usr` (`USR_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `acces_ibfk_2` FOREIGN KEY (`SES_id`) REFERENCES `ses` (`SES_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `acces_ibfk_3` FOREIGN KEY (`ENFA_id`) REFERENCES `enfa` (`ENFA_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ani`
--

DROP TABLE IF EXISTS `ani`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ani` (
  `ANI_id` int NOT NULL AUTO_INCREMENT,
  `ANI_titre` varchar(50) NOT NULL,
  `ANI_description` varchar(255) DEFAULT NULL,
  `ANI_type` varchar(50) DEFAULT NULL,
  `ANI_urlAnimation` varchar(255) NOT NULL,
  `ANI_urlAnimationDessin` varchar(255) DEFAULT NULL,
  `ANI_urlAudio` varchar(255) DEFAULT NULL,
  `ANI_duree` decimal(15,2) DEFAULT NULL,
  `ANI_taille` int DEFAULT NULL,
  `ANI_valider` tinyint(1) DEFAULT '0',
  `ANI_date_creation` datetime NOT NULL,
  `ANI_dateValidation` datetime DEFAULT NULL,
  `USR_creator_id` int NOT NULL,
  `SES_id` int NOT NULL,
  PRIMARY KEY (`ANI_id`),
  KEY `USR_creator_id` (`USR_creator_id`),
  KEY `SES_id` (`SES_id`),
  CONSTRAINT `ani_ibfk_1` FOREIGN KEY (`USR_creator_id`) REFERENCES `usr` (`USR_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `ani_ibfk_2` FOREIGN KEY (`SES_id`) REFERENCES `ses` (`SES_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `enfa`
--

DROP TABLE IF EXISTS `enfa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `enfa` (
  `ENFA_id` int NOT NULL AUTO_INCREMENT,
  `ENFA_prenom` varchar(50) NOT NULL,
  `ENFA_nom` varchar(50) NOT NULL,
  `ENFA_dateNaissance` datetime NOT NULL,
  `ENFA_niveauAudition` varchar(50) DEFAULT NULL,
  `ENFA_dateCreation` datetime NOT NULL,
  `ENFA_dateDebutSuivi` datetime DEFAULT NULL,
  `ENFA_dateFinSuivi` datetime DEFAULT NULL,
  `ENFA_notesSuivi` varchar(255) DEFAULT NULL,
  `USR_parent_id` int NOT NULL,
  `USR_orthophoniste_id` int NOT NULL,
  PRIMARY KEY (`ENFA_id`),
  KEY `USR_parent_id` (`USR_parent_id`),
  KEY `USR_orthophoniste_id` (`USR_orthophoniste_id`),
  CONSTRAINT `enfa_ibfk_1` FOREIGN KEY (`USR_parent_id`) REFERENCES `usr` (`USR_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `enfa_ibfk_2` FOREIGN KEY (`USR_orthophoniste_id`) REFERENCES `usr` (`USR_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `login_attempts`
--

DROP TABLE IF EXISTS `login_attempts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `login_attempts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `USR_id` int NOT NULL,
  `attempt_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `success` tinyint(1) NOT NULL DEFAULT '0',
  `ip_address` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `login_attempts__u_s_r_id` (`USR_id`),
  CONSTRAINT `login_attempts_ibfk_1` FOREIGN KEY (`USR_id`) REFERENCES `usr` (`USR_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `orthophonisteconfig`
--

DROP TABLE IF EXISTS `orthophonisteconfig`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orthophonisteconfig` (
  `CONFIG_id` int NOT NULL AUTO_INCREMENT,
  `USR_orthophoniste_id` int NOT NULL,
  `CONFIG_paiement_obligatoire` tinyint(1) NOT NULL DEFAULT '0',
  `CONFIG_prix_par_enfant` decimal(10,2) NOT NULL DEFAULT '9.99',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`CONFIG_id`),
  UNIQUE KEY `USR_orthophoniste_id` (`USR_orthophoniste_id`),
  KEY `idx_config_orthophoniste_id` (`USR_orthophoniste_id`),
  CONSTRAINT `orthophonisteconfig_ibfk_1` FOREIGN KEY (`USR_orthophoniste_id`) REFERENCES `usr` (`USR_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `refresh_tokens`
--

DROP TABLE IF EXISTS `refresh_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `refresh_tokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `USR_id` int NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `used` tinyint(1) NOT NULL DEFAULT '0',
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `refresh_tokens__u_s_r_id` (`USR_id`),
  KEY `refresh_tokens_user_id` (`user_id`),
  CONSTRAINT `refresh_tokens_ibfk_1` FOREIGN KEY (`USR_id`) REFERENCES `usr` (`USR_id`) ON UPDATE CASCADE,
  CONSTRAINT `refresh_tokens_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `usr` (`USR_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sequelizemeta`
--

DROP TABLE IF EXISTS `sequelizemeta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sequelizemeta` (
  `name` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ses`
--

DROP TABLE IF EXISTS `ses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ses` (
  `SES_id` int NOT NULL AUTO_INCREMENT,
  `SES_titre` varchar(50) NOT NULL,
  `SES_theme` varchar(50) DEFAULT NULL,
  `SES_description` varchar(255) DEFAULT NULL,
  `SES_statut` varchar(50) NOT NULL,
  `SES_dateCreation` date DEFAULT NULL,
  `SES_icone` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`SES_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `stat`
--

DROP TABLE IF EXISTS `stat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stat` (
  `ENFA_id` int NOT NULL,
  `SES_id` int NOT NULL,
  `STAT_dernierAcces` datetime DEFAULT NULL,
  `STAT_tempUtil` time DEFAULT NULL,
  PRIMARY KEY (`ENFA_id`,`SES_id`),
  KEY `s_t_a_t__s_e_s_id` (`SES_id`),
  CONSTRAINT `stat_ibfk_1` FOREIGN KEY (`ENFA_id`) REFERENCES `enfa` (`ENFA_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `stat_ibfk_2` FOREIGN KEY (`SES_id`) REFERENCES `ses` (`SES_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `usr`
--

DROP TABLE IF EXISTS `usr`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usr` (
  `USR_id` int NOT NULL AUTO_INCREMENT,
  `USR_email` varchar(50) NOT NULL,
  `USR_pass` varchar(255) NOT NULL,
  `USR_prenom` varchar(50) NOT NULL,
  `USR_nom` varchar(50) NOT NULL,
  `USR_role` varchar(50) NOT NULL,
  `USR_telephone` varchar(15) DEFAULT NULL,
  `USR_dateCreation` datetime NOT NULL,
  `USR_derniereConnexion` datetime DEFAULT NULL,
  `USR_statut` varchar(50) NOT NULL,
  `USR_activationToken` varchar(255) DEFAULT NULL,
  `USR_tokenExpiry` datetime DEFAULT NULL,
  `USR_stripe_customer_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`USR_id`),
  UNIQUE KEY `USR_email` (`USR_email`),
  UNIQUE KEY `USR_stripe_customer_id` (`USR_stripe_customer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping routines for database 'pfe'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-25 16:07:53
