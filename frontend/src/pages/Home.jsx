import { useState, useEffect } from "react";
import { VideoCard } from "../components"
import axios from "axios";

export default function Home() {


    // TODO:  use later.
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get("/api/v1/videos/fetchAll") // setup api later.
            .then(response => {
              console.log(response);

                setVideos(response.data.data);
            }).catch(error => {
              if (error.response) {
                setError(error.response.data.message);
              } else {
                  setError(error.message);
              }

            }).finally(() => {
              setLoading(false);
            })
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>


    // const videos = [
    //     {
    //       title: "Learn React in 30 Minutes",
    //       owner: {
    //         name: "kenny.np",
    //         avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    //       },
    //       duration: 1800, // in seconds (30 mins)
    //       views: 12500,
    //       thumbnail: "https://picsum.photos/id/1011/400/225"
    //     },
    //     {
    //       title: "TailwindCSS Crash Course",
    //       owner: {
    //         name: "kenny.np",
    //         avatar: "https://randomuser.me/api/portraits/men/33.jpg"
    //       },
    //       duration: 900, // 15 mins
    //       views: 4500,
    //       thumbnail: "https://picsum.photos/id/1012/400/225"
    //     },
    //     {
    //       title: "JavaScript Basics",
    //       owner: {
    //         name: "kenny.np",
    //         avatar: "https://randomuser.me/api/portraits/men/34.jpg"
    //       },
    //       duration: 1200, // 20 mins
    //       views: 32000,
    //       thumbnail: "https://picsum.photos/id/1013/400/225"
    //     },
    //     {
    //       title: "Building a YouTube Clone",
    //       owner: {
    //         name: "kenny.np",
    //         avatar: "https://randomuser.me/api/portraits/men/35.jpg"
    //       },
    //       duration: 2700, // 45 mins
    //       views: 7800,
    //       thumbnail: "https://picsum.photos/id/1014/400/225"
    //     },
    //     {
    //       title: "Node.js API Tutorial",
    //       owner: {
    //         name: "kenny.np",
    //         avatar: "https://randomuser.me/api/portraits/men/36.jpg"
    //       },
    //       duration: 1500, // 25 mins
    //       views: 120000,
    //       thumbnail: "https://picsum.photos/id/1015/400/225"
    //     },
    //     {
    //       title: "CSS Grid & Flexbox Explained",
    //       owner: {
    //         name: "kenny.np",
    //         avatar: "https://randomuser.me/api/portraits/men/37.jpg"
    //       },
    //       duration: 600, // 10 mins
    //       views: 2300,
    //       thumbnail: "https://picsum.photos/id/1016/400/225"
    //     }
    //   ];

    return (
        <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {
                    videos.map((video, i) => {
                        return <VideoCard key={i} 
                            _id={video._id}
                            title={video.title}
                            owner={video.owner}
                            duration={video.duration}
                            views={video.views}
                            thumbnail={video.thumbnail}
                        />
                    })
                }
            </div>
        </div>
    )
}