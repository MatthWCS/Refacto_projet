export function EndingScreen({ ending, onReplay, onQuit, disabled }) {
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
                <button
                    onClick={onReplay}
                    disabled={disabled}
                    className="btn btn-sm btn-outline border-emerald-700
                               text-emerald-400 disabled:opacity-40"
                >
                    Rejouer
                </button>
                <button
                    onClick={onQuit}
                    disabled={disabled}
                    className="btn btn-sm btn-ghost opacity-50 disabled:opacity-40"
                >
                    Quitter
                </button>
            </div>
        </div>
    )
}