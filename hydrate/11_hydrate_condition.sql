-- Condition 1 : Possède la pierre percée
INSERT INTO `condition` (type, item_id) VALUES ('has_item', 5);

-- Condition 2 : Possède une pièce d’or
INSERT INTO `condition` (type, item_id) VALUES ('has_item', 18);

-- Condition 3 : Porte la couronne protectrice
INSERT INTO `condition` (type, item_id) VALUES ('has_item', 8);

-- Condition 4 : Porte la couronne révélatrice
INSERT INTO `condition` (type, item_id) VALUES ('has_item', 7);

-- Condition 5 : Possède trèfles + pâquerettes
INSERT INTO `condition` (type, item_id) VALUES ('has_item', 17);

-- Condition 6 : Possède un instrument de musique
INSERT INTO `condition` (type, item_id) VALUES ('has_item', 3);
INSERT INTO `condition` (type, item_id) VALUES ('has_item', 4);
INSERT INTO `condition` (type, item_id) VALUES ('has_item', 14);

-- Condition 7 : Possède Baume d’Écorce
INSERT INTO `condition` (type, item_id) VALUES ('has_item', 1);

-- Condition 8 : Possède Graine d’Enchevêtrement
INSERT INTO `condition` (type, item_id) VALUES ('has_item', 2);

-- Condition 9 : Possède le bracelet de Niamh (flag)
INSERT INTO flag (name, description) VALUES ('bracelet_niamh', 'Bracelet donné par Niamh');
INSERT INTO `condition` (type, flag_id)
VALUES ('has_flag', (SELECT id FROM flag WHERE name='bracelet_niamh'));