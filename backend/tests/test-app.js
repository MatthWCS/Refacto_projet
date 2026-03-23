// -------------------------------------------------------
// test-app.js — Point d'entrée console
// Lance l'aventure en mode terminal.
//
// Usage :
//   node --experimental-vm-modules test-app.js
// -------------------------------------------------------

import { ConsoleIO } from "../engines/ConsoleIO.js";
import { ConsoleUI } from "../engines/ConsoleUI.js";
import { GameEngine } from "../engines/GameEngine.js";
import { DirectSaveService } from "../engines/DirectSaveService.js";
import { Logger, LogLevel } from "../engines/Logger.js";

// -------------------------------------------------------
// Configuration
// -------------------------------------------------------
const ADVENTURE_ID = 1;
const START_PARAGRAPH = 0;

// En mode console, l'utilisateur n'est pas authentifié via HTTP.
// On fixe un USER_ID en dur pour la persistance BDD directe.
// En production web, c'est req.user.id (session JWT) qui fournit cet id.
const DEV_USER_ID = 1;

// LogLevel.DEBUG  → tous les logs moteur
// LogLevel.INFO   → logs métier normaux
// LogLevel.WARN   → erreurs et avertissements uniquement
const logger = new Logger(LogLevel.INFO, "[App]");

// -------------------------------------------------------
// Bootstrap
// -------------------------------------------------------
const io = new ConsoleIO();
const ui = new ConsoleUI(io, logger);

const saveService = new DirectSaveService(ADVENTURE_ID, DEV_USER_ID, logger);

const game = new GameEngine({
    ui,
    adventureId: ADVENTURE_ID,
    logger,
    saveService,

    // Hook appelé après _initEngines(), avant la navigation.
    // C'est ici qu'on :
    //   1. injecte le CombatUI interactif dans combatEngine
    //   2. propose la création interactive du héros si pas de sauvegarde
    onBeforeStart: async (engine) => {

        // 1. Injection du CombatUI — fight() reçoit l'UI en 3e paramètre
        const { combatEngine } = engine;
        const { combatUI } = ui;
        const _fight = combatEngine.fight.bind(combatEngine);
        combatEngine.fight = (monsters, rules) => _fight(monsters, rules, combatUI);

        // 2. Création interactive si le héros vient d'être créé (pas de sauvegarde)
        //    On détecte l'absence de sauvegarde par l'inventaire vide et les stats à 0
        //    (HeroFactory initialise avec des stats aléatoires — pas interactif)
        //    Pour proposer la création interactive à chaque lancement sans sauvegarde,
        //    on recrée le héros ici via HeroEngine.
        const hasSave = engine.heroEngine.hero.inventory.length > 0
            || engine.heroEngine.hero.flags.length > 0
            || engine.heroEngine.hero.states.length > 0;

        if (!hasSave) {
            io.print("\n=== Bienvenue dans l'aventure ! ===\n");

            const answer = await io.ask("Créer le héros de façon interactive ? (o/n) : ");

            if (answer.toLowerCase() === "o") {
                await engine.heroEngine.initializeHeroInteractive({
                    wait: (msg) => io.wait(msg),
                    print: (msg) => io.print(msg)
                });
                io.print("\nHéros créé avec succès !\n");
            }
        }
    }
});

// -------------------------------------------------------
// Lancement
// -------------------------------------------------------
try {
    await game.start(START_PARAGRAPH);
} catch (err) {
    logger.error("Erreur fatale :", err);
    io.close();
    process.exit(1);
}