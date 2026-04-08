**Navigation**
- Paragraphes narratifs, tests de dés (chance, dextérité, ivresse, parité, random), combat
- Affichage des résultats de test
- Fins d'aventure (succès/échec) avec proposition rejouer/quitter

**Combat**
- Ciblage par `target` depuis la BDD
- Choix de cible unique + rechoix à la mort
- Alliés (`other_enemy`)
- Règles pré-combat : `skill_penalty_unless_item`, `skill_penalty_unless_any_item`, `multi_enemy_behavior`, `no_flee`
- Règles pendant le combat : `conditional_damage_override`, `per_round_penalty`, `ally_damage_each_round`
- Chance pendant les rounds
- Fuite avec pénalité
- Butin après victoire

**Héros**
- Ivresse avec malus temporaire DEX, décrément tous les 5 paragraphes
- Items (pick-up, équipement, consommables)
- Flags, états

**Persistence**
- Console (`DirectSaveService`) et HTTP (`SaveService` + routes)
- Effacement de sauvegarde après fin d'aventure

---

Quelle est la prochaine étape ? Le frontend web, les consommables, ou autre chose ?