import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import {CreateVideo, Home, Login, Signup, YourVideos, PlayVideo, LikedVideos, Subscriptions } from "./pages/index.js"

import {CommentCard} from "./components/index.js"
import {Protected} from './components/index.js'
import { Provider } from 'react-redux'
import store from "./store/store.js"
import SubscriptionCard from './components/SubscriptionCard.jsx'


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
          path: "/",
          element: <Home />,
      },
      {
          path: "/login",
          element: (
              <Protected authentication={false}>
                  <Login />
              </Protected>
          ),
      },
      {
          path: "/signup",
          element: (
              <Protected authentication={false}>
                  <Signup />
              </Protected>
          ),
      },
      {
        path: "/create-video",
        element: (
          <Protected authentication={true}>
            <CreateVideo />
          </Protected>
        )
      },
      {
        path: "/your-videos",
        element: (
          <Protected authentication={true}>
            <YourVideos />
          </Protected>
        )
      },
      {
        path: "/watch",
        element: (
          <PlayVideo />
        )
      },
      {
        path: "/liked-videos",
        element: (
          <Protected authentication={true}>
            <LikedVideos />
          </Protected>
        )
      },
      {
        path: "/subscriptions",
        element: (
          <Protected authentication={true}>
            <Subscriptions />
          </Protected>
        )
      },
      {
        path: "/test-comment",
        element: (
          <CommentCard />
        )
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}></RouterProvider>
    </Provider>
  </StrictMode>,
)
