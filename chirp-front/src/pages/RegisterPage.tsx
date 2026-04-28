import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';

const RegisterPage = () => {
  // Состояния для полей (пока без React Hook Form для простоты)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleSubmit = (e: React.ChangeEvent) => {
    e.preventDefault();
    console.log('Данные для бэка:', formData);
    // Сюда мы потом прикрутим запрос к бэку и Zustand
  };

  const inputStyle = "w-full bg-gray-100 rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all border border-transparent focus:border-blue-100";

  return (
    <div className="max-w-md mx-auto py-12 px-6">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-black text-slate-800 mb-2">Создать аккаунт</h1>
        <p className="text-gray-500">Присоединяйтесь к CHIRP сегодня!</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username */}
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Имя пользователя"
            className={inputStyle}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
          />
        </div>

        {/* Email */}
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="email"
            placeholder="Электронная почта"
            className={inputStyle}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>

        {/* Password */}
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="password"
            placeholder="Пароль"
            className={inputStyle}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
        </div>

        <button 
          type="submit"
          className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-100 mt-6"
        >
          Зарегистрироваться <ArrowRight size={20} />
        </button>
      </form>

      <div className="mt-8 text-center text-sm text-gray-500">
        Уже есть аккаунт?{' '}
        <Link to="/login" className="text-blue-600 font-bold hover:underline">
          Войти
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;
