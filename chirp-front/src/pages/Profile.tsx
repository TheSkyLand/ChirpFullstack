import { useState } from 'react'
import { MapPin, Calendar, Link as LinkIcon, Edit3, Image as ImageIcon, Heart, MessageSquare } from 'lucide-react'

// --- ЗАГЛУШКИ (Твои будущие данные из БД) ---
const DUMMY_POSTS = [
  {
    id: 1,
    author: "Дмитрий Иванов",
    content: "Сегодня обновил архитектуру фронтенда. Tailwind v4 — это пушка! 🔥",
    date: "2ч",
    likes: 45,
    comments: 12
  },
  {
    id: 2,
    author: "Дмитрий Иванов",
    content: "Разбираюсь со Spring Boot транзакциями. Тяжело, но интересно. 🐘",
    date: "5ч",
    likes: 28,
    comments: 4
  }
];

const DUMMY_LIKES = [
  {
    id: 101,
    author: "Java Guru",
    content: "Почему Spring Boot — лучший выбор в 2025 году?",
    date: "12ч",
    likes: 120,
    comments: 15
  }
];

const Profile = () => {
  const [activeTab, setActiveTab] = useState('Посты');

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

  const tabs = ['Посты', 'Медиа', 'Нравится'];

  return (
    <div className="bg-white">
      {/* ... ШАПКА И ИНФО О ПОЛЬЗОВАТЕЛЕ (оставил как было) ... */}
      <div className="h-48 bg-gradient-to-r from-blue-400 to-indigo-500 relative">
        <button className="absolute bottom-4 right-4 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full backdrop-blur-md transition-all">
          <Edit3 size={18} />
        </button>
      </div>

      <div className="px-6 pb-6 relative">
        <div className="absolute -top-16 left-6">
          <div className="w-32 h-32 rounded-3xl bg-white p-1 shadow-xl flex items-center justify-center overflow-hidden">
             <div className="w-full h-full rounded-2xl bg-blue-100 flex items-center justify-center text-4xl font-bold text-blue-600">
               {user.name[0].toUpperCase()}
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
          {/* ... инфо о локации и дате ... */}
        </div>
      </div>

      {/* ТАБЫ */}
      <div className="flex border-b border-gray-100 px-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-4 text-sm font-bold transition-all relative ${
              activeTab === tab ? 'text-blue-600' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            {tab}
            {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full mx-8" />}
          </button>
        ))}
      </div>

      {/* КОНТЕНТ */}
      <div className="p-8 min-h-[300px]">
        {/* ТАБ ПОСТЫ */}
        {activeTab === 'Посты' && (
          <div className="space-y-6">
            {DUMMY_POSTS.map(post => (
              <div key={post.id} className="border border-gray-100 rounded-2xl p-4 flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-100 shrink-0 flex items-center justify-center font-bold text-blue-600">
                  {post.author[0]}
                </div>
                <div>
                  <p className="font-bold">{post.author} <span className="font-normal text-gray-400 text-sm">· {post.date}</span></p>
                  <p className="text-slate-700 mt-1">{post.content}</p>
                  <div className="flex gap-6 mt-4 text-gray-400">
                    <span className="flex items-center gap-1"><MessageSquare size={18} /> {post.comments}</span>
                    <span className="flex items-center gap-1"><Heart size={18} /> {post.likes}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ТАБ МЕДИА */}
        {activeTab === 'Медиа' && (
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center text-gray-300">
                <ImageIcon size={32} />
              </div>
            ))}
          </div>
        )}

        {/* ТАБ НРАВИТСЯ */}
        {activeTab === 'Нравится' && (
          <div className="space-y-6">
            {DUMMY_LIKES.map(post => (
              <div key={post.id} className="border border-gray-100 rounded-2xl p-4 flex gap-4 opacity-80">
                <div className="w-10 h-10 rounded-xl bg-gray-100 shrink-0 flex items-center justify-center font-bold text-gray-400">
                  {post.author[0]}
                </div>
                <div>
                  <p className="font-bold">{post.author} <span className="font-normal text-gray-400 text-sm">· {post.date}</span></p>
                  <p className="text-slate-700 mt-1">{post.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile;
