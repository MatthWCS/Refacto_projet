const sizeClasses = {
    xs: "w-8",
    sm: "w-12",
    md: "w-16",
    lg: "w-24",
    xl: "w-32"
}

export const Avatar = ({ src, alt = "Avatar", size = "md", rounded = true }) => {
    return (
        <div className="avatar">
            <div className={`${sizeClasses[size] || sizeClasses.md} ${rounded ? "rounded-full" : "rounded"}`}>
                <img src={src} alt={alt} />
            </div>
        </div>
    )
}
