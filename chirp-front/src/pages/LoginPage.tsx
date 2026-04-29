import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';
import { AuthController } from '../api/controllers/auth/authController';


const LoginPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Данные для бэка:', formData);

        AuthController.login(formData)
            .then((response) => {
                console.log(response)
            })
    };




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
                    {/* Поле Email */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Email</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                            <input
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                type="email"
                                placeholder="name@example.com"
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                        </div>
                    </div>

                    {/* Поле Пароля */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center px-1">
                            <label className="text-sm font-bold text-slate-700">Пароль</label>
                            <a href="#" className="text-xs font-semibold text-blue-600 hover:underline">Забыли?</a>
                        </div>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                            <input
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                type="password"
                                placeholder="••••••••"
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                        </div>
                    </div>

                    {/* Кнопка входа */}
                    <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-[0.98] mt-4">
                        Войти
                    </button>
                </form>

                {/* Футер формы */}
                <div className="mt-8 text-center border-t border-slate-50 pt-6">
                    <p className="text-slate-500">
                        Нет аккаунта?{" "}
                        <Link to="/register" className="text-blue-600 font-bold hover:underline">
                            Создать аккаунт
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
