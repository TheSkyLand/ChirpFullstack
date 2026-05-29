import React, { useState, useEffect } from 'react';
import { observer } from "mobx-react-lite";
import { authStore } from "../store/AuthStore";
import { Link, useParams } from "react-router-dom"; // 🟢 ДОБАВЛЕН useParams
import { postStore } from "../store/PostStore";
import Post from "../components/Post";

const Profile = observer(() => {
  const [activeTab, setActiveTab] = useState('Посты');
  
  // 1. Извлекаем username из динамического пути роутера "profile/:username"
  const { username } = useParams<{ username: string }>();

  // 2. Проверяем, смотрим ли мы свой собственный профиль
  const isOwnProfile = !username || username === authStore.user?.username;

  // 3. Выбираем, чьи данные отображать в шапке
  // Если профиль наш — берем объект из authStore, если чужой — создаем временный объект на основе постов
  const displayedUser = isOwnProfile ? authStore.user : {
    username: username,
    bio: "Пользователь Chirp 🚀",
    following: 0,
    followers: 0
  };

  // 4. При смене пользователя в URL заставляем стор подтянуть актуальную ленту
  useEffect(() => {
    if (!isOwnProfile && username) {
        // Если у вас еще нет эндпоинта для чужих постов, мы можем временно вызывать fetchPosts(),
        // а фронтенд ниже сам отфильтрует посты по username этого человека
        postStore.fetchPosts(); 
    } else {
        postStore.fetchPosts(); // Для своего профиля грузим обычную ленту
    }
  }, [username, isOwnProfile]);

  // Защита: Лоадер данных авторизации
  if (authStore.isLoading || (localStorage.getItem('token') && !authStore.user)) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 font-bold">Чирпаем данные...</p>
      </div>
    );
  }

  if (!authStore.user && !authStore.isLoading) {
    return <div className="p-20 text-center text-2xl font-black">Войдите в аккаунт</div>;
  }
  return (
    <div className="bg-white">
      {/* Обложка */}
      <div className="h-44 bg-gradient-to-tr from-blue-500 to-blue-300 relative" />

      <div className="px-6 pb-6 relative">
        {/* Аватарка */}
        <div className="absolute -top-16 left-6">
          <div className="w-32 h-32 rounded-3xl bg-white p-1 shadow-2xl flex items-center justify-center">
            <div className="w-full h-full rounded-2xl bg-blue-50 flex items-center justify-center text-4xl font-black text-blue-600">
              {displayedUser?.username ? displayedUser.username[0].toUpperCase() : '?'}
            </div>
          </div>
        </div>

        {/* Кнопка редактирования (Показывается ТОЛЬКО в своем профиле) */}
        <div className="flex justify-end pt-4">
          {isOwnProfile ? (
            <button className="px-5 py-2 border-2 border-slate-100 rounded-full font-bold hover:bg-slate-50 transition-all text-sm">
              Редактировать
            </button>
          ) : (
            <button className="px-5 py-2 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-all text-sm shadow-md shadow-blue-100">
              Читать
            </button>
          )}
        </div>

        {/* Инфо */}
        <div className="mt-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">{displayedUser?.username}</h1>
          <p className="text-slate-500 font-medium leading-none">@{displayedUser?.username?.toLowerCase()}</p>

          <p className="mt-4 text-slate-700 leading-relaxed font-medium">
            {displayedUser?.bio}
          </p>

          <div className="flex gap-4 mt-4 text-sm font-semibold">
            <Link to={`/profile/${displayedUser?.username}/following`} className="hover:underline decoration-slate-400">
              <span className="text-slate-900">{displayedUser?.following || 0}</span>
              <span className="text-slate-400 font-medium ml-1">Читаемые</span>
            </Link>
            <Link to={`/profile/${displayedUser?.username}/followers`} className="hover:underline decoration-slate-400">
              <span className="text-slate-900">{displayedUser?.followers || 0}</span>
              <span className="text-slate-400 font-medium ml-1">Читатели</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Табы */}
      <div className="flex border-b border-slate-100">
        {['Посты', 'Медиа', 'Нравится'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-4 text-sm font-bold transition-all ${activeTab === tab ? 'text-blue-600 border-b-4 border-blue-600' : 'text-slate-400 hover:bg-slate-50'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>
      
      {/* Список постов с фильтрацией под конкретного displayedUser */}
      <div className="divide-y divide-gray-50">
        {postStore.posts
          .filter(p => {
            const isAuthor = p.author?.username === displayedUser?.username;
            const isMyRepost = p.parentPost && p.author?.username === displayedUser?.username;
            const isMyContent = isAuthor || isMyRepost;

            if (activeTab === 'Посты') return isMyContent;
            if (activeTab === 'Медиа') return isMyContent && (p.imageUrl || p.parentPost?.imageUrl);
            if (activeTab === 'Нравится') return p.isLiked;

            return isMyContent;
          })
          .map((post, index) => {
            const uniqueKey = post.parentPost
              ? `profile-repost-${post.id}-${post.author?.username || 'user'}-${index}`
              : `profile-post-${post.id}-${index}`;

            return (
              <Post key={uniqueKey} post={post} />
            );
          })
        }

        {/* Проверка на пустоту */}
        {postStore.posts.filter(p => {
          const isAuthor = p.author?.username === displayedUser?.username;
          const isMyRepost = p.parentPost && p.author?.username === displayedUser?.username;
          const isMyContent = isAuthor || isMyRepost;

          if (activeTab === 'Посты') return isMyContent;
          if (activeTab === 'Медиа') return isMyContent && (p.imageUrl || p.parentPost?.imageUrl);
          if (activeTab === 'Нравится') return p.isLiked;
          return isMyContent;
        }).length === 0 && (
            <div className="p-10 text-center text-slate-400 font-medium">
              На вкладке "{activeTab}" пока ничего нет 🌌
            </div>
          )}
      </div>
    </div>
  );
});

export default Profile;
