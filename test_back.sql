DROP DATABASE IF EXISTS test_back;
CREATE DATABASE test_back CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE test_back;


-- =========================
-- TABLE paragraph
-- =========================
CREATE TABLE paragraph (
  `id` INT UNSIGNED PRIMARY KEY,
  `content` TEXT NOT NULL
) ENGINE=InnoDB;

INSERT INTO paragraph (id, content) VALUES
(1, 'Vous avancez dans la forêt sombre. Deux chemins s’offrent à vous.'),
(2, 'Vous trouvez une petite amulette en bois posée sur une souche.'),
(3, 'Un Sanglier surgit des buissons et charge droit sur vous !'),
(4, 'Vous fouillez les environs et trouvez une potion.'),
(5, 'Vous fuyez à toutes jambes, échappant de peu au Sanglier.'),
(6, 'Un passage secret apparaît… mais seulement si vous portez l’Amulette.'),
(99, 'Vous avez trouvé la sortie secrète. Votre moteur fonctionne parfaitement.');

-- =========================
-- TABLE choice
-- =========================
CREATE TABLE choice (
  `id` INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  `paragraph_id` INT UNSIGNED NOT NULL,
  `content` TEXT NOT NULL,
  `target_paragraph_id` INT UNSIGNED NULL,
  CONSTRAINT fk_choice_paragraph
    FOREIGN KEY (paragraph_id) REFERENCES paragraph(id) ON DELETE CASCADE,
  CONSTRAINT fk_choice_target_paragraph
    FOREIGN KEY (target_paragraph_id) REFERENCES paragraph(id) ON DELETE SET NULL
) ENGINE=InnoDB;

INSERT INTO choice (id, paragraph_id, target_paragraph_id, content) VALUES
(1, 1, 2, 'Aller vers le sentier lumineux'),
(2, 1, 3, 'Prendre le chemin boueux'),

(3, 2, 1, 'Revenir au carrefour'),

(4, 3, 4, 'Continuer après le combat'),
(5, 3, 5, 'Tenter de fuir'),

(6, 4, 6, 'Continuer'),

(7, 5, 1, 'Revenir au carrefour'),

(8, 6, 99, 'Entrer dans le passage secret'),
(9, 6, 1, 'Revenir en arrière');

-- =========================
-- TABLE condition
-- =========================
CREATE TABLE `condition` (
  `id` INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  `choice_id` INT UNSIGNED,
  `attribute` VARCHAR(50),
  `operator` VARCHAR(5),
  `value` INT,
  CONSTRAINT fk_condition_choice
    FOREIGN KEY (choice_id) REFERENCES choice(id) ON DELETE CASCADE
) ENGINE=InnoDB;

INSERT INTO `condition` (id, choice_id, attribute, operator, value) VALUES
(1, 8, 'item', '==', '1');

-- =========================
-- TABLE item
-- =========================
CREATE TABLE item (
  `id` INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(200) NOT NULL,
  `type` VARCHAR(50) NOT NULL,
  `usable` BOOLEAN NOT NULL DEFAULT 0,
  `description` TEXT
) ENGINE=InnoDB;

INSERT INTO item (id, name, type, usable, description) VALUES
(1, 'Amulette de Bois', 'quest', 0, 'Une petite amulette en bois.'),
(2, 'Potion de Vie', 'consumable', 1, 'Restaure 4 points d’endurance.');

-- =========================
-- TABLE paragraph_item
-- =========================
CREATE TABLE paragraph_item (
  `id` INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  `paragraph_id` INT UNSIGNED NOT NULL,
  `item_id` INT UNSIGNED NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  CONSTRAINT fk_paragraph_item_paragraph
    FOREIGN KEY (paragraph_id) REFERENCES paragraph(id) ON DELETE CASCADE,
  CONSTRAINT fk_paragraph_item_item
    FOREIGN KEY (item_id) REFERENCES item(id) ON DELETE CASCADE
) ENGINE=InnoDB;

INSERT INTO paragraph_item (id, paragraph_id, item_id, quantity) VALUES
(1, 2, 1, 1),  -- Amulette trouvée au paragraphe 2
(2, 4, 2, 1);  -- Potion trouvée au paragraphe 4

-- =========================
-- TABLE effect
-- =========================
CREATE TABLE effect (
  `id` INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  `source_type` VARCHAR(50) NOT NULL,
  `source_type_id` INT UNSIGNED NOT NULL,
  `attribute` VARCHAR(50),
  `operation` VARCHAR(20) NOT NULL,
  `value` INT
) ENGINE=InnoDB;

INSERT INTO effect (id, source_type, source_type_id, attribute, operation, value) VALUES
(1, 'paragraph', 4, 'endurance', 'add', 2),
(2, 'paragraph', 5, 'endurance', 'sub', 1);

-- =========================
-- TABLE state (catalogue)
-- =========================
CREATE TABLE state (
  `id` INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  `paragraph_id` INT UNSIGNED,
  `key_name` VARCHAR(100) NOT NULL UNIQUE,
  `value` VARCHAR(100)
) ENGINE=InnoDB;

INSERT INTO state (id, paragraph_id, key_name, value) VALUES
(1, 4, 'odeur_sanglier', 'true');

-- =========================
-- TABLE encounter
-- =========================
CREATE TABLE encounter (
  `id` INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  `paragraph_id` INT UNSIGNED NOT NULL,
  `character_id` INT UNSIGNED NOT NULL,
  `encounter_order` INT NOT NULL DEFAULT 1,
  `combat_type` VARCHAR(50) NOT NULL DEFAULT 'standard',
  `paragraph_victory` INT UNSIGNED NULL,
  `paragraph_flee` INT UNSIGNED NULL,
  `flee_damage` INT,
  `monster_name` VARCHAR(50),
  `dexterity` INT,
  `endurance` INT,
  `rules` VARCHAR(200),
  UNIQUE KEY uq_encounter_order (paragraph_id, encounter_order),
  CONSTRAINT fk_encounter_paragraph
    FOREIGN KEY (paragraph_id) REFERENCES paragraph(id) ON DELETE CASCADE,
  CONSTRAINT fk_encounter_target_victory
    FOREIGN KEY (paragraph_victory) REFERENCES paragraph(id) ON DELETE SET NULL,
  CONSTRAINT fk_encounter_target_flee
    FOREIGN KEY (paragraph_flee) REFERENCES paragraph(id) ON DELETE SET NULL
) ENGINE=InnoDB;

INSERT INTO encounter (
    id,
    paragraph_id,
    character_id,
    encounter_order,
    combat_type,
    paragraph_victory,
    paragraph_flee,
    flee_damage,
    monster_name,
    dexterity,
    endurance,
    rules
) VALUES
(4, 3, 4, 1, 'standard', 4, 5, 2, 'Sanglier', 7, 10, '[]');