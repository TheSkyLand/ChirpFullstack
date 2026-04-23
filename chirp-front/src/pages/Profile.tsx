import { useState } from 'react' // Добавляем useState
import { MapPin, Calendar, Link as LinkIcon, Edit3, Image as ImageIcon, Heart, MessageSquare } from 'lucide-react'
import { Users } from '../types/userTypes';

const Profile = () => {
  // Состояние для активного таба
  const [activeTab, setActiveTab] = useState('Посты');
  const [data, setData] = useState<Users[]>()

  const user = {
    name: "Дмитрий Иванов",
    username: "@dima_dev",
    bio: "Fullstack Developer. Создаю крутые штуки на React и Node.js 🚀",
    location: "Москва, Россия",
    website: "github.com",
    joinedDate: "Апрель 2024",
    following: 128,
    followers: 1024,
  };

  // Варианты табов
  const tabs = ['Посты', 'Медиа', 'Нравится'];

  return (
    <div className="bg-white">
      {/* ... (Блок с обложкой и инфо остается прежним) ... */}
      <div className="h-48 bg-gradient-to-r from-blue-400 to-indigo-500 relative">
        <button className="absolute bottom-4 right-4 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full backdrop-blur-md transition-all">
          <Edit3 size={18} />
        </button>
      </div>

      <div className="px-6 pb-6 relative">
        <div className="absolute -top-16 left-6">
          <div className="w-32 h-32 rounded-3xl bg-white p-1 shadow-xl">
            <div className="w-full h-full rounded-2xl bg-gradient-to-tr from-blue-100 to-blue-200 border border-gray-100 flex items-center justify-center text-4xl font-bold text-blue-600">
              { }
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button className="border-2 border-gray-100 hover:bg-gray-50 px-5 py-2 rounded-full font-bold text-sm transition-colors">
            Редактировать
          </button>
        </div>

        <div className="mt-8">
          <h1 className="text-2xl font-black text-slate-900">{user.name}</h1>
          <p className="text-gray-500">{user.username}</p>
          <p className="mt-4 text-slate-700 leading-relaxed max-w-lg">{user.bio}</p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1"><MapPin size={16} />{user.location}</div>
            <div className="flex items-center gap-1 text-blue-500 cursor-pointer"><LinkIcon size={16} />{user.website}</div>
            <div className="flex items-center gap-1"><Calendar size={16} />В сети с {user.joinedDate}</div>
          </div>
          <div className="mt-6 flex gap-6 border-t border-gray-50 pt-6">
            <div className="flex gap-1 items-center">
              <span className="font-bold text-slate-900">{user.following}</span>
              <span className="text-gray-500 text-sm">Читаемых</span>
            </div>
            <div className="flex gap-1 items-center">
              <span className="font-bold text-slate-900">{user.followers}</span>
              <span className="text-gray-500 text-sm">Читателей</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. ТАБЫ (Кликабельные) */}
      <div className="flex border-b border-gray-100 px-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)} // Меняем стейт при клике
            className={`flex-1 py-4 text-sm font-bold transition-all relative ${activeTab === tab ? 'text-blue-600' : 'text-gray-500 hover:bg-gray-50'
              }`}
          >
            {tab}
            {/* Анимированная полоска под активным табом */}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full mx-8" />
            )}
          </button>
        ))}
      </div>

      {/* 4. КОНТЕНТ ПАНЕЛЕЙ */}
      <div className="p-8 min-h-[300px]">
        {activeTab === 'Посты' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Пример поста */}
            <div className="border border-gray-100 rounded-2xl p-4 flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 shrink-0" />
              <div>
                <p className="font-bold">Дмитрий Иванов <span className="font-normal text-gray-400 text-sm">· 2ч</span></p>
                <p className="text-slate-700 mt-1">Сегодня обновил архитектуру фронтенда. Tailwind v4 — это пушка! 🔥</p>
                <div className="flex gap-6 mt-4 text-gray-400">
                  <button className="flex items-center gap-1 hover:text-blue-500"><MessageSquare size={18} /> 12</button>
                  <button className="flex items-center gap-1 hover:text-red-500"><Heart size={18} /> 45</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Медиа' && (
          <div className="grid grid-cols-3 gap-2 animate-in fade-in duration-300">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center text-gray-300 hover:bg-gray-200 transition-colors cursor-pointer">
                <ImageIcon size={32} />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Нравится' && (
          <div className="text-center py-12 animate-in fade-in duration-300">
            <div className="w-16 h-16 bg-red-50 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart size={32} fill="currentColor" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Здесь будут лайки</h3>
            <p className="text-gray-500 text-sm">Посты, которые вы оцените, появятся здесь.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
