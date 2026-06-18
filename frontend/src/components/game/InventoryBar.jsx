export function InventoryBar({ hero, onUseItem, onEquipItem, onUnequipItem, disabled, itemDefs }) {
    if (!hero?.inventory?.length) return null

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-base-300/95 backdrop-blur-sm
                        border-t border-emerald-900/40 px-4 py-2 flex gap-2 flex-wrap
                        justify-center z-40">
            {hero.inventory.map(inv => {
                const def = itemDefs?.[inv.item_id] ?? {}
                const name = def.name ?? `#${inv.item_id}`
                const isEquippable = def.type === "equippable" || def.type === "equipable"

                return (
                    <div
                        key={inv.item_id}
                        className="flex items-center gap-2 bg-base-200/80 rounded-lg
                                   px-2.5 py-1 text-xs border border-emerald-900/30"
                    >
                        <span className="text-base-content/80">
                            {name}
                            {inv.quantity > 1 ? ` ×${inv.quantity}` : ""}
                            {inv.is_equipped ? " ✦" : ""}
                        </span>

                        {def.usable ? (
                            <button
                                onClick={() => onUseItem(inv.item_id)}
                                disabled={disabled}
                                className="text-emerald-400 hover:text-emerald-300
                                           disabled:opacity-30 font-semibold"
                            >
                                Utiliser
                            </button>
                        ) : isEquippable ? (
                            inv.is_equipped
                                ? <button
                                    onClick={() => onUnequipItem(inv.item_id)}
                                    disabled={disabled}
                                    className="text-amber-400 hover:text-amber-300 disabled:opacity-30"
                                >
                                    Ôter
                                </button>
                                : <button
                                    onClick={() => onEquipItem(inv.item_id)}
                                    disabled={disabled}
                                    className="text-emerald-400 hover:text-emerald-300 disabled:opacity-30"
                                >
                                    Équiper
                                </button>
                        ) : null}
                    </div>
                )
            })}
        </div>
    )
}