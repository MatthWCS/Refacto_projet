import { Dice } from "./Dice.js";
import { Logger, LogLevel } from "./Logger.js";

// -------------------------------------------------------
// Constantes
// -------------------------------------------------------
const MAX_ROUNDS = 50;
const BASE_DAMAGE = 2;
const LUCKY_DAMAGE_BONUS = 2;   // bonus si Chance réussie sur une attaque
const UNLUCKY_DAMAGE_MOD = 1;   // malus si Chance ratée sur une défense

// -------------------------------------------------------
// CombatEngine
// Responsabilité : logique pure du combat (sans UI)
// -------------------------------------------------------
export class CombatEngine {

    /**
     * @param {object} heroEngine
     * @param {object} stateEngine
     * @param {Logger} [logger]
     */
    constructor(heroEngine, stateEngine, logger = new Logger(LogLevel.INFO)) {
        this.heroEngine = heroEngine;
        this.stateEngine = stateEngine;
        this.logger = logger;
    }

    // -------------------------------------------------------
    // 1. RÈGLES PRÉ-COMBAT
    // -------------------------------------------------------

    /**
     * Applique les règles avant le début des rounds.
     * Mutate les objets monsters (target, isAlly) et l'état du héros.
     *
     * @param {object[]} rules
     * @param {object[]} monsters
     */
    applyPreCombatRules(rules, monsters) {

        // La cible initiale est déjà fixée dans _loadMonsters
        // depuis le champ character.target en BDD.
        // On marque les alliés pour les helpers qui en ont besoin.
        monsters.forEach(monster => {
            if (monster.character_type === "ally") {
                monster.isAlly = true;
            }
        });

        // Règles par monstre
        monsters.forEach(monster => {
            monster.rules?.forEach(rule => {
                this.applyPreCombatRule(rule, monster, monsters);
            });
        });

        // Règles globales du combat
        rules.forEach(rule => {
            this.applyPreCombatRule(rule, null, monsters);
        });
    }

    /** @private */
    applyPreCombatRule(rule, monster, allMonsters) {
        switch (rule.rule_type) {

            case "multi_enemy_behavior":
                if (!monster) break;
                if (rule.params.value === "focus_hero") monster.target = "hero";
                if (rule.params.value === "attack_other_enemy") monster.target = "other_enemy";
                break;

            case "ally":
                if (!monster) break;
                monster.isAlly = true;
                monster.target = "other_enemy";
                break;

            case "no_flee":
                this._noFlee = true;
                break;

            case "focus_hero":
                allMonsters.forEach(m => { m.target = "hero"; });
                break;

            case "skill_penalty_unless_item":
                if (!this.heroEngine.hasItem(rule.params.item_id)) {
                    this.heroEngine.modifyAttribute("dexterity", "subtract", rule.params.amount);
                    this.logger.info(`Malus de compétence appliqué : -${rule.params.amount} DEX`);
                }
                break;

            default:
                this.logger.debug(`Règle pré-combat inconnue ignorée : ${rule.rule_type}`);
        }
    }

    // -------------------------------------------------------
    // 2. RÈGLES PENDANT LE COMBAT
    // -------------------------------------------------------

    /**
     * Applique les dégâts et effets spéciaux d'un round.
     *
     * @param {RoundResult} result
     * @param {object[]}    rules
     * @param {number}      round  - Numéro du round (commence à 1)
     * @param {object[]}    monsters
     */
    applyDuringCombatRules(result, rules, round, monsters) {

        // 1) Dégâts ennemis → héros
        if (result.charactersHitHero > 0) {
            const perHit = result.damagePerHit ?? BASE_DAMAGE;
            const dmg = result.charactersHitHero * perHit;
            this.heroEngine.modifyAttribute("endurance", "subtract", dmg);
            this.logger.debug(`Héros perd ${dmg} END (${result.charactersHitHero} touche(s) × ${perHit})`);
        }

        // 2) Dégâts héros → ennemis ciblés
        result.heroTargets.forEach(id => {
            const target = this.findMonster(monsters, id);
            if (target) {
                target.endurance = Math.max(0, target.endurance - BASE_DAMAGE);
                this.logger.debug(`${target.name} perd ${BASE_DAMAGE} END → reste ${target.endurance}`);
            }
        });

        // 3) Dégâts bonus Chance → mêmes cibles
        if (result.extraDamage) {
            result.heroTargets.forEach(id => {
                const target = this.findMonster(monsters, id);
                if (target) {
                    target.endurance = Math.max(0, target.endurance - result.extraDamage);
                    this.logger.debug(`Bonus Chance sur ${target.name} : ${result.extraDamage} END`);
                }
            });
        }

        // 4) Dégâts alliés → ennemis
        result.alliesHits.forEach(hit => {
            const target = this.findMonster(monsters, hit.enemyId);
            if (target) {
                target.endurance = Math.max(0, target.endurance - BASE_DAMAGE);
                this.logger.debug(`Allié touche ${target.name} : -${BASE_DAMAGE} END`);
            }
        });

        // 5) Règles spéciales
        rules.forEach(rule => {
            this.applySpecialRule(rule, result, round, monsters);
        });
    }

    /** @private */
    applySpecialRule(rule, result, round, monsters) {
        switch (rule.rule_type) {

            case "damage_on_hit":
                if (result.charactersHitHero > 0) {
                    const dmg = rule.params.amount * result.charactersHitHero;
                    this.heroEngine.modifyAttribute("endurance", "subtract", dmg);
                    this.logger.info(`damage_on_hit : -${dmg} END`);
                }
                break;

            case "damage_on_hit_unless_item":
                if (!this.heroEngine.hasItem(rule.params.item_id) && result.charactersHitHero > 0) {
                    this.heroEngine.modifyAttribute("endurance", "subtract", rule.params.amount);
                    this.logger.info(`damage_on_hit_unless_item : -${rule.params.amount} END`);
                }
                break;

            case "conditional_damage":
                if (result.charactersHitHero > 0) {
                    const dmg = this.resolveConditionalDamage(rule);
                    this.heroEngine.modifyAttribute("endurance", "subtract", dmg);
                    this.logger.info(`conditional_damage : -${dmg} END`);
                }
                break;

            case "ally_damage_each_round":
                // Inflige des dégâts à chaque ennemi vivant (target === "hero")
                // N'affecte PAS les alliés ni le héros
                monsters
                    .filter(m => m.target === "hero" && m.endurance > 0)
                    .forEach(m => {
                        m.endurance = Math.max(0, m.endurance - rule.params.amount);
                        this.logger.debug(`ally_damage_each_round : ${m.name} -${rule.params.amount} END`);
                    });
                break;

            case "per_round_penalty":
                // Commence au round 2 ; malus cumulatif
                if (round > 1) {
                    const amount = rule.params.amount ?? 1;
                    const totalLoss = (round - 1) * amount;
                    const newDex = this.heroEngine.hero.initial_dexterity - totalLoss;
                    this.heroEngine.modifyAttribute("dexterity", "set_to", newDex);
                    this.logger.info(`per_round_penalty : DEX → ${newDex} (-${totalLoss} cumulé)`);
                }
                break;

            case "conditional_damage_override":
                if (result.charactersHitHero > 0) {
                    const dmg = this.resolveConditionalDamageOverride(rule);
                    this.heroEngine.modifyAttribute("endurance", "subtract", dmg);
                    this.logger.info(`conditional_damage_override : -${dmg} END`);
                }
                break;

            case "per_win_assault_damage":
                let characterHitHeroCount = 0
                const amount = rule.params.amount ?? 1;

                if (result.charactersHitHero > 0) {
                    characterHitHeroCount++;
                    const dmgPerWinAssault = characterHitHeroCount * amount;
                    this.heroEngine.modifyAttribute("endurance", "subtract", dmgPerWinAssault);
                    this.logger.info(`per_win_assault_damage : -${dmgPerWinAssault} END`);
                }
                break;

            default:
                this.logger.debug(`Règle spéciale inconnue ignorée : ${rule.rule_type}`);
        }
    }

    // -------------------------------------------------------
    // 3. RÈGLES POST-COMBAT
    // -------------------------------------------------------

    /**
     * @param {object[]} rules
     * @param {object[]} monsters
     */
    applyPostCombatRules(rules, monsters) {
        const allDead = monsters.every(m => m.endurance <= 0);

        rules.forEach(rule => {
            switch (rule.rule_type) {

                case "regain_skill_after_victory":
                    if (allDead) {
                        this.heroEngine.modifyAttribute("dexterity", "set_to_base");
                        this.logger.info("DEX restaurée après victoire.");
                    }
                    break;

                case "grant_state_after_victory":
                    if (allDead) {
                        this.stateEngine.addState(rule.params.state_id);
                        this.logger.info(`État accordé : ${rule.params.state_id}`);
                    }
                    break;

                default:
                    this.logger.debug(`Règle post-combat inconnue ignorée : ${rule.rule_type}`);
            }
        });
    }

    // -------------------------------------------------------
    // 4. FUITE
    // -------------------------------------------------------

    /** @returns {boolean} */
    canFlee(rules) {
        if (this._noFlee) return false;

        if (rules.some(r =>
            r.rule_type === "combat_behavior" && r.params?.value === "no_flee"
        )) return false;

        return rules.some(r =>
            r.rule_type === "combat_behavior" && r.params?.value === "can_flee"
        );
    }

    /** @param {object[]} rules */
    applyFleePenalty(rules) {
        rules.forEach(rule => {
            if (rule.rule_type === "flee_penalty") {
                this.heroEngine.modifyAttribute("endurance", "subtract", rule.params.amount);
                this.logger.info(`Pénalité de fuite : -${rule.params.amount} END`);
            }
        });
    }

    // -------------------------------------------------------
    // 5. ROUND — calcul des jets (sans effets)
    // -------------------------------------------------------

    /**
     * Calcule tous les jets d'un round sans appliquer de dégâts.
     * Retourne un objet RoundResult pur.
     *
     * @param {object[]} monsters
     * @returns {RoundResult}
     */
    /**
     * @param {object[]} monsters
     * @param {number|null} chosenTargetId  - ID de la cible choisie par le joueur (null = auto)
     */
    resolveRound(monsters, chosenTargetId = null) {

        const drunkPenalty = this.heroEngine.getDrunknessPenalty();
        const heroAttack = (this.heroEngine.hero.dexterity - drunkPenalty) + Dice.roll2D6();
        if (drunkPenalty > 0) {
            this.logger.debug(`Malus Ivresse : -${drunkPenalty} DEX effective`);
        }

        // Jets individuels pour tous les participants vivants
        const perEnemy = monsters.map(m => {
            if (m.endurance <= 0) {
                return { id: m.id, name: m.name, roll: null, attack: -Infinity, target: m.target };
            }
            const roll = Dice.roll2D6();
            const attack = roll + m.dexterity;
            return { id: m.id, name: m.name, roll, attack, target: m.target };
        });

        const getEntry = id => perEnemy.find(e => e.id === id);

        // -------------------------------------------------------
        // Résolution par participant selon son target
        // -------------------------------------------------------
        const heroTargets = [];
        let charactersHitHero = 0;
        const alliesHits = [];

        for (const m of monsters) {
            if (m.endurance <= 0) continue;
            const entry = getEntry(m.id);

            if (m.target === "hero") {
                // Tous les ennemis ciblant le héros peuvent le toucher
                if (entry.attack > heroAttack) {
                    charactersHitHero++;
                }

            } else if (m.target === "other_enemy") {
                // Allié — attaque le premier ennemi vivant qui cible le héros
                const targetEnemy = monsters.find(
                    e => e.target === "hero" && e.endurance > 0
                );
                if (targetEnemy) {
                    const enemyEntry = getEntry(targetEnemy.id);
                    if (entry.attack > enemyEntry.attack) {
                        alliesHits.push({
                            ally: m.name,
                            enemy: targetEnemy.name,
                            enemyId: targetEnemy.id
                        });
                        this.logger.info(`${m.name} touche ${targetEnemy.name} !`);
                    }
                }
            }
        }

        // Le héros ne touche que sa cible choisie, et seulement si son
        // attaque est supérieure à l'attaque de cette cible.
        if (chosenTargetId !== null) {
            const chosenEntry = getEntry(chosenTargetId);
            const chosenMonster = monsters.find(m => m.id === chosenTargetId);
            if (chosenEntry && chosenMonster && chosenMonster.endurance > 0) {
                if (heroAttack > chosenEntry.attack) {
                    heroTargets.push(chosenTargetId);
                }
            }
        }

        return {
            heroAttack,
            perEnemy,
            heroTargets,
            chosenTargetId,
            enemyHit: heroTargets.length > 0,
            charactersHitHero,
            alliesHits,
            alliesHitEnemies: alliesHits.length,
            damagePerHit: null,
            extraDamage: null,
        };
    }

    // -------------------------------------------------------
    // 6. COMBAT COMPLET (sans interaction)
    // -------------------------------------------------------

    /**
     * Lance le combat jusqu'à la mort du héros ou des ennemis.
     * En mode interactif, délègue chaque round à l'IO fourni.
     *
     * @param {object[]} monsters
     * @param {object[]} rules
     * @param {object}   [io]  - Instance CombatUI (optionnel)
     * @returns {Promise<CombatResult>}
     */
    async fight(monsters, rules, io = null) {

        this._noFlee = false;
        const log = [];
        let round = 1;

        this.applyPreCombatRules(rules, monsters);

        const enemies = () => monsters.filter(m => m.target === "hero" && m.endurance > 0);
        const hasEnemiesAlive = () => enemies().length > 0;

        // Choix initial de la cible (uniquement si plusieurs ennemis et UI disponible)
        let chosenTargetId = null;
        if (io && enemies().length > 1) {
            chosenTargetId = await io.askTarget(enemies(), null);
        } else if (enemies().length === 1) {
            chosenTargetId = enemies()[0].id;
        }

        while (this.heroEngine.hero.endurance > 0 && hasEnemiesAlive()) {

            if (round > MAX_ROUNDS) {
                this.logger.warn("Limite de rounds atteinte — combat interrompu.");
                return { outcome: "max_rounds_reached", log };
            }

            const result = this.resolveRound(monsters, chosenTargetId);

            this.logger.debug(`Round ${round} — héros ${result.heroAttack}, ennemis: ${result.perEnemy.map(e => e.attack).join(", ")}`);

            // Phase interactive : l'UI peut modifier damagePerHit / extraDamage
            if (io) {
                const shouldFlee = await io.onRoundResolved(result, round, this, rules);
                if (shouldFlee) {
                    this.applyFleePenalty(rules);
                    return { outcome: "fled", log };
                }
            }

            this.applyDuringCombatRules(result, rules, round, monsters);

            log.push(this.buildLogEntry(result, round, monsters));

            // Re-choix si la cible vient de mourir et qu'il reste des ennemis
            const chosenMonster = monsters.find(m => m.id === chosenTargetId);
            if (io && chosenMonster?.endurance <= 0 && enemies().length > 0) {
                if (enemies().length === 1) {
                    chosenTargetId = enemies()[0].id;
                    this.logger.info(`Nouvelle cible automatique : ${enemies()[0].name}`);
                } else {
                    chosenTargetId = await io.askTarget(enemies(), chosenTargetId);
                }
            }

            round++;
        }

        this.applyPostCombatRules(rules, monsters);

        // Toujours restaurer la DEX de base en fin de combat
        this.heroEngine.modifyAttribute("dexterity", "set_to_base");

        const outcome = this.heroEngine.hero.endurance <= 0 ? "hero_dead" : "monsters_dead";
        this.logger.info(`Combat terminé : ${outcome}`);

        return {
            outcome,
            finalDexterity: this.heroEngine.hero.dexterity,
            finalEndurance: this.heroEngine.hero.endurance,
            log,
        };
    }

    // -------------------------------------------------------
    // Helpers privés
    // -------------------------------------------------------

    /** @private */
    findMonster(monsters, id) {
        const m = monsters.find(m => m.id === id);
        if (!m) this.logger.warn(`Monster introuvable : id=${id}`);
        return m ?? null;
    }

    /** @private */
    resolveConditionalDamage(rule) {
        // Extensible : lire rule.params pour choisir la valeur
        return rule.params?.amount ?? BASE_DAMAGE;
    }

    /** @private */
    resolveConditionalDamageOverride(rule) {
        const baseDamage = rule.params?.base ?? 4;
        const luckyDamage = rule.params?.lucky ?? 2;
        const unluckyDamage = rule.params?.unlucky ?? 6;

        if (!rule.params?.use_luck) {
            this.logger.info(`Morsure venimeuse : -${baseDamage} END`);
            return baseDamage;
        }

        const luckRoll = Dice.testLuck(this.heroEngine.hero);
        this.heroEngine.modifyAttribute("luck", "subtract", 1);

        if (luckRoll.success) {
            this.logger.info(`Test de Chance réussi ! -${luckyDamage} END seulement.`);
            return luckyDamage;
        } else {
            this.logger.info(`Malchance ! Venin : -${unluckyDamage} END.`);
            return unluckyDamage;
        }
    }

    /** @private */
    buildLogEntry(result, round, monsters) {
        return {
            round,
            heroAttack: result.heroAttack,
            perEnemy: result.perEnemy,
            enemyHit: result.enemyHit,
            charactersHitHero: result.charactersHitHero,
            alliesHits: result.alliesHits,
            damagePerHit: result.damagePerHit ?? BASE_DAMAGE,
            extraDamage: result.extraDamage ?? 0,
            heroDexterity: this.heroEngine.hero.dexterity,
            heroEndurance: this.heroEngine.hero.endurance,
            heroLuck: this.heroEngine.hero.luck,
            enemiesEndurance: monsters.map(m => ({ id: m.id, name: m.name, endurance: m.endurance })),
        };
    }
}