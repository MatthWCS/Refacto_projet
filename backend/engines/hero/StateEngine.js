import { Logger, LogLevel } from "../Logger.js";

// -------------------------------------------------------
// StateEngine
// Responsabilité : cycle de vie des états du héros
//   (ajout, suppression, durée, effets buff/debuff)
//
// AUTORITÉ unique pour add/remove d'états.
// HeroEngine expose uniquement hasState() en lecture.
// -------------------------------------------------------
export class StateEngine {

    /**
     * @param {HeroEngine}      heroEngine
     * @param {ConditionEngine} conditionEngine
     * @param {object[]}        stateDefinitions  - Tableau issu de la BDD
     * @param {Logger}          [logger]
     */
    constructor(heroEngine, conditionEngine, stateDefinitions = [], logger = new Logger(LogLevel.INFO, "[StateEngine]")) {
        this.heroEngine = heroEngine;
        this.conditionEngine = conditionEngine;
        this.logger = logger;

        if (!Array.isArray(stateDefinitions)) {
            throw new Error("stateDefinitions doit être un tableau");
        }

        // Index par state_id pour accès O(1)
        this.definitions = new Map(stateDefinitions.map(s => [s.id, s]));

        // Garantir que hero.states est initialisé
        if (this.heroEngine?.hero && !Array.isArray(this.heroEngine.hero.states)) {
            this.heroEngine.hero.states = [];
        }
    }

    // -------------------------------------------------------
    // 1. Ajouter un état
    // -------------------------------------------------------

    /**
     * @param {number}      state_id
     * @param {number|null} [remaining_duration] - null = durée de la définition SQL ou permanent
     * @param {string|null} [source_type]
     * @param {number|null} [source_type_id]
     */
    addState(state_id, remaining_duration = null, source_type = null, source_type_id = null) {
        const def = this.definitions.get(state_id);
        if (!def) {
            this.logger.warn(`addState : état inconnu id=${state_id}`);
            return;
        }

        // Durée par défaut depuis la définition SQL
        if (remaining_duration === null && def.duration) {
            remaining_duration = def.duration;
        }

        this.heroEngine.hero.states.push({ state_id, remaining_duration, source_type, source_type_id });
        this.logger.debug(`État ajouté : ${def.name ?? state_id} (durée=${remaining_duration ?? "permanent"})`);
    }

    // -------------------------------------------------------
    // 2. Supprimer un état
    // -------------------------------------------------------

    /** @param {number} state_id */
    removeState(state_id) {
        const before = this.heroEngine.hero.states.length;
        this.heroEngine.hero.states = this.heroEngine.hero.states.filter(s => s.state_id !== state_id);
        const removed = before - this.heroEngine.hero.states.length;
        if (removed > 0) this.logger.debug(`État retiré : id=${state_id}`);
    }

    /** @param {number} state_id @returns {boolean} */
    hasState(state_id) {
        return this.heroEngine.hero.states.some(s => s.state_id === state_id);
    }

    // -------------------------------------------------------
    // 3. Appliquer les effets buff/debuff des états actifs
    // -------------------------------------------------------

    /**
     * Applique les modificateurs d'attribut de chaque état actif.
     * Typiquement appelé une fois par paragraphe (poison, régénération…).
     */
    applyStateEffects() {
        this.heroEngine.hero.states.forEach(active => {
            const def = this.definitions.get(active.state_id);
            if (!def) return;

            if (def.attribute && def.value !== undefined) {
                this.heroEngine.modifyAttribute(def.attribute, "add", def.value);
                this.logger.debug(`Effet état ${def.name ?? active.state_id} : ${def.attribute} +${def.value}`);
            }
        });
    }

    // -------------------------------------------------------
    // 4. Décrémenter les durées et purger les états expirés
    // -------------------------------------------------------

    decrementDurations() {
        this.heroEngine.hero.states.forEach(s => {
            if (s.remaining_duration !== null) {
                s.remaining_duration -= 1;
            }
        });

        const before = this.heroEngine.hero.states.length;
        this.heroEngine.hero.states = this.heroEngine.hero.states.filter(
            s => s.remaining_duration === null || s.remaining_duration > 0
        );
        const expired = before - this.heroEngine.hero.states.length;
        if (expired > 0) this.logger.debug(`${expired} état(s) expiré(s) supprimé(s)`);
    }

    // -------------------------------------------------------
    // 5. Supprimer les états dont la condition de retrait est remplie
    // -------------------------------------------------------

    removeStatesByCondition() {
        this.heroEngine.hero.states = this.heroEngine.hero.states.filter(active => {
            const def = this.definitions.get(active.state_id);
            if (!def?.remove_condition) return true;

            // remove_condition est un objet structuré (normalisé par StateModel)
            // → on utilise evaluateSQL, cohérent avec le reste des conditions
            const shouldRemove = this.conditionEngine.evaluateSQL(def.remove_condition);
            if (shouldRemove) {
                this.logger.debug(`État retiré par condition : id=${active.state_id}`);
            }
            return !shouldRemove;
        });
    }

    // -------------------------------------------------------
    // 6. Appliquer un état depuis un effet
    // -------------------------------------------------------

    /** @param {object} effect - { value: state_id, duration, source_type, source_type_id } */
    applyStateFromEffect(effect) {
        const { value: state_id, duration, source_type, source_type_id } = effect;
        this.addState(
            state_id,
            duration === "instant" ? null : duration,
            source_type ?? null,
            source_type_id ?? null
        );
    }

    // -------------------------------------------------------
    // 7. Cycle complet — à appeler une fois par paragraphe
    // -------------------------------------------------------

    applyStateCycle() {
        this.applyStateEffects();
        this.decrementDurations();
        this.removeStatesByCondition();
    }
}