import { useState } from "react";
import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { userStore } from "../store/UserStore";

const SearchBar = observer(() => {
    const [query, setQuery] = useState("");

    return (
        <div className="relative w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input 
                type="text" 
                placeholder="Поиск по Chirp..." 
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    userStore.searchUsers(e.target.value);
                }}
                className="w-full bg-gray-100 rounded-full py-2.5 pl-12 pr-4 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all border border-transparent focus:border-blue-100" 
            />

            {/* СПИСОК РЕЗУЛЬТАТОВ ТЕПЕРЬ ЖИВЕТ ТУТ */}
            {query && userStore.users.length > 0 && (
                <div className="absolute top-14 left-0 w-full bg-white border border-gray-100 rounded-2xl shadow-2xl z-[100] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-2 border-b border-gray-50 text-[10px] uppercase tracking-widest text-gray-400 font-bold px-4">
                        Пользователи
                    </div>
                    {userStore.users.map((u) => (
                        <Link 
                            key={u.id} 
                            to={`/profile/${u.id}`} 
                            onClick={() => setQuery("")}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors"
                        >
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-blue-400 flex items-center justify-center text-white font-bold text-sm">
                                {u.username[0].toUpperCase()}
                            </div>
                            <div className="flex flex-col text-left">
                                <p className="font-bold text-sm text-slate-800 leading-none">{u.username}</p>
                                <p className="text-xs text-slate-400 mt-1">Смотреть профиль</p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
});

export default SearchBar;
