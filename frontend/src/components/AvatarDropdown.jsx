import { useEffect, useState, useRef } from "react"
import { Logo } from "./index.js"
import { useSelector } from "react-redux";

export default function AvatarDropdown({
    menuItems = []
}) {
    const [open, setOpen] = useState(false);
    const user = useSelector(state => state.auth.userData);
    const dropdownRef = useRef(null);

    // const tempUser = {
    //     name: "Kenny",
    //     email: "Kenny@mail.np",
    //     pfpUrl: "https://www.shutterstock.com/shutterstock/photos/2286554497/display_1500/stock-photo-random-pictures-cute-and-funny-2286554497.jpg"
    // }

    const toggleOpen = () => {
        setOpen(prev => !prev);
    }

    useEffect(() => {

        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    })

    return (
        <div className="relative" ref={dropdownRef}>

            <Logo src={user.avatar} alt="Profile avatar" width="30px" height="30px" className="w-[30px] h-[30px] rounded-full border object-cover cursor-pointer" onClick={toggleOpen}/>
            {
                open &&

                (
                <div className="w-48 absolute bg-white right-0 mt-6 pt-2 rounded-lg z-50">
                    <div className="user-info-container flex flex-col items-center">
                        <p className="text-gray-400 font-bold">{user.fullName}</p>
                        <p className="text-gray-400 text-sm italic">{user.email}</p>
                    </div>

                    <div className="flex flex-col">
                        {
                            menuItems?.map(
                                (menuItem, i) => {
                                    return (<button key={i} className="w-full py-2 bg-white text-black-500 rounded-lg hover:bg-gray-300 cursor-pointer">
                                        {menuItem.label}
                                    </button> )
                                }
                            )
                        }
                    </div>
                </div>
                )
            }
        </div>
    )
}