-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Hôte : db
-- Généré le : mer. 04 mars 2026 à 08:20
-- Version du serveur : 9.6.0
-- Version de PHP : 8.3.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `faery_story`
--

-- --------------------------------------------------------

--
-- Structure de la table `adventure`
--

CREATE TABLE `adventure` (
  `id` int UNSIGNED NOT NULL,
  `title` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `slug` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_by_user_id` int UNSIGNED NOT NULL,
  `starting_paragraph_id` int UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `adventure`
--

INSERT INTO `adventure` (`id`, `title`, `description`, `slug`, `created_by_user_id`, `starting_paragraph_id`, `created_at`, `updated_at`) VALUES
(1, 'Feary', 'Un livre dont Vous êtes le héros.', 'feary', 1, NULL, '2026-03-03 09:25:00', '2026-03-03 09:25:00');

-- --------------------------------------------------------

--
-- Structure de la table `character`
--

CREATE TABLE `character` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `character_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `hostile` tinyint(1) NOT NULL DEFAULT '0',
  `dexterity` int DEFAULT NULL,
  `endurance` int DEFAULT NULL,
  `is_group` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `character`
--

INSERT INTO `character` (`id`, `name`, `character_type`, `description`, `hostile`, `dexterity`, `endurance`, `is_group`) VALUES
(1, 'Troll', 'enemy', NULL, 1, 10, 10, 0),
(2, 'Plantes Étrangleuses', 'enemy', NULL, 1, 6, 10, 0),
(3, 'Centaure', 'enemy', NULL, 1, 8, 10, 0),
(4, 'Sanglier', 'enemy', NULL, 1, 7, 10, 0),
(5, 'Spriggan', 'enemy', NULL, 1, 8, 6, 0),
(6, 'Premier Farfadet', 'enemy', NULL, 1, 3, 6, 0),
(7, 'Deuxième Farfadet', 'enemy', NULL, 1, 4, 5, 0),
(8, 'Troisième Farfadet', 'enemy', NULL, 1, 5, 5, 0),
(9, 'Quatrième Farfadet', 'enemy', NULL, 1, 4, 6, 0),
(10, 'Araignée', 'enemy', NULL, 1, 7, 1, 0),
(11, 'Monstre Aquatique', 'enemy', NULL, 1, 6, 6, 0),
(12, 'Ours', 'enemy', NULL, 1, 10, 14, 0),
(13, 'Loup', 'enemy', NULL, 0, 11, 12, 0),
(14, 'Fée Ténébreuse', 'enemy', NULL, 1, 11, 11, 0);

-- --------------------------------------------------------

--
-- Structure de la table `choice`
--

CREATE TABLE `choice` (
  `id` int UNSIGNED NOT NULL,
  `paragraph_id` int UNSIGNED NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'normal',
  `target_paragraph_id` int UNSIGNED DEFAULT NULL,
  `continue_to_encounter` tinyint(1) NOT NULL DEFAULT '0',
  `is_repeated` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `choice`
--

INSERT INTO `choice` (`id`, `paragraph_id`, `content`, `type`, `target_paragraph_id`, `continue_to_encounter`, `is_repeated`) VALUES
(1, 1, 'Suivre le sentier', 'normal', 43, 0, 0),
(2, 1, 'Partir dans une autre direction', 'normal', 77, 0, 0),
(3, 2, 'Aller vers la première direction', 'normal', 11, 0, 0),
(4, 2, 'Aller vers la deuxième direction', 'normal', 86, 0, 0),
(5, 2, 'Aller vers la troisième direction', 'normal', 44, 0, 0),
(6, 4, 'Accepter l’invitation du satyre', 'normal', 8, 0, 0),
(7, 4, 'Refuser et poursuivre votre chemin', 'normal', 17, 0, 0),
(8, 4, 'Menacer le satyre', 'normal', 26, 0, 0),
(9, 5, 'Monter le cheval', 'normal', 56, 0, 0),
(10, 5, 'Contourner et poursuivre votre chemin', 'normal', 10, 0, 0),
(11, 6, 'Suivre le martèlement', 'normal', 20, 0, 0),
(12, 6, 'Prendre une autre direction', 'normal', 87, 0, 0),
(13, 7, 'Prendre le sentier vers la gauche', 'normal', 2, 0, 0),
(14, 7, 'Prendre le sentier vers la droite', 'normal', 97, 0, 0),
(15, 8, 'Reprendre votre route', 'normal', 99, 0, 0),
(16, 9, 'Continuer votre route', 'normal', 2, 0, 0),
(17, 10, 'Traverser le ruisseau', 'normal', 4, 0, 0),
(18, 10, 'Tenter de pêcher à mains nues', 'normal', 15, 0, 0),
(19, 11, 'Aller vers la première direction', 'normal', 97, 0, 0),
(20, 11, 'Aller vers la deuxième direction', 'normal', 44, 0, 0),
(21, 12, 'Manger un champignon', 'normal', 28, 0, 0),
(22, 12, 'Refuser poliment', 'normal', 40, 0, 0),
(23, 14, 'Entrer dans le cercle de champignons', 'normal', 23, 0, 0),
(24, 14, 'Contourner la clairière', 'normal', 11, 0, 0),
(25, 16, 'Rejoindre les fées', 'normal', 12, 0, 0),
(26, 16, 'Contourner la clairière', 'normal', 14, 0, 0),
(27, 17, 'Reprendre votre route', 'normal', 99, 0, 0),
(28, 18, 'Poursuivre votre chemin', 'normal', 64, 0, 0),
(29, 19, 'Reprendre votre route', 'normal', 3, 0, 0),
(30, 20, 'Parler au petit homme', 'normal', 35, 0, 0),
(31, 20, 'Déposer vos bottes', 'normal', 61, 0, 0),
(32, 20, 'Poursuivre votre chemin', 'normal', 2, 0, 0),
(33, 21, 'S’approcher du trône', 'normal', 63, 0, 0),
(34, 26, 'Reprendre votre route', 'normal', 99, 0, 0),
(35, 27, 'Prendre la première direction', 'normal', 55, 0, 0),
(36, 27, 'Prendre la seconde direction', 'normal', 99, 0, 0),
(37, 28, 'Reprendre votre route', 'normal', 51, 0, 0),
(38, 29, 'Acheter certains baumes', 'normal', 36, 0, 0),
(39, 29, 'Tenter de voler la couronne', 'normal', 98, 0, 0),
(40, 29, 'Prendre congé et partir', 'normal', 64, 0, 0),
(41, 30, 'Reprendre votre route', 'normal', 10, 0, 0),
(42, 31, 'Perdre connaissance', 'normal', 78, 0, 0),
(43, 32, 'Boire le liquide visqueux', 'normal', 37, 0, 0),
(44, 32, 'Boire le liquide clair', 'normal', 42, 0, 0),
(45, 32, 'Quitter la hutte', 'normal', 99, 0, 0),
(46, 34, 'Reprendre votre route', 'normal', 41, 0, 0),
(47, 35, 'Attaquer le petit homme', 'normal', 48, 0, 0),
(48, 35, 'Partir', 'normal', 2, 0, 0),
(49, 36, 'Prendre congé', 'normal', 64, 0, 0),
(50, 36, 'Tenter de voler la couronne', 'normal', 98, 0, 0),
(51, 38, 'Entrer dans la hutte', 'normal', 32, 0, 0),
(52, 38, 'Poursuivre votre chemin', 'normal', 99, 0, 0),
(53, 39, 'Prendre la direction difficile', 'normal', 14, 0, 0),
(54, 39, 'Prendre la direction plus aisée', 'normal', 5, 0, 0),
(55, 40, 'Reprendre votre route', 'normal', 51, 0, 0),
(56, 41, 'Aller vers la clairière', 'normal', 95, 0, 0),
(57, 41, 'Suivre les lumières', 'normal', 64, 0, 0),
(58, 44, 'Payer une pièce d’or pour passer', 'normal', 3, 0, 0),
(59, 44, 'Attaquer le troll', 'normal', 13, 0, 0),
(60, 44, 'Traverser à la nage', 'normal', 85, 0, 0),
(61, 44, 'Remonter la rivière', 'normal', 93, 0, 0),
(62, 45, 'Prendre le sentier vers la gauche', 'normal', 2, 0, 0),
(63, 45, 'Prendre le sentier vers la droite', 'normal', 97, 0, 0),
(64, 46, 'Suivre le nouveau sentier', 'normal', 57, 0, 0),
(65, 48, 'Reprendre votre route', 'normal', 2, 0, 0),
(66, 50, 'Aller vers la première direction', 'normal', 4, 0, 0),
(67, 50, 'Aller vers la deuxième direction', 'normal', 27, 0, 0),
(68, 50, 'Aller vers la troisième direction', 'normal', 55, 0, 0),
(69, 51, 'Tenter de dégager la fée', 'normal', 60, 0, 0),
(70, 51, 'Attaquer l’araignée', 'normal', 47, 0, 0),
(71, 51, 'Partir et laisser la fée', 'normal', 84, 0, 0),
(72, 52, 'Poursuivre votre route', 'normal', 44, 0, 0),
(73, 55, 'Reprendre votre route', 'normal', 38, 0, 0),
(74, 57, 'Aller vers la clairière', 'normal', 95, 0, 0),
(75, 57, 'Suivre les lumières', 'normal', 64, 0, 0),
(76, 59, 'Proposer votre aide à Niamh', 'normal', 52, 0, 0),
(77, 59, 'Refuser poliment', 'normal', 92, 0, 0),
(78, 61, 'Reprendre votre route', 'normal', 2, 0, 0),
(79, 62, 'Reprendre votre route', 'normal', 44, 0, 0),
(80, 64, 'S’engager dans l’allée lumineuse', 'normal', 90, 0, 0),
(81, 64, 'Chercher un autre chemin', 'normal', 96, 0, 0),
(82, 66, 'Reprendre votre route', 'normal', 76, 0, 0),
(83, 67, 'Choisir le Symbole de Concentration', 'normal', 94, 0, 0),
(84, 67, 'Choisir le Symbole de Vitalité', 'normal', 94, 0, 0),
(85, 68, 'Suivre l’ours', 'normal', 71, 0, 0),
(86, 68, 'Partir dans une autre direction', 'normal', 44, 0, 0),
(87, 70, 'Attaquer la Dryade', 'normal', 53, 0, 0),
(88, 70, 'Essayer de lui parler', 'normal', 80, 0, 0),
(89, 70, 'Partir vers le premier sentier', 'normal', 2, 0, 0),
(90, 70, 'Partir vers le second sentier', 'normal', 97, 0, 0),
(91, 71, 'Reprendre votre route', 'normal', 44, 0, 0),
(92, 72, 'Attendre la décision de la Reine', 'normal', 67, 0, 0),
(93, 75, 'Quitter la clairière', 'normal', 49, 0, 0),
(94, 76, 'Reprendre votre route', 'normal', 3, 0, 0),
(95, 77, 'Se rapprocher des rires', 'normal', 24, 0, 0),
(96, 77, 'Prendre une autre direction', 'normal', 16, 0, 0),
(97, 79, 'Demander une couronne magique', 'normal', 29, 0, 0),
(98, 79, 'Acheter certains baumes', 'normal', 36, 0, 0),
(99, 79, 'Tenter de voler la couronne', 'normal', 98, 0, 0),
(100, 79, 'Prendre congé et partir', 'normal', 64, 0, 0),
(101, 81, 'Affronter le guerrier choisi par la Reine', 'normal', 25, 0, 0),
(102, 81, 'Tenter de charmer la Reine par la musique', 'normal', 69, 0, 0),
(103, 82, 'Suivre l’ours', 'normal', 71, 0, 0),
(104, 82, 'Partir dans une autre direction', 'normal', 44, 0, 0),
(105, 84, 'Continuer votre route', 'normal', 5, 0, 0),
(106, 86, 'Prendre la première direction', 'normal', 97, 0, 0),
(107, 86, 'Prendre la seconde direction', 'normal', 44, 0, 0),
(108, 87, 'Grimper à l’arbre', 'normal', 70, 0, 0),
(109, 87, 'Prendre le premier sentier', 'normal', 2, 0, 0),
(110, 87, 'Prendre le second sentier', 'normal', 97, 0, 0),
(111, 90, 'Continuer dans l’allée', 'normal', 21, 0, 0),
(112, 91, 'Reprendre votre route', 'normal', 14, 0, 0),
(113, 92, 'Reprendre votre route', 'normal', 44, 0, 0),
(114, 93, 'Traverser le ruisseau', 'normal', 4, 0, 0),
(115, 93, 'Tenter de pêcher à mains nues', 'normal', 15, 0, 0),
(116, 95, 'Engager la conversation avec la jeune femme', 'normal', 79, 0, 0),
(117, 95, 'Contourner la clairière', 'normal', 64, 0, 0),
(118, 96, 'S’engager dans l’allée', 'normal', 90, 0, 0),
(119, 97, 'Attaquer le loup', 'normal', 82, 0, 0),
(120, 97, 'Attaquer l’ours', 'normal', 89, 0, 0),
(121, 97, 'Contourner le combat', 'normal', 44, 0, 0),
(122, 99, 'Prendre la première direction', 'normal', 22, 0, 0),
(123, 99, 'Prendre la deuxième direction', 'normal', 34, 0, 0),
(124, 99, 'Prendre la troisième direction', 'normal', 95, 0, 0),
(125, 0, 'Continuer', 'normal', 1, 0, 0);

-- --------------------------------------------------------

--
-- Structure de la table `choice_condition`
--

CREATE TABLE `choice_condition` (
  `id` int UNSIGNED NOT NULL,
  `choice_id` int UNSIGNED NOT NULL,
  `condition_id` int UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `condition`
--

CREATE TABLE `condition` (
  `id` int UNSIGNED NOT NULL,
  `type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `attribute` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `operator` varchar(5) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `value` int DEFAULT NULL,
  `item_id` int UNSIGNED DEFAULT NULL,
  `flag_id` int UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `condition`
--

INSERT INTO `condition` (`id`, `type`, `attribute`, `operator`, `value`, `item_id`, `flag_id`) VALUES
(1, 'has_item', NULL, '==', NULL, 5, NULL),
(2, 'has_item', NULL, '==', NULL, 18, NULL),
(3, 'has_item', NULL, '==', NULL, 8, NULL),
(4, 'has_item', NULL, '==', NULL, 7, NULL),
(5, 'has_item', NULL, '==', NULL, 17, NULL),
(6, 'has_item', NULL, '==', NULL, 3, NULL),
(7, 'has_item', NULL, '==', NULL, 4, NULL),
(8, 'has_item', NULL, '==', NULL, 14, NULL),
(9, 'has_item', NULL, '==', NULL, 1, NULL),
(10, 'has_item', NULL, '==', NULL, 2, NULL),
(11, 'has_flag', NULL, '==', NULL, NULL, 1);

-- --------------------------------------------------------

--
-- Structure de la table `dice_test`
--

CREATE TABLE `dice_test` (
  `id` int UNSIGNED NOT NULL,
  `paragraph_id` int UNSIGNED NOT NULL,
  `attribute` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `target` int DEFAULT NULL,
  `success_paragraph_id` int UNSIGNED NOT NULL,
  `failure_paragraph_id` int UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `dice_test`
--

INSERT INTO `dice_test` (`id`, `paragraph_id`, `attribute`, `target`, `success_paragraph_id`, `failure_paragraph_id`) VALUES
(1, 3, 'drunkness', NULL, 38, 50),
(2, 15, 'luck', NULL, 19, 3),
(3, 23, 'drunkness', NULL, 9, 30),
(4, 47, 'dexterity', NULL, 91, 84),
(5, 53, 'dexterity', NULL, 7, 45),
(6, 54, 'luck', NULL, 57, 57),
(7, 56, 'luck', NULL, 66, 74),
(8, 69, 'drunkness', NULL, 31, 65),
(9, 70, 'luck', NULL, 2, 97),
(10, 80, 'random', NULL, 2, 97),
(11, 98, 'luck', NULL, 18, 83);

-- --------------------------------------------------------

--
-- Structure de la table `effect`
--

CREATE TABLE `effect` (
  `id` int UNSIGNED NOT NULL,
  `source_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `source_type_id` int UNSIGNED NOT NULL,
  `attribute` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `operation` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `value` int DEFAULT NULL,
  `duration` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `condition_id` int UNSIGNED DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `effect`
--

INSERT INTO `effect` (`id`, `source_type`, `source_type_id`, `attribute`, `operation`, `value`, `duration`, `condition_id`, `description`) VALUES
(1, 'paragraph', 17, 'dexterity', 'subtract', 1, NULL, NULL, NULL),
(5, 'paragraph', 62, 'dexterity', 'add', 1, NULL, NULL, NULL),
(6, 'paragraph', 67, 'dexterity', 'set_to_base', NULL, NULL, NULL, NULL),
(7, 'paragraph', 67, 'drunkness', 'set_to', 0, NULL, NULL, NULL),
(8, 'paragraph', 67, 'endurance', 'set_to_base', NULL, NULL, NULL, NULL),
(9, 'paragraph', 91, 'luck', 'set_to', 13, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `encounter`
--

CREATE TABLE `encounter` (
  `id` int UNSIGNED NOT NULL,
  `paragraph_id` int UNSIGNED NOT NULL,
  `character_id` int UNSIGNED NOT NULL,
  `encounter_order` int NOT NULL DEFAULT '1',
  `combat_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'standard',
  `paragraph_victory` int UNSIGNED DEFAULT NULL,
  `paragraph_flee` int UNSIGNED DEFAULT NULL,
  `flee_damage` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `encounter`
--

INSERT INTO `encounter` (`id`, `paragraph_id`, `character_id`, `encounter_order`, `combat_type`, `paragraph_victory`, `paragraph_flee`, `flee_damage`) VALUES
(1, 13, 1, 1, 'standard', NULL, NULL, NULL),
(2, 24, 2, 1, 'standard', NULL, NULL, NULL),
(3, 34, 3, 1, 'standard', NULL, NULL, NULL),
(4, 43, 4, 1, 'standard', NULL, NULL, NULL),
(5, 48, 5, 1, 'standard', NULL, NULL, NULL),
(6, 55, 6, 1, 'standard', NULL, NULL, NULL),
(7, 55, 7, 2, 'standard', NULL, NULL, NULL),
(8, 55, 8, 3, 'standard', NULL, NULL, NULL),
(9, 55, 9, 4, 'standard', NULL, NULL, NULL),
(10, 60, 10, 1, 'standard', NULL, NULL, NULL),
(11, 85, 11, 1, 'standard', NULL, NULL, NULL),
(12, 89, 12, 1, 'standard', NULL, NULL, NULL),
(13, 89, 13, 2, 'standard', NULL, NULL, NULL),
(14, 94, 14, 1, 'standard', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `encounter_rule`
--

CREATE TABLE `encounter_rule` (
  `id` int UNSIGNED NOT NULL,
  `encounter_id` int UNSIGNED NOT NULL,
  `rule_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rule_value` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `item_id` int UNSIGNED DEFAULT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `flag`
--

CREATE TABLE `flag` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `flag`
--

INSERT INTO `flag` (`id`, `name`, `description`) VALUES
(1, 'bracelet_niamh', 'Bracelet donné par Niamh');

-- --------------------------------------------------------

--
-- Structure de la table `game_save`
--

CREATE TABLE `game_save` (
  `id` int UNSIGNED NOT NULL,
  `user_id` int UNSIGNED NOT NULL,
  `adventure_id` int UNSIGNED NOT NULL,
  `current_paragraph_id` int UNSIGNED NOT NULL,
  `slot_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'autosave',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `hero`
--

CREATE TABLE `hero` (
  `id` int UNSIGNED NOT NULL,
  `save_id` int UNSIGNED NOT NULL,
  `dexterity` int NOT NULL,
  `initial_dexterity` int NOT NULL,
  `endurance` int NOT NULL,
  `initial_endurance` int NOT NULL,
  `luck` int NOT NULL,
  `initial_luck` int NOT NULL,
  `drunkness` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `hero_flag`
--

CREATE TABLE `hero_flag` (
  `id` int UNSIGNED NOT NULL,
  `save_id` int UNSIGNED NOT NULL,
  `flag_id` int UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `hero_inventory`
--

CREATE TABLE `hero_inventory` (
  `id` int UNSIGNED NOT NULL,
  `save_id` int UNSIGNED NOT NULL,
  `item_id` int UNSIGNED NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `is_equipped` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `hero_state`
--

CREATE TABLE `hero_state` (
  `id` int UNSIGNED NOT NULL,
  `save_id` int UNSIGNED NOT NULL,
  `state_id` int UNSIGNED DEFAULT NULL,
  `source_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `source_type_id` int UNSIGNED DEFAULT NULL,
  `remaining_duration` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `item`
--

CREATE TABLE `item` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `usable` tinyint(1) NOT NULL DEFAULT '0',
  `description` text COLLATE utf8mb4_unicode_ci,
  `can_use_in_combat` tinyint(1) NOT NULL DEFAULT '0',
  `requires_no_surprise` tinyint(1) NOT NULL DEFAULT '0',
  `quantity_max` int NOT NULL DEFAULT '1',
  `target_paragraph_id` int UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `item`
--

INSERT INTO `item` (`id`, `name`, `type`, `usable`, `description`, `can_use_in_combat`, `requires_no_surprise`, `quantity_max`, `target_paragraph_id`) VALUES
(1, 'Baume d’Écorce', 'consumable', 1, 'Réduit les dégâts des 4 premiers assauts.', 0, 1, 1, NULL),
(2, 'Graine d’Enchevêtrement', 'consumable', 1, 'Diminue l’Habileté de l’ennemi de 2 au début d’un combat.', 0, 1, 1, NULL),
(3, 'Flûte', 'misc', 0, 'Flûte non magique.', 0, 0, 1, NULL),
(4, 'Flûte de Pan', 'misc', 0, 'Instrument offert par un satyre.', 0, 0, 1, NULL),
(5, 'Pierre percée', 'misc', 0, 'Permet de voir à travers les illusions.', 1, 0, 1, NULL),
(6, 'Repas', 'consumable', 1, 'Rend 4 points d’Endurance.', 0, 0, 10, NULL),
(7, 'Couronne Thym-Primevères', 'equipment', 0, 'Permet de voir l’invisible.', 1, 0, 1, NULL),
(8, 'Couronne Trèfles-Pâquerettes', 'equipment', 0, 'Protège de la magie des fées.', 1, 0, 1, NULL),
(9, 'Baume d’Habileté', 'consumable', 1, 'Restaure l’Habileté au total de départ.', 0, 0, 1, NULL),
(10, 'Baume d’Endurance', 'consumable', 1, 'Restaure l’Endurance au total de départ.', 0, 0, 1, NULL),
(11, 'Baume de Chance', 'consumable', 1, 'Restaure la Chance au total de départ.', 0, 0, 1, NULL),
(12, 'Décoction de racines', 'consumable', 1, 'Rend 8 Endurance, +1 Habileté, -3 Ivresse.', 0, 0, 1, NULL),
(13, 'Poison végétal', 'consumable', 1, 'Ajoute +3 dégâts par coup au prochain combat.', 0, 1, 1, NULL),
(14, 'Harpe', 'misc', 0, 'Instrument trouvé dans une hutte.', 0, 0, 1, NULL),
(15, 'Gourde de vin', 'consumable', 1, 'Augmente Ivresse de 4 et Endurance de 6.', 0, 0, 1, NULL),
(16, 'Miel', 'consumable', 1, 'Rend 4 Endurance et +1 Chance.', 0, 0, 5, NULL),
(17, 'Trèfles à quatre feuilles', 'misc', 0, 'Augmente la Chance à 13.', 0, 0, 1, NULL),
(18, 'Pièce d’or', 'currency', 0, 'Monnaie.', 0, 0, 1, NULL),
(19, 'Liquide visqueux', 'consumable', 1, 'Une jarre pleine d\'un liquide visqueux', 0, 1, 1, 37),
(20, 'Liquide claire', 'consumable', 1, 'Une jarre pleine d\'un liquide claire', 0, 1, 1, 42),
(21, 'Décoction de dégrisement', 'consumable', 1, 'Ramène votre total d\'Ivresse à zéro', 0, 0, 1, NULL),
(22, 'Bouquet de pâquerettes', 'misc', 0, 'Un bouquet de pâquerettes', 0, 0, 1, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `paragraph`
--

CREATE TABLE `paragraph` (
  `id` int UNSIGNED NOT NULL,
  `adventure_id` int UNSIGNED NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `paragraph`
--

INSERT INTO `paragraph` (`id`, `adventure_id`, `content`, `created_at`, `updated_at`) VALUES
(0, 1, 'Vous êtes un aventurier expérimenté, toujours à la recherche de nouveaux exploits. Nombreux sont les monstres que vous avez abattus, les ruines que vous avez explorées et les trésors que vous avez amassés, mais vous ne vous contentez jamais d’en rester là. Au début de cette histoire, vous venez une nouvelle fois de mener à bien une quête des plus périlleuses et vous êtes sur le chemin du retour, les poches pleines d’un or que vous êtes décidé à mettre à profit en menant la grande vie pendant quelques semaines. Votre itinéraire vous amène à traverser une forêt qui ne vous est pas familière. Alors que la nuit tombe et que vous êtes sur le point de dresser un bivouac, vous êtes soudain attiré par le bruit de réjouissances voisines. Tout prêt de la route que vous suiviez, une fête est en train de se dérouler en plein air, autour d’un grand feu crépitant. Dès qu’ils vous voient, les joyeux convives vous invitent aussitôt à les rejoindre et vous acceptez sans la moindre hésitation, trop heureux de pouvoir enfin vous délasser. Pendant les heures qui suivent, vous dansez, mangez et videz de nombreuses coupes de vin. Vos hôtes semblent inépuisables. Alors que vous commencez finalement à succomber à la fatigue, bercé par le bruit de la musique et les rires cristallins, il vous semble que leurs visages deviennent plus fins et leurs yeux plus brillants. Leurs cheveux soyeux ne dissimulent plus leurs oreilles pointues et vous entre-voyez çà et là de larges ailes colorées. Puis l’épuisement vous terrasse et vous sombrez dans le sommeil.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(1, 1, 'Vous vous réveillez subitement. Vous êtes seul, étendu au milieu d’une petite clairière bordée d’arbres. A en juger par la fraîcheur de l’air et la clarté qui commence à poindre par-dessus les feuillages, ce doit être le matin. Le souvenir de la soirée précédente vous revient en mémoire et vous réalisez avec un choc que vous avez été victime de fées ! Vous aviez entendu dire qu’elles habitaient certaines forêts reculées et qu’elles aimaient à se divertir aux dépens des voyageurs en les égarant. C’est visiblement ce qui vous est arrivé : tout autour de vous, les profondeurs insondables de la forêt s’offrent à vos yeux. La route que vous aviez suivie la veille n’est visible nulle part. Vous pressentez qu’il ne sera pas facile de la retrouver. Alors que vous vous levez, vous réalisez brusquement qu’une difficulté supplémentaire s’ajoute à votre situation : vous ressentez encore les effets des festivités de la veille ! Vous avez du mal à tenir sur vos jambes et votre vision est légèrement floue, brouillant les contours et les distances. Cette ébriété va nuire à vos prouesses guerrières tant qu’elle durera.  Alors que vous examinez votre sac à dos, vous avez la mauvaise surprise de découvrir que, si votre équipement d’aventurier est intact, vos provisions et vos pièces d’or ont disparu, ainsi que tous les trésors que vous aviez découverts lors de votre quête passée. En guise de compensation, on ne vous a laissé qu’une gourde pleine, contenant visiblement du vin. Un rapide tour de la clairière vous révèle l’existence d’un mince sentier qui s’engage en serpentant parmi les arbres.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(2, 1, 'Vous vous retrouvez à un endroit de la forêt où le feuillage est si épais qu’il vous semble presque être sous terre. L’atmosphère est feutrée et même le bruit de vos propres pas ne vous parvient qu’étouffé. Les arbres, particulièrement serrés, vous empêchent de voir clairement à plus de quelques pas. Plusieurs directions s’offrent à vous, mais vous n’avez aucun moyen de déterminer laquelle peut être la meilleure.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(3, 1, 'Vous êtes parvenu à l’intersection d’une multitude de sentiers qui serpentent parmi les arbres. Rien ne vient les différencier entre eux et vous ne disposez pas du moindre point de repère qui vous permettrait de vous orienter avec certitude. Vous vous mettez pourtant en route, faisant confiance au hasard.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(4, 1, 'Vous cheminez assez longuement sans interruption. La forêt est un peu moins dense dans la direction où vous avancez et vous voulez croire que c’est un bon présage. Un bruit de flûte parvient soudain à vos oreilles. Il semble que vous ne soyez pas seul dans les parages ! Avançant avec prudence, vous arrivez finalement à un large rocher éclairé par le soleil, sur lequel est assis un satyre, aisément reconnaissable à ses jambes de chèvre et aux cornes sur sa tête. Il était en train de jouer de la flûte de Pan, mais s’interrompt à votre arrivée et vous fait signe de le rejoindre. « Par ici, voyageur ! J’ai de l’excellent vin et personne avec qui le boire ! » Qu’allez-vous faire ? Vous pouvez accepter l’invitation, la décliner et poursuivre votre chemin ou encore menacer le satyre de votre épée pour qu’il vous laisse tranquille.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(5, 1, 'Les arbres sont plus espacés de ce côté et vous progressez sans trop de peine. Après avoir cheminé quelques instants, vous parvenez à une petite clairière, où vous avez la grande surprise de découvrir un magnifique cheval blanc, occupé à manger les feuilles du sous-bois. L’animal relève la tête lorsque vous approchez et vous regarde sans peur. C’est sans aucun doute l’un des plus beaux chevaux que vous ayez jamais vu. Allez-vous tenter de monter sur son dos ou faire un détour et poursuivre votre chemin à travers la forêt.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(6, 1, 'Vous vous servez de votre couteau pour découper la chair du sanglier. Quelques instants de travail vous permettent de récupérer suffisamment de viande pour faire trois Repas. Vous vous apprêtez ensuite à poursuivre votre chemin, mais c’est pour vous apercevoir que le sentier a totalement disparu. Errant quelques instants au hasard, vous finissez par entendre une sorte de martèlement, léger mais répété.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(7, 1, 'Vous saisissez la Dryade au moment où elle allait se réfugier à l’intérieur de son arbre. Elle se répand en imprécations contre vous, mais vous maintenez fermement votre emprise et la menacez de votre épée. A la vue de l’acier tranchant, le comportement de la créature sylvaine change du tout au tout. Elle cesse de se débattre et vous implore de l’épargner, offrant de vous dédommager pour le tort qu’elle vous a causé. Vous savez que les dryades, tout comme la plupart des fées, ne sont pas dignes de confiance, mais qu’elles respectent scrupuleusement leurs marchés. Après quelques instants de négociation, vous parvenez à un accord avec la Dryade, qui vous offre trois objets en échange de sa vie et de sa liberté. Vous acceptez et elle se baisse pour toucher une épaisse racine de l’arbre, qui s’écarte aussitôt pour dévoiler une cavité où se trouvent les trésors promis. Satisfait, vous relâchez la Dryade, qui disparaît aussitôt à l’intérieur de son arbre. Par prudence, vous emportez tout de même les objets à une certaine distance de l’arbre pour les examiner. Dans un petit flacon de terre cuite, vous avez un Baume d’Écorce, dont vous pourrez enduire votre peau au début de n’importe quel combat à condition de n’être pas surpris. Il épaissira votre épiderme lors des quatre premiers assauts. Le deuxième objet est une petite Graine d’Enchevêtrement, que vous pourrez également utiliser au début de n’importe quel combat où vous n’êtes pas surpris. Elle fera instantanément pousser des plantes grimpantes qui s’accrocheront à votre adversaire pour la durée du combat. Notez que vous n’avez pas le temps d’utiliser à la fois le Baume et la Graine au début d’un même combat. Enfin, le troisième objet est une flûte, très belle mais qui ne semble pas magique. Il ne vous reste plus maintenant qu’à quitter la clairière par l’un des deux sentiers qui vous sont offerts.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(8, 1, 'Le satyre n’avait pas menti : son vin est véritablement excellent ! Son goût est âpre mais riche et vous ne pouvez pas résister à la tentation d’en boire toujours davantage. Le satyre et vous accompagnez vos libations de diverses chansons et vous avez l’impression d’être revenu à la fête de la veille, avant que vos ennuis ne commencent. La gourde finie, le satyre vous offre sa flûte de Pan avant de prendre congé et de disparaître parmi les arbres. Vous vous relevez avec une certaine difficulté et reprenez également votre chemin, titubant quelque peu sous l’effet de la boisson.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(9, 1, 'Alors que vous dansez, les couleurs et les formes commencent à se fondre les unes dans les autres jusqu’à devenir un tourbillon de vert et de brun. Le vertige vous gagne et c’est à peine si vous sentez encore vos pieds toucher le sol. Vous avez l’impression d’être léger, léger… Puis vous sentez que vos jambes s’immobilisent et vous cessez de tourner sur vous-même. Il vous faut quelques instants pour que votre vision redevienne plus claire. Des arbres vous entourent toujours, mais vous n’êtes plus au milieu de la clairière. Le cercle de champignons vous a transporté à un autre endroit de la forêt.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(10, 1, 'La forêt s’éclaire peu à peu devant vous et vous parvenez finalement à un ruisseau assez large, qui serpente joyeusement parmi les arbres. Le soleil fait son apparition entre les arbres, éclairant la surface de l’eau de reflets dorés. Quelques pierres bien disposées vous offrent un moyen aisé de traverser le cours d’eau.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(11, 1, 'Le sol est ici tapissé d’une mousse si épaisse qu’elle étouffe tous les sons. À distance, il vous semble pourtant deviner des bruits d’animaux, mais vous seriez incapable de dire de quelle direction ils viennent.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(12, 1, 'Votre arrivée ne semble pas déranger les fées le moins du monde. Au contraire, elles paraissent ravies ! Plusieurs d’entre elles s’envolent et viennent vous tirer jusqu’à une large souche pour que vous vous y asseyiez. Au début, vous avez du mal à saisir le déluge de paroles cristallines dont elles vous abreuvent, mais elles s’en rendent rapidement compte et font un effort pour parler plus lentement. Elles vous disent que la nourriture qu’elles consommaient aurait des effets néfastes sur vous, mais vous invitent à goûter quelques-uns des champignons qui se trouvent là. « Ils sont très bons pour les humains ! » insiste une petite fée aux cheveux rouge coquelicot.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(13, 1, 'Le troll brandit une lourde hache rouillée au moment où vous vous jetez sur lui.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(14, 1, 'Après une assez longue marche, vous parvenez à une petite clairière où le feuillage des arbres s’amincit jusqu’à laisser filtrer un peu plus la clarté du jour. Vous êtes sur le point de la traverser, lorsque vous réalisez que le milieu de cette clairière est occupé par un large cercle de champignons.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(15, 1, 'Vous vous allongez sur la berge, retroussez votre manche et plongez votre bras tout entier dans le ruisseau, qui est plus profond qu’il ne vous avait tout d’abord semblé. Puis vous attendez. Il y a peu de poissons, ce qui vous paraît un peu curieux mais ne vous alarme pas outre mesure. Malheureusement, cela est dû au fait que vous n’êtes pas le seul à pêcher par ici ! Un brochet géant de plus de deux mètres est en train de rôder précisément à l’endroit où vous êtes et votre bras lui semble une proie très désirable ! Vous avez soudain la surprise très désagréable de sentir une myriade de petites dents acérées s’enfoncer dans votre peau. Vous tentez aussitôt de vous libérer, mais le poisson est si fort qu’il vous entraîne avec lui ! L’eau fraîche du ruisseau se referme au-dessus de votre tête et vous êtes traîné sur plusieurs mètres avant que le brochet ne réalise que vous êtes un trop gros morceau pour lui et ne vous relâche. Vous remontez aussitôt à la surface et vous extirpez du cours d’eau.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(16, 1, 'Vous bataillez un certain temps avec la végétation qui obstrue votre chemin, mais celle-ci va heureusement en s’amoindrissant. Après quelques instants de marche, vous parvenez finalement à une petite clairière où vous découvrez un spectacle étonnant. Une dizaine de fées minuscules, pas plus grandes que votre main et dotées d’ailes de libellules, sont en train de déguster des baies et de boire dans des glands évidés. Quelques-unes se chamaillent dans les airs, la plupart sont assises sur de larges champignons pour leur festin. Vous entendez le pépiement aigu de leurs paroles, sans parvenir à saisir ce qu’elles disent. Votre arrivée n’a pas été remarquée.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(17, 1, 'Le satyre ne l’entend pas de cette oreille ! Alors que vous contournez le rocher où il est assis, il joue quelque chose sur sa flûte de Pan et vous sentez un fourmillement vous parcourir soudain le bas du corps. Baissant les yeux, vous réalisez que vous avez maintenant des jambes de chèvre, tout comme lui ! Furieux, vous voulez vous jeter sur le satyre, mais il a déjà disparu en riant. Votre condition (qui durera jusqu’à ce que vous trouviez un remède ou jusqu’à ce que vous quittiez la forêt) n’est pas aussi gênante que vous pourriez le craindre. Après quelques expérimentations, vous réalisez que vous pouvez marcher avec autant d’aisance que d’ordinaire. Vos bottes sont devenues inutiles (vous les rangez dans votre sac à dos en attendant de pouvoir vous en resservir), mais votre pantalon s’ajuste assez bien à votre nouvelle forme. Cependant, comme vous n’êtes pas habitué à ces nouvelles jambes, cela réduira votre DEXTERITE lors de vos futurs combats.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(18, 1, 'Avec la rapidité du serpent, vous saisissez la couronne et la cachez derrière votre dos juste avant qu’Arilys ne se retourne pour vous dire qu’il s’agissait d’une simple jacinthe. Jugeant préférable d’avoir disparu avant qu’elle ne s’aperçoive de votre larcin, vous prenez rapidement congé et poursuivez votre chemin, emportant avec vous la couronne de thym et de primevères. Notez que, si vous possédez une autre couronne de fleurs, vous ne pouvez pas porter les deux en même temps. Vous devez décider à la fin de chaque paragraphe laquelle vous porterez lors du suivant.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(19, 1, 'Alors que vous cherchiez à agripper quelque chose pour résister au brochet qui vous traînait avec lui, votre main s’est par hasard refermée sur une pierre qui gisait au fond du ruisseau. Vous l’examinez à présent : elle est plate, peu épaisse, à peu près large comme votre main, et l’érosion continue de l’eau a percé un trou en son centre. Vous éprouvez une sensation assez étrange lorsque vous regardez ce qui vous entoure à travers ce trou. Décidez si vous souhaitez ou non conserver cette pierre, puis reprenez votre route.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(20, 1, 'Le bruit se fait peu à peu plus fort, indiquant que vous progressez dans la bonne direction. Fort heureusement, les broussailles sont de plus en plus clairsemées de ce côté, ce qui vous permet de progresser sans trop d’encombre. Vous arrivez finalement devant une souche d’arbre massive, bien que rongée par les champignons et les vers. Assis dessus se trouve un petit homme barbu, vêtu d’habits dépenaillés et coiffé d’une sorte de bonnet informe. S’il était debout, il vous arriverait à peine à la taille. Un épais filet de fumée s’échappe de la pipe entre ses lèvres tandis qu’il s’occupe à ressemeller une chaussure. C’est le bruit de son marteau contre les clous qui vous a attiré jusqu’ici. Au bas de la souche, une pile de chaussures de tailles diverses attendent visiblement leur tour. Le petit homme ne vous prête pas la moindre attention et vous n’êtes même pas certain qu’il se soit rendu compte de votre arrivée.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(21, 1, 'L’allée débouche soudain sur une vaste clairière, entièrement recouverte de feuillage épais. Des lanternes en grand nombre sont suspendues aux branches des arbres, illuminant l’endroit sans en dissiper toutes les ombres. Les fées sont partout, certaines aussi grandes que vous, d’autres de la taille de votre main. Tous les regards se tournent vers vous à votre arrivée et la musique comme la conversation baissent de volume jusqu’à n’être plus qu’un murmure insistant. Vous continuez à avancer, objet unique de cette attention des plus inquiétantes. Que va-t-il vous arriver ? Vous remarquez soudain qu’un trône de bois sculpté se trouve au beau milieu de la clairière. De part et d’autre, des chevaliers en armure d’argent se tiennent en rangs serrés. Assise sur le trône se trouve une femme à la beauté indescriptible. Vous n’avez même pas besoin de la couronne d’or fin qui cercle son front pour deviner que vous avez face à vous la Reine des Fées. Elle fait un geste de la main et vous approchez, conscient que c’est elle seule qui va décider de votre destin.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(22, 1, 'Vous cheminez parmi les arbres… Vous marchez longuement, sans qu’aucun obstacle ni aucune créature ne vienne vous barrer le passage. Le paysage autour de vous semble toujours rester le même. Etes-vous en train de tourner en rond ou s’agit-il seulement d’une fausse impression ?', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(23, 1, 'Un fourmillement vous parcourt le corps une fois que vous avez posé les deux pieds à l’intérieur du cercle de champignons. Puis vous vous mettez à danser ! Vous tentez de vous arrêter, mais c’est peine perdue : vos jambes échappent totalement à votre contrôle. Vous faites des cabrioles et des pirouettes effrénées, seul au milieu de la clairière.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(24, 1, 'Vous suivez le bruit des rires. Vous avez l’impression de vous en rapprocher, car ils se font progressivement plus forts et plus nets, mais vous ne rejoignez pas pour autant les créatures qui se divertissent ainsi. La végétation est de plus en plus dense et vous ne progressez que lentement. Alors que vous vous efforcez de traverser un véritable rideau de plantes grimpantes qui s’accrochent aux arbres devant vous, celles-ci se resserrent brusquement sur vous, vous prenant au piège comme dans une nasse ! Dégainant votre épée, vous tentez de vous frayer un passage.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(25, 1, 'La Reine a l’air quelque peu surprise par votre offre, mais elle l’accepte néanmoins. Elle fait signe à l’un des chevaliers qui entourent son trône et celui-ci s’avance pour vous affronter. Son armure brillante lui recouvre presque tout le corps et il manie avec grâce une épée d’argent.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(26, 1, 'Dès qu’il aperçoit la lame de votre épée, le satyre détale sans demander son reste. Il oublie sur le rocher la flûte de Pan dont il jouait.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(27, 1, 'Vous bataillez pour vous frayer un passage parmi les sous-bois. La végétation est particulièrement dense ici et cela ne vous aide pas à progresser en ligne droite.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(28, 1, 'Vous cueillez le champignon le plus proche et vous en prenez une petite bouchée. Le goût est étrange, douceâtre mais légèrement amer. Vous vous apprêtez à en prendre une seconde bouchée lorsqu’un spasme brutal vous tord le ventre ! Vous tombez à quatre pattes et vous efforcez de recracher ce que vous avez déjà avalé. Ces champignons sont empoisonnés !', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(29, 1, 'La jeune femme hoche la tête lorsque vous lui montrez les trèfles et les pâquerettes. « Vous avez de la chance. Les trèfles à quatre feuilles sont très difficiles à trouver en cette quantité et les pâquerettes sont assez rares dans cette forêt. Avec ça, je peux vous faire une couronne qui vous protègera de la magie des fées. Je ne sais pas si son efficacité sera totale, mais cela devrait tout de même pouvoir vous être utile. » Vous acceptez sans hésiter et elle se met aussitôt au travail, tressant la couronne de ses doigts agiles et précis. En très peu de temps, elle a terminé et vous tend le fruit de son travail. « Gardez-la sur votre tête en permanence pour qu’elle fasse effet. » Vous la remerciez et suivez aussitôt ses instructions, trop heureux de disposer d’une forme de protection contre les enchantements qui peuplent cette forêt.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(30, 1, 'Vous dansez longuement, incapable de vous maîtriser. Votre épuisement est tel que chaque mouvement est une torture, mais le sortilège qui fait se mouvoir vos jambes n’en a visiblement cure. Finalement, alors que votre danse effrénée vous amène tout au bord du cercle de champignons, vous tendez les bras et parvenez à agripper la branche de l’arbre le plus proche. Vous vous y cramponnez avec l’énergie du désespoir pour résister à vos jambes qui vous entraînent. Finalement, après de longs efforts, vous parvenez à vous tirer vous-même jusqu’à l’extérieur du cercle. L’enchantement est rompu et vos jambes s’arrêtent enfin. Exténué, vous vous laissez tomber au sol. L’épreuve que vous venez de vivre vous a coûté 4 points d’Endurance. Après un instant, si vous en êtes encore capable, vous vous relevez pour reprendre votre route, en évitant cette fois-ci soigneusement les champignons.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(31, 1, 'Depuis que vous vous êtes réveillé, perdu au milieu de cette forêt mystérieuse, vous avez l’impression de ne plus réfléchir ni percevoir les choses comme à l’accoutumée. Vos pérégrinations à travers la forêt n’ont fait qu’accentuer la chose. Votre esprit et vos sens sont troublés, pas seulement par l’alcool féerique, mais surtout par la magie qui imprègne ce lieu. Et c’est dans cette ivresse mystique que vous trouvez l’inspiration. La musique coule de votre instrument comme une rivière sans fin, submergeant la clairière d’une harmonie merveilleuse. Les fées qui vous entourent sont prises au charme de vos notes. La Reine elle-même vous écoute sans bouger, fascinée. L’ivresse qui parcourt vos gestes et anime votre musique se fait si intense qu’elle finit par vous dépasser : votre vision se trouble et vous perdez connaissance.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(32, 1, 'Vous devez presque vous mettre à quatre pattes pour pénétrer à l’intérieur de la hutte. De toute évidence, la personne qui y habite doit être d’une taille bien inférieure à la vôtre ! Le rideau franchi, vous vous retrouvez dans un espace particulièrement restreint, essentiellement occupé par un mobilier miniature. Il n’y a personne et cette réalisation vous emplit d’un certain soulagement : vous n’êtes pas du tout certain que vous auriez apprécié de rencontrer le propriétaire de cet endroit, petit ou pas ! Fouillant rapidement l’intérieur de la hutte, vous trouvez suffisamment de nourriture pour 2 Repas (chacun vous permettant de récupérer 4 points d’Endurance). Accrochée à une paroi se trouve une très belle harpe et, posé sur la table, un bouquet de pâquerettes. Vous pouvez prendre ce que bon vous semble. Vous découvrez également deux jarres pleine de liquide, visqueux pour l’une, clair et limpide comme de l’eau pour l’autre. Vous pouvez en boire ici même ou les emporter avec vous si vous le désirez.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(33, 1, 'Un hurlement strident vous déchire les oreilles au moment où vous portez le coup fatal. Puis tout se met à tourner autour de vous. La clairière se dissout en un tourbillon de couleurs et de formes et vous perdez tout sens de l’équilibre et de l’orientation. Lorsque vous reprenez finalement vos esprits… vous êtes de nouveau sur la route que vous aviez quittée la veille. Le soleil est haut dans le ciel et un vent frais agite le feuillage de la forêt derrière vous. Tournant la tête, vous n’êtes pas très surpris de voir que Niamh est à vos côtés, un sac à dos sur les épaules. « Alors ? Où va-t-on ? » vous demande-t-elle avec un sourire. Vous lui souriez également avant de hausser les épaules. « Je suis bien placé pour dire que c’est le genre de choses qu’on ne sait jamais à l’avance. » Vous vous mettez tous les deux en marche sous le ciel d’azur. Félicitations, votre aventure est un succès !', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(34, 1, 'Vous cheminez tranquillement parmi les arbres, appréciant la beauté offerte à vos yeux, lorsqu’un fracas brutal vient perturber la sérénité de votre rêverie. Sous vos yeux ébahis, un centaure massif apparaît devant vous et se met à galoper dans votre direction en brandissant deux lourds javelots ! Des tatouages écarlates couvrent son corps de cheval et son torse humain et, à en juger par son visage, il est dans un état d’exaltation guerrière tel qu’il serait vain de le raisonner. Au moment d’arriver sur vous, le centaure lance l’un de ses deux javelots dans votre direction.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(35, 1, 'Vous saluez aimablement le petit homme, vous excusant de le déranger et lui demandant avec politesse s’il saurait vous aider à retrouver votre chemin, mais il ne lève même pas les yeux sur vous. Vous insistez, lui demandant le prix qu’il souhaite mettre à son aide. Il redresse alors la tête, mais ce n’est que pour vous souffler au visage la fumée nauséabonde de sa pipe ! Vous êtes saisi d’une violente quinte de toux, bientôt remplacée par une sensation de vertige. De toute évidence, ces vapeurs sont nocives pour des poumons humains !', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(36, 1, 'Arilys se montre tout à fait prête à commercer avec vous. Elle dispose de Baumes de Dextérité, d’Endurance et de Chance, qui vous permettront de ramener le score choisi à son total de départ. Elle offre également une décoction qui ramènera votre total d’Ivresse à 0. Enfin, comme vous êtes un guerrier, elle vous propose d’acquérir un poison végétal qui vous permettra d’ôter 3 points d’Endurance à chaque coup réussi. Notez que vous ne pourrez enduire votre épée de ce poison que lors d’un paragraphe où vous ne combattez pas. Arilys est prête à échanger ses produits (elle n’a qu’un exemplaire de chaque type) contre les objets suivants : des trèfles à quatre feuilles, des pâquerettes, un Baume d’Écorce, une Graine d’Enchevêtrement, un instrument de musique, une pierre percée d’un trou ou une pièce d’or.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(37, 1, 'Vous débouchez la jarre et buvez une gorgée prudente. Le liquide est d’une consistance particulièrement épaisse, mais il n’a pas de goût particulier. Vous reprenez une gorgée… et vous vous effondrez au sol, saisi de convulsions, le ventre rongé par le poison virulent que vous venez d’ingurgiter.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(38, 1, 'Votre chemin vous conduit finalement à une petite hutte, apparemment faite de roseaux tressés. Un rideau sale en masque l’entrée et rien ne vous permet de déterminer s’il y a ou non quelqu’un à l’intérieur. Le silence règne tout autour de la bâtisse sommaire. Qu’allez-vous faire ?', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(39, 1, 'Les rires ont cessé. N’étaient-ils donc qu’une ruse pour vous attirer dans ce piège ? Vous n’avez aucun moyen de le savoir, ni même de déterminer qui en était à l’origine.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(40, 1, 'Votre refus engendre un bourdonnement de déception. Sentant que vous feriez mieux de ne pas vous attarder davantage, vous vous relevez pour partir, mais, à ce moment-là, la fée qui vous offrait de goûter au champignon vous souffle une poudre en plein visage ! Pris par surprise, vous ne pouvez pas empêcher les particules scintillantes de s’infiltrer dans vos yeux et dans vos narines. Un profond vertige vous fait presque perdre l’équilibre, mais ce n’est pas là le pire. Si votre vision était légèrement floue lorsque vous vous êtes réveillé, vous voyez désormais tout en double !', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(41, 1, 'Vous avancez avec prudence, craignant que d’autres centaures – voire des créatures pires encore ! – ne se trouvent dans les parages. Mais cela ne semble heureusement pas être le cas. Après un certain temps, vous apercevez devant vous ce qui doit être une clairière assez large. Mais, dans une autre direction, vous observez tout à coup des reflets de lumières mouvantes, comme autant de torches en procession !', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(42, 1, 'Vous débouchez la jarre et vous mettez à boire. Le liquide qui coule dans votre gorge a un goût si anodin que vous en venez presque à penser que c’est vraiment de l’eau. Mais, alors que vous vous arrêtez de boire, vous êtes brusquement saisi de tremblements convulsifs. Vous lâchez la jarre, qui va s’écraser au sol. Votre vision est plus trouble que jamais et les sons qui parviennent à vos oreilles sont confus et mélangés. Vous ne contrôlez plus votre corps qu’avec difficulté.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(43, 1, 'Le sentier est parfois difficilement visible parmi la végétation du sous-bois, mais il vous permet néanmoins de progresser rapidement. Ce constat vous emplirait d’une certaine satisfaction si vous aviez également la certitude de toujours progresser dans la même direction, mais ce n’est malheureusement pas le cas ! Le chemin que vous suivez est si plein de tournants que vous avez perdu tout sens de l’orientation après seulement quelques instants. Alors que vous vous demandez si vous avez eu raison de vous fier à ce sentier qui vous était offert, vous êtes brusquement alerté par le froissement des broussailles tout près de vous. Vous avez tout juste le temps de tirer votre épée avant qu’un sanglier massif n’en surgisse pour vous charger. La fuite est impossible et vous devez mener le combat.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(44, 1, 'Vous parvenez finalement à une petite rivière qui coule paresseusement entre les arbres. Au-dessus du cours d’eau, le feuillage s’écarte jusqu’à laisser affluer les rayons du soleil, ce qui vous emplit d’un certain réconfort. Malheureusement, le spectacle devant vous est moins réjouissant: un pont arqué enjambe la rivière, mais il est gardé par un troll aussi large que haut. « Une pièce d’or pour le passage ! » grince-t-il alors que vous approchez.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(45, 1, 'Au dernier moment, la Dryade a le réflexe de se jeter en arrière et disparaît à l’intérieur de son arbre. Emporté par votre élan, vous ne vous arrêtez pas à temps et vous percutez le tronc de plein fouet, ce qui vous coûte 1 point d’Endurance. Vous vous redressez en vous tenant le nez, furieux. Il n’y a rien à faire : la Dryade est totalement à l’abri à l’intérieur de l’arbre et celui-ci est bien trop gigantesque pour que vous puissiez lui causer des dommages quelconques si vous en ressentiez l’envie.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(46, 1, 'Saisi d’une brusque inspiration, vous tirez la pierre de votre sac à dos et observez ce qui vous entoure à travers le trou en son centre. Le paysage autour de vous apparaît bien différemment ! Les arbres sont disposés totalement différemment et vous réalisez que vous n’avez pratiquement pas avancé depuis que vous vous êtes engagé dans cette direction ! De toute évidence, vous avez été la victime d’un sortilège de désorientation. Fort heureusement, cette pierre que vous avez ramassée par hasard semble vous permettre de voir à travers l’illusion.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(47, 1, 'Vous dégainez votre épée et l’abattez aussitôt en un arc de cercle foudroyant. Mais l’araignée est particulièrement véloce et votre adresse n’est pas ce qu’elle est habituellement.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(48, 1, 'Au moment où vous dégainez votre arme, le petit homme jette sa pipe et son marteau et se met à inspirer de l’air avec une force stupéfiante. Ebahi, vous le voyez doubler, puis tripler en taille et en volume, ses vêtements se déchirant pour révéler des muscles incroyablement noueux. Désormais aussi grand que vous et aussi large qu’une barrique, il se jette sur vous avec fureur. Il n’est pas armé mais ses poings infligent autant de dommage qu’une masse d’arme.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(49, 1, 'Cela fait maintenant un certain temps que vous avez laissé la clairière des fées derrière vous et le sentier n’a pas cessé de se diriger en ligne droite. Une vague de soulagement et d’enthousiasme vous traverse.lorsque vous en apercevez finalement l’extrémité, assez loin devant vous ! Vous hâtez le pas, pressé d’échapper enfin à cette forêt et à ses enchantements. A ce moment, un vent léger fait bruire les feuilles au-dessus de vous et vous sentez un fourmillement étrange vous parcourir la peau. Etes-vous coiffé d’une couronne faite de pâquerettes et de trèfles à quatre feuilles ?', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(50, 1, 'Votre situation ne s’arrange pas. Le soleil est impossible à distinguer au-dessus de votre tête et tous les arbres se ressemblent. Vous n’êtes même pas sûr de ne pas être en train de tourner en rond.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(51, 1, 'Les fées éclatent de rire mais, le temps que vous vous releviez, elles ont déjà toutes disparu parmi les arbres. Seule celle qui vous a joué ce mauvais tour s’attarde un instant pour mieux se moquer de vous. Elle décrit quelques cercles autour de votre tête, trop vive pour que vous puissiez l’attraper, avant de s’enfuir à son tour à tire-d’aile. Mais, alors qu’elle se retournait pour vous adresser un dernier quolibet, elle se prend dans une large toile d’araignée étendue entre deux arbres ! Le choc et les efforts que la fée déploie en vain pour se libérer attirent aussitôt l’araignée elle-même, une créature noire et rouge aussi grande que la paume de votre main, qui se précipite vers cette proie inattendue. Qu’allez-vous faire ?', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(52, 1, 'Les yeux de la jeune fée se mettent à briller. « C’est vrai, vous seriez prêt à m’aider ? Ma mère ne pourra pas refuser de me laisser partir si j’ai quelqu’un pour me servir de guide ! Vous êtes un bon guerrier et vous avez l’air d’avoir beaucoup voyagé. Elle ne pourra pas dire non cette fois ! » Elle enlève un bracelet d’herbes tressées de son poignet pour le passer au vôtre. « Gardez cela avec vous et poursuivez votre chemin jusqu’à ce que vous parveniez devant ma mère. Il y a plusieurs choses qu’il faut que je prépare, mais je vous rejoindrai à ce moment-là ! » Vous n’avez pas le temps d’ajouter un mot qu’elle s’est métamorphosée en daim et disparaît à grands bonds parmi les arbres. Il ne vous reste plus qu’à reprendre votre chemin.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(53, 1, 'Trop occupée à rire, la Dryade est prise par surprise lorsque vous vous précipitez sur elle.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(54, 1, 'Vous êtes maintenant certain de tourner en rond ! Un sortilège malveillant vous égare, brouillant votre sens de l’orientation et vous empêchant de progresser en ligne droite. Chaque direction se ressemble et aucune ne semble mener nulle part. Pire encore, une fatigue surnaturelle est en train de saper vos forces, rendant vos jambes aussi pesantes que du plomb. Il vous faut échapper à ce piège aussi vite que possible !', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(55, 1, 'Vous êtes en train de cheminer parmi les arbres lorsqu’un rire étouffé vous alerte. Vous avez tout juste le temps de dégainer votre épée avant que quatre farfadets ne surgissent des buissons et ne vous encerclent ! C’est tout juste si le plus grand d’entre eux vous arrive à mi-cuisse, mais ils sont vifs et leurs dagues sont particulièrement tranchantes. Vous devez les affronter tous en même temps. Les petites créatures sont trop rapides pour que vous puissiez prendre la fuite.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(56, 1, 'Vous vous approchez prudemment du cheval. L’animal ne bronche pas, même lorsque vous tendez une main pour lui flatter l’encolure. Enhardi par sa docilité, vous l’enfourchez… et dès que vous êtes sur son dos, il part au grand galop à travers la forêt ! Déséquilibré, vous tentez de tirer sur sa crinière pour le faire ralentir, mais en vain. Le cheval file à une vitesse qui défie l’entendement et vous n’osez pas sauter, certain de vous tuer si vous vous y risquiez. Les branches des arbres vous fouettent violemment le visage (vous perdez 1 point d’Endurance). Vous éprouvez un certain soulagement lorsque la forêt commence finalement à s’éclaircir devant vous, mais vous réalisez bientôt que c’est parce que vous vous approchez d’un large étang ! Le cheval pique droit dessus et vous ne pouvez que regarder avec horreur jusqu’au moment où il se précipite dans les eaux noires avec vous.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(57, 1, 'Vous trouvez finalement un minuscule sentier que vous n’aviez pas remarqué jusque-là et vous décidez le suivre, espérant qu’il vous permettra d’échapper à ce piège surnaturel. Après quelques instants, vous êtes rassuré : le paysage qui vous entoure n’est plus figé en ce dédale végétal immuable dans lequel vous erriez. A une certaine distance devant vous, vous pouvez apercevoir ce qui doit être une clairière assez large. Mais, dans une autre direction, vous observez des reflets de lumières mouvantes, comme autant de torches en procession !', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(58, 1, 'Vous débouchez la gourde. À en juger par l’odeur, il s’agit bel et bien de vin. Prudemment, vous en prenez une petite gorgée. Le goût délicieux dissipe aussitôt toutes vos craintes. Vous ne pouvez vous empêcher de prendre une nouvelle gorgée, puis encore une autre et une autre, et c’est avec une réelle surprise que vous réalisez bientôt que vous avez entièrement vidé la gourde.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(59, 1, 'Niamh fronce les sourcils à vos paroles. « Vous aussi, vous voudriez quitter cette forêt ? Cela fait bien longtemps que je rêve de l’extérieur, mais ma mère ne m’accorde pas son autorisation. Elle dit qu’il n’y a rien d’intéressant pour nous là-bas. Mais je suis sûre du contraire ! J’ai envie de voir des plaines, des villes, des montagnes, des océans, n’importe quoi qui change de ces arbres ennuyeux ! » Elle poursuit sa diatribe avec véhémence, comme si votre présence lui donnait enfin l’occasion de laisser libre cours à sa rancœur ressassée. De toute évidence, songez-vous en votre for intérieur, les fées connaissent également des crises d’adolescence ! Mais il vous reste encore à décider ce que vous allez faire.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(60, 1, 'Vous tendez la main pour sauver la fée mais, dès que vos doigts ont effleuré la toile, ils y restent englués ! Impossible de vous dégager : les fils soyeux, si fins qu’ils en sont presque invisibles, vous retiennent aussi efficacement que des cordes épaisses. Pire que tout, l’araignée a décidé d’abandonner provisoirement la fée pour s’intéresser à la proie bien plus intéressante que vous êtes ! Vous n’avez pas suffisamment d’espace pour manier correctement votre épée et vous dégainez donc votre poignard pour livrer ce combat. La morsure de l’araignée est extrêmement venimeuse.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(61, 1, 'Vous retirez vos bottes et les déposez au sommet du tas de chaussures avant de vous reculer prudemment. Le petit homme continue de vous ignorer. Quelques instants plus tard, il en a fini avec la chaussure qu’il tient devant lui et, comme vous l’espériez, il passe alors à vos bottes. Sans bouger, vous le regardez œuvrer, remplaçant adroitement les semelles usées par vos longs voyages. Lorsqu’il en a terminé, il dépose vos bottes au bas de la souche, où vous n’avez aucune difficulté à les récupérer. Lorsque vous les enfilez à nouveau, elles se révèlent considérablement plus confortables qu’elles ne l’étaient auparavant ! Le petit homme ne doit pas être un cordonnier ordinaire, car vous avez l’impression étrange de vous déplacer avec beaucoup plus de facilité que d’ordinaire. C’est avec un certain entrain et à grandes enjambées que vous reprenez votre chemin.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(62, 1, 'Niamh hoche la tête lorsque vous lui présentez votre requête. Elle détache un petit sac qui se trouvait à sa ceinture et vous le tend. « C’est une décoction à base de racines. C’est très amer, mais cela guérira même les blessures les plus graves. » La décoction nécessite de faire bouillir de l’eau et il faut du temps pour la préparer, et vous ne pourrez la prendre qu’à la fin d’un paragraphe où vous ne serez pas confronté à une situation périlleuse ou qui demande de réagir rapidement. Ensuite, Niamh fait apparaître un petit pot de terre cuite, rempli d’une sorte de pigment jaune, et s’en sert pour vous dessiner un symbole en spirale sur le front. Vous vous sentez aussitôt empli d’une vivacité nouvelle, comme si votre perception et votre sens de l’équilibre venaient d’être grandement augmentés. Cet effet bénéfique durera tant que le symbole sera sur votre front. Ceci fait, la jeune fée vous adresse un dernier salut. Vous faites de même et, lorsque vous relevez la tête, vous voyez un grand faucon disparaître parmi le feuillage des arbres. Vous reprenez votre route.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(63, 1, 'La Reine des Fées laisse échapper un rire cristallin en vous voyant vous tenir devant elle. « Eh bien, on dirait que notre voyageur revient nous voir encore une fois. Veut-il encore participer à nos festivités ? ».', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(64, 1, 'Les arbres s’écartent soudain devant vous jusqu’à former une large allée. Le feuillage est si dense qu’il ne laisse rien filtrer des rayons du soleil, mais des boules de lumière semblables à des feux follets flottent dans l’air, illuminant le chemin et lui donnant un aspect irréel.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(65, 1, 'Vous jouez depuis un moment lorsque le rire de la Reine vous interrompt. « Mon pauvre serin, je ne crois pas que tu sois fait pour être musicien, vous lance-t-elle de sa voix soyeuse. Peut-être qu’en restant parmi nous, tu en viendras à t’améliorer. » Vous ouvrez la bouche pour répondre, mais il ne sort de votre gorge qu’un trille interrogateur. Tout ce qui vous entoure est soudain beaucoup plus grand. Les petites fées, qui font désormais la même taille que vous, viennent danser une ronde au-dessus de votre tête. Battant de vos ailes de plumes, vous vous élevez dans l’air pour les rejoindre. Vos derniers souvenirs d’aventurier s’échappent de votre mémoire tandis que vous allez finalement vous percher sur la branche d’un arbre et que vous pépiez gaiement sous le regard amusé de la Reine. Votre aventure s’achève ici.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(66, 1, 'L’eau glacée vous engloutit, mais, fort heureusement, vous avez le réflexe de vous dégager aussitôt, sans laisser à ce cheval du diable le temps de vous entraîner vers le fond. Le poids de votre équipement vous entraîne vers le bas mais vous battez furieusement des jambes pour remonter. Votre tête émerge finalement à la surface et vous sentez avec soulagement l’air emplir à nouveau vos poumons. La froideur de l’eau et la panique que vous avez ressentie à l’idée de vous noyer dans cet étang vous ont dégrisé.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(67, 1, 'Vous suivez de loin la discussion longue et acharnée qui s’est engagée entre la Reine des Fées et sa fille, vous demandant avec anxiété ce qui va en résulter. Lorsque Niamh revient finalement vers vous, son expression quelque peu défaite vous apprend que tout ne s’est pas passé pour le mieux. « Elle prétend vouloir tester vos talents de guerrier avant de donner son consentement. Et je crains qu’elle ne soit en train d’invoquer la créature la plus redoutable qu’elle puisse imaginer. » De fait, vous voyez que la Reine des Fées a les yeux fermés et qu’elle semble en train de se concentrer. Des ombres impénétrables s’étendent autour de son trône et les lanternes les plus proches semblent sur le point de s’éteindre. Vous remarquez aussi que toutes les autres fées se sont réfugiées à une distance prudente. Niamh a fait apparaître un petit pot en terre cuite, rempli d’une sorte de pigment jaune, et vous le montre. « Je peux me servir de ceci pour tracer un symbole magique qui augmentera vos chances lors du combat. Qu’est-ce qui vous sera le plus utile : un Symbole de Concentration ou un Symbole de Vitalité ? » Le Symbole de Concentration ramènera votre Dextérité à son total de départ et diminuera votre total d’Ivresse à 0. Le Symbole de Vitalité ramènera votre Endurance à son total de départ et vous offrira une certaine protection lors du combat à venir. Niamh dessine celui que vous choisissez sur votre front à l’aide du pigment jaune. Puis vient le moment du combat.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(68, 1, 'Couvert de sang et de blessures, l’ours s’effondre dans un dernier grognement. Sa masse énorme fait trembler le sol lorsqu’il s’abat, puis il n’y a plus que le silence. Epuisé par le combat, vous passez quelques instants à reprendre votre souffle. Puis vous vous souvenez de l’existence du loup ! Vulnérable comme vous êtes, il pourrait bien décider de s’en prendre maintenant à vous. Mais le loup n’est plus là lorsque vous vous tournez dans sa direction. A sa place se trouve une jeune femme mince et musclée, à la peau bronzée et aux cheveux bruns qui lui tombent jusqu’à la taille. Elle porte des vêtements légers, couleur de feuilles mortes. Son visage triangulaire, ses yeux en amande et ses oreilles pointues indiquent clairement sa nature féerique. « C’était un beau combat ! » vous lance-t-elle avec un sourire. « Vous vous en êtes bien tiré. Je m’appelle Niamh. Êtes-vous un voyageur ? » Vous vous présentez poliment, choisissant vos mots avec soin. Les fées sont imprévisibles, mais celle-ci, qui dispose visiblement de pouvoirs de métamorphose, semble véritablement bien disposée à votre égard. Vous pouvez peut-être en tirer parti.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(69, 1, 'La Reine paraît ravie de vous voir sortir votre instrument et toutes les autres fées s’installent autour de vous pour vous écouter. Vous n’êtes guère rassuré. La musique est loin d’être votre spécialité ! Mais vous n’avez déjà plus le choix et vous vous mettez donc à jouer.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(70, 1, 'Fort heureusement, le tronc de l’arbre est si rugueux qu’il offre de nombreuses prises. Laissant votre sac à dos derrière, vous vous hissez sans trop de difficulté jusqu’à la branche la plus basse, située à près d’une dizaine de mètres du sol et particulièrement épaisse. Vous vous y agrippez, convaincu que le reste de l’ascension sera tout aussi aisé, mais la branche se dérobe soudain en dessous de vous ! Incapable de vous raccrocher à quoi que ce soit, vous chutez.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(71, 1, 'Vous suivez l’ours sur une courte distance. Parvenu à un arbre au tronc épais, il se dresse soudain sur ses deux pattes arrière. Vous réalisez qu’une grosse ruche est suspendue à la branche la plus basse. En quelques coups de griffes, l’ours a tôt fait de la faire tomber et de l’ouvrir en deux. Les abeilles en furie s’échappent de leur demeure détruite et s’agglomèrent autour de lui, mais leurs piqûres sont totalement inefficaces contre son cuir épais. L’ours prend son temps pour se nourrir, puis repart d’une démarche nonchalante. Vous patientez encore un moment, le temps que les dernières abeilles soient parties, puis vous vous approchez à votre tour pour goûter le miel. Il est délicieux et vous vous en nourrissez copieusement avant de finalement repartir.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(72, 1, 'Au moment où vous ouvriez la bouche pour répondre, une grande chouette vient se poser à côté de vous et reprend aussitôt la forme familière de Niamh. « Ce voyageur s’est proposé pour me servir de guide dans le monde extérieur ! s’exclame-t-elle aussitôt avec énergie. Je demande à ce que nous puissions tous les deux quitter la forêt sans délai ! » La bouche de la Reine des Fées se plisse en une expression de mécontentement et vous sentez une certaine inquiétude vous envahir à nouveau. Cela ne va peut-être pas être si simple que cela.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(73, 1, 'La sensation passe aussi rapidement qu’elle était apparue et vous poursuivez votre chemin sans encombres. Etait-ce simplement là le fruit de votre imagination ou la couronne offerte par Arilys vient-elle de vous sauver d’un sort funeste ? Vous n’en serez jamais tout à fait sûr, mais ce n’est pas important. Vous parcourez d’un pas rapide le reste du sentier et vous émergez finalement à l’air libre, sur la route que vous suiviez la veille ! Vous prenez une profonde inspiration, heureux de ne plus sentir le poids oppressant des arbres surplombant votre tête. Derrière vous, le sentier s’est effacé comme un rêve, mais vous ne vous en souciez plus. La chaleur du soleil réchauffe vos membres et l’horizon s’offre à vos yeux. Sifflotant un air joyeux, vous vous remettez en route. Félicitations, votre aventure est un succès !', '2026-03-03 09:26:05', '2026-03-03 09:26:05');
INSERT INTO `paragraph` (`id`, `adventure_id`, `content`, `created_at`, `updated_at`) VALUES
(74, 1, 'L’eau glacée vous engloutit, tétanisant aussitôt vos muscles. Vous tentez malgré tout de remonter vers la surface, mais vos vêtements, votre épée et votre sac à dos vous alourdissent, gênant vos efforts. Vous tentez de vous en débarrasser alors que le cheval vous entraîne toujours plus loin dans les profondeurs obscures de l’étang, mais l’air finit par vous manquer. Vous perdez connaissance et votre aventure s’achève ici, dans les ténèbres froides et insondables.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(75, 1, 'La mince armure du chevalier est ensanglantée et déchirée par endroit. Il est en train de plier sous vos coups lorsque la Reine arrête soudain le combat. « C’est suffisant, dit-elle d’une voix froide. Vous avez montré votre capacité à manier l’épée et vous avez gagné le droit de quitter cette forêt. » Elle fait un geste de la main et vous voyez un sentier s’ouvrir tout à coup parmi les arbres qui bordent la clairière. Vous en prenez la direction, suivi du regard silencieux des fées.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(76, 1, 'Vous vous extirpez péniblement de l’élément aquatique. Vos vêtements sont trempés et vous êtes transi jusqu’aux os. Comme la perspective de tomber gravement malade ne vous sourit pas et que le feuillage des arbres ne laisse filtrer que quelques rayons de soleil épars, vous décidez de faire un feu pour vous réchauffer, vous éloignant pour ce faire à une distance raisonnable de l’eau. Vous rassemblez rapidement une quantité de petit bois, que vous enflammez à l’aide de votre briquet à amadou (que vous conserviez heureusement dans une poche imperméable !). Puis vous entreprenez enfin de vider vos bottes de l’eau qu’elles contiennent et de retirer vos vêtements pour les essorer. Environ une demi-heure plus tard, alors que vous et vos vêtements êtes raisonnablement secs, vous vous remettez en route.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(77, 1, 'La végétation est plus épaisse que vous ne l’aviez pensé d’entrée de jeu. Les broussailles s’accrochent à vos vêtements, les branches vous obligent fréquemment à vous baisser et des racines traîtresses vous font régulièrement trébucher. Vos chutes répétées et les efforts que vous devez déployer pour vous frayer un chemin vous font perdre 1 point d’Endurance. Vous vous arrêtez un instant pour reprendre votre souffle. Vous êtes presque tenté de revenir sur vos pas, mais vous n’êtes aucunement certain de retrouver la clairière derrière vous. Soudain, des rires cristallins viennent vous frapper les oreilles. Ils semblent proches, mais ne vous pouvez pas en distinguer l’origine.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(78, 1, 'Lorsque vous reprenez connaissance, vous êtes étendu sur la route que vous suiviez la veille, votre instrument encore à vos côtés. Vous sentez le contact du soleil contre votre visage. Vous relevant, vous remarquez tout à coup que votre sac à dos est plus lourd qu’il ne devrait l’être. Vous l’ouvrez et réalisez alors que tous les trésors que vous aviez récupérés lors de votre mission passée s’y trouvent de nouveau ! Bien plus, les fées ont ajouté des fruits à l’aspect délicieux, de l’or, des joyaux et encore quelques objets visiblement chargés de leur magie ! Vous remarquez également qu’une gourde est accrochée à votre ceinture, pleine sans aucun doute du vin que vous avez déjà eu l’occasion de goûter. Ce n’est pas souvent qu’un humain doit faire une telle impression à la Reine des Fées et à ses sujets ! C’est particulièrement chargé, mais le coeur joyeux, que vous reprenez votre chemin interrompu. Félicitations, votre aventure est un succès !', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(79, 1, 'La jeune femme lève la tête à votre approche et vous réalisez qu’elle était en train de tresser une couronne de fleurs. Vous vous présentez courtoisement, vous excusant de la déranger. Elle semble surprise de votre présence mais aussi ravie d’avoir quelqu’un à qui parler. Bavardant quelques instants avec elle, vous apprenez qu’elle se nomme Arilys et qu’elle était une simple bergère avant de s’aventurer dans ces bois. Elle n’est jamais parvenue à en ressortir, mais sa nouvelle situation ne lui déplaît pas. « Je serais probablement toujours en train de garder des moutons, si je ne m’étais pas perdue ici. Dans cette forêt, je peux passer mes journées à faire ce qui me plaît. Les fleurs sont magnifiques et elles ont même des effets magiques ! J’ai appris à utiliser certaines d’entre elles pour créer des baumes. » Vous orientez la conversation vers ses couronnes de fleurs et elle vous apprend qu’elles peuvent également être dotées de pouvoirs magiques, mais que leur création nécessite de mélanger au moins deux types de fleurs ou d’herbes pour qu’elles soient efficaces. Elle vous montre l’une des couronnes posées à côté d’elle. « Celle-ci, par exemple, est faite de primevère et de thym. Il m’a fallu du temps pour la réaliser, mais elle donne le pouvoir de voir les choses autrement invisibles. Je l’essaierai dès que j’en aurai le temps. Je suis curieuse de savoir ce qu’elle me permettra de découvrir dans cette forêt. » La discussion se poursuit encore un moment et vous apprenez notamment que les fées se regroupent fréquemment dans un endroit situé non loin d’ici. Mais le temps passe et vous ne voulez pas vous attarder trop longtemps. Si vous possédez des trèfles à quatre feuilles et des pâquerettes, vous pouvez demander à Arilys si elle peut vous en faire une couronne. Sinon, vous pouvez essayer d’acquérir certains de ses baumes ou encore essayer de dérober la couronne de fleurs qu’elle vous montrait. Enfin, vous pouvez également prendre congé et poursuivre votre route.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(80, 1, 'La Dryade n’a visiblement aucun désir de converser avec vous, du moins avec courtoisie. « Hors d’ici, petit humain ! Retourne à ton errance ! Lorsque tu seras mort, ton corps décomposé viendra nourrir les arbres de cette forêt ! » Puis elle vous lance ce qui doit être un sortilège, car les pensées se brouillent subitement dans votre esprit et vous n’êtes plus capable de réfléchir. À demi conscient, vous vous rendez à peine compte que vous quittez la clairière et ce n’est que bien plus tard, parmi les arbres innombrables qui vous entourent de nouveau, que vous reprenez finalement vos esprits.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(81, 1, 'Usant de toute la courtoisie possible, vous exprimez le désir de pouvoir quitter cette forêt. Mais la Reine des Fées balaie votre demande d’un revers de main désinvolte. « Ce serait trop facile. On ne quitte pas notre forêt aussi facilement qu’on y entre. Mais si vous prouviez votre valeur, je suis prête à vous laisser partir comme vous le demandez. » Qu’allez-vous faire ?', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(82, 1, 'Vous chargez le loup en brandissant votre épée. Trop occupé à maintenir ses distances avec son dangereux adversaire, il ne vous voit arriver que lorsqu’il est trop tard et vous lui infligez une profonde blessure. L’instant d’après, c’est l’ours qui lui ouvre l’épaule jusqu’à l’os. C’en est trop pour le loup. Blessé, pris entre deux adversaires, il prend la fuite et disparaît bientôt parmi les arbres. Vous restez face à face avec l’ours, ce qui n’est pas une situation des plus rassurantes. L’animal doit peser au moins quatre fois plus que vous et vous n’êtes pas certain que la furie sanguinaire qui l’animait un instant auparavant se soit dissipée. Il vous considère un long moment, respirant bruyamment, puis finit par se détourner et s’enfoncer à son tour dans la forêt. Vous poussez un soupir de soulagement.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(83, 1, 'Elle vous a vu ! Vive comme l’éclair, elle saisit une autre couronne et vous la jette autour du cou. Vous tentez de vous en débarrasser… mais vos pattes sont moins efficaces que des mains et tout est subitement beaucoup plus grand autour de vous, ce qui vous désoriente. Vous poussez un miaulement plaintif. Arilys vous soulève doucement, vous caresse derrière les oreilles et vous installe sur ses genoux. Réconforté, vous vous roulez en boule en ronronnant et vous endormez bientôt. Votre aventure s’achève ici.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(84, 1, 'La fée pousse un cri aigu au moment où les crocs venimeux de l’araignée transpercent son corps. Ses ailes frémissent une dernière fois, puis s’immobilisent. Un silence glacial est descendu sur la clairière et vous vous sentez soudain transi jusqu’aux os. Étourdi, comme anesthésié, vous reprenez votre chemin à travers la forêt sans savoir dans quelle direction vous vous dirigez.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(85, 1, 'Vous vous éloignez suffisamment loin du troll pour qu’il ne puisse plus vous voir, avant de vous immerger dans l’eau. Le courant est faible et vous progressez sans trop de difficulté. Parvenu au milieu de la rivière, l’une de vos jambes s’accroche à quelque chose. Vous tentez de vous dégager, pensant qu’il s’agit d’une sorte de plante aquatique, mais vous êtes vite détrompé lorsqu’une force irrésistible vous entraîne sous la surface de l’eau !', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(86, 1, 'Vous déambulez sous les vastes arches que dessinent les branches des arbres, accompagné du trille d’un oiseau isolé. Privé que vous êtes du moindre point de repère et dans l’impossibilité de progresser en ligne droite, vous en venez à vous demander si vous n’êtes pas en train de tourner en rond.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(87, 1, 'Vous cheminez sans interruption pendant un certain temps, sans autre compagnie que le bruit de vos pas et les sons de la forêt, avant de déboucher soudain sur une vaste clairière. Au-dessus de votre tête, vous pouvez de nouveau voir le ciel azur, qui vous était jusque-là dissimulé par l’épais feuillage. Au milieu de la clairière se dresse un arbre gigantesque, dont six hommes ne parviendraient pas à encercler le tronc en se tenant par la main. Il ne semble pas y avoir quoi que ce soit d’autre d’intéressant ici. L’arbre est si grand qu’il doit offrir un bon point de vue sur l’ensemble de la forêt.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(88, 1, 'Vous marchez d’un pas rapide mais, bientôt, vous vous voyez forcé de ralentir. Vos jambes sont lourdes et vous vous sentez curieusement essoufflé. Vous portez une main à votre visage… et vous réalisez qu’elle est maintenant couverte de rides profondes ! Les fées vous ont affligé d’une malédiction de vieillissement ! Vos cheveux sont déjà blancs comme neige et votre dos courbé comme sous un lourd fardeau. Vous continuez pourtant votre chemin. La route que vous suiviez la veille est maintenant visible devant vous. Vous pourrez peut-être l’atteindre, mais cela n’inversera pas la malédiction et il est très peu probable que vous surviviez au long voyage qui vous attendra alors. Les quelques dizaines de mètres qui vous restent avant de sortir de la forêt s’annoncent comme votre dernier combat. Votre aventure s’achève ici.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(89, 1, 'Vous contournez l’ours dans l’intention de le prendre à revers, mais il sent votre approche et se retourne vers vous ! Vous êtes contraint d’affronter de face cet animal énorme, ivre d’une fureur sanguinaire (combattez avec le loup contre l’ours).', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(90, 1, 'L’allée se prolonge un certain temps, si sombre que vous avez l’impression d’être engagé dans un véritable tunnel souterrain. Mais plus vous avancez et plus vous entendez des sons devant vous : de la musique et des éclats de conversation. Ces bruits vous rappellent irrésistiblement la fête de la veille, à l’origine de votre situation présente. Allez-vous devoir confronter les fées une nouvelle fois pour qu’elles vous permettent de sortir enfin de cette forêt ? Ce n’est pas sans une certaine appréhension que vous poursuivez votre route.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(91, 1, 'La toile se désagrège à la mort de l’araignée. De nouveau libre, la fée s’envole et disparaît aussitôt dans les sous-bois. Elle en revient quelques instants plus tard, une expression apparemment contrite sur son visage minuscule, et dépose dans le creux de votre main une petite brassée de trèfles à quatre feuilles. Avant que vous ne puissiez dire un mot, elle a de nouveau disparu, cette fois pour de bon. Dans cette forêt peuplée de créatures féeriques, les trèfles à quatre feuilles possèdent une vertu considérable.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(92, 1, 'Vous exprimez votre compassion à Niamh, mais vous la laissez comprendre que vous ne vous sentez pas en mesure de l’aider avec ses problèmes. Elle a l’air particulièrement déçue. Vous cherchez quelques mots de sympathie à ajouter mais sa silhouette se brouille et, l’instant d’après, elle est devenue un oiseau qui s’envole et disparaît rapidement parmi les arbres de la forêt. Haussant les épaules, vous reprenez votre chemin.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(93, 1, 'La rivière va en rétrécissant à mesure que vous la remontez. Ce n’est bientôt plus qu’un large ruisseau, que vous pouvez aisément traverser en vous servant de quelques pierres bien disposées.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(94, 1, 'Un souffle d’air glacial balaye brusquement la clairière et la plupart des lanternes s’éteignent, plongeant tout ce qui vous entoure dans la pénombre. Une forme indistincte est en train d’apparaître devant vous. Les contours de son corps sont vagues et sombres et ses ailes immenses se fondent avec les ténèbres. Un susurrement malveillant s’échappe de sa bouche invisible, vous glaçant le sang. Vous n’avez pas le choix, il vous faut livrer cette dernière bataille !', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(95, 1, 'Vous débouchez rapidement sur une vaste clairière baignée de soleil. Des fleurs de toutes les couleurs s’étendent devant vous en un tapis ondoyant au moindre souffle d’air. Le parfum qu’elles diffusent est délicieusement léger. Après un instant, vous remarquez que vous n’êtes pas seul : une jeune femme blonde est assise au milieu de la clairière, en train de s’affairer sur quelque chose que vous ne distinguez pas clairement. Des fleurs sont dans ses cheveux, autour de son cou et sur ses vêtements. Elle ne vous a pas remarqué.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(96, 1, 'Vous vous frayez un chemin parmi les broussailles. Les sous-bois sont particulièrement denses et les ronces s’accrochent à vos vêtements à chaque pas, ralentissant votre progression. Vous poursuivez pourtant dans cette direction avec obstination. Après un long moment et des efforts prolongés, vous parvenez finalement à un endroit où la végétation se fait plus mince… et vous vous retournez pour découvrir devant vous la même allée d’arbres que vous aviez refusé d’emprunter. De toute évidence, ce n’était pas le hasard si vous l’avez découverte. Il s’agit d’une invitation qu’on ne vous permettra pas de refuser. Haussant les épaules, vous vous engagez dans l’allée.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(97, 1, 'Un spectacle des plus curieux vous barre le passage : sous vos yeux, un grand loup noir et un ours massif sont en train de se livrer un combat furieux. L’ours a subi quelques blessures légères qui l’ont mis en rage et le spectacle qu’il donne, écumant et grondant, est des plus impressionnants. Le loup, quant à lui, s’applique à rester tout juste hors de portée des griffes de son adversaire redoutable, guettant l’ouverture qui lui permettra d’infliger une nouvelle blessure. Qu’allez-vous faire ?', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(98, 1, 'Distrayant Arilys par votre conversation, vous vous rapprochez discrètement de la couronne de fleurs. Puis, alors que vous êtes parvenu juste à côté, vous demandez à la jeune femme de vous nommer une fleur située dans la direction opposée. Dès qu’elle détourne le regard, vous vous baisser pour vous emparer de la couronne.', '2026-03-03 09:26:05', '2026-03-03 09:26:05'),
(99, 1, 'Les arbres sont plus grands dans cette partie de la forêt et vous commencez à vous demander si vous n’êtes pas, depuis le début, parti dans la mauvaise direction ! N’ayant pas la moindre envie de revenir sur vos pas, vous poursuivez votre chemin malgré tout. Du reste, l’endroit est particulièrement beau. Les branches des arbres forment de hautes voûtes sous lesquelles se fait entendre de loin en loin le trille d’un oiseau. Les rayons de soleil filtrent à travers le feuillage, dessinant sur le sol couvert de mousse des mosaïques de lumière que le vent léger fait se mouvoir. Vous éprouvez une sensation de quiétude rafraîchissante. Plusieurs directions possibles s’offrent à vous.', '2026-03-03 09:26:05', '2026-03-03 09:26:05');

-- --------------------------------------------------------

--
-- Structure de la table `paragraph_after_event`
--

CREATE TABLE `paragraph_after_event` (
  `id` int UNSIGNED NOT NULL,
  `paragraph_id` int UNSIGNED NOT NULL,
  `trigger_event` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `additional_text` text COLLATE utf8mb4_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `paragraph_item`
--

CREATE TABLE `paragraph_item` (
  `id` int UNSIGNED NOT NULL,
  `paragraph_id` int UNSIGNED NOT NULL,
  `item_id` int UNSIGNED NOT NULL,
  `quantity` int NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `paragraph_item`
--

INSERT INTO `paragraph_item` (`id`, `paragraph_id`, `item_id`, `quantity`) VALUES
(1, 1, 15, 1),
(2, 6, 6, 3),
(3, 7, 1, 1),
(4, 7, 2, 1),
(5, 7, 3, 1),
(6, 8, 4, 1),
(7, 13, 18, 2),
(8, 18, 7, 1),
(9, 19, 5, 1),
(10, 32, 6, 2),
(11, 32, 14, 1),
(12, 32, 19, 1),
(13, 32, 20, 1),
(14, 32, 22, 1),
(15, 36, 9, 1),
(16, 36, 10, 1),
(17, 36, 11, 1),
(18, 36, 13, 1),
(19, 36, 21, 1),
(20, 48, 18, 1),
(21, 62, 12, 1),
(22, 71, 16, 1),
(23, 79, 8, 1),
(24, 91, 17, 1);

-- --------------------------------------------------------

--
-- Structure de la table `state`
--

CREATE TABLE `state` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `state_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `attribute` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `value` int DEFAULT NULL,
  `duration` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `remove_condition` text COLLATE utf8mb4_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `state`
--

INSERT INTO `state` (`id`, `name`, `description`, `state_type`, `attribute`, `value`, `duration`, `remove_condition`) VALUES
(1, 'Jambes de chèvre', 'Vous avez des jambes de satyre : -1 Habileté jusqu’à guérison.', 'curse', 'dexterity', 1, 'unlimited', 'leave forest'),
(2, 'Symbole de Concentration', 'Habileté restaurée au total de départ, Ivresse réduite à 0.', NULL, NULL, NULL, NULL, NULL),
(3, 'Symbole de Vitalité', 'Endurance restaurée au total de départ et protection contre le froid.', NULL, NULL, NULL, NULL, NULL),
(4, 'Symbole de Vivacité', '+1 Habileté tant que vous n’êtes pas immergé.', 'buff', 'dexterity', 1, 'unlimited', 'submerged'),
(5, 'Protection contre la magie des fées', 'Vous êtes protégé contre certains enchantements.', 'buff', NULL, NULL, NULL, NULL),
(6, 'Vision de l’invisible', 'Vous pouvez voir les illusions et choses cachées.', 'buff', NULL, NULL, 'is_equiped', 'not_equiped'),
(7, 'Bracelet de Niamh', 'Permet d’accéder à la Reine via le paragraphe 72.', NULL, NULL, NULL, 'has_item', NULL),
(8, 'Chance augmentée', 'Votre total de Chance est fixé à 13 tant que vous possédez les trèfles.', 'buff', 'luck', 13, 'has_item', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

CREATE TABLE `user` (
  `id` int UNSIGNED NOT NULL,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_admin` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `user`
--

INSERT INTO `user` (`id`, `username`, `email`, `password`, `is_admin`, `created_at`, `updated_at`) VALUES
(1, 'Shaalandu', 'shaalandu@mail.com', '$2a$10$ztFCGXmNUZQV7STFi24C/uQk1Q9l/msUkQaNE.UXkduFfYioBfN.K', 1, '2026-03-03 09:22:58', '2026-03-03 09:22:58');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `adventure`
--
ALTER TABLE `adventure`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `fk_adventure_user` (`created_by_user_id`),
  ADD KEY `fk_adventure_paragraph` (`starting_paragraph_id`);

--
-- Index pour la table `character`
--
ALTER TABLE `character`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `choice`
--
ALTER TABLE `choice`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_choice_paragraph` (`paragraph_id`),
  ADD KEY `fk_choice_target_paragraph` (`target_paragraph_id`);

--
-- Index pour la table `choice_condition`
--
ALTER TABLE `choice_condition`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_choice_condition_choice` (`choice_id`),
  ADD KEY `fk_choice_condition_condition` (`condition_id`);

--
-- Index pour la table `condition`
--
ALTER TABLE `condition`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_condition_item` (`item_id`),
  ADD KEY `fk_condition_flag` (`flag_id`);

--
-- Index pour la table `dice_test`
--
ALTER TABLE `dice_test`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_dice_test_paragraph` (`paragraph_id`),
  ADD KEY `fk_dice_test_success_paragraph` (`success_paragraph_id`),
  ADD KEY `fk_dice_test_failure_paragraph` (`failure_paragraph_id`);

--
-- Index pour la table `effect`
--
ALTER TABLE `effect`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_effect_condition` (`condition_id`);

--
-- Index pour la table `encounter`
--
ALTER TABLE `encounter`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_encounter_order` (`paragraph_id`,`encounter_order`),
  ADD KEY `fk_encounter_character` (`character_id`),
  ADD KEY `fk_encounter_target_victory` (`paragraph_victory`),
  ADD KEY `fk_encounter_target_flee` (`paragraph_flee`);

--
-- Index pour la table `encounter_rule`
--
ALTER TABLE `encounter_rule`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_encounter_rule_encounter` (`encounter_id`),
  ADD KEY `fk_encounter_rule_item` (`item_id`);

--
-- Index pour la table `flag`
--
ALTER TABLE `flag`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Index pour la table `game_save`
--
ALTER TABLE `game_save`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_adventure_slot` (`user_id`,`adventure_id`,`slot_name`),
  ADD KEY `idx_user_adventure` (`user_id`,`adventure_id`,`current_paragraph_id`),
  ADD KEY `adventure_id` (`adventure_id`),
  ADD KEY `current_paragraph_id` (`current_paragraph_id`);

--
-- Index pour la table `hero`
--
ALTER TABLE `hero`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `save_id` (`save_id`);

--
-- Index pour la table `hero_flag`
--
ALTER TABLE `hero_flag`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_hero_flag` (`save_id`,`flag_id`),
  ADD KEY `fk_hero_flag_flag` (`flag_id`);

--
-- Index pour la table `hero_inventory`
--
ALTER TABLE `hero_inventory`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_hero_inventory` (`save_id`,`item_id`),
  ADD KEY `fk_hero_inventory_item` (`item_id`);

--
-- Index pour la table `hero_state`
--
ALTER TABLE `hero_state`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_hero_state_game_save` (`save_id`),
  ADD KEY `fk_hero_state_state` (`state_id`);

--
-- Index pour la table `item`
--
ALTER TABLE `item`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_item_target_paragraph` (`target_paragraph_id`);

--
-- Index pour la table `paragraph`
--
ALTER TABLE `paragraph`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_paragraph_adventure` (`adventure_id`);

--
-- Index pour la table `paragraph_after_event`
--
ALTER TABLE `paragraph_after_event`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_paragraph_after_event_paragraph` (`paragraph_id`);

--
-- Index pour la table `paragraph_item`
--
ALTER TABLE `paragraph_item`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_paragraph_item_paragraph` (`paragraph_id`),
  ADD KEY `fk_paragraph_item_item` (`item_id`);

--
-- Index pour la table `state`
--
ALTER TABLE `state`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `key_name` (`name`);

--
-- Index pour la table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `adventure`
--
ALTER TABLE `adventure`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `character`
--
ALTER TABLE `character`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT pour la table `choice`
--
ALTER TABLE `choice`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=130;

--
-- AUTO_INCREMENT pour la table `choice_condition`
--
ALTER TABLE `choice_condition`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `condition`
--
ALTER TABLE `condition`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT pour la table `dice_test`
--
ALTER TABLE `dice_test`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT pour la table `effect`
--
ALTER TABLE `effect`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT pour la table `encounter`
--
ALTER TABLE `encounter`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT pour la table `encounter_rule`
--
ALTER TABLE `encounter_rule`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `flag`
--
ALTER TABLE `flag`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `game_save`
--
ALTER TABLE `game_save`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `hero`
--
ALTER TABLE `hero`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `hero_flag`
--
ALTER TABLE `hero_flag`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `hero_inventory`
--
ALTER TABLE `hero_inventory`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `hero_state`
--
ALTER TABLE `hero_state`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `item`
--
ALTER TABLE `item`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT pour la table `paragraph_after_event`
--
ALTER TABLE `paragraph_after_event`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `paragraph_item`
--
ALTER TABLE `paragraph_item`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT pour la table `state`
--
ALTER TABLE `state`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT pour la table `user`
--
ALTER TABLE `user`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `adventure`
--
ALTER TABLE `adventure`
  ADD CONSTRAINT `fk_adventure_paragraph` FOREIGN KEY (`starting_paragraph_id`) REFERENCES `paragraph` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_adventure_user` FOREIGN KEY (`created_by_user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `choice`
--
ALTER TABLE `choice`
  ADD CONSTRAINT `fk_choice_paragraph` FOREIGN KEY (`paragraph_id`) REFERENCES `paragraph` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_choice_target_paragraph` FOREIGN KEY (`target_paragraph_id`) REFERENCES `paragraph` (`id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `choice_condition`
--
ALTER TABLE `choice_condition`
  ADD CONSTRAINT `fk_choice_condition_choice` FOREIGN KEY (`choice_id`) REFERENCES `choice` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_choice_condition_condition` FOREIGN KEY (`condition_id`) REFERENCES `condition` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `condition`
--
ALTER TABLE `condition`
  ADD CONSTRAINT `fk_condition_flag` FOREIGN KEY (`flag_id`) REFERENCES `flag` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_condition_item` FOREIGN KEY (`item_id`) REFERENCES `item` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `dice_test`
--
ALTER TABLE `dice_test`
  ADD CONSTRAINT `fk_dice_test_failure_paragraph` FOREIGN KEY (`failure_paragraph_id`) REFERENCES `paragraph` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_dice_test_paragraph` FOREIGN KEY (`paragraph_id`) REFERENCES `paragraph` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_dice_test_success_paragraph` FOREIGN KEY (`success_paragraph_id`) REFERENCES `paragraph` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `effect`
--
ALTER TABLE `effect`
  ADD CONSTRAINT `fk_effect_condition` FOREIGN KEY (`condition_id`) REFERENCES `condition` (`id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `encounter`
--
ALTER TABLE `encounter`
  ADD CONSTRAINT `fk_encounter_character` FOREIGN KEY (`character_id`) REFERENCES `character` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_encounter_paragraph` FOREIGN KEY (`paragraph_id`) REFERENCES `paragraph` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_encounter_target_flee` FOREIGN KEY (`paragraph_flee`) REFERENCES `paragraph` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_encounter_target_victory` FOREIGN KEY (`paragraph_victory`) REFERENCES `paragraph` (`id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `encounter_rule`
--
ALTER TABLE `encounter_rule`
  ADD CONSTRAINT `fk_encounter_rule_encounter` FOREIGN KEY (`encounter_id`) REFERENCES `encounter` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_encounter_rule_item` FOREIGN KEY (`item_id`) REFERENCES `item` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `game_save`
--
ALTER TABLE `game_save`
  ADD CONSTRAINT `game_save_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `game_save_ibfk_2` FOREIGN KEY (`adventure_id`) REFERENCES `adventure` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `game_save_ibfk_3` FOREIGN KEY (`current_paragraph_id`) REFERENCES `paragraph` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `hero`
--
ALTER TABLE `hero`
  ADD CONSTRAINT `fk_hero_game_save` FOREIGN KEY (`save_id`) REFERENCES `game_save` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `hero_flag`
--
ALTER TABLE `hero_flag`
  ADD CONSTRAINT `fk_hero_flag_flag` FOREIGN KEY (`flag_id`) REFERENCES `flag` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_hero_flag_game_save` FOREIGN KEY (`save_id`) REFERENCES `game_save` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `hero_inventory`
--
ALTER TABLE `hero_inventory`
  ADD CONSTRAINT `fk_hero_inventory_game_save` FOREIGN KEY (`save_id`) REFERENCES `game_save` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_hero_inventory_item` FOREIGN KEY (`item_id`) REFERENCES `item` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `hero_state`
--
ALTER TABLE `hero_state`
  ADD CONSTRAINT `fk_hero_state_game_save` FOREIGN KEY (`save_id`) REFERENCES `game_save` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_hero_state_state` FOREIGN KEY (`state_id`) REFERENCES `state` (`id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `item`
--
ALTER TABLE `item`
  ADD CONSTRAINT `fk_item_target_paragraph` FOREIGN KEY (`target_paragraph_id`) REFERENCES `paragraph` (`id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `paragraph`
--
ALTER TABLE `paragraph`
  ADD CONSTRAINT `fk_paragraph_adventure` FOREIGN KEY (`adventure_id`) REFERENCES `adventure` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `paragraph_after_event`
--
ALTER TABLE `paragraph_after_event`
  ADD CONSTRAINT `fk_paragraph_after_event_paragraph` FOREIGN KEY (`paragraph_id`) REFERENCES `paragraph` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `paragraph_item`
--
ALTER TABLE `paragraph_item`
  ADD CONSTRAINT `fk_paragraph_item_item` FOREIGN KEY (`item_id`) REFERENCES `item` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_paragraph_item_paragraph` FOREIGN KEY (`paragraph_id`) REFERENCES `paragraph` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
