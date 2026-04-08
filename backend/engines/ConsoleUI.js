import { CombatUI } from "./CombatUI.js";
import { Logger, LogLevel } from "./Logger.js";

// -------------------------------------------------------
// ConsoleUI
// Responsabilité : toute l'interaction joueur en console
//   — affichage des paragraphes, choix, items, combat
//
// Implémente l'interface attendue par GameEngine (ui).
// -------------------------------------------------------
export class ConsoleUI {

    /**
     * @param {ConsoleIO} io
     * @param {Logger}    [logger]
     */
    constructor(io, logger = new Logger(LogLevel.INFO, "[ConsoleUI]")) {
        this.io = io;
        this.logger = logger;
        this.combatUI = new CombatUI(this._makeCombatIO(), logger);
    }

    // -------------------------------------------------------
    // Interface GameEngine.ui
    // -------------------------------------------------------

    /** @param {object} result  @param {object} hero */
    renderParagraph(result, hero) {
        this.io.print("\n" + "─".repeat(48));
        this.io.print(`§ Paragraphe : ${result.paragraphId ?? "?"}`);
        this.io.print("─".repeat(48) + "\n");
        this.io.print(result.content || "(pas de texte)");
        const penalty = hero.drunkness > 0 ? Math.ceil(hero.drunkness / 2) : 0;
        const dexDisplay = penalty > 0
            ? `DEX ${hero.dexterity} (-${penalty} ivresse)`
            : `DEX ${hero.dexterity}`;
        this.io.print(`\n[${dexDisplay} | END ${hero.endurance} | CHANCE ${hero.luck} | IVRESSE ${hero.drunkness}]`);
    }

    /** @param {object[]} choices  @param {Function} onChoice */
    renderChoices(choices, onChoice) {
        this.io.print("\nChoix disponibles :");
        choices.forEach((c, i) => {
            this.io.print(`  ${i + 1}. ${c.content} → §${c.target_paragraph_id}`);
        });

        this.io.ask("\nVotre choix : ").then(answer => {
            const index = parseInt(answer, 10) - 1;
            if (isNaN(index) || index < 0 || index >= choices.length) {
                this.io.print("Choix invalide.");
                this.renderChoices(choices, onChoice);
                return;
            }
            onChoice(choices[index]);
        });
    }

    renderNoChoices() {
        this.io.print("\n(Aucun choix disponible — fin de l'aventure ?)");
    }

    /** @param {object} hero */
    renderGameOver(hero) {
        this.io.print("\n╔══════════════════════════════╗");
        this.io.print("║          GAME  OVER          ║");
        this.io.print("╚══════════════════════════════╝");
        this.io.print(`\n${hero.name} a succombé. END finale : ${hero.endurance}`);
        this.io.close();
    }

    /** @param {string} msg */
    renderError(msg) {
        this.io.print(`[ERREUR] ${msg}`);
    }

    /**
     * Attend une pression sur Entrée avant de continuer.
     * Utilisé après les tests de dés pour laisser le joueur lire le résultat.
     */
    async waitForInput() {
        await this.io.wait("Appuyez sur Entrée pour continuer...");
    }

    /**
     * Affiche le message de fin d'aventure.
     * @param {"success"|"failure"} endingType
     */
    renderEnding(endingType) {
        if (endingType === "success") {
            this.io.print("\n╔══════════════════════════════════╗");
            this.io.print("║     FIN DE L'AVENTURE — SUCCÈS   ║");
            this.io.print("║   Félicitations, aventurier !    ║");
            this.io.print("╚══════════════════════════════════╝");
        } else {
            this.io.print("\n╔══════════════════════════════════╗");
            this.io.print("║     FIN DE L'AVENTURE — ÉCHEC    ║");
            this.io.print("║   L'aventure se termine ici...   ║");
            this.io.print("╚══════════════════════════════════╝");
        }
    }

    /**
     * Propose au joueur de rejouer ou de quitter.
     * @returns {Promise<"replay"|"quit">}
     */
    async askEndingChoice() {
        this.io.print("\n1. Rejouer depuis le début");
        this.io.print("2. Quitter");
        const answer = await this.io.ask("Votre choix : ");
        return answer === "1" ? "replay" : "quit";
    }

    /**
     * Ferme le terminal.
     */
    close() {
        this.io.print("\nAu revoir !");
        this.io.close();
    }

    // -------------------------------------------------------
    // Résultat d'un test de dés
    // -------------------------------------------------------

    /**
     * @param {{ attribute: string, roll: number, threshold: number|null, success: boolean }} testResult
     */
    renderTestResult(testResult) {
        const { attribute, roll, threshold, success, diceCount = 2 } = testResult;

        const labels = {
            chance: "Chance",
            dexterity: "Dextérité",
            drunkness: "Ivresse",
            parity: "Parité",
            random: "Hasard"
        };
        const label = labels[attribute] ?? attribute;
        const dice = `${diceCount}D6`;

        this.io.print("\n" + "─".repeat(48));
        this.io.print(`Test de ${label} (${dice})`);

        if (attribute === "parity" || attribute === "random") {
            this.io.print(`   Jet : ${roll} → ${roll % 2 === 0 ? "Pair" : "Impair"}`);
        } else {
            this.io.print(`   Jet : ${roll}  |  Seuil : ${threshold}`);
        }

        if (attribute === "parity" || attribute === "random") {
            this.io.print(success
                ? `   ✔ Pair !`
                : `   ✘ Impair.`
            );
        } else {
            this.io.print(success
                ? `   ✔ Réussi !`
                : `   ✘ Échoué.`
            );
        }

        this.io.print("─".repeat(48));
    }

    // -------------------------------------------------------
    // Résumé de combat
    // -------------------------------------------------------

    /** @param {object} result — résultat retourné par ParagraphEngine après combat */
    renderCombatResult(result) {
        if (!result?.log?.length) return;

        this.io.print("\n" + "─".repeat(50));
        this.io.print("   RÉSUMÉ DU COMBAT");
        this.io.print("─".repeat(50));

        result.log.forEach((round, i) => {
            this.io.print(`\nRound ${i + 1}`);
            this.io.print(`  Jet du héros : ${round.heroAttack}`);

            round.perEnemy.forEach(e => {
                const atk = e.attack === -Infinity ? "mort" : `attaque ${e.attack}`;
                this.io.print(`  ${e.name} : jet ${e.roll ?? "—"} → ${atk}`);
            });

            this.io.print(round.enemyHit
                ? "  Le héros touche l'ennemi."
                : "  Le héros ne touche personne.");

            if (round.charactersHitHero > 0) {
                this.io.print(`  Le héros est touché ${round.charactersHitHero} fois.`);
            }

            if (round.alliesHitEnemies > 0) {
                this.io.print(`  Les alliés touchent ${round.alliesHitEnemies} fois.`);
                round.alliesHits.forEach(h => this.io.print(`    - ${h.ally} → ${h.enemy}`));
            }

            this.io.print("  État des ennemis :");
            round.enemiesEndurance.forEach(m => {
                this.io.print(`    - ${m.name} : ${m.endurance} END`);
            });

            this.io.print(`  END héros : ${round.heroEndurance}  |  CHANCE : ${round.heroLuck}`);
        });

        this.io.print("\n" + "─".repeat(50));
        this.io.print(`Issue : ${result.outcome}`);
        if (result.currentHeroDex !== undefined) {
            this.io.print(`DEX : ${result.currentHeroDex}  |  END : ${result.currentHeroEnd}`);
        }
        this.io.print("─".repeat(50) + "\n");
    }

    // -------------------------------------------------------
    // Gestion des items
    // -------------------------------------------------------

    /**
     * @param {object}          item
     * @param {InventoryEngine} inventoryEngine
     * @param {object}          [context]  — { inCombat, surprised }
     */
    async handleItemPickup(item, inventoryEngine, context = {}) {
        this.io.print(`\nVous trouvez : ${item.name}`);

        if (item.type === "equippable") {
            await this._handleEquippable(item, inventoryEngine);
        } else if (item.type === "consumable") {
            await this._handleConsumable(item, inventoryEngine, context);
        } else {
            await this._handleMisc(item, inventoryEngine);
        }
    }

    /** @private */
    async _handleEquippable(item, inv) {
        this.io.print("1. Équiper  2. Mettre dans l'inventaire  3. Laisser");
        const answer = await this.io.ask("Votre choix : ");

        if (answer === "1") {
            inv.addItem(item.item_id, item.quantity ?? 1);
            inv.equipItem(item.item_id);
            this.io.print(`${item.name} équipé !`);
        } else if (answer === "2") {
            inv.addItem(item.item_id, item.quantity ?? 1);
            this.io.print(`${item.name} ajouté à l'inventaire.`);
        } else {
            this.io.print("Vous laissez l'objet.");
        }
    }

    /** @private */
    async _handleConsumable(item, inv, context) {
        this.io.print("1. Utiliser  2. Mettre dans l'inventaire  3. Laisser");
        const answer = await this.io.ask("Votre choix : ");

        if (answer === "1") {
            inv.addItem(item.item_id, item.quantity ?? 1);
            const useResult = inv.useItem(item.item_id, context);
            this.io.print(useResult.success ? "L'objet a été utilisé." : useResult.message);
        } else if (answer === "2") {
            inv.addItem(item.item_id, item.quantity ?? 1);
            this.io.print(`${item.name} ajouté à l'inventaire.`);
        } else {
            this.io.print("Vous laissez l'objet.");
        }
    }

    /** @private */
    async _handleMisc(item, inv) {
        this.io.print("1. Prendre  2. Laisser");
        const answer = await this.io.ask("Votre choix : ");

        if (answer === "1") {
            inv.addItem(item.item_id, item.quantity ?? 1);
            this.io.print(`${item.name} ajouté à l'inventaire.`);
        } else {
            this.io.print("Vous laissez l'objet.");
        }
    }

    // -------------------------------------------------------
    // CombatIO — interface attendue par CombatUI
    // -------------------------------------------------------

    /** @private */
    _makeCombatIO() {
        return {
            askLuckUsage: async (result) => {
                this.io.print("\nUtiliser la Chance ?");
                this.io.print("1. Non");
                if (result.enemyHit) this.io.print("2. Augmenter les dégâts infligés");
                if (result.charactersHitHero) this.io.print("3. Réduire les dégâts subis");
                const answer = await this.io.ask("Ton choix : ");
                if (answer === "2" && result.enemyHit) return "increase";
                if (answer === "3" && result.charactersHitHero) return "reduce";
                return "none";
            },

            askTarget: async (enemies, previousTargetId) => {
                this.io.print("\nChoisissez votre cible :");
                enemies.forEach((e, i) => {
                    this.io.print(`  ${i + 1}. ${e.name} (END ${e.endurance})`);
                });
                const answer = await this.io.ask("Votre cible : ");
                const index = parseInt(answer, 10) - 1;
                if (isNaN(index) || index < 0 || index >= enemies.length) {
                    // Choix invalide → première cible par défaut
                    this.io.print(`Choix invalide, ${enemies[0].name} ciblé par défaut.`);
                    return enemies[0].id;
                }
                return enemies[index].id;
            },

            askContinueOrFlee: async (canFlee) => {
                this.io.print("\n1. Continuer le combat");
                if (canFlee) this.io.print("2. Fuir");
                const answer = await this.io.ask("Ton choix : ");
                if (answer === "2" && canFlee) return "flee";
                return "continue";
            }
        };
    }
}