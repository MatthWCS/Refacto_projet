export function TestResult({ testResults }) {
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

export function ContinueButton({ pending, onContinue, disabled }) {
    if (pending?.type !== "continue") return null
    return (
        <button
            onClick={onContinue}
            disabled={disabled}
            className="btn btn-sm btn-outline border-emerald-700 text-emerald-400
                       mt-4 disabled:opacity-40"
        >
            Continuer →
        </button>
    )
}