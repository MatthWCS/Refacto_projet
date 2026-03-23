// -------------------------------------------------------
// Dice
// Responsabilité : jets de dés uniquement.
// Ne mute JAMAIS les objets passés en paramètre.
// -------------------------------------------------------
export class Dice {

    static roll1D6() {
        return Math.floor(Math.random() * 6) + 1;
    }

    static roll2D6() {
        return this.roll1D6() + this.roll1D6();
    }

    /**
     * Test de Chance : jet 2D6 ≤ hero.luck → succès.
     * N'applique AUCUN décrément — c'est à l'appelant de
     * consommer la Chance via heroEngine.modifyAttribute("luck", "subtract", 1).
     *
     * @param {object} hero
     * @returns {{ roll: number, success: boolean }}
     */
    static testLuck(hero) {
        const roll = this.roll2D6();
        const success = roll <= hero.luck;
        return { roll, success };
    }

    /**
     * Test d'attribut générique.
     * @param {object} hero
     * @param {string} attribute
     * @returns {{ roll: number, success: boolean }}
     */
    static testAttribute(hero, attribute) {
        const roll = this.roll2D6();
        const success = roll <= hero[attribute];
        return { roll, success };
    }

    /**
     * Test d'attribut avec modificateur.
     * @param {object} hero
     * @param {string} attribute
     * @param {number} [modifier]
     * @param {1|2}    [dice]      - Nombre de D6
     * @returns {{ roll: number, total: number, success: boolean }}
     */
    static testAttributeModified(hero, attribute, modifier = 0, dice = 1) {
        const roll = dice === 1 ? this.roll1D6() : this.roll2D6();
        const total = roll + modifier;
        const success = total <= hero[attribute];
        return { roll, total, success };
    }

    /**
     * Test pair/impair sur 1D6.
     * @returns {{ roll: number, isEven: boolean, isOdd: boolean }}
     */
    static testParity() {
        const roll = this.roll1D6();
        return { roll, isEven: roll % 2 === 0, isOdd: roll % 2 === 1 };
    }
}