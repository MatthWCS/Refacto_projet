1. Liste complète des combats avec règles spéciales

Voici tous les combats qui dérogent au système standard :
✅ Paragraphe 13 — Troll

Règle spéciale :

    Si tu fuis → tu perds 2 points d’Endurance.

👉 Ce n’est pas une règle de combat, mais une règle de fuite.
Tu peux la mettre dans encounter_rule si tu veux.
✅ Paragraphe 24 — Plantes Étrangleuses

Règle spéciale :

    Impossible de fuir.

✅ Paragraphe 34 — Centaure

Règle spéciale :

    Impossible de fuir.

    Avant le combat : test de Chance → dégâts éventuels.

👉 Le test n’est pas une règle de combat, mais l’interdiction de fuite oui.
❗ Paragraphe 47 — Araignée

Règle spéciale :

    Tu combats avec un malus d’Habileté si Ivresse > 0 (déjà géré par ton moteur).

    Rien de spécial côté ennemi.

👉 Pas de règle spéciale à coder ici.
❗ Paragraphe 48 — Spriggan

Règle spéciale :

    Si tu fuis → tu perds 3 points de Chance.

👉 Règle de fuite, pas de combat.
❗ Paragraphe 55 — Farfadets

Règle spéciale :

    Combat multiple (4 ennemis).

    Impossible de fuir.

👉 L’impossibilité de fuir est une règle.
❗ Paragraphe 60 — Araignée (toile)

Règle spéciale :

    Dégâts de morsure : 4 (ou 2 / 6 selon Chance).

👉 C’est une règle de dégâts spéciaux.
❗ Paragraphe 68 — Ours + Loup

Règle spéciale :

    L’ours attaque toujours le héros.

    Le loup attaque l’ours.

    Impossible de fuir.

👉 C’est un combat à 3 entités avec comportement spécial.
❗ Paragraphe 85 — Monstre Aquatique

Règle spéciale :

    À partir du 2ᵉ assaut : −1 Habileté par assaut.

    Impossible de fuir.

❗ Paragraphe 89 — Ours + Loup

Même règles que 68.
❗ Paragraphe 94 — Fée Ténébreuse

Règles spéciales :

    −2 Habileté sauf si pierre percée ou couronne.

    Dégâts spéciaux : 3 (ou 2 / 4 selon Chance).

    Protection si Symbole de Vitalité.

👉 C’est le combat le plus complexe du livre.


Pour encounter_rule
````
encounter_rule (
  id,
  encounter_id,
  rule_type,
  rule_value,
  description
)
````

rule_type possibles :
* no_flee
* flee_penalty
* damage_override
* damage_multiplier
* skill_penalty
* skill_override
* conditional_skill_override
* conditional_damage_override
* multi_enemy_behavior
* per_round_penalty

rule_value est un champ libre qui sert à stocker la valeur paramétrique d’une règle spéciale de combat.

Autrement dit :

    rule_type = quel type de règle ?

    rule_value = avec quel paramètre ?

Ton moteur lit :

    rule_type → identifie la logique à appliquer

    rule_value → lui donne les données nécessaires

🧱 Exemples concrets
1. Règle : impossible de fuir
sql

rule_type = 'no_flee'
rule_value = NULL

→ Pas besoin de paramètre.
2. Règle : pénalité en cas de fuite

Exemple : Troll (−2 Endurance)
sql

rule_type = 'flee_penalty'
rule_value = '-2'

Ton moteur fera :

    si fuite → héros.endurance += rule_value

3. Règle : dégâts spéciaux

Exemple : Araignée (4 dégâts, ou 2/6 selon Chance)
sql

rule_type = 'conditional_damage_override'
rule_value = '4/2/6'

Ton moteur interprète :

    valeur normale = 4

    si test de Chance réussi = 2

    si test raté = 6

4. Règle : pénalité par assaut

Exemple : Monstre aquatique (−1 Habileté par assaut)
sql

rule_type = 'per_round_penalty'
rule_value = '-1_habilete'

Ton moteur lit :

    à partir du 2ᵉ assaut → héros.habilete −= 1

5. Règle : comportement multi‑ennemis

Exemple : Ours attaque toujours le héros
sql

rule_type = 'multi_enemy_behavior'
rule_value = 'focus_hero'

Exemple : Loup attaque l’ours
sql

rule_type = 'multi_enemy_behavior'
rule_value = 'attack_other_enemy'

6. Règle : malus d’Habileté conditionnel

Exemple : Fée Ténébreuse (−2 Habileté sauf si pierre percée ou couronne)
sql

rule_type = 'conditional_skill_override'
rule_value = '-2_if_no_vision'

Ton moteur sait que :

    “vision” = pierre percée OU couronne

    si pas de vision → appliquer −2

🎯 Donc, en résumé :

rule_value est un paramètre qui dépend du rule_type.

Tu peux le voir comme :

rule_type	                    rule_value	        Signification
no_flee	                        NULL	            fuite impossible
flee_penalty	                -2	                perte d’endurance
conditional_damage_override	    4/2/6	            dégâts normal / chanceux / malchanceux
per_round_penalty	            -1_habilete	        malus par assaut
multi_enemy_behavior	        focus_hero	        comportement IA
conditional_skill_override	    -2_if_no_vision	    malus conditionnel