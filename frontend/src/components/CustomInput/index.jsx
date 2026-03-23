export const CustomInput = ({ labelText, inputName, inputType, inputValue, onChange }) => {
    return (
        <>
            <label
                htmlFor={inputName}>
                {labelText}
                <input
                    className="border border-white input input-ghost input-sm"
                    id={inputName}
                    name={inputName}
                    type={inputType}
                    value={inputValue}
                    onChange={onChange}
                />
            </label>
        </>
    )
}