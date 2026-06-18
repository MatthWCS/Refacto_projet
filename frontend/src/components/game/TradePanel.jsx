import { useGetTradesQuery, useExecuteTradeMutation } from "@apiSlice"
import { Spinner } from "@ui"

export function TradePanel({ paragraphId, itemDefs, onExecute, disabled }) {
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
        } catch (e) {
            console.error("Erreur troc", e)
        }
    }

    return (
        <div className="mt-6 rounded-xl border border-purple-800/40 bg-base-200/90 p-4">
            <p className="text-xs text-purple-400 uppercase tracking-wider mb-3">
                Commerce d'Arilys
            </p>
            <div className="flex flex-col gap-3">
                {data.trades.map(offer => (
                    <div key={offer.id}
                        className="flex flex-col gap-1.5 border-b border-purple-900/20
                                   pb-3 last:border-0">
                        <p className="text-sm text-base-content/80">{offer.description}</p>
                        {offer.giveableItemIds.length > 0 ? (
                            <div className="flex flex-wrap gap-1.5">
                                {offer.giveableItemIds.map(itemId => (
                                    <button
                                        key={itemId}
                                        onClick={() => handleTrade(offer.id, itemId)}
                                        disabled={disabled}
                                        className="btn btn-xs btn-outline border-purple-700
                                                   text-purple-300 disabled:opacity-40"
                                    >
                                        Contre {itemDefs[itemId]?.name ?? `#${itemId}`}
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