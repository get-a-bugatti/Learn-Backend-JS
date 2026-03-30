
import {useState, useEffect} from "react"
import { VideoPlayer } from "../components/index.js";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

export default function PlayVideo() {
    const [searchParams] = useSearchParams();
    const [video, setVideo] = useState(null);
    const [loader, setLoader] = useState(true)
    const [error, setError] = useState(null)

    const videoId = searchParams.get("v");

    if (!videoId) {
        return <div>Invalid URL. Query parameter `?v` missing.</div>
    }

    useEffect(() => {
        axios.get(`/api/v1/videos/${videoId}`)
            .then(response => {
                console.log("response :", response);
                setVideo(response.data.data);
            })
            .catch(error => {
                if (error.response) {
                    setError(error.response.data.message)
                } else {
                    setError(error.message)
                }
            }).finally(() => {
                setLoader(false);
            })
    }, [])


    if (loader) return <div>Loading...</div>
    if (error) return <div>Error: {error}</div>

    return (
        <div className="w-full">
            <VideoPlayer
                videoUrl={video.videoFile}
                title={video.title}
                description={video.description}
            />
        </div>
    )
}