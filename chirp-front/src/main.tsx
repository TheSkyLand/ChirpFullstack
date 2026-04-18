import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'

// Импортируем страницы
import Home from './pages/Home'
import App from './App'
import Profile from './pages/Profile'
import Notifications from './pages/Notification'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // Главная обертка
    children: [
      {
        path: "/home", // Путь "/" внутри App
        element: <Home />,
      },
      {
        path: "/about",
        element: <Home />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/explore",
        element: <Home />,
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
