import { Heart, MessageSquare, Share2, Repeat2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import { postStore } from "../store/PostStore";
import type { IPost } from "../store/PostStore.ts";
import { useState } from "react";
import { authStore } from "../store/AuthStore";

const Post = observer(({ post }: { post: IPost }) => {
    // 1. Все хуки СТРОГО в самом верху
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState(""); 

    // 2. ИСПРАВЛЕНО: Вместо return null делаем безопасный fallback-объект, если автор потерялся
    const safeAuthor = post?.author || { name: "Аноним", username: "unknown" };
    
    const targetId = post?.parentPost ? post.parentPost.id : (post?.id || 0);
    const currentPostData = post?.parentPost ? post.parentPost : post;
    const safeCurrentAuthor = currentPostData?.author || { name: "Аноним", username: "unknown" };

    const handleSendComment = () => {
        if (!commentText.trim() || !currentPostData) return;
        postStore.addComment(currentPostData.id, commentText);
        setCommentText(""); 
    };
    
    

    // Если пост совсем пустой, отрендерим пустой контейнер, не ломая хуки React
    if (!post) return <div className="hidden" />;

    return (
        <div
            className="p-4 hover:bg-gray-50/50 transition-colors cursor-pointer border-b border-gray-50 last:border-0"
            onClick={() => setShowComments(!showComments)} 
        >
            {/* ИСПРАВЛЕНО: Используем safeAuthor вместо прямой вложенности */}
            {post.parentPost && (!post.content || !post.content.trim()) && (
                <div className="flex items-center gap-2 text-xs font-bold text-green-500 mb-2 ml-12" onClick={(e) => e.stopPropagation()}>
                    <Repeat2 size={14} />
                    <span>@{safeAuthor.username} репостнул(а)</span>
                </div>
            )}

            <div className="flex gap-4">
                {/* Аватарка */}
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center font-bold text-blue-500 shrink-0">
                    {safeCurrentAuthor.name ? safeCurrentAuthor.name[0].toUpperCase() : "?"}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 truncate">
                            {safeCurrentAuthor.name}
                        </span>
                        <span className="text-gray-400 text-sm">
                            @{safeCurrentAuthor.username}
                        </span>
                        <span className="text-gray-400 text-sm">· {currentPostData?.createdAt}</span>
                    </div>

                    {currentPostData?.content && (
                        <p className="mt-2 text-slate-800 leading-relaxed whitespace-pre-wrap">
                            {currentPostData.content}
                        </p>
                    )}

                    {currentPostData?.imageUrl && (
                        <img src={currentPostData.imageUrl} className="mt-3 rounded-2xl w-full max-h-80 object-cover border border-gray-100" alt="content" />
                    )}

                    {/* Дополнительный блок цитирования */}
                    {post.parentPost && post.content && post.content.trim() && (
                        <div 
                            className="mt-3 border border-slate-100 rounded-2xl p-3 bg-slate-50/30 hover:bg-slate-50 transition-colors"
                            onClick={(e) => e.stopPropagation()} 
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-xs">@{post.parentPost.author?.username || "unknown"}</span>
                                <span className="text-[10px] text-slate-400">· {post.parentPost.createdAt}</span>
                            </div>
                            <p className="text-sm text-slate-700 leading-snug">
                                {post.parentPost.content}
                            </p>
                        </div>
                    )}

                    {/* Кнопки действий */}
                    <div className="flex justify-between mt-4 max-w-md text-gray-400">
                        <button
                            onClick={(e) => {
                                e.stopPropagation(); 
                                setShowComments(!showComments);
                            }}
                            className="flex items-center gap-1 hover:text-blue-500 transition-colors group"
                        >
                            <div className="p-2 group-hover:bg-blue-50 rounded-full"><MessageSquare size={18} /></div>
                            <span className="text-sm">{currentPostData?.repliesCount || 0}</span>
                        </button>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                postStore.toggleRetweet(targetId); 
                            }}
                            className={`flex items-center gap-1 transition-colors group ${currentPostData?.isRetweeted ? 'text-green-500' : 'hover:text-green-500'}`}
                        >
                            <div className="p-2 group-hover:bg-green-50 rounded-full">
                                <Repeat2 size={18} />
                            </div>
                            <span className="text-sm">{currentPostData?.retweetsCount || 0}</span>
                        </button>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                postStore.toggleLike(targetId); 
                            }}
                            className={`flex items-center gap-1 transition-colors group ${currentPostData?.isLiked ? 'text-red-500' : 'hover:text-red-500'}`}
                        >
                            <div className={`p-2 group-hover:bg-red-50 rounded-full ${currentPostData?.isLiked ? 'bg-red-50' : ''}`}>
                                <Heart size={18} className={currentPostData?.isLiked ? "fill-current text-red-500" : ""} />
                            </div>
                            <span className="text-sm font-bold">{currentPostData?.likesCount || 0}</span>
                        </button>

                        <button onClick={(e) => e.stopPropagation()} className="p-2 hover:bg-gray-50 rounded-full hover:text-slate-600 transition-colors">
                            <Share2 size={18} />
                        </button>
                    </div>

                    {/* Секция комментариев */}
                    {showComments && currentPostData && (
                        <div className="mt-4 space-y-4 pt-4 border-t border-gray-100" onClick={(e) => e.stopPropagation()}>
                            
                            {currentPostData.comments?.map((c) => (
                                <div key={c.id} className="flex gap-2 text-sm bg-slate-50 p-2.5 rounded-2xl">
                                    <span className="font-bold text-slate-800">@{c.author?.username}:</span>
                                    <span className="text-slate-600">{c.content}</span>
                                </div>
                            ))}

                            <div className="flex gap-3 px-2">
                                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center font-bold text-blue-500 shrink-0">
                                    {authStore.user?.username ? authStore.user.username.toUpperCase() : "?"}
                                </div>

                                <div className="flex-1 group">
                                    <textarea
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        placeholder="Чиркните в ответ..."
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-2.5 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all resize-none min-h-[45px]"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSendComment();
                                            }
                                        }}
                                    />
                                    <div className="flex justify-end mt-2">
                                        <button
                                            onClick={handleSendComment}
                                            className="bg-blue-600 text-white px-5 py-1.5 rounded-full text-xs font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-100 active:scale-95"
                                        >
                                            Ответить
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
});

export default Post;
