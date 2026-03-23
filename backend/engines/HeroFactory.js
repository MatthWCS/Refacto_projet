import { Dice } from "./Dice.js";
import { Hero } from "./hero/Hero.js";

// -------------------------------------------------------
// HeroFactory
// Responsabilité : créer un nouveau héros avec des stats
//                  aléatoires selon les règles du livre.
// -------------------------------------------------------
export class HeroFactory {

    /**
     * @param {string} [name]
     * @returns {Hero}
     */
    static createNewHero(name = "Héros") {
        const initial_dexterity = Dice.roll1D6() + 6;
        const initial_endurance = Dice.roll2D6() + 12;
        const initial_luck = Dice.roll1D6() + 6;

        return new Hero({
            name,
            initial_dexterity,
            dexterity: initial_dexterity,
            initial_endurance,
            endurance: initial_endurance,
            initial_luck,
            luck: initial_luck,
            drunkness: 0,
            inventory: [],
            flags: [],
            states: []
        });
    }
}