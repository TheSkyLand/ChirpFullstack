import { makeAutoObservable, runInAction } from "mobx";
import apiClient from "../api/config";
import { authStore } from "./AuthStore";
import type { postDto } from "../types/post.types";

export interface IComment {
    id: number;
    content: string;
    author: {
        username: string;
    };
}

export interface IPost {
    id: number;
    content: string;
    imageUrl?: string;
    createdAt: string;
    author: {
        username: string;
        name: string;
    };
    likesCount: number;
    retweetsCount: number;
    repliesCount: number;
    isLiked: boolean;
    isRetweeted: boolean;
    parentPost?: IPost; // Ссылка на оригинальный пост
    comments?: IComment[];
}

class PostStore {
    posts: IPost[] = [];
    isLoading = false;

    constructor() {
        makeAutoObservable(this);
    }

    // Загрузка ленты (посты + репосты)
    async fetchPosts() {
        this.isLoading = true;
        try {
            // Заменяем <any> на <unknown> — это чистый тип для динамических ответов API
            const response = await apiClient.get<unknown>('/api/v1/posts');

            runInAction(() => {
                // Приводим ответ к объекту Spring Page или массиву через безопасный кастинг
                const dataObj = response.data as Record<string, unknown>;

                // Извлекаем массив content, если он есть, либо весь ответ как массив объектов
                const rawPosts = (Array.isArray(dataObj.content)
                    ? dataObj.content
                    : (Array.isArray(response.data) ? response.data : [])) as Record<string, unknown>[];

                this.posts = rawPosts.map((p) => ({
                    ...p,
                    id: Number(p.id),
                    content: String(p.content || ""),
                    imageUrl: p.imageUrl ? String(p.imageUrl) : undefined,
                    createdAt: String(p.createdAt || ""),
                    author: p.author as { username: string; name: string },
                    parentPost: p.parentPost as IPost | undefined,
                    comments: p.comments as IComment[] | undefined,

                    // Защита числовых счетчиков от NaN и null
                    likesCount: Number(p.likesCount) || Number(p.likeCount) || 0,
                    retweetsCount: Number(p.retweetsCount) || Number(p.retweetCount) || 0,
                    repliesCount: Number(p.repliesCount) || Number(p.replyCount) || 0,

                    // Защита логических флагов
                    isLiked: Boolean(p.isLiked),
                    isRetweeted: Boolean(p.isRetweeted)
                })) as unknown as IPost[];
            });
        } catch (e) {
            console.error("Ошибка загрузки постов", e);
        } finally {
            runInAction(() => { this.isLoading = false; });
        }
    }




    // Исправлено: корректная отправка файлов на бэкенд через FormData
    async createPost(text: string, file: File | null) {
        try {
            let response;
            if (file) {
                const formData = new FormData();
                formData.append('content', text);
                formData.append('image', file);

                response = await apiClient.post<IPost>('/api/v1/posts', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                response = await apiClient.post<IPost>('/api/v1/posts', { content: text });
            }

            runInAction(() => {
                const newPost = response.data;
                if (!newPost.author) {
                    newPost.author = {
                        name: authStore.user?.username || "Пользователь",
                        username: authStore.user?.username || "user"
                    };
                }
                this.posts.unshift(newPost);
            });
        } catch (e) {
            console.error("Ошибка создания поста:", e);
        }
    }

    // Лайк (Оптимистичный UI)
    // Лайк (Строгая реактивная мутация через MobX)
    async toggleLike(postId: number) {
        const postIndex = this.posts.findIndex(p => p.id === postId);
        if (postIndex === -1) return;

        const post = this.posts[postIndex];
        const wasLiked = post.isLiked;

        // Оптимистичный UI
        runInAction(() => {
            post.isLiked = !wasLiked;
            post.likesCount = wasLiked ? post.likesCount - 1 : post.likesCount + 1;
        });

        try {
            const response = await apiClient.post<postDto>(`/api/v1/posts/${postId}/like`);
            runInAction(() => {
                // Принудительно синхронизируем точные данные, пришедшие из Java базы данных
                this.posts[postIndex].likesCount = Number(response.data.likesCount) || 0;
                this.posts[postIndex].isLiked = Boolean(response.data.isLiked);
            });
        } catch (error) {
            console.error("Ошибка лайка:", error);
            // Откат интерфейса при сбое сети
            runInAction(() => {
                post.isLiked = wasLiked;
                post.likesCount = wasLiked ? post.likesCount + 1 : post.likesCount - 1;
            });
        }
    }

    // Комментарии (Оптимистичный UI)
    async addComment(postId: number, content: string) {
        if (!content.trim()) return;

        const tempComment: IComment = {
            id: Date.now(),
            content: content,
            author: {
                username: authStore.user?.username || "me"
            }
        };

        const post = this.posts.find(p => p.id === postId);
        runInAction(() => {
            if (post) {
                if (!post.comments) post.comments = [];
                post.comments.push(tempComment);
                post.repliesCount += 1;
            }
        });

        try {
            await apiClient.post(`/api/v1/posts/${postId}/comments`, { content });
        } catch {
            console.error("Ошибка при сохранении комментария на сервере");
        }
    }

    // ПОЛНОЦЕННЫЙ МЕХАНИЗМ РЕПОСТОВ (Включение / Отмена с Оптимистичным UI)
    async toggleRetweet(postId: number) {
        const postIndex = this.posts.findIndex(p => p.id === postId);
        if (postIndex === -1) return;

        const post = this.posts[postIndex];
        const wasRetweeted = post.isRetweeted;

        runInAction(() => {
            post.isRetweeted = !wasRetweeted;
            post.retweetsCount = wasRetweeted ? post.retweetsCount - 1 : post.retweetsCount + 1;
        });

        try {
            if (wasRetweeted) {
                await apiClient.delete(`/api/v1/posts/${postId}/retweet`);
                runInAction(() => {
                    this.posts = this.posts.filter(p =>
                        !(p.parentPost?.id === postId && p.author?.username === authStore.user?.username)
                    );
                });
            } else {
                // ИСПРАВЛЕНО: Заменили <any> на <unknown> для соответствия правилам ESLint
                const response = await apiClient.post<unknown>('/api/v1/posts/' + postId + '/retweet');
                
                runInAction(() => {
                    // Приводим данные к безопасному объектному типу Record
                    const incomingPost = response.data as Record<string, unknown>;
                    const incomingAuthor = incomingPost.author as { username: string; name: string } | undefined;
                    const incomingParent = incomingPost.parentPost as Record<string, unknown> | undefined;

                    // ПРОВЕРКА: Если бэк вернул пост, который уже есть в самом верху массива, не дублируем его
                    const isAlreadyInFeed = this.posts.some((p, idx) => 
                        idx < 2 && p.id === Number(incomingPost.id) && p.author?.username === incomingAuthor?.username
                    );

                    if (!isAlreadyInFeed) {
                        const formattedRepost = {
                            ...incomingPost,
                            id: Number(incomingPost.id),
                            content: String(incomingPost.content || ""),
                            imageUrl: incomingPost.imageUrl ? String(incomingPost.imageUrl) : undefined,
                            createdAt: String(incomingPost.createdAt || ""),
                            author: incomingAuthor,
                            parentPost: incomingParent,
                            
                            likesCount: Number(incomingPost.likesCount) || 0,
                            retweetsCount: Number(incomingPost.retweetsCount) || Number(incomingPost.retweetCount) || 0,
                            repliesCount: Number(incomingPost.repliesCount) || 0,
                            isLiked: Boolean(incomingPost.isLiked),
                            isRetweeted: Boolean(incomingPost.isRetweeted)
                        } as unknown as IPost;

                        this.posts.unshift(formattedRepost);
                    }

                    if (incomingParent) {
                        post.retweetsCount = Number(incomingParent.retweetsCount) ||
                            Number(incomingParent.retweetCount) || 0;
                    }
                });
            }


        } catch (error) {
            console.error("Ошибка репоста:", error);
            runInAction(() => {
                post.isRetweeted = wasRetweeted;
                post.retweetsCount = wasRetweeted ? post.retweetsCount + 1 : post.retweetsCount - 1;
            });
        }
    }
}

export const postStore = new PostStore();
