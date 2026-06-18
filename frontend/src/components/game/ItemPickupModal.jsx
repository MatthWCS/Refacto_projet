const LABELS = {
    use_now: "Utiliser maintenant",
    take: "Prendre",
    equip: "Équiper",
    inventory: "Mettre en sac",
    discard: "Laisser"
}

const VARIANTS = {
    use_now: "btn-success",
    take: "btn-primary",
    equip: "btn-primary",
    inventory: "btn-ghost",
    discard: "btn-ghost opacity-50"
}

export function ItemPickupModal({ pending, onAnswer, disabled }) {
    if (pending?.type !== "item_pickup") return null
    const { item, options } = pending

    return (
        <div className="mt-6 rounded-xl border border-emerald-700/40 bg-base-200/90 p-4">
            <p className="text-xs text-emerald-600 uppercase tracking-wider mb-1">
                Objet trouvé
            </p>
            <p className="font-semibold text-emerald-300 mb-0.5">{item.name}</p>
            {item.description && (
                <p className="text-xs text-base-content/60 mb-3">{item.description}</p>
            )}
            {item.quantity > 1 && (
                <p className="text-xs text-emerald-600 mb-3">Quantité : {item.quantity}</p>
            )}
            <div className="flex flex-wrap gap-2">
                {options.map(opt => (
                    <button
                        key={opt}
                        onClick={() => onAnswer(opt)}
                        disabled={disabled}
                        className={`btn btn-sm ${VARIANTS[opt] ?? "btn-ghost"} disabled:opacity-40`}
                    >
                        {LABELS[opt] ?? opt}
                    </button>
                ))}
            </div>
        </div>
    )
}