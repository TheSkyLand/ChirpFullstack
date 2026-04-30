import { Route, Navigate, Routes } from 'react-router-dom';
import Layout from '../layouts/Layout';
import Feed from '../pages/Feed';
import Profile from '../pages/Profile';
import Explore from '../pages/Explore';
import Notifications from '../pages/Notification';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import AuthLayout from '../layouts/AuthLayout';

const AppRouter = () => {
  return (
<Routes>
  {/* Группа Авторизации */}
  <Route element={<AuthLayout />}>
    <Route path="login" element={<LoginPage />} />
    <Route path="register" element={<RegisterPage />} />
  </Route>

  {/* Группа Основного приложения */}
  <Route element={<Layout />}>
    <Route index element={<Feed />} />
    <Route path="profile" element={<Profile />} />
    <Route path="explore" element={<Explore />} />
    <Route path="notifications" element={<Notifications />} />
  </Route>

  <Route path="*" element={<Navigate to="/" replace />} />
</Routes>
  );
};

export default AppRouter
