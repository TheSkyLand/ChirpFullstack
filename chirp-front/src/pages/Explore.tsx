import { useEffect, useState } from "react";
import { CrossIcon, LoaderIcon, UserPlus } from "lucide-react";
import type { userDto } from "../types/user.types";

// --- ЗАГЛУШКИ (Понятные поля для будущих Users) ---
const DUMMY_USERS = [
    {
        id: 1,
        name: "test",
        username: "test",
        bio: "test",
        location: "test",
        website: "test",
        joinedDate: "test",
        following: 52,
        followers: 11,
    },
];

const Explore = () => {
    // Используем Users[] если у тебя уже есть тип, или пока any для заглушек
    const [data, setData] = useState<userDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadUsers = async () => {
            try {
                setLoading(true);
                //await new Promise(resolve => setTimeout(resolve, 600));
                //const response = await axios.get('/api/users');
                setData(DUMMY_USERS);

            } catch (err) {
                setError(String(err));
            } finally {
                setLoading(false);
            }
        };

        loadUsers();
    }, []);

    if (loading) return (
        <div className="flex justify-center py-20 animate-spin">
            <LoaderIcon className="text-blue-500" size={40} />
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center py-20 text-red-500">
            <CrossIcon size={40} />
            <p className="mt-2 font-bold">Произошла ошибка (govno)</p>
        </div>
    );

    return (
        <div className="bg-white min-h-screen">
            <div className="px-6 py-4 border-b border-gray-100">
                <h1 className="text-xl font-black text-slate-900">Интересное</h1>
                <p className="text-sm text-gray-500">Рекомендованные пользователи для вас</p>
            </div>

            <ul className="divide-y divide-gray-50">
                {data.map(item => (
                    <li key={item.id} className="p-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                        <div className="flex gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center font-bold text-indigo-600">
                                {item.name[0]}
                            </div>
                            <div>
                                <p className="font-bold text-slate-900">{item.name}</p>
                                <p className="text-sm text-gray-500">{item.username}</p>
                                <p className="text-xs text-slate-600 mt-1">{item.bio}</p>
                            </div>
                        </div>
                        <button className="bg-black text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-slate-800 transition-colors flex items-center gap-1">
                            <UserPlus size={14} /> Читать
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Explore;