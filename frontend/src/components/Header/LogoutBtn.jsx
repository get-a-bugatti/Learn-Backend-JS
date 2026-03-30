

export default function LogoutBtn({
    className,
    ...props
}) {
    return (
        <button type="submit" className={`py-2 px-2 cursor-pointer rounded-xl font-bold bg-red-500 text-white hover:bg-red-300 active:bg-red-200 duration-200 ${className}`} {...props}>Logout</button>
    )
}