import { useEffect } from "react"; // Добавил useState
import { observer } from "mobx-react-lite";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Bell, User, Home, Hash, Bookmark, MessageSquare, LogOut } from "lucide-react";
import { authStore } from "../store/AuthStore";
import SearchBar from "../components/SearchBar";
import { postStore } from "../store/PostStore";

const Layout = observer(() => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // Загрузка профиля пользователя
        if (authStore.isAuthenticated && !authStore.user) {
            authStore.fetchProfile();
        }
        
        // ДОБАВИТЬ: Автоматическая загрузка ленты из БД Spring Boot при инициализации сайта
        postStore.fetchPosts();
    }, []);


    const handleLogout = () => {
        authStore.logout();
        navigate('/login');
    };

    const linkClass = (path: string) =>
        `flex items-center gap-4 p-3 rounded-full transition-all duration-200 ${
            location.pathname === path ? 'font-black text-blue-600 bg-blue-50' : 'hover:bg-gray-100 text-slate-800'
        }`;

    return (
        <div className="min-h-screen bg-white">
            <header className="fixed top-0 w-full z-50 border-b bg-white/80 backdrop-blur-md h-16">
                <div className="max-w-[1400px] mx-auto h-full px-4 flex items-center">
                    <div className="flex-1">
                        <Link to="/" className="text-2xl font-black text-blue-600 tracking-tighter">CHIRP</Link>
                    </div>

                    {/* ПОИСК ТЕПЕРЬ ЧИСТЫЙ — ВСЁ ВНУТРИ SearchBar */}
                    <div className="hidden md:flex flex-1 items-center justify-center relative w-full max-w-md">
                        <SearchBar />
                    </div>

                    <div className="flex-1 flex justify-end gap-3">
                        {!authStore.isAuthenticated ? (
                            <div className="flex gap-2">
                                <Link to="/login" className="px-4 py-2 font-bold text-slate-700 hover:text-blue-600 transition-colors">Войти</Link>
                                <Link to="/register" className="bg-blue-600 text-white px-5 py-2.5 rounded-full font-bold hover:bg-blue-700 transition-all shadow-md active:scale-95">Регистрация</Link>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to="/notifications" className="p-2 text-slate-600 hover:bg-gray-100 rounded-full transition-colors"><Bell size={24} /></Link>
                                <Link to="/profile" className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold border-2 border-transparent hover:border-blue-200 transition-all shadow-sm shadow-blue-100">
                                    {authStore.user?.username ? authStore.user.username[0].toUpperCase() : <User size={20} />}
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <main className="max-w-[1400px] mx-auto pt-16 flex justify-between gap-4 px-4">
                <aside className="hidden lg:flex flex-col gap-1 w-64 shrink-0 sticky top-16 h-[calc(100vh-64px)] py-4 font-medium">
                    <nav className="flex flex-col h-full gap-1">
                        <Link to="/" className={linkClass('/')}><Home size={26} /> <span>Главная</span></Link>
                        <Link to="/explore" className={linkClass('/explore')}><Hash size={26} /> <span>Обзор</span></Link>
                        {authStore.isAuthenticated && (
                            <>
                                <Link to="/messages" className={linkClass('/messages')}><MessageSquare size={26} /> <span>Сообщения</span></Link>
                                <Link to="/bookmarks" className={linkClass('/bookmarks')}><Bookmark size={26} /> <span>Закладки</span></Link>
                                <Link to="/profile" className={linkClass('/profile')}><User size={26} /> <span>Профиль</span></Link>
                                <button onClick={handleLogout} className="mt-auto mb-4 flex items-center gap-3 p-3 rounded-full text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all font-bold">
                                    <LogOut size={24} /> <span>Выйти</span>
                                </button>
                            </>
                        )}
                    </nav>
                </aside>
                <section className="flex-grow max-w-[600px] border-x border-gray-100 min-h-screen bg-white">
                    <Outlet />
                </section>
                <aside className="hidden xl:block w-[350px] shrink-0 sticky top-16 h-fit py-4 pl-4" />
            </main>
        </div>
    );
});

export default Layout;
