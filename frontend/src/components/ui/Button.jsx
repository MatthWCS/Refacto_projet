export const Button = ({ text, onClick, id, variant = "", disabled = false, type = "button" }) => {
    return (
        <button
            type={type}
            className={`btn ${variant}`}
            onClick={onClick}
            id={id}
            disabled={disabled}
        >
            {text}
        </button>
    )
}
