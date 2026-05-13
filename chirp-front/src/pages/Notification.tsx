import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { Heart, UserPlus, MessageCircle, AtSign, Loader2 } from 'lucide-react';
import { notificationStore } from '../store/NotificationStore';

const Notifications = observer(() => {
  const [filter, setFilter] = useState('Все');

  useEffect(() => {
    notificationStore.fetchNotifications();
    // Опционально: помечать как прочитанные при выходе со страницы
    return () => { notificationStore.markAsRead(); };
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'like': return <Heart className="text-red-500 fill-red-500" size={18} />;
      case 'follow': return <UserPlus className="text-blue-500" size={18} />;
      case 'reply': return <MessageCircle className="text-green-500" size={18} />;
      case 'mention': return <AtSign className="text-purple-500" size={18} />;
      default: return null;
    }
  };

  const filteredNotifs = filter === 'Упоминания' 
    ? notificationStore.notifications.filter(n => n.type === 'mention' || n.type === 'reply')
    : notificationStore.notifications;

  if (notificationStore.isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Заголовок и фильтры оставляем как были */}
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
                filter === tab ? 'text-blue-600' : 'text-gray-500'
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

      {/* Лента */}
      <div className="divide-y divide-gray-50">
        {filteredNotifs.length > 0 ? (
          filteredNotifs.map((n) => (
            <div 
              key={n.id} 
              className={`p-4 flex gap-4 transition-colors cursor-pointer hover:bg-gray-50/50 ${
                n.unread ? 'bg-blue-50/20' : ''
              }`}
            >
              <div className="mt-1">{getIcon(n.type)}</div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[10px] font-bold text-blue-400 border border-blue-100">
                      {n.userName[0].toUpperCase()}
                    </div>
                    <span className="font-bold text-sm text-slate-900">{n.userName}</span>
                  </div>
                  <span className="text-xs text-gray-400">{n.time}</span>
                </div>
                <p className="mt-1 text-sm text-slate-600 leading-snug">{n.content}</p>
              </div>
              {n.unread && <div className="w-2 h-2 bg-blue-500 rounded-full self-center" />}
            </div>
          ))
        ) : (
          <div className="py-20 text-center text-gray-400">Здесь пока пусто 🌌</div>
        )}
      </div>
    </div>
  );
});

export default Notifications;
