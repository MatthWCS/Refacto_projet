export function MenuCard({ icon, title, description, onClick, disabled = false, variant = "default" }) {
    const base = `group flex flex-col gap-3 p-5 rounded-xl border text-left
                  transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed`

    const variants = {
        default: `border-emerald-900/40 bg-base-200/60 hover:bg-emerald-900/20
                  hover:border-emerald-700/60`,
        primary: `border-emerald-700/60 bg-emerald-900/20 hover:bg-emerald-900/40
                  hover:border-emerald-600`,
        muted: `border-base-300/40 bg-base-200/30 hover:bg-base-200/60
                  hover:border-base-300/60`
    }

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${base} ${variants[variant]}`}
        >
            <span className="text-2xl">{icon}</span>
            <div>
                <p className={`font-semibold text-sm
                    ${variant === "primary" ? "text-emerald-300" : "text-base-content/80"}`}>
                    {title}
                </p>
                <p className="text-xs text-base-content/40 mt-0.5">{description}</p>
            </div>
        </button>
    )
}