export const Spinner = ({ type = "spinner", size = "md" }) => {
    return (
        <span className={`loading loading-${type} loading-${size}`} />
    )
}
