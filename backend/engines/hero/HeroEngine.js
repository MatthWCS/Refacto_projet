import { Dice } from "../Dice.js";
import { Hero } from "./Hero.js";
import { Logger, LogLevel } from "../Logger.js";

// -------------------------------------------------------
// HeroEngine
// Responsabilité : manipulation des attributs, flags,
//                  états et inventaire du héros.
// -------------------------------------------------------
export class HeroEngine {

    /**
     * @param {object|Hero|null} hero    - Données héros (sauvegarde ou null)
     * @param {Logger}           [logger]
     */
    constructor(hero = null, logger = new Logger(LogLevel.INFO, "[HeroEngine]")) {
        this.logger = logger;
        this.hero = hero ? new Hero(hero) : null;
    }

    // -------------------------------------------------------
    // INITIALISATION INTERACTIVE (délégué à une UI externe)
    // -------------------------------------------------------

    /**
     * Crée un nouveau héros via des jets de dés interactifs.
     * L'affichage est délégué à l'objet `io` — HeroEngine ne
     * touche pas à console directement.
     *
     * @param {object} io - { wait(msg): Promise<void> , print(msg): void }
     */
    async initializeHeroInteractive(io) {
        io.print("=== Création du héros ===\n");

        await io.wait("Lancer la DEXTÉRITÉ (1D6 + 6) — appuyez sur Entrée");
        const d1 = Dice.roll1D6();
        const dex = d1 + 6;
        io.print(`→ ${d1} → DEXTÉRITÉ = ${dex}\n`);

        await io.wait("Lancer l'ENDURANCE (2D6 + 12) — appuyez sur Entrée");
        const e1 = Dice.roll1D6();
        const e2 = Dice.roll1D6();
        const end = e1 + e2 + 12;
        io.print(`→ ${e1} + ${e2} → ENDURANCE = ${end}\n`);

        await io.wait("Lancer la CHANCE (1D6 + 6) — appuyez sur Entrée");
        const l1 = Dice.roll1D6();
        const luck = l1 + 6;
        io.print(`→ ${l1} → CHANCE = ${luck}\n`);

        this.hero = new Hero({
            name: "Héros",
            dexterity: dex,
            initial_dexterity: dex,
            endurance: end,
            initial_endurance: end,
            luck,
            initial_luck: luck,
            drunkness: 0,
            inventory: [],
            flags: [],
            states: []
        });

        this.logger.info("Héros créé :", this.hero.name);
    }

    // -------------------------------------------------------
    // ATTRIBUTS
    // -------------------------------------------------------

    /**
     * Lit un attribut du héros.
     * @param {string} attribute
     * @returns {*}
     */
    getAttribute(attribute) {
        const val = this.hero[attribute];
        if (val === undefined) {
            this.logger.warn(`getAttribute : attribut inconnu "${attribute}"`);
        }
        return val;
    }

    /**
     * Calcule le malus de Dextérité dû à l'Ivresse.
     * Malus = ceil(drunkness / 2) — appliqué temporairement lors des jets,
     * sans modifier la DEX stockée.
     * @returns {number}
     */
    getDrunknessPenalty() {
        return Math.ceil((this.hero.drunkness ?? 0) / 2);
    }

    /**
     * Modifie un attribut avec clamping automatique.
     * - endurance / dexterity / luck sont clampées entre 0 et leur valeur initiale.
     * - drunkness est clampée à 0 minimum, sans plafond.
     *
     * @param {string} attribute
     * @param {"add"|"subtract"|"set_to"|"set_to_base"} operation
     * @param {number} [value]
     */
    modifyAttribute(attribute, operation, value) {
        if (this.hero[attribute] === undefined) {
            this.logger.warn(`modifyAttribute : attribut inconnu "${attribute}"`);
            return;
        }

        switch (operation) {
            case "add":
                this.hero[attribute] += value;
                break;
            case "subtract":
                this.hero[attribute] -= value;
                break;
            case "set_to":
                this.hero[attribute] = value;
                break;
            case "set_to_base":
                this.hero[attribute] = this.hero[`initial_${attribute}`] ?? this.hero[attribute];
                break;
            default:
                this.logger.warn(`modifyAttribute : opération inconnue "${operation}"`);
                return;
        }

        this._clampAttribute(attribute);

        this.logger.debug(`${attribute} → ${this.hero[attribute]}`);
    }

    /** @private — clamp entre 0 et la valeur initiale si elle existe */
    _clampAttribute(attribute) {
        if (typeof this.hero[attribute] !== "number") return;

        // Minimum à 0 pour tous les attributs
        if (this.hero[attribute] < 0) {
            this.hero[attribute] = 0;
        }

        // drunkness n'a pas de plafond
        if (attribute === "drunkness") return;

        // Maximum = valeur initiale (si définie)
        const max = this.hero[`initial_${attribute}`];
        if (max !== undefined && this.hero[attribute] > max) {
            this.hero[attribute] = max;
        }
    }

    // -------------------------------------------------------
    // INVENTAIRE
    // -------------------------------------------------------

    /**
     * @param {number} item_id
     * @returns {boolean}
     */
    hasItem(item_id) {
        return this.hero.inventory?.some(i => i.item_id === item_id) ?? false;
    }

    // -------------------------------------------------------
    // FLAGS
    // -------------------------------------------------------

    addFlag(flag_id) {
        if (!this.hero.flags.includes(flag_id)) {
            this.hero.flags.push(flag_id);
            this.logger.debug(`Flag ajouté : ${flag_id}`);
        }
    }

    hasFlag(flag_id) {
        return this.hero.flags.includes(flag_id);
    }

    removeFlag(flag_id) {
        this.hero.flags = this.hero.flags.filter(f => f !== flag_id);
        this.logger.debug(`Flag retiré : ${flag_id}`);
    }

    // -------------------------------------------------------
    // ÉTATS (lecture seule — écriture déléguée à StateEngine)
    // -------------------------------------------------------

    /**
     * Lecture seule : StateEngine est l'autorité pour add/remove.
     * @param {number} state_id
     * @returns {boolean}
     */
    hasState(state_id) {
        return this.hero.states?.some(s => s.state_id === state_id) ?? false;
    }
}