import { Heart, MessageSquare, Share2 } from "lucide-react";

interface PostProps {
    id: number,
    author: string,
    username: string,
    content: string,
    time: string,
    likes: number,
    replies: number
}

const Post = (props: PostProps) => {
    return (
        <div>
            <div key={props.id} className="p-4 hover:bg-gray-50/50 transition-colors cursor-pointer border-b border-gray-50 last:border-0">
                <div className="flex gap-4">
                    {/* Аватарка */}
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-gray-100 to-gray-200 border border-gray-100 flex items-center justify-center font-bold text-gray-500 shrink-0">
                        {props.author[0]}
                    </div>

                    {/* Контент */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 truncate">{props.author}</span>
                            <span className="text-gray-400 text-sm">{props.username}</span>
                            <span className="text-gray-400 text-sm">· {props.time}</span>
                        </div>
                        <p className="mt-2 text-slate-800 leading-relaxed">
                            {props.content}
                        </p>

                        {/* Кнопки действий */}
                        <div className="flex justify-between mt-4 max-w-md text-gray-400">
                            <button className="flex items-center gap-2 hover:text-blue-500 transition-colors group">
                                <div className="p-2 group-hover:bg-blue-50 rounded-full">
                                    <MessageSquare size={18} />
                                </div>
                                <span className="text-sm">{props.replies}</span>
                            </button>
                            <button className="flex items-center gap-2 hover:text-red-500 transition-colors group">
                                <div className="p-2 group-hover:bg-red-50 rounded-full">
                                    <Heart size={18} />
                                </div>
                                <span className="text-sm">{props.likes}</span>
                            </button>
                            <button className="flex items-center gap-2 hover:text-green-500 transition-colors group">
                                <div className="p-2 group-hover:bg-green-50 rounded-full">
                                    <Share2 size={18} />
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Post;
