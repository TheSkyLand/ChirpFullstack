import { Bell, Home, PlusSquare, Search, User, LogIn } from "lucide-react" // Добавил LogIn
import { Link, Outlet, useLocation } from "react-router-dom"
import { useAuthStore } from "../store/useAuthStore" // Импортируем наш стор

const Layout = () => {
    const location = useLocation();

    // 1. Достаем состояние из Zustand
    const { isAuthenticated, user } = useAuthStore();
    console.log("Статус входа:", isAuthenticated); // Добавь это

    const linkClass = (path: string) =>
        `flex items-center gap-3 p-3 rounded-full transition-all ${location.pathname === path
            ? 'font-bold text-blue-600 bg-blue-50'
            : 'hover:bg-gray-100 text-slate-700'
        }`;

    return (
        <div className="min-h-screen bg-white">
            <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/" className="text-2xl font-black tracking-tighter text-blue-600">
                        CHIRP
                    </Link>

                    {/* ПОИСК (скрываем, если не залогинен, чтобы не захламлять) */}
                    <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Поиск..."
                            className="w-full bg-gray-100 rounded-full py-2 pl-10 pr-4 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <nav className="flex items-center gap-2">
                        <Link to="/" className="p-2 hover:bg-gray-100 rounded-full"><Home /></Link>

                        {/* 2. ПРОВЕРКА: Если залогинен — показываем колокольчик и аватар */}
                        {isAuthenticated ? (
                            <>
                                <Link to="/notifications" className="p-2 hover:bg-gray-100 rounded-full relative">
                                    <Bell />
                                    <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border border-white" />
                                </Link>
                                <Link to="/profile" className="ml-2 w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold overflow-hidden border-2 border-transparent hover:border-blue-200 transition-all">
                                    {/* Если на бэке есть аватарка, можно вставить <img>, если нет — первую букву */}
                                    {user?.username?.[0].toUpperCase() || <User size={20} />}
                                </Link>
                            </>
                        ) : (
                            // Если НЕ залогинен — кнопка входа
                            <Link to="/login" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full font-bold hover:bg-blue-700 transition-all">
                                <LogIn size={18} /> <span>Войти</span>
                            </Link>
                        )}
                    </nav>
                </div>
            </header>

            <main className="max-w-6xl mx-auto flex gap-8 px-4 py-6">

                {/* ЛЕВАЯ КОЛОНКА (скрываем часть ссылок для гостей) */}
                <aside className="hidden lg:flex flex-col gap-2 w-64 h-fit sticky top-24">
                    <Link to="/" className={linkClass('/')}><Home size={24} /> Главная</Link>
                    <Link to="/explore" className={linkClass('/explore')}><Search size={24} /> Обзор</Link>

                    {isAuthenticated && (
                        <>
                            <Link to="/notifications" className={linkClass('/notifications')}><Bell size={24} /> Уведомления</Link>
                            <Link to="/profile" className={linkClass('/profile')}><User size={24} /> Профиль</Link>
                            <button className="mt-4 bg-blue-500 text-white p-4 rounded-2xl font-bold hover:bg-blue-600 flex items-center justify-center gap-2 shadow-lg shadow-blue-100">
                                <PlusSquare size={20} /> Создать пост
                            </button>
                        </>
                    )}
                </aside>

                <section className="flex-1 min-w-0">
                    <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden min-h-[80vh]">
                        <Outlet />
                    </div>
                </section>

                {/* ПРАВАЯ КОЛОНКА */}
                <aside className="hidden xl:block w-80 h-fit sticky top-24">
                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                        <h3 className="font-black text-lg mb-4 text-slate-800">
                            {isAuthenticated ? "Рекомендации" : "Популярное"}
                        </h3>
                        {/* ... твой список юзеров ... */}
                    </div>
                </aside>
            </main>
        </div>
    )
}

export default Layout;
