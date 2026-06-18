export const Checkbox = ({ legendText, labelText, inputName, checked, onChange, disabled = false }) => {
    return (
        <fieldset className="fieldset">
            {legendText && <legend className="fieldset-legend">{legendText}</legend>}
            <label htmlFor={inputName} className="label cursor-pointer gap-2">
                <input
                    type="checkbox"
                    className="checkbox"
                    id={inputName}
                    name={inputName}
                    checked={checked}
                    onChange={onChange}
                    disabled={disabled}
                />
                {labelText}
            </label>
        </fieldset>
    )
}
