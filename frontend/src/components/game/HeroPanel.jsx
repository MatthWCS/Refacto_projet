// ─── Helpers ─────────────────────────────────────────────────────────────────

function statColor(current, initial) {
    const ratio = initial > 0 ? current / initial : 1
    if (ratio > 0.6) return "text-emerald-400"
    if (ratio > 0.3) return "text-amber-400"
    return "text-red-400"
}

function StatRow({ label, current, initial, penalty = 0 }) {
    const effective = current - penalty
    return (
        <div className="flex justify-between items-center gap-2">
            <span className="text-base-content/60 text-sm">{label}</span>
            <div className="flex items-center gap-1 font-mono text-sm">
                <span className={statColor(current, initial)}>{current}</span>
                <span className="text-base-content/30 text-xs">/{initial}</span>
                {penalty > 0 && (
                    <span className="text-amber-400/70 text-xs ml-1">(→{effective})</span>
                )}
            </div>
        </div>
    )
}

// ─── HeroPanel ───────────────────────────────────────────────────────────────

export function HeroPanel({ hero, itemDefs }) {
    if (!hero) return null
    const {
        dexterity, initial_dexterity,
        endurance, initial_endurance,
        luck, initial_luck,
        drunkness, drunknessPenalty,
        inventory
    } = hero

    return (
        <aside className="flex flex-col gap-4 p-5 rounded-xl border border-emerald-900/60
                          bg-base-200/80 backdrop-blur-sm min-w-[220px] max-w-[260px]
                          self-start sticky top-16">
            <h2 className="text-lg text-emerald-300 tracking-widest uppercase font-semibold">
                {hero.name}
            </h2>

            <div className="flex flex-col gap-2">
                <StatRow label="Habileté" current={dexterity} initial={initial_dexterity}
                    penalty={drunknessPenalty} />
                <StatRow label="Endurance" current={endurance} initial={initial_endurance} />
                <StatRow label="Chance" current={luck} initial={initial_luck} />
                {drunkness > 0 && (
                    <div className="flex justify-between items-center mt-1 opacity-70">
                        <span className="text-amber-300 text-sm">Ivresse</span>
                        <span className="text-amber-300 font-mono text-sm">{drunkness}</span>
                    </div>
                )}
            </div>

            {inventory?.length > 0 && (
                <div className="border-t border-emerald-900/40 pt-3">
                    <p className="text-xs text-emerald-600 uppercase tracking-wider mb-2">
                        Inventaire
                    </p>
                    <ul className="flex flex-col gap-1">
                        {inventory.map(item => {
                            const def = itemDefs?.[item.item_id]
                            const name = def?.name ?? `#${item.item_id}`
                            return (
                                <li key={item.item_id}
                                    className="text-xs text-base-content/80 flex justify-between">
                                    <span>{name}</span>
                                    <span className="opacity-50">
                                        {item.quantity > 1 ? `×${item.quantity}` : ""}
                                        {item.is_equipped ? " ✦" : ""}
                                    </span>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            )}
        </aside>
    )
}