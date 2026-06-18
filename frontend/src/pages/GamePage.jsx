import { useState, useEffect, useRef } from "react"
import {
    useStartGameMutation,
    useSendActionMutation,
    useUseItemMutation,
    useEquipItemMutation,
    useUnequipItemMutation,
    useExecuteTradeMutation,
    useGetTradesQuery
} from "@apiSlice"
import { Spinner } from "@ui"

// ─── Helpers ─────────────────────────────────────────────────────────────────

const ITEM_NAMES = {}

function statColor(current, initial) {
    const ratio = initial > 0 ? current / initial : 1
    if (ratio > 0.6) return "text-emerald-400"
    if (ratio > 0.3) return "text-amber-400"
    return "text-red-400"
}

// ─── HeroPanel ───────────────────────────────────────────────────────────────

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

function HeroPanel({ hero }) {
    if (!hero) return null
    const { dexterity, initial_dexterity, endurance, initial_endurance,
        luck, initial_luck, drunkness, drunknessPenalty, inventory } = hero

    return (
        <aside className="flex flex-col gap-4 p-5 rounded-xl border border-emerald-900/60
                          bg-base-200/80 backdrop-blur-sm min-w-[220px] max-w-[260px] self-start
                          sticky top-0">
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
                        {inventory.map(item => (
                            <li key={item.item_id}
                                className="text-xs text-base-content/80 flex justify-between">
                                <span>{ITEM_NAMES[item.item_id] ?? `#${item.item_id}`}</span>
                                <span className="opacity-50">
                                    {item.quantity > 1 ? `×${item.quantity}` : ""}
                                    {item.is_equipped ? " ✦" : ""}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </aside>
    )
}

// ─── Narration ───────────────────────────────────────────────────────────────

function ParagraphText({ content, contentAfter, paragraphId }) {
    return (
        <div className="relative pl-4">
            <div className="absolute left-0 top-0 bottom-0 w-0.5
                            bg-gradient-to-b from-transparent via-emerald-500/50 to-transparent" />
            <p className="text-xs text-emerald-700/60 mb-3 font-mono">§ {paragraphId}</p>
            <p className="text-base-content/90 leading-relaxed text-[15px]">{content}</p>
            {contentAfter && (
                <p className="text-base-content/90 leading-relaxed text-[15px] mt-4
                              border-t border-emerald-900/30 pt-4">
                    {contentAfter}
                </p>
            )}
        </div>
    )
}

// ─── Choix ───────────────────────────────────────────────────────────────────

function ChoiceList({ choices, onChoice, disabled }) {
    return (
        <div className="flex flex-col gap-2 mt-6">
            {choices.map((choice, i) => (
                <button key={i} onClick={() => onChoice(i)} disabled={disabled}
                    className="btn btn-outline btn-sm border-emerald-800 text-emerald-300
                               hover:bg-emerald-900/40 hover:border-emerald-600
                               disabled:opacity-40 text-left normal-case justify-start gap-3">
                    <span className="text-emerald-600 font-mono text-xs w-4 shrink-0">{i + 1}</span>
                    {choice.content}
                </button>
            ))}
        </div>
    )
}

// ─── Test de dé ──────────────────────────────────────────────────────────────

function TestResultBanner({ testResults }) {
    if (!testResults?.length) return null
    const r = testResults[0]
    return (
        <div className={`rounded-lg p-3 text-sm border mt-4
            ${r.success
                ? "bg-emerald-900/30 border-emerald-700/50 text-emerald-300"
                : "bg-red-900/30 border-red-800/50 text-red-300"}`}>
            <p className="font-semibold mb-1">
                {r.success ? "✦ Succès" : "✗ Échec"} — Test {r.attribute}
            </p>
            <p className="text-xs opacity-70">
                Jet : {r.total ?? r.roll} / Seuil : {r.threshold ?? "—"}
            </p>
        </div>
    )
}

function ContinueButton({ pending, onContinue, disabled }) {
    if (pending?.type !== "continue") return null
    return (
        <button onClick={onContinue} disabled={disabled}
            className="btn btn-sm btn-outline border-emerald-700 text-emerald-400 mt-4
                       disabled:opacity-40">
            Continuer →
        </button>
    )
}

// ─── Combat ──────────────────────────────────────────────────────────────────

function CombatLog({ combat }) {
    const [open, setOpen] = useState(false)
    if (!combat?.log?.length) return null
    const outcome = combat.outcome === "monsters_dead" ? "Victoire"
        : combat.outcome === "fled" ? "Fuite" : "Défaite"
    const color = combat.outcome === "monsters_dead" ? "text-emerald-400"
        : combat.outcome === "fled" ? "text-amber-400" : "text-red-400"
    return (
        <div className="mt-4 rounded-lg border border-emerald-900/40 bg-base-300/50">
            <button onClick={() => setOpen(o => !o)}
                className="w-full flex justify-between items-center px-4 py-2 text-sm">
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
                                    ? <span className="text-red-400">Reçu {round.charactersHitHero} coup(s)</span>
                                    : <span className="opacity-40">Égalité</span>}
                            <span className="ml-auto opacity-40">END {round.heroEndurance}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

function CombatDecision({ pending, onCombatTarget, onCombatLuck, onCombatFlee, disabled }) {
    if (!pending) return null

    if (pending.type === "combat_target") {
        return (
            <div className="mt-6 rounded-xl border border-red-800/40 bg-base-200/90 p-4">
                <p className="text-xs text-red-500 uppercase tracking-wider mb-3">
                    Choisissez votre cible
                </p>
                <div className="flex flex-wrap gap-2">
                    {pending.enemies.map(e => (
                        <button key={e.id} onClick={() => onCombatTarget(e.id)} disabled={disabled}
                            className="btn btn-sm btn-outline border-red-800 text-red-300
                                       hover:bg-red-900/30 disabled:opacity-40">
                            {e.name} ({e.endurance} END)
                        </button>
                    ))}
                </div>
            </div>
        )
    }

    if (pending.type === "combat_luck") {
        const labels = { none: "Ignorer", increase: "Forcer le coup", reduce: "Réduire les dégâts" }
        return (
            <div className="mt-6 rounded-xl border border-amber-800/40 bg-base-200/90 p-4">
                <p className="text-xs text-amber-500 uppercase tracking-wider mb-1">
                    Tenter votre Chance ?
                </p>
                <p className="text-xs text-base-content/50 mb-3">
                    {pending.round.enemyHit ? "Vous avez touché l'ennemi."
                        : pending.round.charactersHitHero > 0 ? "Vous avez reçu un coup."
                            : "Aucun coup décisif."}
                </p>
                <div className="flex flex-wrap gap-2">
                    {pending.options.map(opt => (
                        <button key={opt} onClick={() => onCombatLuck(opt)} disabled={disabled}
                            className={`btn btn-sm disabled:opacity-40
                                ${opt === "none"
                                    ? "btn-ghost opacity-60"
                                    : "btn-outline border-amber-700 text-amber-300"}`}>
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
                    <button onClick={() => onCombatFlee("continue")} disabled={disabled}
                        className="btn btn-sm btn-outline border-emerald-700
                                   text-emerald-400 disabled:opacity-40">
                        Continuer
                    </button>
                    {pending.options.includes("flee") && (
                        <button onClick={() => onCombatFlee("flee")} disabled={disabled}
                            className="btn btn-sm btn-ghost opacity-60 disabled:opacity-40">
                            Fuir
                        </button>
                    )}
                </div>
            </div>
        )
    }

    return null
}

// ─── Ramassage ───────────────────────────────────────────────────────────────

function ItemPickupModal({ pending, onAnswer, disabled }) {
    if (pending?.type !== "item_pickup") return null
    const { item, options } = pending
    const labels = {
        use_now: "Utiliser maintenant", take: "Prendre",
        equip: "Équiper", inventory: "Mettre en sac", discard: "Laisser"
    }
    const variants = {
        use_now: "btn-success", take: "btn-primary",
        equip: "btn-primary", inventory: "btn-ghost", discard: "btn-ghost opacity-50"
    }
    return (
        <div className="mt-6 rounded-xl border border-emerald-700/40 bg-base-200/90 p-4">
            <p className="text-xs text-emerald-600 uppercase tracking-wider mb-1">Objet trouvé</p>
            <p className="font-semibold text-emerald-300 mb-0.5">{item.name}</p>
            {item.description && (
                <p className="text-xs text-base-content/60 mb-3">{item.description}</p>
            )}
            {item.quantity > 1 && (
                <p className="text-xs text-emerald-600 mb-3">Quantité : {item.quantity}</p>
            )}
            <div className="flex flex-wrap gap-2">
                {options.map(opt => (
                    <button key={opt} onClick={() => onAnswer(opt)} disabled={disabled}
                        className={`btn btn-sm ${variants[opt] ?? "btn-ghost"} disabled:opacity-40`}>
                        {labels[opt] ?? opt}
                    </button>
                ))}
            </div>
        </div>
    )
}

// ─── Flavor modal ─────────────────────────────────────────────────────────────

function FlavorModal({ content, onClose }) {
    if (!content) return null
    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-base-200 rounded-xl border border-emerald-800/50
                            max-w-lg w-full p-6 flex flex-col gap-4">
                <p className="text-base-content/90 leading-relaxed text-[15px]">{content}</p>
                <button onClick={onClose}
                    className="btn btn-sm btn-outline border-emerald-700 text-emerald-400 self-end">
                    Continuer
                </button>
            </div>
        </div>
    )
}

// ─── Troc §36 ────────────────────────────────────────────────────────────────

function TradePanel({ paragraphId, itemDefs, onExecute, disabled }) {
    const { data, isLoading } = useGetTradesQuery(undefined, {
        skip: paragraphId !== 36
    })
    const [executeTrade] = useExecuteTradeMutation()

    if (paragraphId !== 36) return null
    if (isLoading) return <Spinner size="sm" />
    if (!data?.trades?.length) return null

    const handleTrade = async (tradeId, giveItemId) => {
        if (disabled) return
        try {
            const res = await executeTrade({ tradeOfferId: tradeId, giveItemId }).unwrap()
            onExecute(res.state)
        } catch (e) { console.error(e) }
    }

    return (
        <div className="mt-6 rounded-xl border border-purple-800/40 bg-base-200/90 p-4">
            <p className="text-xs text-purple-400 uppercase tracking-wider mb-3">
                Commerce d'Arilys
            </p>
            <div className="flex flex-col gap-3">
                {data.trades.map(offer => (
                    <div key={offer.id}
                        className="flex flex-col gap-1.5 border-b border-purple-900/20 pb-3 last:border-0">
                        <p className="text-sm text-base-content/80">{offer.description}</p>
                        {offer.giveableItemIds.length > 0 ? (
                            <div className="flex flex-wrap gap-1.5">
                                {offer.giveableItemIds.map(itemId => (
                                    <button key={itemId}
                                        onClick={() => handleTrade(offer.id, itemId)}
                                        disabled={disabled}
                                        className="btn btn-xs btn-outline border-purple-700
                                                   text-purple-300 disabled:opacity-40">
                                        Échanger contre {itemDefs[itemId]?.name ?? `#${itemId}`}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-base-content/30 italic">
                                Aucun objet échangeable en votre possession
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

// ─── Fin d'aventure ──────────────────────────────────────────────────────────

function EndingScreen({ ending, onReplay, onQuit, disabled }) {
    if (!ending) return null
    const success = ending.type === "success"
    return (
        <div className={`rounded-xl border p-6 mt-6 text-center
            ${success
                ? "border-emerald-600/50 bg-emerald-900/20"
                : "border-red-800/50 bg-red-900/10"}`}>
            <p className={`text-2xl font-semibold mb-2
                ${success ? "text-emerald-300" : "text-red-400"}`}>
                {success ? "✦ Félicitations" : "✗ Aventure terminée"}
            </p>
            <p className="text-sm text-base-content/60 mb-6">
                {success ? "Vous avez réussi votre quête !" : "Votre héros s'arrête ici."}
            </p>
            <div className="flex justify-center gap-3">
                <button onClick={onReplay} disabled={disabled}
                    className="btn btn-sm btn-outline border-emerald-700
                               text-emerald-400 disabled:opacity-40">
                    Rejouer
                </button>
                <button onClick={onQuit} disabled={disabled}
                    className="btn btn-sm btn-ghost opacity-50 disabled:opacity-40">
                    Quitter
                </button>
            </div>
        </div>
    )
}

// ─── Barre d'inventaire ───────────────────────────────────────────────────────

function InventoryBar({ hero, onUseItem, onEquipItem, onUnequipItem, disabled, itemDefs }) {
    if (!hero?.inventory?.length) return null
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-base-300/95 backdrop-blur-sm
                        border-t border-emerald-900/40 px-4 py-2 flex gap-2 flex-wrap
                        justify-center z-40">
            {hero.inventory.map(inv => {
                const def = itemDefs[inv.item_id] ?? {}
                const name = def.name ?? `#${inv.item_id}`
                return (
                    <div key={inv.item_id}
                        className="flex items-center gap-2 bg-base-200/80 rounded-lg
                                   px-2.5 py-1 text-xs border border-emerald-900/30">
                        <span className="text-base-content/80">
                            {name}
                            {inv.quantity > 1 ? ` ×${inv.quantity}` : ""}
                            {inv.is_equipped ? " ✦" : ""}
                        </span>
                        {def.usable ? (
                            <button onClick={() => onUseItem(inv.item_id)} disabled={disabled}
                                className="text-emerald-400 hover:text-emerald-300
                                           disabled:opacity-30 font-semibold">
                                Utiliser
                            </button>
                        ) : def.type === "equippable" || def.type === "equipable" ? (
                            inv.is_equipped
                                ? <button onClick={() => onUnequipItem(inv.item_id)} disabled={disabled}
                                    className="text-amber-400 hover:text-amber-300 disabled:opacity-30">
                                    Ôter
                                </button>
                                : <button onClick={() => onEquipItem(inv.item_id)} disabled={disabled}
                                    className="text-emerald-400 hover:text-emerald-300 disabled:opacity-30">
                                    Équiper
                                </button>
                        ) : null}
                    </div>
                )
            })}
        </div>
    )
}

// ─── GamePage ─────────────────────────────────────────────────────────────────

export const GamePage = () => {
    const [gameState, setGameState] = useState(null)
    const [flavorContent, setFlavorContent] = useState(null)
    const [itemDefs, setItemDefs] = useState({})
    const [busy, setBusy] = useState(false)
    const contentRef = useRef(null)

    const [startGame] = useStartGameMutation()
    const [sendAction] = useSendActionMutation()
    const [useItem] = useUseItemMutation()
    const [equipItem] = useEquipItemMutation()
    const [unequipItem] = useUnequipItemMutation()

    useEffect(() => {
        let cancelled = false
        const init = async () => {
            setBusy(true)
            try {
                const res = await startGame().unwrap()
                if (!cancelled) applyState(res)
            } catch (e) {
                console.error("Impossible de démarrer la partie", e)
            } finally {
                if (!cancelled) setBusy(false)
            }
        }
        init()
        return () => { cancelled = true }
    }, [])

    useEffect(() => {
        contentRef.current?.scrollTo({ top: 0, behavior: "smooth" })
    }, [gameState?.paragraphId])

    function applyState(state) {
        if (!state) return
        setGameState(state)
        // Hydrate les noms depuis le pending courant
        if (state.pending?.item) {
            const item = state.pending.item
            ITEM_NAMES[item.item_id] = item.name
            setItemDefs(prev => ({ ...prev, [item.item_id]: item }))
        }
        // Et depuis les items résolus
        state.items?.forEach(({ item }) => {
            if (item) {
                ITEM_NAMES[item.item_id] = item.name
                setItemDefs(prev => ({ ...prev, [item.item_id]: item }))
            }
        })
    }

    async function act(type, value) {
        if (busy) return
        setBusy(true)
        try {
            const res = await sendAction({ type, value }).unwrap()
            applyState(res)
        } catch (e) {
            console.error("Erreur action", type, e)
        } finally {
            setBusy(false)
        }
    }

    const handleUseItem = async (itemId) => {
        if (busy) return
        setBusy(true)
        try {
            const res = await useItem({ item_id: itemId }).unwrap()
            if (res.flavorContent) setFlavorContent(res.flavorContent)
            applyState(res.state)
        } catch (e) { console.error(e) } finally { setBusy(false) }
    }

    const handleEquip = async (itemId) => {
        if (busy) return
        setBusy(true)
        try {
            const res = await equipItem({ item_id: itemId }).unwrap()
            applyState(res.state)
        } catch (e) { console.error(e) } finally { setBusy(false) }
    }

    const handleUnequip = async (itemId) => {
        if (busy) return
        setBusy(true)
        try {
            const res = await unequipItem({ item_id: itemId }).unwrap()
            applyState(res.state)
        } catch (e) { console.error(e) } finally { setBusy(false) }
    }

    if (!gameState && busy) {
        return (
            <div className="flex items-center justify-center min-h-screen gap-3">
                <Spinner size="lg" />
                <span className="text-emerald-600 animate-pulse text-sm tracking-widest">
                    Chargement de l'aventure…
                </span>
            </div>
        )
    }

    if (!gameState) return null

    const { pending, hero, paragraphId, content, contentAfter,
        testResults, combat, ending, isGameOver } = gameState

    const pendingType = pending?.type
    const inventoryBlocked = busy || ["item_pickup", "combat_target",
        "combat_luck", "combat_flee", "continue", "ending_choice"].includes(pendingType)

    return (
        <>
            <FlavorModal content={flavorContent} onClose={() => setFlavorContent(null)} />

            <div className="min-h-screen bg-base-100 flex flex-col">
                <header className="px-6 py-3 border-b border-emerald-900/30
                                   flex items-center justify-between sticky top-0 z-30
                                   bg-base-100/90 backdrop-blur-sm">
                    <span className="text-emerald-700 text-xs font-mono tracking-widest uppercase">
                        Les Bois Enchantés
                    </span>
                    {busy && <Spinner size="xs" />}
                </header>

                <main className="flex flex-1 gap-6 p-6 pb-24 max-w-5xl mx-auto w-full">
                    <HeroPanel hero={hero} />

                    <section ref={contentRef} className="flex-1 flex flex-col">

                        {content && (
                            <ParagraphText content={content} contentAfter={contentAfter}
                                paragraphId={paragraphId} />
                        )}

                        <TestResultBanner testResults={testResults} />
                        <CombatLog combat={combat} />

                        {pendingType === "item_pickup" && (
                            <ItemPickupModal pending={pending}
                                onAnswer={(v) => act("item_pickup", v)} disabled={busy} />
                        )}

                        <CombatDecision
                            pending={["combat_target", "combat_luck", "combat_flee"]
                                .includes(pendingType) ? pending : null}
                            onCombatTarget={(v) => act("combat_target", v)}
                            onCombatLuck={(v) => act("combat_luck", v)}
                            onCombatFlee={(v) => act("combat_flee", v)}
                            disabled={busy}
                        />

                        <ContinueButton pending={pending}
                            onContinue={() => act("continue", null)} disabled={busy} />

                        <TradePanel paragraphId={paragraphId} itemDefs={itemDefs}
                            onExecute={applyState} disabled={busy} />

                        {ending && (
                            <EndingScreen ending={ending}
                                onReplay={() => act("ending_choice", "replay")}
                                onQuit={() => act("ending_choice", "quit")}
                                disabled={busy} />
                        )}

                        {pendingType === "choice" && gameState.choices?.length > 0 && (
                            <ChoiceList choices={gameState.choices}
                                onChoice={(i) => act("choice", i)} disabled={busy} />
                        )}

                        {pendingType === "no_choices" && !ending && (
                            <p className="text-base-content/40 text-sm mt-6 italic">
                                Fin du chemin.
                            </p>
                        )}

                        {isGameOver && !ending && (
                            <div className="mt-6 rounded-xl border border-red-900/50
                                            bg-red-900/10 p-4 text-center">
                                <p className="text-red-400 font-semibold text-lg mb-2">
                                    Votre héros est mort.
                                </p>
                                <p className="text-xs text-base-content/40">
                                    Rechargez la page pour une nouvelle partie.
                                </p>
                            </div>
                        )}
                    </section>
                </main>
            </div>

            <InventoryBar hero={hero} onUseItem={handleUseItem}
                onEquipItem={handleEquip} onUnequipItem={handleUnequip}
                disabled={inventoryBlocked} itemDefs={itemDefs} />
        </>
    )
}
