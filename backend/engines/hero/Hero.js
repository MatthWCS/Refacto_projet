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
        inventory = [],
        flags = [],
        states = []
    } = {}) {
        this.name = name;

        // Valeurs initiales (plafond pour le clamping)
        this.initial_dexterity = initial_dexterity ?? 0;
        this.initial_endurance = initial_endurance ?? 0;
        this.initial_luck = initial_luck ?? 0;

        // Valeurs courantes
        this.dexterity = dexterity ?? this.initial_dexterity;
        this.endurance = endurance ?? this.initial_endurance;
        this.luck = luck ?? this.initial_luck;

        this.drunkness = drunkness;

        // Inventaire : [{ item_id, quantity, is_equipped }]
        this.inventory = inventory;
        // Flags : [flag_id, ...]
        this.flags = flags;
        // États actifs : [{ state_id, remaining_duration, source_type, source_type_id }]
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
            initial_dexterity: this.initial_dexterity,
            initial_endurance: this.initial_endurance,
            initial_luck: this.initial_luck,
            inventory: this.inventory,
            flags: this.flags,
            states: this.states
        };
    }
}