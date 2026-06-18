export const CustomInput = ({
    labelText,
    inputName,
    inputType = "text",
    inputValue,
    onChange,
    placeholder,
    disabled = false,
    onKeyDown
}) => {
    return (
        <label htmlFor={inputName} className="flex flex-col gap-1">
            {labelText}
            <input
                className="border border-white input input-ghost input-sm"
                id={inputName}
                name={inputName}
                type={inputType}
                value={inputValue}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                onKeyDown={onKeyDown}
            />
        </label>
    )
}
