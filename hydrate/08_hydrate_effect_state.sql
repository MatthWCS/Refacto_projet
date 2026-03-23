-- Table state

INSERT INTO state (id, key_name, description) VALUES
(1, 'Jambes de chèvre', 'Vous avez des jambes de satyre : -1 Habileté jusqu’à guérison.'),
(2, 'Symbole de Concentration', 'Habileté restaurée au total de départ, Ivresse réduite à 0.'),
(3, 'Symbole de Vitalité', 'Endurance restaurée au total de départ et protection contre le froid.'),
(4, 'Symbole de Vivacité', '+1 Habileté tant que vous n’êtes pas immergé.'),
(5, 'Protection contre la magie des fées', 'Vous êtes protégé contre certains enchantements.'),
(6, 'Vision de l’invisible', 'Vous pouvez voir les illusions et choses cachées.'),
(7, 'Bracelet de Niamh', 'Permet d’accéder à la Reine via le paragraphe 72.'),
(8, 'Chance augmentée', 'Votre total de Chance est fixé à 13 tant que vous possédez les trèfles.');

-- Table effect

-- Paragraphe 17 — Jambes de chèvre
INSERT INTO effect (source_type, source_type_id, attribute, operation, value)
VALUES ('paragraph', 17, 'dexterity', 'subtract', 1);

-- Paragraphe 18 — Couronne Thym-Primevères (voir l’invisible)
INSERT INTO effect (source_type, source_type_id)
VALUES ('paragraph', 18);

-- Paragraphe 29 — Couronne Trèfles-Pâquerettes (protection)
INSERT INTO effect (source_type, source_type_id)
VALUES ('paragraph', 29);

-- Paragraphe 52 — Bracelet de Niamh
INSERT INTO effect (source_type, source_type_id)
VALUES ('paragraph', 52);

-- Paragraphe 62 — Symbole de Vivacité (+1 Habileté)
INSERT INTO effect (source_type, source_type_id, attribute, operation, value)
VALUES ('paragraph', 62, 'dexterity', 'add', 1);

-- Paragraphe 67 — Symbole de Concentration
INSERT INTO effect (source_type, source_type_id, attribute, operation, value)
VALUES ('paragraph', 67, 'dexterity', 'set_to_base', NULL);

INSERT INTO effect (source_type, source_type_id, attribute, operation, value)
VALUES ('paragraph', 67, 'drunkness', 'set_to', 0);

-- Paragraphe 67 — Symbole de Vitalité
INSERT INTO effect (source_type, source_type_id, attribute, operation, value)
VALUES ('paragraph', 67, 'stamina', 'set_to_base', NULL);

-- Paragraphe 91 — Trèfles à quatre feuilles (Chance = 13)
INSERT INTO effect (source_type, source_type_id, attribute, operation, value)
VALUES ('paragraph', 91, 'luck', 'set_to', 13);
