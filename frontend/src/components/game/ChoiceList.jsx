export function ChoiceList({ choices, onChoice, disabled }) {
    return (
        <div className="flex flex-col gap-2 mt-6">
            {choices.map((choice, i) => (
                <button
                    key={i}
                    onClick={() => onChoice(i)}
                    disabled={disabled}
                    className="btn btn-outline btn-sm border-emerald-800 text-emerald-300
                               hover:bg-emerald-900/40 hover:border-emerald-600
                               disabled:opacity-40 text-left normal-case justify-start gap-3"
                >
                    <span className="text-emerald-600 font-mono text-xs w-4 shrink-0">
                        {i + 1}
                    </span>
                    {choice.content}
                </button>
            ))}
        </div>
    )
}