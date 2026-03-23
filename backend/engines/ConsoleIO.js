import readline from "readline";

// -------------------------------------------------------
// ConsoleIO
// Responsabilité : primitives d'entrée/sortie console.
// Un seul rl partagé pour toute l'application.
// -------------------------------------------------------
export class ConsoleIO {

    constructor() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    /**
     * Pose une question et retourne la réponse.
     * @param {string} question
     * @returns {Promise<string>}
     */
    ask(question) {
        return new Promise(resolve => this.rl.question(question, resolve));
    }

    /**
     * Affiche un message et attend Entrée.
     * @param {string} msg
     * @returns {Promise<void>}
     */
    wait(msg) {
        return new Promise(resolve => {
            console.log(msg);
            this.rl.question("", () => resolve());
        });
    }

    /** @param {string} msg */
    print(msg) {
        console.log(msg);
    }

    close() {
        this.rl.close();
    }
}