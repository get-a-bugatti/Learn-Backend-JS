import { PlaylistCard } from "../components";
import { useEffect, useState } from "react";
import axios from "axios";


export default function MyPlaylists() {

  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    setPlaylists([]);
    setLoading(true);
    setError(null);


    axios.get("/api/v1/playlists/")
      .then(res => {
        console.log("Your playlists are : ", res.data.data)
        setPlaylists(res.data.data);
      })
      .catch(error => {
        if (error.response) {
          setError(error.response.data.message);
        } else {
          setError(error.message);
        }
      })
      .finally(() => {
        setLoading(false);
      })
      ;
  }, []);


  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {playlists.map(pl => (
        <PlaylistCard
          key={pl._id}
          _id={pl._id}
          name={pl.name}
          owner={pl.owner}
          videosCount={pl.videosCount}
          thumbnail={pl.thumbnail || pl.videos?.[0]?.thumbnail}
        />
      ))}
    </div>
  );
  }