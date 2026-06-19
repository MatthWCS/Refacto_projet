function formatDate(dateStr) {
    return new Date(dateStr).toLocaleString("fr-FR", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit"
    })
}

export const SaveSlot = ({ slot, label, save, onLoad, onDelete, onSave, isSaving, isDeleting }) => {
    const isEmpty = !save

    return (
        <div className={`rounded-xl border p-4 flex flex-col gap-3 transition-colors
            ${isEmpty
                ? "border-emerald-900/30 bg-base-200/40"
                : "border-emerald-800/50 bg-base-200/80"}`}>

            {/* En-tête du slot */}
            <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-emerald-400">{label}</p>
                {!isEmpty && (
                    <p className="text-xs text-base-content/40">
                        {formatDate(save.updated_at)}
                    </p>
                )}
            </div>

            {/* Contenu */}
            {isEmpty ? (
                <p className="text-xs text-base-content/30 italic">Emplacement vide</p>
            ) : (
                <div className="flex gap-4 text-xs text-base-content/60">
                    <span>§ {save.current_paragraph_id}</span>
                    <span>HAB {save.dexterity}</span>
                    <span>END {save.endurance}</span>
                    <span>CHA {save.luck}</span>
                    {save.drunkness > 0 && (
                        <span className="text-amber-400/70">IVR {save.drunkness}</span>
                    )}
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 flex-wrap mt-1">
                {!isEmpty && (
                    <>
                        <button
                            onClick={() => onLoad(slot)}
                            className="btn btn-xs btn-outline border-emerald-700
                                       text-emerald-400 hover:bg-emerald-900/30">
                            Charger
                        </button>
                        <button
                            onClick={() => onDelete(slot)}
                            disabled={isDeleting}
                            className="btn btn-xs btn-ghost text-red-400/60
                                       hover:text-red-400 disabled:opacity-40">
                            {isDeleting ? "..." : "Supprimer"}
                        </button>
                    </>
                )}
                <button
                    onClick={() => onSave(slot)}
                    disabled={isSaving}
                    className="btn btn-xs btn-ghost text-base-content/40
                               hover:text-emerald-400 disabled:opacity-40 ml-auto">
                    {isSaving ? "Sauvegarde..." : isEmpty ? "Sauvegarder ici" : "Écraser"}
                </button>
            </div>
        </div>
    )
}