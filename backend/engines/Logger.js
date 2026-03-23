// -------------------------------------------------------
// Logger — niveaux : debug / info / warn / error
// -------------------------------------------------------

export const LogLevel = Object.freeze({
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
    NONE: 4,
});

export class Logger {

    /**
     * @param {number} level - Niveau minimum affiché (LogLevel.*)
     * @param {string} [prefix] - Préfixe affiché devant chaque message
     */
    constructor(level = LogLevel.INFO, prefix = "[Combat]") {
        this.level = level;
        this.prefix = prefix;
    }

    debug(...args) {
        if (this.level <= LogLevel.DEBUG) console.debug(`${this.prefix} [DEBUG]`, ...args);
    }

    info(...args) {
        if (this.level <= LogLevel.INFO) console.log(`${this.prefix} [INFO]`, ...args);
    }

    warn(...args) {
        if (this.level <= LogLevel.WARN) console.warn(`${this.prefix} [WARN]`, ...args);
    }

    error(...args) {
        if (this.level <= LogLevel.ERROR) console.error(`${this.prefix} [ERROR]`, ...args);
    }
}