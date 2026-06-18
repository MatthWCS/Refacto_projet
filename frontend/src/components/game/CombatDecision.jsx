export function CombatDecision({ pending, onCombatTarget, onCombatLuck, onCombatFlee, disabled }) {
    if (!pending) return null

    if (pending.type === "combat_target") {
        return (
            <div className="mt-6 rounded-xl border border-red-800/40 bg-base-200/90 p-4">
                <p className="text-xs text-red-500 uppercase tracking-wider mb-3">
                    Choisissez votre cible
                </p>
                <div className="flex flex-wrap gap-2">
                    {pending.enemies.map(e => (
                        <button
                            key={e.id}
                            onClick={() => onCombatTarget(e.id)}
                            disabled={disabled}
                            className="btn btn-sm btn-outline border-red-800 text-red-300
                                       hover:bg-red-900/30 disabled:opacity-40"
                        >
                            {e.name} ({e.endurance} END)
                        </button>
                    ))}
                </div>
            </div>
        )
    }

    if (pending.type === "combat_luck") {
        const labels = {
            none: "Ignorer",
            increase: "Forcer le coup",
            reduce: "Réduire les dégâts"
        }
        return (
            <div className="mt-6 rounded-xl border border-amber-800/40 bg-base-200/90 p-4">
                <p className="text-xs text-amber-500 uppercase tracking-wider mb-1">
                    Tenter votre Chance ?
                </p>
                <p className="text-xs text-base-content/50 mb-3">
                    {pending.round.enemyHit
                        ? "Vous avez touché l'ennemi."
                        : pending.round.charactersHitHero > 0
                            ? "Vous avez reçu un coup."
                            : "Aucun coup décisif."}
                </p>
                <div className="flex flex-wrap gap-2">
                    {pending.options.map(opt => (
                        <button
                            key={opt}
                            onClick={() => onCombatLuck(opt)}
                            disabled={disabled}
                            className={`btn btn-sm disabled:opacity-40
                                ${opt === "none"
                                    ? "btn-ghost opacity-60"
                                    : "btn-outline border-amber-700 text-amber-300"}`}
                        >
                            {labels[opt] ?? opt}
                        </button>
                    ))}
                </div>
            </div>
        )
    }

    if (pending.type === "combat_flee") {
        return (
            <div className="mt-6 rounded-xl border border-orange-800/40 bg-base-200/90 p-4">
                <p className="text-xs text-orange-400 uppercase tracking-wider mb-3">
                    Continuer le combat ?
                </p>
                <div className="flex gap-2">
                    <button
                        onClick={() => onCombatFlee("continue")}
                        disabled={disabled}
                        className="btn btn-sm btn-outline border-emerald-700
                                   text-emerald-400 disabled:opacity-40"
                    >
                        Continuer
                    </button>
                    {pending.options.includes("flee") && (
                        <button
                            onClick={() => onCombatFlee("flee")}
                            disabled={disabled}
                            className="btn btn-sm btn-ghost opacity-60 disabled:opacity-40"
                        >
                            Fuir
                        </button>
                    )}
                </div>
            </div>
        )
    }

    return null
}