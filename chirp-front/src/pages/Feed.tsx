import { Image, Send } from 'lucide-react'
import Post from '../components/Post';

// --- ЗАГЛУШКИ ДЛЯ ЛЕНТЫ ---
const DUMMY_FEED = [
    {
        id: 1,
        author: "Алексей Петров",
        username: "@alex_java",
        content: "Наконец-то настроил Spring Security. Это было потно, но теперь база под замком! 🔒🐘",
        time: "45м",
        likes: 124,
        replies: 12
    },
    {
        id: 2,
        author: "Мария и Ко",
        username: "@mary_design",
        content: "Как вам обновленный дизайн Chirp? Старались сделать максимально минималистично. ✨",
        time: "2ч",
        likes: 89,
        replies: 45
    },
    {
        id: 3,
        author: "Ivan 01",
        username: "@vanya_dev",
        content: "Vite + React = любовь с первого билда. Забываю про CRA как про страшный сон.",
        time: "5ч",
        likes: 210,
        replies: 8
    }
];

const Feed = () => {
    return (
        <div className="divide-y divide-gray-100">

            {/* 1. БЛОК СОЗДАНИЯ ПОСТА */}
            <div className="p-4 bg-white">
                <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center text-white font-bold shrink-0">
                        Д
                    </div>
                    <div className="flex-1">
                        <textarea
                            placeholder="Что нового?"
                            className="w-full bg-transparent text-lg outline-none resize-none py-2"
                            rows={2}
                        />
                        <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                            <div className="flex gap-2 text-blue-500">
                                <button className="p-2 hover:bg-blue-50 rounded-full transition-colors">
                                    <Image size={20} />
                                </button>
                            </div>
                            <button className="bg-blue-500 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-600 transition-colors flex items-center gap-2">
                                <span>Chirp</span>
                                <Send size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. ЛЕНТА ПОСТОВ */}
            <div className="flex flex-col">
                {DUMMY_FEED.map((post) => (
                    <Post
                        id={post.id}
                        author={post.author}
                        username={post.username}
                        content={post.content}
                        time={post.time}
                        likes={post.likes}
                        replies={post.replies}
                    ></Post>
                ))}
            </div>
        </div>
    )
}

export default Feed