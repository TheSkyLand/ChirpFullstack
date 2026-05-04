import { observer } from "mobx-react-lite"; // Важно для MobX

import { useState } from "react";
import { authStore } from "../store/AuthStore";

const Profile = observer(() => {
  const [activeTab, setActiveTab] = useState('Посты');
  
  // Достаем данные пользователя из MobX
  const user = authStore.user;

  // Если данные еще грузятся или пользователя нет
  if (authStore.isLoading) return <div className="p-10 text-center">Загрузка профиля...</div>;
  if (!user) return <div className="p-10 text-center">Войдите, чтобы увидеть профиль</div>;

  const tabs = ['Посты', 'Медиа', 'Нравится'];

  return (
    <div className="bg-white">
      {/* ... СИНЯЯ ШАПКА ... */}
      
      <div className="px-6 pb-6 relative">
        <div className="absolute -top-16 left-6">
          <div className="w-32 h-32 rounded-3xl bg-white p-1 shadow-xl flex items-center justify-center overflow-hidden">
             <div className="w-full h-full rounded-2xl bg-blue-100 flex items-center justify-center text-4xl font-bold text-blue-600">
               {/* Используем первую букву имени из стора */}
               {user.username[0].toUpperCase()}
             </div>
          </div>
        </div>

        {/* ... КНОПКА РЕДАКТИРОВАТЬ ... */}

        <div className="mt-8">
          {/* Данные из твоего userDto */}
          <h1 className="text-2xl font-black text-slate-900">{user.username}</h1>
          <p className="text-gray-500">@{user.username.toLowerCase()}</p>
          
          {/* Если в userDto есть bio и email, выводим их */}
          <p className="mt-4 text-slate-700 leading-relaxed max-w-lg">
            {user.bio || "Стек: React, MobX, TypeScript 🚀"}
          </p>
          
          <div className="flex gap-4 mt-4 text-sm text-gray-500">
             <span><strong>{user.email}</strong></span>
             <span>ID: {user.id}</span>
          </div>
        </div>
      </div>

      {/* ТАБЫ И КОНТЕНТ (оставляем логику отрисовки) */}
      {/* ... */}
    </div>
  );
});

export default Profile;
