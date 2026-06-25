import { useState, useEffect, useRef } from "react"
import { Link, useLocation } from "react-router"
import {
    useStartGameMutation,
    useSendActionMutation,
    useUseItemMutation,
    useEquipItemMutation,
    useUnequipItemMutation,
    useGetInventoryQuery
} from "@apiSlice"
import { Spinner } from "@ui"
import {
    HeroPanel,
    ParagraphText,
    ChoiceList,
    TestResult,
    ContinueButton,
    CombatLog,
    CombatDecision,
    ItemPickupModal,
    FlavorModal,
    TradePanel,
    EndingScreen,
    InventoryBar
} from "@components/game"

// ─── GamePage ─────────────────────────────────────────────────────────────────

export const GamePage = () => {
    const [gameState, setGameState] = useState(null)
    const [flavorContent, setFlavorContent] = useState(null)
    const [itemDefs, setItemDefs] = useState({})
    const [busy, setBusy] = useState(false)
    const contentRef = useRef(null)

    const location = useLocation()
    const slot = location.state?.slot ?? "autosave"

    const [gameStarted, setGameStarted] = useState(false)
    const [startGame] = useStartGameMutation()
    const [sendAction] = useSendActionMutation()
    const [useItem] = useUseItemMutation()
    const [equipItem] = useEquipItemMutation()
    const [unequipItem] = useUnequipItemMutation()

    // Récupère les définitions complètes des items en inventaire
    // (nom, type, usable...) dès que la partie est démarrée.
    // Couvre le cas des items déjà présents en save sans passer par item_pickup.
    const { data: inventoryData } = useGetInventoryQuery(undefined, {
        skip: !gameStarted
    })

    useEffect(() => {
        if (!inventoryData?.inventory?.length) return
        const updates = {}
        inventoryData.inventory.forEach(item => {
            updates[item.item_id] = item
        })
        setItemDefs(prev => ({ ...prev, ...updates }))
    }, [inventoryData])

    // Démarrage automatique au montage
    useEffect(() => {
        let cancelled = false
        const init = async () => {
            setBusy(true)
            try {
                const res = await startGame({ slot }).unwrap()
                if (!cancelled) {
                    applyState(res)
                    setGameStarted(true)
                }
            } catch (e) {
                console.error("Impossible de démarrer la partie", e)
            } finally {
                if (!cancelled) setBusy(false)
            }
        }
        init()
        return () => { cancelled = true }
    }, [])

    // Scroll vers le haut à chaque changement de paragraphe
    useEffect(() => {
        contentRef.current?.scrollTo({ top: 0, behavior: "smooth" })
    }, [gameState?.paragraphId])

    // Hydrate le dictionnaire de noms/définitions depuis les données reçues
    function applyState(state) {
        if (!state) return
        setGameState(state)
        const updates = {}
        if (state.pending?.item) {
            const { item } = state.pending
            updates[item.item_id] = item
        }
        state.items?.forEach(({ item }) => {
            if (item) updates[item.item_id] = item
        })
        if (Object.keys(updates).length) {
            setItemDefs(prev => ({ ...prev, ...updates }))
        }
    }

    // Action générique vers POST /api/game/action
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

    // Actions inventaire (endpoints dédiés)
    const handleUseItem = async (itemId) => {
        if (busy) return
        setBusy(true)
        try {
            const res = await useItem({ item_id: itemId }).unwrap()
            if (res.flavorContent) setFlavorContent(res.flavorContent)
            applyState(res.state)
        } catch (e) {
            console.error("Erreur useItem", e)
        } finally {
            setBusy(false)
        }
    }

    const handleEquip = async (itemId) => {
        if (busy) return
        setBusy(true)
        try {
            const res = await equipItem({ item_id: itemId }).unwrap()
            applyState(res.state)
        } catch (e) {
            console.error("Erreur equipItem", e)
        } finally {
            setBusy(false)
        }
    }

    const handleUnequip = async (itemId) => {
        if (busy) return
        setBusy(true)
        try {
            const res = await unequipItem({ item_id: itemId }).unwrap()
            applyState(res.state)
        } catch (e) {
            console.error("Erreur unequipItem", e)
        } finally {
            setBusy(false)
        }
    }

    // ── Chargement initial ────────────────────────────────────────────────────
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

    const {
        pending, hero, paragraphId, content, contentAfter,
        testResults, combat, ending, isGameOver
    } = gameState

    const pendingType = pending?.type
    const BLOCKING = ["item_pickup", "combat_target", "combat_luck",
        "combat_flee", "continue", "ending_choice"]
    const inventoryBlocked = busy || BLOCKING.includes(pendingType)

    const isCombatPending = ["combat_target", "combat_luck", "combat_flee"]
        .includes(pendingType)

    return (
        <>
            <FlavorModal content={flavorContent} onClose={() => setFlavorContent(null)} />

            <div className="min-h-screen bg-base-100 flex flex-col">

                <header className="px-6 py-3 border-b border-emerald-900/30
                                   flex items-center justify-between sticky top-0 z-30
                                   bg-base-100/90 backdrop-blur-sm">
                    <Link to="/home"
                        className="text-emerald-700 text-xs font-mono tracking-widest
                                   uppercase hover:text-emerald-500 transition-colors">
                        Faery ~ Interlude Sylvain ~
                    </Link>
                    {busy && <Spinner size="xs" />}
                </header>

                <main className="flex flex-1 gap-6 p-6 pb-24 max-w-5xl mx-auto w-full">

                    <HeroPanel hero={hero} itemDefs={itemDefs} />

                    <section ref={contentRef} className="flex-1 flex flex-col">

                        {content && (
                            <ParagraphText
                                content={content}
                                contentAfter={contentAfter}
                                paragraphId={paragraphId}
                            />
                        )}

                        <TestResult testResults={testResults} />

                        <CombatLog combat={combat} />

                        {pendingType === "item_pickup" && (
                            <ItemPickupModal
                                pending={pending}
                                onAnswer={(v) => act("item_pickup", v)}
                                disabled={busy}
                            />
                        )}

                        {isCombatPending && (
                            <CombatDecision
                                pending={pending}
                                onCombatTarget={(v) => act("combat_target", v)}
                                onCombatLuck={(v) => act("combat_luck", v)}
                                onCombatFlee={(v) => act("combat_flee", v)}
                                disabled={busy}
                            />
                        )}

                        <ContinueButton
                            pending={pending}
                            onContinue={() => act("continue", null)}
                            disabled={busy}
                        />

                        <TradePanel
                            paragraphId={paragraphId}
                            itemDefs={itemDefs}
                            onExecute={applyState}
                            disabled={busy}
                        />

                        {ending && (
                            <EndingScreen
                                ending={ending}
                                onReplay={() => act("ending_choice", "replay")}
                                onQuit={() => act("ending_choice", "quit")}
                                disabled={busy}
                            />
                        )}

                        {pendingType === "choice" && gameState.choices?.length > 0 && (
                            <ChoiceList
                                choices={gameState.choices}
                                onChoice={(i) => act("choice", i)}
                                disabled={busy}
                            />
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

            <InventoryBar
                hero={hero}
                onUseItem={handleUseItem}
                onEquipItem={handleEquip}
                onUnequipItem={handleUnequip}
                disabled={inventoryBlocked}
                itemDefs={itemDefs}
            />
        </>
    )
}