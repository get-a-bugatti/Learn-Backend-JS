import { useEffect, useState } from 'react'
import Footer from './components/Footer/Footer'
import Header from './components/Header/Header'
import Home from './pages/Home'
import { Sidebar } from './components'
import { Link, Outlet } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { login as loginUser, logout, logout as logoutUser } from './store/authSlice'
import { addToPlaylists, removeFromPlaylists, setPlaylists } from './store/playlistSlice'
import axios from 'axios'

function App() {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch();

  useEffect(() => {
    axios.get("/api/v1/users/current-user")
      .then(response => {
        if (response.data?.data) {
          dispatch(loginUser(response.data.data));
          return true;
        } else {
          dispatch(logoutUser());
          return false;
        }
      })
      .then(response => {
        if (!response) {
          return false;
        } else {
          axios.get("/api/v1/playlists/")
            .then(playlists => {
              if (playlists.data.data) {
                dispatch(setPlaylists(playlists.data.data))
              }
            })
        }
      })
      // add more .then()'s here to fetch and reduxStorify user-based items (posts, videos)
      .catch(err => {
        dispatch(logoutUser())
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      })
  }, [])

  return (
    loading ? null : 
    <div className="">
      <Header toggleSidebar={() => setExpanded(prev => !prev)} className="z-100"></Header>
      <Sidebar expanded={expanded}></Sidebar>
      <div className={`${expanded ? "ml-40" : "ml-28"} mt-27`}>
        <Outlet></Outlet>
      </div>
    </div>
  )
}

export default App
