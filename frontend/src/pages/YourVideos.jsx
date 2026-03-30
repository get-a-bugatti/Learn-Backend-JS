import axios from "axios";
import {VideoCard} from "../components/index.js"
import {useEffect, useState} from "react";


export default function YourVideos() {
    const [videos, setVideos] = useState([]);
    const [loader, setLoader] = useState(true);

    useEffect(() => {

        axios.post("/api/v1/videos/your-videos")
            .then(result => {
                console.log("retireved videos", result);

                setVideos(result.data.data);
            })
            .finally(() => {
                setLoader(false)
            })
    }, [])


    return (
        loader ? null : (

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
    )
}