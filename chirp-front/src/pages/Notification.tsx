import { useState } from 'react'
import { Heart, UserPlus, MessageCircle, AtSign } from 'lucide-react'

const Notifications = () => {
  const [filter, setFilter] = useState('Все');

  const notifications = [
    {
      id: 1,
      type: 'like',
      user: 'Анна Смирнова',
      content: 'понравился ваш пост "Tailwind v4 — это пушка!"',
      time: '12м',
      icon: <Heart className="text-red-500 fill-red-500" size={18} />,
      unread: true
    },
    {
      id: 2,
      type: 'follow',
      user: 'Максим Петров',
      content: 'подписался на вас',
      time: '2ч',
      icon: <UserPlus className="text-blue-500" size={18} />,
      unread: false
    },
    {
      id: 3,
      type: 'reply',
      user: 'CodeMaster',
      content: 'ответил: "Согласен, сборка стала в разы быстрее!"',
      time: '5ч',
      icon: <MessageCircle className="text-green-500" size={18} />,
      unread: false
    },
    {
      id: 4,
      type: 'mention',
      user: 'TechNews',
      content: 'упомянул вас в обсуждении архитектуры',
      time: '1д',
      icon: <AtSign className="text-purple-500" size={18} />,
      unread: false
    }
  ];

  const filteredNotifs = filter === 'Упоминания' 
    ? notifications.filter(n => n.type === 'mention' || n.type === 'reply')
    : notifications;

  return (
    <div className="bg-white min-h-screen">
      {/* Заголовок и фильтры */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="px-6 py-4">
          <h1 className="text-xl font-black text-slate-900">Уведомления</h1>
        </div>
        <div className="flex px-2">
          {['Все', 'Упоминания'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`flex-1 py-3 text-sm font-bold transition-all relative ${
                filter === tab ? 'text-blue-600' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              {tab}
              {filter === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full mx-12" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Лента уведомлений */}
      <div className="divide-y divide-gray-50">
        {filteredNotifs.length > 0 ? (
          filteredNotifs.map((n) => (
            <div 
              key={n.id} 
              className={`p-4 flex gap-4 transition-colors cursor-pointer hover:bg-gray-50/50 ${
                n.unread ? 'bg-blue-50/30' : ''
              }`}
            >
              <div className="mt-1">{n.icon}</div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-100 to-gray-200 border border-gray-100" />
                    <span className="font-bold text-sm text-slate-900 hover:underline">{n.user}</span>
                  </div>
                  <span className="text-xs text-gray-400">{n.time}</span>
                </div>
                <p className="mt-1 text-sm text-slate-600 leading-snug">
                  {n.content}
                </p>
              </div>
              {n.unread && (
                <div className="w-2 h-2 bg-blue-500 rounded-full self-center" />
              )}
            </div>
          ))
        ) : (
          <div className="py-20 text-center">
            <p className="text-gray-400 text-sm">Здесь пока ничего нет</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Notifications
