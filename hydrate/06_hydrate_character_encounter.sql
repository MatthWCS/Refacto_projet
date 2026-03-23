-- Paragraphe 13 - Troll
INSERT INTO `character` (name, character_type, hostile, dexterity, stamina)
VALUES ('Troll', 'enemy', 1, 10, 10);

INSERT INTO `encounter` (paragraph_id, character_id, combat_type)
VALUES (13, LAST_INSERT_ID(), 'standard');

-- Paragraphe 24 - Plantes étrangleuses
INSERT INTO `character` (name, character_type, hostile, dexterity, stamina)
VALUES ('Plantes Étrangleuses', 'enemy', 1, 6, 10);

INSERT INTO encounter (paragraph_id, character_id, combat_type)
VALUES (24, LAST_INSERT_ID(), 'standard');

-- Paragraphe 34 - Centaure
INSERT INTO `character` (name, character_type, hostile, dexterity, stamina)
VALUES ('Centaure', 'enemy', 1, 8, 10);

INSERT INTO encounter (paragraph_id, character_id, combat_type)
VALUES (34, LAST_INSERT_ID(), 'standard');

-- Paragraphe 43 - Sanglier
INSERT INTO `character` (name, character_type, hostile, dexterity, stamina)
VALUES ('Sanglier', 'enemy', 1, 7, 10);

INSERT INTO encounter (paragraph_id, character_id, combat_type)
VALUES (43, LAST_INSERT_ID(), 'standard');

-- Paragraphe 48 - Spriggan
INSERT INTO `character` (name, character_type, hostile, dexterity, stamina)
VALUES ('Spriggan', 'enemy', 1, 8, 6);

INSERT INTO encounter (paragraph_id, character_id, combat_type)
VALUES (48, LAST_INSERT_ID(), 'standard');

-- Paragraphe 55 - Farfadets x4
INSERT INTO `character` (name, character_type, hostile, dexterity, stamina)
VALUES ('Premier Farfadet', 'enemy', 1, 3, 6);
INSERT INTO encounter (paragraph_id, character_id, encounter_order, combat_type)
VALUES (55, LAST_INSERT_ID(), 1, 'standard');

INSERT INTO `character` (name, character_type, hostile, dexterity, stamina)
VALUES ('Deuxième Farfadet', 'enemy', 1, 4, 5);
INSERT INTO encounter (paragraph_id, character_id, encounter_order, combat_type)
VALUES (55, LAST_INSERT_ID(), 2, 'standard');

INSERT INTO `character` (name, character_type, hostile, dexterity, stamina)
VALUES ('Troisième Farfadet', 'enemy', 1, 5, 5);
INSERT INTO encounter (paragraph_id, character_id, encounter_order, combat_type)
VALUES (55, LAST_INSERT_ID(), 3, 'standard');

INSERT INTO `character` (name, character_type, hostile, dexterity, stamina)
VALUES ('Quatrième Farfadet', 'enemy', 1, 4, 6);
INSERT INTO encounter (paragraph_id, character_id, encounter_order, combat_type)
VALUES (55, LAST_INSERT_ID(), 4, 'standard');

-- Paragraphe 60 - Araignée
INSERT INTO `character` (name, character_type, hostile, dexterity, stamina)
VALUES ('Araignée', 'enemy', 1, 7, 1);

INSERT INTO encounter (paragraph_id, character_id, combat_type)
VALUES (60, LAST_INSERT_ID(), 'standard');

-- Paragraphe 85 - Monstre aquatique
INSERT INTO `character` (name, character_type, hostile, dexterity, stamina)
VALUES ('Monstre Aquatique', 'enemy', 1, 6, 6);

INSERT INTO encounter (paragraph_id, character_id, combat_type)
VALUES (85, LAST_INSERT_ID(), 'standard');

-- Paragraphe 89 - Ours
INSERT INTO `character` (name, character_type, hostile, dexterity, stamina)
VALUES ('Ours', 'enemy', 1, 10, 14);

INSERT INTO encounter (paragraph_id, character_id, combat_type)
VALUES (89, LAST_INSERT_ID(), 'standard');

-- Paragraphe 89 - Loup
INSERT INTO `character` (name, character_type, hostile, dexterity, stamina)
VALUES ('Loup', 'enemy', 0, 11, 12);

INSERT INTO encounter (paragraph_id, character_id, encounter_order, combat_type)
VALUES (89, LAST_INSERT_ID(), 2, 'standard');

-- Paragraphe 94 - Fée Ténébreuse
INSERT INTO `character` (name, character_type, hostile, dexterity, stamina)
VALUES ('Fée Ténébreuse', 'enemy', 1, 11, 11);

INSERT INTO encounter (paragraph_id, character_id, combat_type)
VALUES (94, LAST_INSERT_ID(), 'standard');
