import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Repeat2, MessageSquare, Heart, Share2 } from 'lucide-react';
import { postStore } from '../store/PostStore';
import { authStore } from '../store/AuthStore';
import { useNavigate } from 'react-router-dom';
interface IAuthor {
    id?: number | null;
    username: string;
    name: string;
}

interface IComment {
    id: number;
    content: string;
    author?: IAuthor | null;
}

interface IPost {
    id: number;
    content: string;
    imageUrl?: string;
    createdAt: string;
    userId?: number | null;
    isLiked: boolean;
    isRetweeted: boolean;
    likesCount: number;
    retweetsCount: number;
    repliesCount: number;
    author: IAuthor;
    parentPost?: IPost | null;
    comments: IComment[];
}


const Post = observer(({ post }: { post: IPost }) => {
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState("");
    const navigate = useNavigate(); // 🟢 Инициализируем хук навигации

    if (!post) return <div className="hidden" />;

    const rootAuthor = {
        name: post.author?.name || post.author?.username || "Пользователь",
        username: post.author?.username || "user"
    };

    const originalAuthor = {
        name: post.parentPost?.author?.name || post.parentPost?.author?.username || "Аноним",
        username: post.parentPost?.author?.username || "unknown"
    };

    const currentPostData = post.parentPost ?? post;
    const displayAuthor = post.parentPost ? originalAuthor : rootAuthor;
    const targetId = post.parentPost?.id ?? post.id;

    const avatarLetter = displayAuthor.name.trim().length > 0
        ? displayAuthor.name.trim().toUpperCase()
        : "?";

    // 🟢 Вспомогательный метод для безопасного перехода в профиль
    const handleProfileClick = (username: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Предотвращаем открытие/закрытие комментариев поста
        if (username && username !== "unknown" && username !== "user") {
            navigate(`/profile/${username}`);
        }
    };

    const handleSendComment = () => {
        if (!commentText.trim()) return;
        postStore.addComment(currentPostData.id, commentText);
        setCommentText("");
    };

    const isPureRetweet = !!post.parentPost && (!post.content || !post.content.trim());

    return (
        <div>
            <div
                className="p-4 hover:bg-gray-50/50 transition-colors cursor-pointer border-b border-gray-50 last:border-0"
                onClick={() => setShowComments(!showComments)}
            >
                {/* Шапка репоста */}
                {isPureRetweet && (
                    <div
                        className="flex items-center gap-2 text-xs font-bold text-green-500 mb-2 ml-12 hover:underline"
                        onClick={(e) => handleProfileClick(rootAuthor.username, e)}
                    >
                        <Repeat2 size={14} />
                        <span>@{rootAuthor.username} репостнул(а)</span>
                    </div>
                )}

                <div className="flex gap-4">
                    {/* Аватарка */}
                    <div
                        className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center font-bold text-blue-500 shrink-0 select-none hover:opacity-80 transition-opacity"
                        onClick={(e) => handleProfileClick(displayAuthor.username, e)}
                    >
                        {avatarLetter}
                    </div>

                    {/* Контентный блок */}
                    <div className="flex-1 min-w-0">
                        {/* Имя и юзернейм автора */}
                        <div className="flex items-center gap-2">
                            <span
                                className="font-bold text-slate-900 truncate hover:underline cursor-pointer"
                                onClick={(e) => handleProfileClick(displayAuthor.username, e)}
                            >
                                {displayAuthor.name}
                            </span>
                            <span
                                className="text-gray-400 text-sm truncate hover:underline cursor-pointer"
                                onClick={(e) => handleProfileClick(displayAuthor.username, e)}
                            >
                                @{displayAuthor.username}
                            </span>
                            <span className="text-gray-400 text-sm shrink-0">
                                · {currentPostData.createdAt || "недавно"}
                            </span>
                        </div>

                        {/* Текст поста */}
                        {currentPostData.content && currentPostData.content.trim() && (
                            <p className="mt-2 text-slate-800 leading-relaxed whitespace-pre-wrap break-words">
                                {currentPostData.content}
                            </p>
                        )}

                        {/* Метрики активности и кнопки действий */}
                        <div className="flex justify-between mt-4 max-w-md text-gray-400">
                            {/* Кнопка комментариев */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowComments(!showComments);
                                }}
                                className="flex items-center gap-1 hover:text-blue-500 transition-colors group"
                            >
                                <div className="p-2 group-hover:bg-blue-50 rounded-full">
                                    <MessageSquare size={18} />
                                </div>
                                <span className="text-sm">{currentPostData.repliesCount ?? 0}</span>
                            </button>

                            {/* Кнопка ретвитов */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    postStore.toggleRetweet(targetId);
                                }}
                                className={`flex items-center gap-1 transition-colors group ${currentPostData.isRetweeted ? 'text-green-500' : 'hover:text-green-500'}`}
                            >
                                <div className="p-2 group-hover:bg-green-50 rounded-full">
                                    <Repeat2 size={18} />
                                </div>
                                <span className="text-sm">{currentPostData.retweetsCount ?? 0}</span>
                            </button>

                            {/* Кнопка лайков */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    postStore.toggleLike(targetId);
                                }}
                                className={`flex items-center gap-1 transition-colors group ${currentPostData.isLiked ? 'text-red-500' : 'hover:text-red-500'}`}
                            >
                                <div className={`p-2 group-hover:bg-red-50 rounded-full ${currentPostData.isLiked ? 'bg-red-50' : ''}`}>
                                    <Heart size={18} className={currentPostData.isLiked ? "fill-current text-red-500" : ""} />
                                </div>
                                <span className="text-sm font-bold">{currentPostData.likesCount ?? 0}</span>
                            </button>

                            {/* Поделиться */}
                            <button onClick={(e) => e.stopPropagation()} className="p-2 hover:bg-gray-50 rounded-full hover:text-slate-600 transition-colors">
                                <Share2 size={18} />
                            </button>
                        </div>

                    </div> {/* Конец flex-1 min-w-0 */}
                </div> {/* Конец flex gap-4 */}
            </div> {/* Конец интерактивного контейнера поста */}

            {/* Раздел комментариев */}
            {showComments && (
                <div className="mt-4 space-y-4 pt-4 border-t border-gray-100 ml-16" onClick={(e) => e.stopPropagation()}>
                    {(currentPostData.comments || []).map((c, idx) => {
                        const commentKey = c.id ?? `comment-key-${idx}`;
                        const commentAuthor = c.author?.username || "unknown";
                        return (
                            <div key={commentKey} className="flex gap-2 text-sm bg-slate-50 p-2.5 rounded-2xl">
                                <span className="font-bold text-slate-800">@{commentAuthor}:</span>
                                <span className="text-slate-600 break-words">{c.content || ""}</span>
                            </div>
                        );
                    })}

                    <div className="flex gap-3 px-2">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center font-bold text-blue-500 shrink-0 select-none">
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
    );

});

export default Post