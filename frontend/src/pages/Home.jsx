import { useState, useEffect } from "react";
import { VideoCard } from "../components"
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

export default function Home() {
    const playlists = useSelector(state => state.playlist.playlists);

    // TODO:  use later.
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchParams] = useSearchParams();
    const query = searchParams.get("query");
    
    useEffect(() => {
        setLoading(true);
        setError(null);


        const params = new URLSearchParams();
        if (query) params.set("query", query);

        const queryString = params.toString();
        const url = `/api/v1/videos/fetchAll${queryString ? `?${queryString}` : ""}`;

        axios.get(url) // setup api later.
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
    }, [query]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>

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
                            playlists={playlists}
                        />
                    })
                }
            </div>
        </div>
    )
}