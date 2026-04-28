import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { VideoCard } from "../components";
import { useSelector } from "react-redux";

export default function PlaylistPage() {
  const { playlistId } = useParams();

  const [playlist, setPlaylist] = useState(null);
  const [loader, setLoader] = useState(true);
  const [error, setError] = useState(null);

  const playlists = useSelector(state => state.playlist.playlists);

  useEffect(() => {
    axios.get(`/api/v1/playlists/${playlistId}`)
      .then(res => {
        setPlaylist(res.data.data);
      })
      .catch(err => {
        if (err.response) {
          setError(err.response.data.message);
        } else {
          setError(err.message);
        }
      })
      .finally(() => {
        setLoader(false);
      })
      ;
  }, [playlistId]);

  if (loader) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="w-full">

      {/* 🔥 Playlist Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{playlist.name}</h1>
        <p className="text-gray-500">
          {playlist.videos.length} videos
        </p>
        <p className="text-gray-500">
          By ...
        </p>
      </div>

      {/* 🎬 Videos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {playlist.videos.map((video, i) => {
          return <VideoCard
            key={video._id}
            _id={video._id}
            playlists={playlists}
            owner={video.owner}
            title={video.title}
            playlistPage={true}
            thumbnail={video.thumbnail}
            duration={video.duration}
            createdAt={video.createdAt}
          />
        })}
      </div>
    </div>
  );
}