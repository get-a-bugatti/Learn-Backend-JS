export default function Button({
    children,
    type="button",
    className="",
    bgColor="bg-blue-400",
    textColor="text-white",
    ...props
}) {
    return (
        <button type={type} className={`py-3 px-2 cursor-pointer ${bgColor} ${textColor} ${className}`} {...props}>{children}</button>
    )
}