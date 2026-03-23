-- Paragraphe 13 — Troll (fuite = −2 Endurance)
INSERT INTO encounter_rule (encounter_id, rule_type, rule_value, description)
VALUES (:id_troll, 'flee_penalty', '-2', 'Perd 2 Endurance en cas de fuite.');

-- Paragraphe 24 — Plantes Étrangleuses (pas de fuite)
INSERT INTO encounter_rule (encounter_id, rule_type, rule_value, description)
VALUES (:id_plantes, 'no_flee', NULL, 'Impossible de fuir.');

-- Paragraphe 34 — Centaure (pas de fuite)
INSERT INTO encounter_rule (encounter_id, rule_type, rule_value, description)
VALUES (:id_centaure, 'no_flee', NULL, 'Impossible de fuir.');

-- Paragraphe 55 — Farfadets (pas de fuite)
INSERT INTO encounter_rule (encounter_id, rule_type, rule_value, description)
VALUES (:id_farfadet_1, 'no_flee', NULL, 'Impossible de fuir.');
INSERT INTO encounter_rule (encounter_id, rule_type, rule_value, description)
VALUES (:id_farfadet_2, 'no_flee', NULL, 'Impossible de fuir.');
INSERT INTO encounter_rule (encounter_id, rule_type, rule_value, description)
VALUES (:id_farfadet_3, 'no_flee', NULL, 'Impossible de fuir.');
INSERT INTO encounter_rule (encounter_id, rule_type, rule_value, description)
VALUES (:id_farfadet_4, 'no_flee', NULL, 'Impossible de fuir.');

-- Paragraphe 60 — Araignée (dégâts spéciaux)
INSERT INTO encounter_rule (encounter_id, rule_type, rule_value, description)
VALUES (:id_araignee, 'conditional_damage_override', '4/2/6', 'Morsure : 4 dégâts (2 si Chance, 6 si Malchance).');

-- Paragraphe 85 — Monstre Aquatique (−1 Habileté par assaut)
INSERT INTO encounter_rule (encounter_id, rule_type, rule_value, description)
VALUES (:id_monstre_aquatique, 'per_round_penalty', '-1_habilete', 'À partir du 2e assaut, -1 Habileté par assaut.');

-- Paragraphe 89 — Ours + Loup (comportement spécial)
INSERT INTO encounter_rule (encounter_id, rule_type, rule_value, description)
VALUES (:id_ours_89, 'multi_enemy_behavior', 'focus_hero', 'L’ours attaque toujours le héros.');

INSERT INTO encounter_rule (encounter_id, rule_type, rule_value, description)
VALUES (:id_loup_89, 'multi_enemy_behavior', 'attack_other_enemy', 'Le loup attaque l’ours.');

INSERT INTO encounter_rule (encounter_id, rule_type, rule_value, description)
VALUES (:id_ours_89, 'no_flee', NULL, 'Impossible de fuir.');

-- Paragraphe 94 — Fée Ténébreuse (combat complexe)
INSERT INTO encounter_rule (encounter_id, rule_type, rule_value, description)
VALUES (:id_fee_tenebreuse, 'conditional_skill_override', '-2_if_no_vision', '−2 Habileté sauf si pierre percée ou couronne.');

INSERT INTO encounter_rule (encounter_id, rule_type, rule_value, description)
VALUES (:id_fee_tenebreuse, 'conditional_damage_override', '3/2/4', 'Toucher glacial : 3 dégâts (2 si Chance, 4 si Malchance).');

INSERT INTO encounter_rule (encounter_id, rule_type, rule_value, description)
VALUES (:id_fee_tenebreuse, 'conditional_damage_override', 'reduced_if_vitality', 'Symbole de Vitalité réduit les dégâts.');
