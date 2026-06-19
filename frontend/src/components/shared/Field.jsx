export const Field = ({ label, name, type, value, onChange }) => {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-xs text-base-content/60">{label}</label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                className="input input-sm input-bordered bg-base-300/50
                           border-emerald-900/40 focus:border-emerald-700
                           focus:outline-none w-full"
            />
        </div>
    )
}