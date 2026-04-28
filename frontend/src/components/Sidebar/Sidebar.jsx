import { useState } from "react";
import {
    HiHome,
    HiCollection,
    HiClock,
    HiViewList,
    HiHeart,
    HiVideoCamera
  } from "react-icons/hi";
import { useNavigate } from "react-router-dom";



function Sidebar({
    expanded=false
}) {
    const navigate = useNavigate();

    // add all paths later.
    const sidebarItems = [
        {
            label: "Home",
            slug: "home",
            icon: HiHome,
            path: "/"
        },
        {
            label: "Subscriptions",
            slug: "subscriptions",
            icon: HiCollection,
            path: "/subscriptions"
        },
        {
            label: "History",
            slug: "history",
            icon: HiClock,
            path: "/watch-history"
        },
        {
            label: "My Playlists",
            slug: "my-playlists",
            icon: HiViewList,
            path: "/my-playlists"
        },
        {
            label: "Liked Videos",
            slug: "liked-videos",
            icon: HiHeart,
            path: "/liked-videos"
        },
        {
            label: "Your Videos",
            slug: "your-videos",
            icon: HiVideoCamera,
            path: "/your-videos"
        }
    ];

    return (
        <nav className={`sidebar fixed bottom-0 top-[76px] left-0 bg-white duration-200 ${expanded ? "max-w-[170px]" : "max-w-[85px]" }`}>
            <ul className={` flex flex-col items-center space-y-2` }>
                {
                    sidebarItems.map((sidebarItem, i) => {    
                    const Icon = sidebarItem.icon;
                    const isActive = location.pathname === sidebarItem.path;
                    
                    return (
                        <li key={i} className={`w-full cursor-pointer py-1 hover:bg-gray-300 flex ${expanded ? "flex-row justify-start px-3 " : "flex-col px-2"} items-center ${isActive ? "bg-gray-300" : "" }`} onClick={() => navigate(sidebarItem.path)}>
                            <Icon size={28}></Icon>
                            <span className={`text-gray-500 text-xs ${expanded ? "ml-2" : ""}`}>{sidebarItem.label}</span>
                        </li>
                    )
                    })
                }
            </ul>
        </nav>
    )
}


export default Sidebar;