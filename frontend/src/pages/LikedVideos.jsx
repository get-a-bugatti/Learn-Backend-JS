import axios from "axios";
import {VideoCard} from "../components/index.js"
import {useEffect, useState} from "react";


export default function LikedVideos() {
    const [videos, setVideos] = useState([]);
    const [loader, setLoader] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        axios.post("/api/v1/users/liked/videos")
            .then(result => {
                console.log("retrieved videos", result);

                setVideos(result.data.data);
            })
            .catch(error => {
                if (error.response) {
                    setError(error.response.data.message)
                } else {
                    setError(error.message);
                }
            })
            .finally(() => {
                setLoader(false)
            })
    }, [])


    if (loader) return <div>Loading...</div>
    if (error) return <div>Error : {error}</div>


    return (

        <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-fit">
            {
                videos.map((video, i) => {
                    return <VideoCard key={i}
                        _id={video._id}
                        title={video.title}
                        description={video.description}
                        thumbnail={video.thumbnail}
                        owner={video.owner}
                        views={video.views}
                        duration={video.duration}
                        createdAt={video.createdAt}
                    />
                })
            }
        </div>
        )
}