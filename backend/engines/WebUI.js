import { CombatUI } from "./CombatUI.js";
import { Logger, LogLevel } from "./Logger.js";

// -------------------------------------------------------
// serializeHero
// Snapshot JSON du héros pour le frontend — base sur
// hero.serialize() + valeur calculee (malus Ivresse).
// -------------------------------------------------------
export function serializeHero(hero) {
    return {
        ...hero.serialize(),
        drunknessPenalty: hero.drunkness > 0 ? Math.ceil(hero.drunkness / 2) : 0
    };
}

// -------------------------------------------------------
// WebUI
// Responsabilite : implementer l'interface attendue par
//   GameEngine (ui) et CombatEngine (io, via CombatUI)
//   pour un contexte HTTP — sans bloquer le thread.
//
// Chaque methode "bloquante" en console pose ici un point
// d'attente (this.state.pending) et suspend une Promise
// jusqu'a ce que GameController.action() la resolve via
// resolve(type, value).
//
// Une seule decision peut etre en attente a la fois — ce
// qui correspond exactement au flux sequentiel du moteur.
// -------------------------------------------------------
export class WebUI {

    /** @param {Logger} [logger] */
    constructor(logger = new Logger(LogLevel.INFO, "[WebUI]")) {
        this.logger = logger;
        this.combatUI = new CombatUI(this._makeCombatIO(), logger);

        // Snapshot consultable par le frontend
        this.state = this._emptyState();

        // Type du pending courant — separe de state.pending pour
        // pouvoir valider une resolution sans dependre de la forme
        // exacte de l'objet expose au frontend.
        this._pendingType = null;

        // Resolver de la decision en cours (une seule a la fois)
        this._resolver = null;

        // Callback positionne par GameController avant de relancer
        // le moteur — appele quand un nouveau pending est pose ou
        // qu'un etat terminal est atteint.
        this.onSettled = null;
    }

    // -------------------------------------------------------
    // Etat
    // -------------------------------------------------------

    /** @private */
    _emptyState() {
        return {
            paragraphId: null,
            content: null,
            contentAfter: null,
            hero: null,
            choices: [],
            testResults: [],
            combat: null,
            items: [],
            ending: null,
            isGameOver: false,
            pending: null,
            error: null
        };
    }

    /**
     * Reinitialise les champs transitoires d'un tour avant de relancer
     * le moteur depuis une decision du joueur. paragraphId / content /
     * hero / choices sont conserves jusqu'a ce qu'ils soient remplaces.
     */
    beginTurn() {
        this.state.contentAfter = null;
        this.state.testResults = [];
        this.state.combat = null;
        this.state.items = [];
        this.state.error = null;
    }

    /**
     * @param {object} hero
     */
    refreshHero(hero) {
        this.state.hero = serializeHero(hero);
    }

    /**
     * Force un etat "game over" (utilise hors du flux normal,
     * ex: mort suite a l'utilisation d'un objet depuis l'inventaire).
     * @param {object} hero
     */
    triggerGameOver(hero) {
        this.refreshHero(hero);
        this.state.isGameOver = true;
        this._settle("game_over");
    }

    // -------------------------------------------------------
    // Mecanique d'attente / resolution
    // -------------------------------------------------------

    /**
     * @private
     * Pose un point d'attente et notifie GameController.
     * @param {string}   pendingType
     * @param {object}   payload
     * @param {Function} [resolver] - transforme la valeur recue avant resolution
     * @returns {Promise<*>}
     */
    _wait(pendingType, payload, resolver) {
        return new Promise(resolve => {
            this.state.pending = { type: pendingType, ...payload };
            this._pendingType = pendingType;
            this._resolver = (value) => {
                this._pendingType = null;
                this._resolver = null;
                resolve(resolver ? resolver(value) : value);
            };
            this.onSettled?.();
            this.onSettled = null;
        });
    }

    /**
     * @private
     * Etat terminal sans decision attendue (game over, fin, erreur...).
     * @param {string|null} pendingType
     * @param {object} [payload]
     */
    _settle(pendingType, payload = {}) {
        this.state.pending = pendingType ? { type: pendingType, ...payload } : null;
        this._pendingType = pendingType;
        this._resolver = null;
        this.onSettled?.();
        this.onSettled = null;
    }

    /**
     * Resout le pending courant — appele par GameController.action().
     * @param {string} type  - doit correspondre a state.pending.type
     * @param {*}      value
     * @returns {boolean} false si aucune decision de ce type n'est attendue
     */
    resolve(type, value) {
        if (this._pendingType !== type || !this._resolver) {
            return false;
        }
        this._resolver(value);
        return true;
    }

    // -------------------------------------------------------
    // Interface GameEngine.ui — affichage
    // -------------------------------------------------------

    /** @param {object} result  @param {object} hero */
    renderParagraph(result, hero) {
        this.state.paragraphId = result.paragraphId ?? this.state.paragraphId;
        this.state.content = result.content ?? null;
        this.refreshHero(hero);
    }

    /**
     * @param {string} content
     * @param {object} hero
     */
    renderContentAfter(content, hero) {
        this.state.contentAfter = content;
        this.refreshHero(hero);
    }

    /** @param {object[]} choices  @param {Function} onChoice */
    renderChoices(choices, onChoice) {
        this.state.choices = choices.map((c, index) => ({
            index,
            content: c.content,
            target_paragraph_id: c.target_paragraph_id
        }));

        // Fire-and-forget — comme ConsoleUI.renderChoices, GameEngine
        // n'attend pas cette methode.
        this._wait("choice", {}, (index) => {
            const choice = choices[index];
            if (!choice) {
                this.logger.warn(`WebUI.renderChoices : index invalide (${index})`);
                return;
            }
            onChoice(choice);
        });
    }

    renderNoChoices() {
        this._settle("no_choices");
    }

    /** @param {object} hero */
    renderGameOver(hero) {
        this.refreshHero(hero);
        this.state.isGameOver = true;
        this._settle("game_over");
    }

    /** @param {string} msg */
    renderError(msg) {
        this.state.error = msg;
        this._settle("error", { message: msg });
    }

    /**
     * Attend une confirmation du joueur avant de continuer
     * (apres l'affichage d'un resultat de test).
     */
    async waitForInput() {
        await this._wait("continue", {});
    }

    /** @param {"success"|"failure"} endingType */
    renderEnding(endingType) {
        this.state.ending = { type: endingType };
    }

    /** @returns {Promise<"replay"|"quit">} */
    async askEndingChoice() {
        return this._wait("ending_choice", {
            endingType: this.state.ending?.type ?? null,
            options: ["replay", "quit"]
        });
    }

    close() {
        this._settle("closed");
    }

    // -------------------------------------------------------
    // Resultat d'un test de des
    // -------------------------------------------------------

    /** @param {object} testResult */
    renderTestResult(testResult) {
        this.state.testResults.push(testResult);
    }

    // -------------------------------------------------------
    // Resume de combat (appele une fois, en fin de fight())
    // -------------------------------------------------------

    /** @param {object} result */
    renderCombatResult(result) {
        if (!result?.log?.length) return;
        this.state.combat = {
            ...(this.state.combat ?? {}),
            log: result.log,
            outcome: result.outcome,
            currentHeroDex: result.currentHeroDex,
            currentHeroEnd: result.currentHeroEnd
        };
    }

    // -------------------------------------------------------
    // Gestion des items (ramassage)
    // -------------------------------------------------------

    /**
     * @param {object}          item
     * @param {InventoryEngine} inventoryEngine
     * @param {object}          [context] - { inCombat, surprised }
     * @returns {Promise<null>}
     */
    async handleItemPickup(item, inventoryEngine, context = {}) {
        const isEquippable = item.type === "equippable";
        const options = isEquippable
            ? ["equip", "inventory", "discard"]
            : ["take", "discard"];

        const answer = await this._wait("item_pickup", { item, context, options });

        if (isEquippable) {
            if (answer === "equip") {
                inventoryEngine.addItem(item.item_id, item.quantity ?? 1);
                inventoryEngine.equipItem(item.item_id);
            } else if (answer === "inventory") {
                inventoryEngine.addItem(item.item_id, item.quantity ?? 1);
            }
        } else if (answer === "take") {
            inventoryEngine.addItem(item.item_id, item.quantity ?? 1);
        }

        this.state.items.push({ item, answer });
        return null;
    }

    // -------------------------------------------------------
    // CombatIO — interface attendue par CombatUI
    // -------------------------------------------------------

    /** @private */
    _makeCombatIO() {
        return {
            askTarget: async (enemies, previousTargetId) => {
                const value = await this._wait("combat_target", {
                    enemies: enemies.map(e => ({ id: e.id, name: e.name, endurance: e.endurance })),
                    previousTargetId: previousTargetId ?? null
                });

                if (!enemies.some(e => e.id === value)) {
                    this.logger.warn(`WebUI.askTarget : cible invalide (${value}), ${enemies[0].name} ciblee par defaut.`);
                    return enemies[0].id;
                }
                return value;
            },

            askLuckUsage: async (result) => {
                const options = ["none"];
                if (result.enemyHit) options.push("increase");
                if (result.charactersHitHero) options.push("reduce");

                const value = await this._wait("combat_luck", {
                    round: this._roundInfo(result),
                    options
                });

                return options.includes(value) ? value : "none";
            },

            askContinueOrFlee: async (canFlee) => {
                const options = canFlee ? ["continue", "flee"] : ["continue"];

                const value = await this._wait("combat_flee", {
                    canFlee,
                    options
                });

                return value === "flee" && canFlee ? "flee" : "continue";
            }
        };
    }

    /**
     * @private
     * Extrait les informations d'un round pour l'affichage frontend.
     */
    _roundInfo(result) {
        return {
            heroAttack: result.heroAttack,
            perEnemy: result.perEnemy,
            enemyHit: result.enemyHit,
            charactersHitHero: result.charactersHitHero,
            alliesHits: result.alliesHits
        };
    }
}