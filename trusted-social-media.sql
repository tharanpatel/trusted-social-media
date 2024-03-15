CREATE DATABASE  IF NOT EXISTS `tharansocial` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `tharansocial`;
-- MySQL dump 10.13  Distrib 8.0.33, for macos13 (arm64)
--
-- Host: localhost    Database: tharansocial
-- ------------------------------------------------------
-- Server version	8.0.33

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `desc` varchar(200) NOT NULL,
  `userId` int NOT NULL,
  `postId` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `commentUserId_idx` (`userId`),
  KEY `postId_idx` (`postId`),
  CONSTRAINT `commentUserId` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `postId` FOREIGN KEY (`postId`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=83 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (82,'nikesh stinks of shit',22,256);
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `likes`
--

DROP TABLE IF EXISTS `likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `likes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `postId` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `likeUserId_idx` (`userId`),
  KEY `likePostId_idx` (`postId`),
  CONSTRAINT `likePostId` FOREIGN KEY (`postId`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `likeUserId` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=330 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `likes`
--

LOCK TABLES `likes` WRITE;
/*!40000 ALTER TABLE `likes` DISABLE KEYS */;
INSERT INTO `likes` VALUES (329,22,256);
/*!40000 ALTER TABLE `likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `negativeTrusts`
--

DROP TABLE IF EXISTS `negativeTrusts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `negativeTrusts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `postId` int NOT NULL,
  `userId` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `negativeTrustPostId_idx` (`postId`),
  KEY `negativeTrustUserId_idx` (`userId`),
  CONSTRAINT `negativeTrustPostId` FOREIGN KEY (`postId`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `negativeTrustUserId` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=521 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `negativeTrusts`
--

LOCK TABLES `negativeTrusts` WRITE;
/*!40000 ALTER TABLE `negativeTrusts` DISABLE KEYS */;
INSERT INTO `negativeTrusts` VALUES (518,243,2),(520,256,22);
/*!40000 ALTER TABLE `negativeTrusts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `positiveTrusts`
--

DROP TABLE IF EXISTS `positiveTrusts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `positiveTrusts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `postId` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `positiveTrustPostId_idx` (`postId`),
  KEY `positiveTrustUserId_idx` (`userId`),
  CONSTRAINT `positiveTrustPostId` FOREIGN KEY (`postId`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `positiveTrustUserId` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=922 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `positiveTrusts`
--

LOCK TABLES `positiveTrusts` WRITE;
/*!40000 ALTER TABLE `positiveTrusts` DISABLE KEYS */;
INSERT INTO `positiveTrusts` VALUES (918,1,243),(919,1,240);
/*!40000 ALTER TABLE `positiveTrusts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `posts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `desc` varchar(200) DEFAULT NULL,
  `img` varchar(200) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `userId` int NOT NULL,
  `postTrust` int DEFAULT NULL,
  `trustVoteCount` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `userId_idx` (`userId`),
  CONSTRAINT `userId` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=258 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES (231,'Hello this is test two\'s post!','','2023-08-10 22:03:34',2,NULL,0),(238,'meep','','2023-08-13 13:54:10',3,NULL,NULL),(239,'Another test 2 post!','','2023-08-13 14:38:12',2,NULL,0),(240,'This is test 6 post.','','2023-08-14 11:15:16',6,100,1),(242,'Post','','2023-08-15 23:04:45',3,NULL,NULL),(243,'Look at this view!','1692746705822IMG_5229.jpeg','2023-08-23 00:25:05',6,50,2),(246,'This is test 14\'s post','','2023-08-23 12:30:37',14,NULL,NULL),(248,'Hello this is a new post!','','2023-08-23 12:52:06',15,0,1),(251,'This is test 18s text post.','','2023-08-23 13:07:58',18,NULL,0),(252,'Look at this!','1692792492466pexels-sapphire-alsh-2121907.jpg','2023-08-23 13:08:12',18,0,1),(256,'POOOO','',NULL,22,0,NULL),(257,'woah',NULL,NULL,22,NULL,NULL);
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `relationships`
--

DROP TABLE IF EXISTS `relationships`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `relationships` (
  `id` int NOT NULL AUTO_INCREMENT,
  `followerUserId` int NOT NULL,
  `followedUserId` int NOT NULL,
  `trustRating` int DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `followerUser_idx` (`followerUserId`),
  KEY `followedUser_idx` (`followedUserId`),
  CONSTRAINT `followedUser` FOREIGN KEY (`followedUserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `followerUser` FOREIGN KEY (`followerUserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=221 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `relationships`
--

LOCK TABLES `relationships` WRITE;
/*!40000 ALTER TABLE `relationships` DISABLE KEYS */;
INSERT INTO `relationships` VALUES (204,1,4,65),(205,1,6,0),(206,2,3,35),(208,3,2,35),(209,4,5,45),(210,5,4,65),(211,4,1,65),(212,6,8,70),(213,8,6,45),(214,6,1,0),(215,1,14,55),(217,1,21,80),(218,2,21,40),(219,1,2,0),(220,22,23,0);
/*!40000 ALTER TABLE `relationships` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(45) NOT NULL,
  `name` varchar(200) NOT NULL,
  `password` varchar(200) NOT NULL,
  `profilePic` varchar(200) DEFAULT 'defaultProfilePic.avif',
  `city` varchar(45) DEFAULT NULL,
  `postTrustSum` int DEFAULT '0',
  `relationshipTrustSum` int DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'test1','testnew2','$2a$10$JuwmeNGQ4EpQp0lFP9I7d.F/UN2ftp4K1M57ite4dF/tFu0vEFQWG','1692793715188pexels-sapphire-alsh-2121907.jpg','United Kingdom',0,33),(2,'test2','test2','$2a$10$dkP00Rfr2h04arvIZaMapulU1GjqXYIs1QibCvmjxD4n423UjA9Iy','defaultProfilePic.avif',NULL,0,18),(3,'test3','test3','$2a$10$TmU.jBN9tKb0fjJfAMJFCusUXaMwxNZr6q1JjIVPAT6QTCJqg3y7W','defaultProfilePic.avif','Newcastle',0,35),(4,'test4','test4','$2a$10$vDV8M//I9ZurduYTXDSP6eefYborfUY4wMYLt/JVbvcN5wIgW8L8K','defaultProfilePic.avif','Manchester',0,65),(5,'test5','test5','$2a$10$ZUBQDjCL9ViRQz5ObPMxme2IW9H.HHvDaDWURbQasLfrruosiZ.H.','defaultProfilePic.avif',NULL,100,45),(6,'test6','test6','$2a$10$wmLL.H84JpcySZVL3Eo/ieH/4BlK2/9UYQPYVukF/rKUQEYdS5bk6','defaultProfilePic.avif',NULL,67,23),(8,'test8','test8','$2a$10$SKeRMEozAc2d/5CkN9ICkuWpkk8iFASdMbncFZRfQDI5wx/ng.zBS','defaultProfilePic.avif',NULL,0,70),(9,'test9','test9','$2a$10$tQSQ7/CrW2GnCk2gV0IYNOk8D9ZXw28YMx9MoWvAjzOd4Yho5izae','defaultProfilePic.avif',NULL,0,0),(10,'test10','test10','$2a$10$uns3rCJ/Ro4i1QClfKrswOqiCCUiRhef5qOVX6ROKD3qF1OZ6prmu','defaultProfilePic.avif',NULL,0,0),(11,'test11','test11','$2a$10$Kk5mLw9HLID6kFRO2nCyCuVHXzfdvHpLKJh.9kFB8GbvkFC67K0Nm','defaultProfilePic.avif',NULL,0,30),(12,'test12','test12','$2a$10$PRXxZWypKFkIL1w1Fn57I..cJwXFq.GEUyggNOEV4bOdYhSwiQDMS','defaultProfilePic.avif',NULL,0,0),(13,'test13','test13NoFriendRating','$2a$10$UxCj3Wu.1QGewcU0rKk//.R1zXM3jr.Xytnloub66uAiq8dD9EWjW','defaultProfilePic.avif',NULL,0,0),(14,'test14','test14','$2a$10$Spry8Idl48iLl2T.p7IZ4e6.CasQbbFvRaWqqHClDF1VF22353GlG','defaultProfilePic.avif',NULL,0,55),(15,'test15','test15','$2a$10$AKVeA0lEtfHCSEPDMD8RG.89LMMGq71ep0jgeJ7XzRQIjCxty5EOG','defaultProfilePic.avif',NULL,0,0),(16,'test16','test16','$2a$10$zQnWps7g74CgUYl3r6rJuu88HSTWCgG.XqHRZGYOi5VOV4v1MX6sq','defaultProfilePic.avif',NULL,0,0),(17,'test17','test17','$2a$10$LoZihPEnmLuuCROJXuCkAOXMq2t6jDKbxgv7jelwUsq1k8aXEuk5C','defaultProfilePic.avif',NULL,0,0),(18,'test18','test18','$2a$10$CQ.VsNdZy/Ce67OfacmyYuuA0drJoYDFTxLrILpAFdrpWCIF2pXPm','defaultProfilePic.avif',NULL,0,0),(19,'test19','test19','$2a$10$JcVkuUYZpsyBHlBS5I.8nef76gyV/GIU51UnbDo8.G.OL5w.OwUra','defaultProfilePic.avif',NULL,0,0),(20,'test20','test20','$2a$10$dVDqJAmBtopzG.TDxc7ynOlHLKM0i.c63vDdQ5Oehhp3HvEXI9wxa','defaultProfilePic.avif',NULL,0,0),(21,'test21','test21','$2a$10$wFD.aydDJ8ydN908gr7ibOK73mXmA/P8PkjFMDVe3yUK4is9GrDHG','defaultProfilePic.avif',NULL,0,60),(22,'ninuman','pooboy','$2a$10$mTfJIfxaf5UliSJFK5RCnOiGRf7g7wtI7OZERgKaQwnuaw2OUKx0G','defaultProfilePic.avif',NULL,0,0),(23,'tharan','tharan','$2a$10$l636zswfAtkktivSnU0Uju4Z/JsgV9P8TXa6999xvJ/hKJiMzgz6e','defaultProfilePic.avif',NULL,0,0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-03-13 21:13:11
