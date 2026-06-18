export function FlavorModal({ content, onClose }) {
    if (!content) return null
    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-base-200 rounded-xl border border-emerald-800/50
                            max-w-lg w-full p-6 flex flex-col gap-4">
                <p className="text-base-content/90 leading-relaxed text-[15px]">{content}</p>
                <button
                    onClick={onClose}
                    className="btn btn-sm btn-outline border-emerald-700
                               text-emerald-400 self-end"
                >
                    Continuer
                </button>
            </div>
        </div>
    )
}