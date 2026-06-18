export const SelectInput = ({ labelText, inputName, inputValue, options, onChange }) => {
    return (
        <label htmlFor={inputName} className="flex flex-col gap-1">
            {labelText}
            <select
                className="select select-ghost select-sm border border-white"
                id={inputName}
                name={inputName}
                value={inputValue}
                onChange={onChange}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </label>
    )
}
