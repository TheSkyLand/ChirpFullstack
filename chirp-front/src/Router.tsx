import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'

// Импортируем страницы
import Profile from './pages/Profile'
import Notifications from './pages/Notification'
import Explore from './pages/Explore'
import Feed from './pages/Feed'
import Layout from './layouts/Layout' // Тот самый код, что мы писали
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // Теперь это главная точка входа с нашими стилями
    children: [
      {
        index: true,     // Вместо path: "/" используем index: true
        element: <Feed />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "explore",
        element: <Explore />,
      },
      {
        path: "notifications",
        element: <Notifications />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "login",
        element: <LoginPage />
      }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
