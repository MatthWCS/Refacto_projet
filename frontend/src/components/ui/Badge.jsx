export const Badge = ({ text, variant = "primary", size = "md" }) => {
    return (
        <span className={`badge badge-${variant} badge-${size}`}>
            {text}
        </span>
    )
}
