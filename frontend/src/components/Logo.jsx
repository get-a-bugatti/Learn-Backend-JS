export default function Logo({
    width,
    src,
    className="",
    ...props
}) {
    return (
        <div className="w-full">
            <img src={src} alt="logo" className={`${className}`} width={width} height={width} {...props} />
        </div>
    )
}