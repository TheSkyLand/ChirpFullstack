import { Search, Bell, User, Home, Hash, Bookmark, MessageSquare, LogOut } from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { observer } from "mobx-react-lite"; // 1. Импортируем observer
import { authStore } from "../store/AuthStore"; // 2. Импортируем экземпляр стора (с маленькой буквы)

const Layout = observer(() => { // 3. Оборачиваем в observer
    const location = useLocation();
    
    // 4. Достаем данные напрямую из объекта стора
    const { isAuthenticated, user, logout } = authStore;

    const linkClass = (path: string) =>
        `flex items-center gap-4 p-3 rounded-full transition-all duration-200 ${
            location.pathname === path
                ? 'font-black text-blue-600 bg-blue-50'
                : 'hover:bg-gray-100 text-slate-800'
        }`;

    return (
        <div className="min-h-screen bg-white">
            <header className="fixed top-0 w-full z-50 border-b bg-white/80 backdrop-blur-md h-16">
                <div className="max-w-[1400px] mx-auto h-full px-4 flex items-center">
                    <div className="flex-1">
                        <Link to="/" className="text-2xl font-black text-blue-600 tracking-tighter">CHIRP</Link>
                    </div>

                    <div className="hidden md:flex flex- items-center relative w-full max-w-md">
                        <Search className="absolute left-4 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Поиск по Chirp..."
                            className="w-full bg-gray-100 rounded-full py-2.5 pl-12 pr-4 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all border border-transparent focus:border-blue-500"
                        />
                    </div>

                    <div className="flex-1 flex justify-end gap-3">
                        {!isAuthenticated ? (
                            <>
                                <Link to="/login" className="px-4 py-2 font-bold text-slate-700 hover:text-blue-600 transition-colors">Войти</Link>
                                <Link to="/register" className="bg-blue-600 text-white px-5 py-2.5 rounded-full font-bold hover:bg-blue-700 transition-all shadow-md active:scale-95">Регистрация</Link>
                            </>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to="/notifications" className="p-2 text-slate-600 hover:bg-gray-100 rounded-full relative">
                                    <Bell size={22} />
                                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white" />
                                </Link>
                                <Link to="/profile" className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold overflow-hidden border border-gray-100">
                                    {/* Безопасное отображение первой буквы */}
                                    {user?.username ? user.username[0].toUpperCase() : <User size={20} />}
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <main className="max-w-[1400px] mx-auto pt-16 flex justify-between gap-4 px-4">
                <aside className="hidden lg:flex flex-col gap-1 w-64 shrink-0 sticky top-16 h-[calc(100vh-64px)] py-4">
                    <nav className="flex flex-col gap-1">
                        <Link to="/" className={linkClass('/')}><Home size={26} /> <span className="text-lg">Главная</span></Link>
                        <Link to="/explore" className={linkClass('/explore')}><Hash size={26} /> <span className="text-lg">Обзор</span></Link>
                        
                        {isAuthenticated && (
                            <>
                                <Link to="/messages" className={linkClass('/messages')}><MessageSquare size={26} /> <span className="text-lg">Сообщения</span></Link>
                                <Link to="/bookmarks" className={linkClass('/bookmarks')}><Bookmark size={26} /> <span className="text-lg">Закладки</span></Link>
                                <Link to="/profile" className={linkClass('/profile')}><User size={26} /> <span className="text-lg">Профиль</span></Link>
                                
                                <button className="mt-4 w-full bg-blue-500 text-white py-3 rounded-full font-bold hover:bg-blue-600 shadow-lg transition-transform active:scale-95">
                                    Опубликовать
                                </button>
                                
                                <button 
                                    onClick={() => logout()} 
                                    className="mt-auto mb-4 flex items-center gap-3 p-3 rounded-full text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all"
                                >
                                    <LogOut size={24} /> <span className="font-medium">Выйти</span>
                                </button>
                            </>
                        )}
                    </nav>
                </aside>

                <section className="flex-grow max-w-[600px] border-x border-gray-100 min-h-screen bg-white">
                    <Outlet />
                </section>

                <aside className="hidden xl:block w-[350px] shrink-0 sticky top-16 h-fit py-4 pl-4">
                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                        <h3 className="font-black text-xl mb-4 text-slate-800">Что нового</h3>
                        <div className="space-y-4">
                            <div className="cursor-pointer hover:opacity-70 text-sm">
                                <p className="text-xs text-gray-500 italic">Тренды</p>
                                <p className="font-bold">#MobXisLife</p>
                                <p className="text-xs text-gray-500">1,204 постов</p>
                            </div>
                        </div>
                    </div>
                </aside>
            </main>
        </div>
    );
});

export default Layout;
