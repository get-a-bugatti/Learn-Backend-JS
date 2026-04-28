import { Tooltip } from "react-tooltip";
import { Button } from "./index.js"
import { AiOutlineDelete } from "react-icons/ai";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useMemo } from "react";

export default function DeleteVideoFromPlaylist({
    videoId
}) {
    const navigate = useNavigate();

    const encodedId = useMemo(() => btoa(videoId).slice(0, 4), [videoId]);

    let { playlistId } = useParams();

    const deleteVideoFromPlaylist = async (targetId) => {

        if (!targetId) {
            alert("No video id found.");
            return null;
        }

        try {
            const response = await axios.delete(`/api/v1/playlists/${playlistId}/videos/${targetId}`)
    
            navigate(0);
        } catch (err) {
            if (err.response) {
                console.log("Error: ", err.response.data.message);
                alert("Error: ", err.response.data.message);
            } else {
                console.log("Error: ", err.message)
                alert("Error: ", err.message)
            }
        }
   
    }

    return (
        <div className="" onClick={(e) => {
            e.stopPropagation();
        }}>
            <Button id={`del-vid-playlist-btn-${encodedId}`} bgColor="bg-white" textColor="text-black" className="hover:text-red-500 hover:font-bold" onClick={(e) => {
                e.stopPropagation();
                console.log("DELETE clicked. videoId :", videoId);
                deleteVideoFromPlaylist(videoId);
            }}><AiOutlineDelete /></Button>
            <Tooltip
                anchorSelect={`#del-vid-playlist-btn-${encodedId}`}
                place="top"
                content="Remove video from playlist"
                delayshow={200} 
            />
        </div>
    )
}