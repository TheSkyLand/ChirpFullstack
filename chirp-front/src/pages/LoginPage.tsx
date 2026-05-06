import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';
import { AuthController } from '../api/controllers/auth/authController';
import type { ApiError } from '../types/error-api/error-api.types';
import { codeResponseError } from '../utils/api-responses/api-responses';
import { authStore } from '../store/AuthStore';
import { observer } from 'mobx-react-lite';

const LoginPage = observer(() => {
    const [formData, setFormData] = useState({
        login: '',    // Должно быть в точности как в Java DTO
        password: '',
    });
    const navigate = useNavigate();
    const [error, setError] = useState('');

        useEffect(() => {
        // Если мы считаем, что залогинены (есть токен), но данных юзера нет — грузим их
        if (authStore.isAuthenticated && !authStore.user) {
            authStore.fetchProfile();
        }
    }, []); // Сработает один раз при загрузке сайта

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        AuthController.login(formData)
            .then((response) => {
                if (response.data.token) {
                    // Вызываем метод стора, чтобы обновить всё приложение
                    authStore.login(response.data.token);
                    console.log("Успешный вход!");
                    navigate('/');
                }
            })
            .catch(err => {
                const errorData = err as ApiError;
                if (errorData.response?.status) {
                    setError(codeResponseError(errorData.response.status));
                } else {
                    setError('Ошибка подключения к серверу');
                }
            });
    };

    // Вынес стиль в константу, чтобы не дублировать
    const inputStyle = "w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all";

    return (
        <div className="flex items-center justify-center py-20 px-4">
            <div className="w-full max-w-md bg-white rounded-3xl border border-gray-100 shadow-xl shadow-blue-50/50 p-8">

                {/* Лого и Заголовок */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-2xl mb-4">
                        <LogIn className="text-blue-600" size={32} />
                    </div>
                    <h1 className="text-3xl font-black tracking-tighter text-slate-800">С возвращением!</h1>
                    <p className="text-slate-500 mt-2">Войдите в свой аккаунт CHIRP</p>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>

                    {/* Блок Ошибки */}
                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl text-sm font-semibold animate-in fade-in slide-in-from-top-1">
                            {error}
                        </div>
                    )}

                    {/* Поле Username/Email */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Никнейм или Email</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                            <input
                                onChange={(e) => {
                                    setFormData({ ...formData, login: e.target.value });
                                    if (error) setError('');
                                }}
                                type="text"
                                required
                                placeholder="Ваш никнейм"
                                className={inputStyle}
                            />
                        </div>
                    </div>

                    {/* Поле Пароля */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center px-1">
                            <label className="text-sm font-bold text-slate-700">Пароль</label>
                            <a href="#" className="text-xs font-semibold text-blue-600 hover:underline text-right">Забыли?</a>
                        </div>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                            <input
                                onChange={(e) => {
                                    setFormData({ ...formData, password: e.target.value }); // ИСПРАВЛЕНО: было login
                                    if (error) setError('');
                                }}
                                type="password" // ИСПРАВЛЕНО: было text
                                required
                                placeholder="••••••••"
                                className={inputStyle}
                            />
                        </div>
                    </div>

                    {/* Кнопка входа */}
                    <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-[0.98] mt-4 flex items-center justify-center">
                        Войти
                    </button>
                </form>

                <div className="mt-8 text-center border-t border-slate-50 pt-6">
                    <p className="text-slate-500 text-sm">
                        Нет аккаунта?{" "}
                        <Link to="/register" className="text-blue-600 font-bold hover:underline">
                            Создать аккаунт
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
});

export default LoginPage;
