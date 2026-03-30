import { GiHamburgerMenu } from "react-icons/gi";
import { FcSearch } from "react-icons/fc";
import {Input, Button, LogoutBtn, AvatarDropdown} from "../index.js"
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout as logoutUser } from "../../store/authSlice.js";
import {
    Link,
} from "react-router-dom";
import axios from "axios";


export default function Header({
    toggleSidebar
}) {
    
    const authStatus = useSelector(state => state.auth.status);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const navItems = [
        {
            name: "Login",
            path: "/login",
            active: !authStatus
        },
        {
            name: "Signup",
            path: "/signup",
            active: !authStatus
        },
        {
            name: "+ Create",
            path: "/create-video",
            className: "",
            active: authStatus
        },
    ]

    const menuItems = [
        { label: "Dashboard", onClick: () => console.log("Dashboard") },
        { label: "Settings", onClick: () => console.log("Settings") },
      ];


    const logout = async () => {
        let logoutFailed = false;

        try {
            const response = await axios.post("/api/v1/users/logout");
            
            console.log(response);
            
        } catch (error) {
            console.log("Logout API Failed :", error);
            

        } finally {
            dispatch(logoutUser());
            
            if (logoutFailed) {
                alert("Logged out locally, but server logout failed.");
            }
            navigate("/login");
        }
    }

    return(
        <header className="bg-white ">
            <nav className="py-4 px-3 flex flex-wrap flex-row align-center justify-between">
                <div className="left-section flex flex-row items-center">
                    <div className="hamburger-menu-container hover:bg-gray-300 mt-1 mr-4 py-2 px-2 rounded-full">
                        <GiHamburgerMenu className="cursor-pointer text-lg text-gray-500 " onClick={toggleSidebar}/>
                    </div>
                    <Link to="/" className="cursor-pointer">
                        <h2 className="text-xl font-bold">Video<span className="bg-red-500 py-1 px-1 rounded-lg ml-1 text-white ">Tube</span></h2>
                    </Link>
                </div>

                <div className="middle-section flex flex-row">
                    <Input type="text" placeholder="Search Videos..." className="border-gray-400 h-full " />
                    <Button bgColor="bg-white" className="border rounded-xl border-gray-400 px-2 py-2">
                        <FcSearch className="text-lg"/>
                    </Button>
                </div>

                <div className="right-section flex items-center mr-4">
                    <ul className="flex flex-row space-x-4 mr-4">
                        {
                            navItems.map(navItem => {
                                return navItem.active ? <Button key={navItem.name} className={`font-bold cursor-pointer hover:bg-blue-200 hover:text-blue-300 active:bg-gray-400 py-2 px-2 rounded-xl ${navItem.className}`} onClick={() => navigate(`${navItem.path}`)}> {/* Todo: Wrap in Link elements later with to={navItem.path}*/}
                                    {navItem.name}
                                </Button>: null
                            })
                        }
                    </ul>
                        {
                            authStatus && 
                                <LogoutBtn className="mr-4" onClick={logout}></LogoutBtn>
                        }

            
                        {
                            authStatus &&
                            <AvatarDropdown className="mr-4" menuItems={menuItems}></AvatarDropdown>
                        }
                </div>
            </nav>
        </header>
    )
}