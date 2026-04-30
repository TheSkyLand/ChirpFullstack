import { Link, Outlet } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 relative">
      {/* Кнопка Назад */}
      <Link 
        to="/" 
        className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-semibold"
      >
        <ChevronLeft size={20} />
        <span>На главную</span>
      </Link>

      {/* Контент (LoginPage или RegisterPage) */}
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;