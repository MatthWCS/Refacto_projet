export const Button = ({ text, onClick, id }) => {
    return (
        <button className="btn" onClick={onClick} id={id}>
            {text}
        </button>
    )
}