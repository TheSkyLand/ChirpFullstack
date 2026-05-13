import { Heart, MessageSquare, Share2, Repeat2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import { postStore } from "../store/PostStore";
import type { IPost, IComment } from "../store/PostStore.ts";
import { useState } from "react";
// 1. Исправляем тип пропсов: принимаем только IPost
const Post = observer(({ post }: { post: IPost }) => {
    if (!post || !post.author) return null; 
    const [showComments, setShowComments] = useState(false);

    return (
        <div
            className="p-4 hover:bg-gray-50/50 transition-colors cursor-pointer border-b border-gray-50 last:border-0"
            onClick={() => setShowComments(!showComments)} // Разворачиваем комменты по клику на пост
        >
            <div className="flex gap-4">
                {/* Аватарка */}
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center font-bold text-blue-500 shrink-0">
                    {post.author.name[0].toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 truncate">
                            {post.author?.name || "Аноним"}
                        </span>
                        <span className="text-gray-400 text-sm">
                            @{post.author?.username || "unknown"}
                        </span>
                        <span className="text-gray-400 text-sm">· {post.createdAt}</span>
                    </div>

                    <p className="mt-2 text-slate-800 leading-relaxed whitespace-pre-wrap">
                        {post.content}
                    </p>

                    {post.imageUrl && (
                        <img src={post.imageUrl} className="mt-3 rounded-2xl w-full max-h-80 object-cover border border-gray-100" alt="content" />
                    )}

                    {/* Кнопки действий */}
                    <div className="flex justify-between mt-4 max-w-md text-gray-400">
                        {/* Кнопка комментариев */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation(); // Чтобы не срабатывал клик родителя
                                setShowComments(!showComments);
                            }}
                            className="flex items-center gap-1 hover:text-blue-500 transition-colors group"
                        >
                            <div className="p-2 group-hover:bg-blue-50 rounded-full"><MessageSquare size={18} /></div>
                            <span className="text-sm">{post.repliesCount}</span>
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                postStore.toggleRetweet(post.id);
                            }}
                            className={`flex items-center gap-1 transition-colors group ${post.isRetweeted ? 'text-green-500' : 'hover:text-green-500'}`}
                        >
                            <div className="p-2 group-hover:bg-green-50 rounded-full">
                                <Repeat2 size={18} />
                            </div>
                            <span className="text-sm">{post.retweetsCount}</span>
                        </button>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                postStore.toggleLike(post.id);
                            }}
                            className={`flex items-center gap-1 transition-colors group ${post.isLiked ? 'text-red-500' : 'hover:text-red-500'}`}
                        >
                            <div className={`p-2 group-hover:bg-red-50 rounded-full ${post.isLiked ? 'bg-red-50' : ''}`}>
                                <Heart size={18} className={post.isLiked ? "fill-current text-red-500" : ""} />
                            </div>
                            <span className="text-sm font-bold">{post.likesCount}</span>
                        </button>

                        <button className="p-2 hover:bg-gray-50 rounded-full hover:text-slate-600 transition-colors">
                            <Share2 size={18} />
                        </button>
                    </div>

                    {post.parentPost && (
                        <div className="mt-3 border border-slate-100 rounded-2xl p-3 bg-slate-50/30 hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-5 h-5 rounded-md bg-blue-500 flex items-center justify-center text-[8px] text-white font-bold">
                                    {post.parentPost.author.name[0]}
                                </div>
                                <span className="font-bold text-xs">@{post.parentPost.author.username}</span>
                                <span className="text-[10px] text-slate-400">· {post.parentPost.createdAt}</span>
                            </div>
                            <p className="text-sm text-slate-700 leading-snug">
                                {post.parentPost.content}
                            </p>
                        </div>
                    )}

                    {/* Секция комментариев */}
                    {showComments && (
                        <div className="mt-4 space-y-6 pt-4 border-t border-gray-100" onClick={(e) => e.stopPropagation()}>

                            {/* Форма ввода (стильная) */}
                            <div className="flex gap-3 px-2">

                                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center font-bold text-blue-500 shrink-0">
                                    {post.author?.name ? post.author.name[0].toUpperCase() : "?"}
                                </div>

                                <div className="flex-1 group">
                                    <textarea
                                        placeholder="Чиркните в ответ..."
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-2.5 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all resize-none min-h-[45px]"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                postStore.addComment(post.id, e.currentTarget.value);
                                                e.currentTarget.value = "";
                                            }
                                        }}
                                    />
                                    <div className="flex justify-end mt-2">
                                        <button
                                            onClick={(e) => {
                                                const input = e.currentTarget.parentElement?.previousElementSibling as HTMLTextAreaElement;
                                                if (input.value.trim()) {
                                                    postStore.addComment(post.id, input.value);
                                                    input.value = "";
                                                }
                                            }}
                                            className="bg-blue-600 text-white px-5 py-1.5 rounded-full text-xs font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-100 active:scale-95"
                                        >
                                            Ответить
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Список комментаторов */}
                            <div className="space-y-5">
                                {post.comments?.map((c: IComment) => (
                                    <div key={c.id} className="relative flex gap-3 px-2 group">
                                        {/* Линия связи (визуальная нить) */}
                                        <div className="absolute left-7 top-10 bottom-[-20px] w-0.5 bg-slate-100 group-last:hidden" />

                                        {/* Аватар комментатора */}
                                        <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-500 shrink-0 z-10">
                                            {c.author.username[0].toUpperCase()}
                                        </div>

                                        <div className="flex-1 bg-slate-50/50 rounded-2xl p-3 border border-slate-100/50 hover:bg-slate-50 transition-colors">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="font-bold text-sm text-slate-900">@{c.author.username}</span>
                                                <span className="text-[10px] text-slate-400 font-medium">только что</span>
                                            </div>
                                            <p className="text-sm text-slate-700 leading-relaxed">
                                                {c.content}
                                            </p>

                                            {/* Мини-кнопки под комментом для вида */}
                                            <div className="flex gap-4 mt-2 text-slate-400">
                                                <Heart size={14} className="hover:text-red-500 cursor-pointer transition-colors" />
                                                <MessageSquare size={14} className="hover:text-blue-500 cursor-pointer transition-colors" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {(!post.comments || post.comments.length === 0) && (
                                <p className="text-center text-slate-400 text-xs py-4 font-medium">
                                    Будьте первым, кто ответит на этот чирп! ✨
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});

export default Post;
