import {Logo} from "./index"

import {
    Link
} from "react-router-dom"

export default function VideoCard({
    _id,
    title,
    owner,
    views,
    duration,
    thumbnail="/missing-thumbnail.jpg",
    createdAt=Date.now(),
    className="",
    ...props
}) {

    const convertDuration = (duration) => { // years, months, weeks, days

        if (typeof duration !== "Number") {
            duration = Number(duration);
        }

        let seconds = Math.floor(duration % 60);
    
        if (duration >= 3600) {
            let hours = Math.floor(duration / 3600);
            let minutes = Math.floor((duration % 3600) / 60);
    
            return `${hours}:${minutes === 0 ? "00" : minutes}:${seconds === 0 ? "00" : seconds}`
        } else if (duration >= 60) {
            let minutes = Math.floor((duration % 3600) / 60);
    
            return `${minutes}:${seconds === 0 ? "00" : seconds}`
        } else {
            return `00:${seconds === 0 ? "00" : seconds}`
        }
    }
    

    const convertUploadTime = (createdAt) => {
        const now = Date.now();
        const diff = now - new Date(createdAt).getTime(); // in ms
    
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const weeks = Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
        const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
        const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
    
        if (seconds < 60) return "just now";
        if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
        if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
        if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
        if (weeks < 4) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
        if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;
        
        return `${years} year${years > 1 ? "s" : ""} ago`;
    };

    const formatViews = (views) => {
        if (typeof views !== "Number") {
            views = Number(views);
        }

        if (views < 1000) return `${views} view${views === 1 ? "" : "s"}`;
    
        if (views < 1_000_000) {
            const val = (views / 1000).toFixed(1).replace(/\.0$/, "");
            return `${val}K views`;
        }
    
        if (views < 1_000_000_000) {
            const val = (views / 1_000_000).toFixed(1).replace(/\.0$/, "");
            return `${val}M views`;
        }
    
        const val = (views / 1_000_000_000).toFixed(1).replace(/\.0$/, "");
        return `${val}B views`;
    };
    
    return (
        <Link to={`/watch?v=${_id}`}>        
            <div className={`max-w-sm border rounded-lg border-transparent flex flex-col bg-white ${className}`} {...props}>
                <div className="upper-section relative cursor-pointer">
                    <img src={thumbnail} alt="thumbnail" className="w-50 h-50 object-contain mx-auto" />
                    <span className="video-views py-2 px-2 bg-black opacity-80 text-white font-semibold rounded-sm absolute bottom-2 right-2">{convertDuration(duration)}</span>
                </div>

                <div className="lower-section grid grid-cols-[50px_1fr] mt-2">
                    <div className="image-container">
                        <Logo src={owner.avatar} alt="profile image" width="40px" className="rounded-full w-12 h-12 cursor-pointer"/>
                    </div>
                    <div className="userinfo-container ml-2">
                        <p className="text-xl font-semibold">{title}</p>
                        <p className="text-lg text-gray-500">{owner.name}</p>
                        <div className="text-sm  text-gray-500 ">{formatViews(views)} &#183; {convertUploadTime(createdAt)}</div>
                    </div>
                </div>
            </div>
        </Link>
    )
}