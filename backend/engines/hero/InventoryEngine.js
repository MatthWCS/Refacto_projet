import { Logger, LogLevel } from "../Logger.js";

// -------------------------------------------------------
// InventoryEngine
// Responsabilité : gestion de l'inventaire du héros
//   (ajout, retrait, équipement, utilisation d'objets)
// -------------------------------------------------------
export class InventoryEngine {

    /**
     * @param {HeroEngine}      heroEngine
     * @param {EffectEngine}    effectEngine
     * @param {ConditionEngine} conditionEngine
     * @param {StateEngine}     stateEngine
     * @param {object[]}        itemDefinitions  - Tableau issu de la BDD (normalised)
     * @param {Logger}          [logger]
     */
    constructor(heroEngine, effectEngine, conditionEngine, stateEngine, itemDefinitions = [], logger = new Logger(LogLevel.INFO, "[InventoryEngine]")) {
        this.heroEngine = heroEngine;
        this.effectEngine = effectEngine;
        this.conditionEngine = conditionEngine;
        this.stateEngine = stateEngine;
        this.logger = logger;

        if (itemDefinitions instanceof Map) {
            this.items = itemDefinitions;
        } else {
            this.items = new Map(itemDefinitions.map(i => [i.id, i]));
        }
    }

    // -------------------------------------------------------
    // 1. Accès à la définition d'un item
    // -------------------------------------------------------

    /** @returns {object|undefined} */
    getItemDefinition(item_id) {
        const item = this.items.get(item_id);
        if (!item) this.logger.warn(`getItemDefinition : item inconnu id=${item_id}`);
        return item;
    }

    // -------------------------------------------------------
    // 2. Ajouter un item à l'inventaire
    // -------------------------------------------------------

    /**
     * @param {number} item_id
     * @param {number} [quantity]
     */
    addItem(item_id, quantity = 1) {
        const def = this.getItemDefinition(item_id);
        if (!def) return;

        const max = def.quantity_max ?? Infinity;
        const existing = this.findInInventory(item_id);
        const isNew = !existing;

        if (existing) {
            existing.quantity = Math.min(existing.quantity + quantity, max);
        } else {
            this.heroEngine.hero.inventory.push({
                item_id,
                quantity: Math.min(quantity, max),
                is_equipped: false
            });
        }

        // Appliquer les effets permanents de l'item à la première acquisition
        if (isNew && def.effects?.length > 0) {
            this.effectEngine.applyEffects(def.effects);
            this.logger.debug(`Effets item appliqués : id=${item_id}`);
        }

        this.logger.debug(`Item ajouté : id=${item_id} ×${quantity}`);
    }

    // -------------------------------------------------------
    // 3. Retirer un item de l'inventaire
    // -------------------------------------------------------

    /**
     * @param {number} item_id
     * @param {number} [quantity]
     */
    removeItem(item_id, quantity = 1) {
        const existing = this.findInInventory(item_id);
        if (!existing) return;

        existing.quantity -= quantity;

        if (existing.quantity <= 0) {
            this.heroEngine.hero.inventory =
                this.heroEngine.hero.inventory.filter(i => i.item_id !== item_id);
            this.logger.debug(`Item retiré de l'inventaire : id=${item_id}`);

            // Recalculer les valeurs initiales depuis les items encore possédés
            this._recalculateInitialAttributes();
        }
    }

    // -------------------------------------------------------
    // 4. Équiper / déséquiper
    // -------------------------------------------------------

    /** @param {number} item_id */
    equipItem(item_id) {
        const item = this.findInInventory(item_id);
        if (item) {
            item.is_equipped = true;
            this.logger.debug(`Item équipé : id=${item_id}`);
        }
    }

    /** @param {number} item_id */
    unequipItem(item_id) {
        const item = this.findInInventory(item_id);
        if (item) {
            item.is_equipped = false;
            this.logger.debug(`Item déséquipé : id=${item_id}`);
        }
    }

    /**
     * @param {number} item_id
     * @returns {boolean}
     */
    isEquipped(item_id) {
        return this.findInInventory(item_id)?.is_equipped ?? false;
    }

    // -------------------------------------------------------
    // 5. Utiliser un objet
    // -------------------------------------------------------

    /**
     * @param {number} item_id
     * @param {{ inCombat?: boolean, surprised?: boolean }} [context]
     * @returns {{ success: boolean, message?: string, goto?: number }}
     */
    useItem(item_id, context = {}) {
        const def = this.getItemDefinition(item_id);
        if (!def) return { success: false, message: "Objet inconnu." };

        const inv = this.findInInventory(item_id);
        if (!inv || inv.quantity <= 0) {
            return { success: false, message: "Objet non possédé." };
        }
        if (!def.usable) {
            return { success: false, message: "Cet objet ne peut pas être utilisé." };
        }
        if (context.inCombat && !def.can_use_in_combat) {
            return { success: false, message: "Impossible d'utiliser cet objet en combat." };
        }
        if (context.surprised && def.requires_no_surprise) {
            return { success: false, message: "Impossible d'utiliser cet objet en étant surpris." };
        }

        if (def.effects?.length > 0) {
            this.effectEngine.applyEffects(def.effects);
        }

        this.removeItem(item_id, 1);
        this.logger.info(`Item utilisé : ${def.name ?? item_id}`);

        if (def.target_paragraph_id) {
            return { success: true, goto: def.target_paragraph_id };
        }

        return { success: true };
    }

    // -------------------------------------------------------
    // Helpers privés
    // -------------------------------------------------------

    /** @private */
    findInInventory(item_id) {
        return this.heroEngine.hero.inventory.find(i => i.item_id === item_id) ?? null;
    }

    /**
     * Recalcule les valeurs initiales des attributs après retrait d'un item.
     * Repart de la valeur de base (base_initial_*) et réapplique tous les
     * effets set_initial des items encore possédés.
     *
     * @private
     */
    _recalculateInitialAttributes() {
        const hero = this.heroEngine.hero;

        // Collecter tous les effets set_initial des items encore possédés
        const setInitialEffects = [];
        for (const invItem of hero.inventory) {
            const def = this.items.get(invItem.item_id);
            if (!def?.effects) continue;
            for (const effect of def.effects) {
                if (effect.operation === "set_initial") {
                    setInitialEffects.push(effect);
                }
            }
        }

        // Attributs concernés
        const affectedAttributes = [...new Set(setInitialEffects.map(e => e.attribute))];

        for (const attribute of affectedAttributes) {
            const initialKey = `initial_${attribute}`;
            const baseInitialKey = `base_initial_${attribute}`;

            // Mémoriser la valeur de base la première fois (avant tout item)
            if (hero[baseInitialKey] === undefined) {
                hero[baseInitialKey] = hero[initialKey];
            }

            // Repartir de la valeur de base
            hero[initialKey] = hero[baseInitialKey];

            // Réappliquer les effets set_initial des items encore possédés
            // (on prend le maximum si plusieurs items affectent le même attribut)
            for (const effect of setInitialEffects.filter(e => e.attribute === attribute)) {
                if (effect.value > hero[initialKey]) {
                    hero[initialKey] = effect.value;
                }
            }

            // Si la valeur courante dépasse le nouveau plafond, la ramener au plafond
            if (hero[attribute] > hero[initialKey]) {
                hero[attribute] = hero[initialKey];
            }

            this.logger.info(
                `Recalcul ${initialKey} → ${hero[initialKey]} ` +
                `(valeur courante : ${hero[attribute]})`
            );
        }
    }
}