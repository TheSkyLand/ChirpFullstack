import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'

// Импортируем страницы
import Home from './pages/Home'
import App from './App'
import Profile from './pages/Profile'
import Notifications from './pages/Notification'
import Explore from './pages/Explore'
import Feed from './pages/Feed'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // Главная обертка
    children: [
            {
        path: "/", // Путь "/" внутри App
        element: <Feed />,
      },
      {
        path: "/home", // Путь "/" внутри App
        element: <Home />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/explore",
        element: <Explore />,
      },      {
        path: "/notifications",
        element: <Notifications />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
