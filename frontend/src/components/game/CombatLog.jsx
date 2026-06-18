import { useState } from "react"

export function CombatLog({ combat }) {
    const [open, setOpen] = useState(false)
    if (!combat?.log?.length) return null

    const outcome = combat.outcome === "monsters_dead" ? "Victoire"
        : combat.outcome === "fled" ? "Fuite" : "Défaite"
    const color = combat.outcome === "monsters_dead" ? "text-emerald-400"
        : combat.outcome === "fled" ? "text-amber-400" : "text-red-400"

    return (
        <div className="mt-4 rounded-lg border border-emerald-900/40 bg-base-300/50">
            <button
                onClick={() => setOpen(o => !o)}
                className="w-full flex justify-between items-center px-4 py-2 text-sm"
            >
                <span className={`font-semibold ${color}`}>
                    {outcome} — {combat.log.length} assaut{combat.log.length > 1 ? "s" : ""}
                </span>
                <span className="text-xs opacity-50">{open ? "▲" : "▼"} détails</span>
            </button>

            {open && (
                <div className="border-t border-emerald-900/30 px-4 py-3 flex flex-col gap-1.5">
                    {combat.log.map((round, i) => (
                        <div key={i} className="text-xs flex gap-4 text-base-content/70">
                            <span className="text-emerald-700 font-mono w-5 shrink-0">
                                A{round.round}
                            </span>
                            {round.enemyHit
                                ? <span className="text-emerald-400">Touché !</span>
                                : round.charactersHitHero > 0
                                    ? <span className="text-red-400">
                                        Reçu {round.charactersHitHero} coup(s)
                                    </span>
                                    : <span className="opacity-40">Égalité</span>
                            }
                            <span className="ml-auto opacity-40">END {round.heroEndurance}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}