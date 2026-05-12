// -------------------------------------------------------
// Hero
// Responsabilité : structure de données du héros.
// Pas de logique métier — uniquement données + sérialisation.
// -------------------------------------------------------
export class Hero {

    /**
     * @param {object} data
     */
    constructor({
        name = "Héros",
        dexterity,
        initial_dexterity,
        endurance,
        initial_endurance,
        luck,
        initial_luck,
        drunkness = 0,
        paragraphsSinceDrunkDecrement = 0,
        base_initial_dexterity,
        base_initial_endurance,
        base_initial_luck,
        inventory = [],
        flags = [],
        states = []
    } = {}) {
        this.name = name;

        // Valeurs initiales (plafond pour le clamping)
        this.initial_dexterity = initial_dexterity ?? 0;
        this.initial_endurance = initial_endurance ?? 0;
        this.initial_luck = initial_luck ?? 0;

        // Valeurs de base initiales (avant tout bonus d'item)
        // Utilisées par InventoryEngine._recalculateInitialAttributes
        this.base_initial_dexterity = base_initial_dexterity ?? this.initial_dexterity;
        this.base_initial_endurance = base_initial_endurance ?? this.initial_endurance;
        this.base_initial_luck = base_initial_luck ?? this.initial_luck;

        // Valeurs courantes
        this.dexterity = dexterity ?? this.initial_dexterity;
        this.endurance = endurance ?? this.initial_endurance;
        this.luck = luck ?? this.initial_luck;

        // Ivresse
        this.drunkness = drunkness;
        this.paragraphsSinceDrunkDecrement = paragraphsSinceDrunkDecrement;

        // Inventaire : [{ item_id, quantity, is_equipped }]
        this.inventory = inventory;
        // Flags : [flag_id, ...]
        this.flags = flags;
        // États actifs : [{ state_id, remaining_duration }]
        this.states = states;
    }

    /**
     * Sérialise le héros pour la persistance backend.
     * @returns {object}
     */
    serialize() {
        return {
            name: this.name,
            dexterity: this.dexterity,
            endurance: this.endurance,
            luck: this.luck,
            drunkness: this.drunkness,
            paragraphsSinceDrunkDecrement: this.paragraphsSinceDrunkDecrement,
            initial_dexterity: this.initial_dexterity,
            initial_endurance: this.initial_endurance,
            initial_luck: this.initial_luck,
            base_initial_dexterity: this.base_initial_dexterity,
            base_initial_endurance: this.base_initial_endurance,
            base_initial_luck: this.base_initial_luck,
            inventory: this.inventory,
            flags: this.flags,
            states: this.states
        };
    }
}