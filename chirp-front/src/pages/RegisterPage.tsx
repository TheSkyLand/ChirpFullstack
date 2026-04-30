import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Добавил useNavigate
import { User, Mail, Lock, ArrowRight, UserPlus } from 'lucide-react';
import { AuthController } from '../api/controllers/auth/authController';
import type { ApiError } from '../types/error-api/error-api.types';
import { codeResponseError } from '../utils/api-responses/api-responses';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  
  const [error, setError] = useState(''); // Стейт для ошибки
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Сброс перед запросом
    console.log('Данные для бэка:', formData);

    AuthController.register(formData)
      .then((response) => {
        // Если бэк сразу отдает токен после регистрации
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('userId', String(response.data.userId));
          localStorage.setItem('username', response.data.username);
          
          console.log("Регистрация успешна!", response.data);
          navigate('/'); // Или на '/'
        } else {
          // Если бэк не логинит сразу, просто отправляем на логин
          navigate('/login');
        }
      })
      .catch(err => {
        const errorData = err as ApiError;
        console.error('Ошибка регистрации:', errorData);

        if (errorData.response?.status) {
          setError(codeResponseError(errorData.response.status));
        } else {
          setError('Ошибка подключения к серверу');
        }
      });
  };

  const inputStyle = "w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all";

  return (
    <div className="flex items-center justify-center py-10 px-4">
      <div className="w-full bg-white rounded-3xl border border-gray-100 shadow-xl shadow-blue-50/50 p-8">

        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-2xl mb-4 text-blue-600">
            <UserPlus size={32} />
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-slate-800">Создать аккаунт</h1>
          <p className="text-slate-500 mt-2">Присоединяйтесь к CHIRP сегодня!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Блок Ошибки — такой же, как в логине */}
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl text-sm font-semibold animate-in fade-in slide-in-from-top-1">
              {error}
            </div>
          )}

          {/* Username */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 ml-1">Имя пользователя</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                required
                type="text"
                placeholder="johndoe"
                className={inputStyle}
                onChange={(e) => {
                  setFormData({ ...formData, username: e.target.value });
                  if(error) setError('');
                }}
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 ml-1">Email</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                required
                type="email"
                placeholder="name@example.com"
                className={inputStyle}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if(error) setError('');
                }}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 ml-1">Пароль</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                required
                type="password"
                placeholder="••••••••"
                className={inputStyle}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  if(error) setError('');
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-100 mt-6 active:scale-[0.98]"
          >
            Зарегистрироваться <ArrowRight size={20} />
          </button>
        </form>

        <div className="mt-8 text-center border-t border-slate-50 pt-6">
          <p className="text-slate-500 text-sm">
            Уже есть аккаунт?{' '}
            <Link to="/login" className="text-blue-600 font-bold hover:underline">
              Войти
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;