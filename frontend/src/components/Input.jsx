import React, {useId} from "react";

const Input = React.forwardRef(function ({
    label,
    type="text",
    placeholder="",
    className="",
    ...props
}, ref) {
    const id = useId();

    return (
        <div className="w-full">
            {
                label && 
                <label className="inline-block pl-1 mb-1 " htmlFor={id}>{label}</label>
            }

            <input ref={ref} id={id} placeholder={placeholder} type={type} className={`px-3 py-2 rounded-lg bg-white text-black outline-none focus:border-gray-400 duration-200 border border-gray-200 w-full ${className} `} {...props} />

        </div>
    )
});

export default Input;