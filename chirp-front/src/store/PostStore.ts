import { makeAutoObservable, runInAction } from "mobx";
import { authStore } from "./authStore";
import apiClient from "../api/config";

export interface IAuthor {
    id?: number | null;
    username: string;
    name: string;
}

export interface IComment {
    id: number;
    content: string;
    author?: IAuthor | null;
}

export interface IPost {
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

class PostStore {
    posts: IPost[] = [];
    isLoading = false;

    constructor() {
        makeAutoObservable(this);
    }

    // Вспомогательный метод для защиты от null-авторов
private safeExtractAuthor(authorData: any): IAuthor {
    if (authorData && typeof authorData === 'object' && !Array.isArray(authorData)) {
        // Вытаскиваем юзернейм или ставим unknown
        const username = String(authorData.username || "unknown");
        
        return {
            id: authorData.id ? Number(authorData.id) : null,
            username: username,
            // 🟢 КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ: Если поля name нет или оно null, 
            // мы берем username вместо безликого слова "Пользователь"!
            name: authorData.name && authorData.name !== "null" ? String(authorData.name) : username
        };
    }
    
    // Фоллбек для текущего авторизованного пользователя из authStore
    if (authStore.user) {
        const myUsername = authStore.user.username || "gayass";
        return {
            id: authStore.user.id ? Number(authStore.user.id) : null,
            username: myUsername,
            name: authStore.user.name || myUsername // 🟢 Если у вас нет имени, берем ваш юзернейм
        };
    }
    
    return { id: null, username: "user", name: "Пользователь" };
}

    // Загрузка ленты с глубокой очисткой от null
    async fetchPosts() {
        this.isLoading = true;
        try {
            const response = await apiClient.get('/api/v1/posts/');

            runInAction(() => {
                const dataObj = response.data;
                const rawPosts = (Array.isArray(dataObj?.content)
                    ? dataObj.content
                    : (Array.isArray(dataObj) ? dataObj : [])) as any[];

                this.posts = rawPosts.map((p) => {
                    let finalParentPost: IPost | null = null;

                    if (p.parentPost && typeof p.parentPost === 'object') {
                        const rp = p.parentPost;
                        finalParentPost = {
                            id: Number(rp.id),
                            content: String(rp.content || ""),
                            imageUrl: rp.imageUrl ? String(rp.imageUrl) : undefined,
                            createdAt: String(rp.createdAt || "недавно"),
                            userId: rp.userId ? Number(rp.userId) : null,
                            author: this.safeExtractAuthor(rp.author),
                            comments: Array.isArray(rp.comments) ? rp.comments.map((c: any) => ({
                                id: Number(c.id),
                                content: String(c.content || ""),
                                author: c.author ? this.safeExtractAuthor(c.author) : null
                            })) : [],
                            likesCount: Number(rp.likesCount) || 0,
                            retweetsCount: Number(rp.retweetsCount) || 0,
                            repliesCount: Number(rp.repliesCount) || 0,
                            isLiked: Boolean(rp.isLiked),
                            isRetweeted: Boolean(rp.isRetweeted)
                        };
                    }

                    return {
                        id: Number(p.id),
                        content: String(p.content || ""),
                        imageUrl: p.imageUrl ? String(p.imageUrl) : undefined,
                        createdAt: String(p.createdAt || "недавно"),
                        userId: p.userId ? Number(p.userId) : null,
                        author: this.safeExtractAuthor(p.author),
                        parentPost: finalParentPost,
                        comments: Array.isArray(p.comments) ? p.comments.map((c: any) => ({
                            id: Number(c.id),
                            content: String(c.content || ""),
                            author: c.author ? this.safeExtractAuthor(c.author) : null
                        })) : [],
                        likesCount: Number(p.likesCount) || Number(p.likeCount) || 0,
                        retweetsCount: Number(p.retweetsCount) || Number(p.retweetCount) || 0,
                        repliesCount: Number(p.repliesCount) || Number(p.replyCount) || 0,
                        isLiked: Boolean(p.isLiked),
                        isRetweeted: Boolean(p.isRetweeted)
                    };
                });
            });
        } catch (e) {
            console.error("Ошибка загрузки постов", e);
        } finally {
            runInAction(() => { this.isLoading = false; });
        }
    }
    async createPost(text: string, file: File | null) {
        try {
            let response;

            if (file) {
                const formData = new FormData();
                formData.append('content', text);
                formData.append('image', file);

                response = await apiClient.post('/api/v1/posts/', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {

                response = await apiClient.post('/api/v1/posts/', { content: text });
            }

            // Безопасное добавление в массив
            runInAction(() => {
                const incoming = response.data;
                if (!incoming) return;

                const newPost: IPost = {
                    id: incoming.id ? Number(incoming.id) : Date.now(),
                    content: String(incoming.content || text || ""),
                    imageUrl: incoming.imageUrl ? String(incoming.imageUrl) : undefined,
                    createdAt: String(incoming.createdAt || "только что"),
                    userId: authStore.user?.id ? Number(authStore.user.id) : null,

                    // 🟢 ИСПРАВЛЕНО: Принудительно пишем username текущего юзера, если бэкенд прислал пустой или дефолтный объект
                    author: {
                        id: authStore.user?.id ? Number(authStore.user.id) : null,
                        username: authStore.user?.username || "gayass",
                        name: authStore.user?.name || authStore.user?.username || "Пользователь"
                    },
                    comments: [],
                    likesCount: 0,
                    retweetsCount: 0,
                    repliesCount: 0,
                    isLiked: false,
                    isRetweeted: false
                };

                this.posts.unshift(newPost);
            });
        } catch (e) {
            console.error("Критическая ошибка создания поста на фронтенде:", e);
        }
    }


    // ИСПРАВЛЕНО: Синхронизирует состояния и в корне ленты, и внутри вложенных parentPost
    private syncPostInState(postId: number, mutator: (p: IPost) => void) {
        this.posts.forEach(p => {
            if (p.id === postId) mutator(p);
            if (p.parentPost && p.parentPost.id === postId) mutator(p.parentPost);
        });
    }

    async toggleLike(postId: number) {
        let wasLiked = false;

        const sample = this.posts.find(p => p.id === postId || p.parentPost?.id === postId);
        if (!sample) return;

        wasLiked = sample.id === postId ? sample.isLiked : !!sample.parentPost?.isLiked;

        // Оптимистичное обновление
        runInAction(() => {
            this.syncPostInState(postId, (p) => {
                p.isLiked = !wasLiked;
                p.likesCount = wasLiked ? Math.max(0, p.likesCount - 1) : p.likesCount + 1;
            });
        });

        try {

            const response = await apiClient.post(`/api/v1/posts/${postId}/like`);
            runInAction(() => {
                this.syncPostInState(postId, (p) => {
                    p.likesCount = Number(response.data.likesCount) || 0;
                    p.isLiked = Boolean(response.data.isLiked);
                });
            });
        } catch (error) {
            console.error("Ошибка лайка:", error);
            runInAction(() => {
                this.syncPostInState(postId, (p) => {
                    p.isLiked = wasLiked;
                    p.likesCount = wasLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1);
                });
            });
        }
    }

    async toggleRetweet(postId: number) {
        let wasRetweeted = false;

        const sample = this.posts.find(p => p.id === postId || p.parentPost?.id === postId);
        if (!sample) return;

        wasRetweeted = sample.id === postId ? sample.isRetweeted : !!sample.parentPost?.isRetweeted;

        runInAction(() => {
            this.syncPostInState(postId, (p) => {
                p.isRetweeted = !wasRetweeted;
                p.retweetsCount = wasRetweeted ? Math.max(0, p.retweetsCount - 1) : p.retweetsCount + 1;
            });
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

                const response = await apiClient.post('/api/v1/posts/' + postId + '/retweet');

                runInAction(() => {
                    const rp = response.data;
                    if (!rp) return;

                    const isAlreadyInFeed = this.posts.some(p => p.id === Number(rp.id));
                    if (!isAlreadyInFeed) {
                        const formattedRepost: IPost = {
                            id: Number(rp.id),
                            content: String(rp.content || ""),
                            imageUrl: rp.imageUrl ? String(rp.imageUrl) : undefined,
                            createdAt: String(rp.createdAt || "только что"),
                            userId: rp.userId ? Number(rp.userId) : null,
                            author: this.safeExtractAuthor(rp.author),
                            parentPost: rp.parentPost ? {
                                id: Number(rp.parentPost.id),
                                content: String(rp.parentPost.content || ""),
                                imageUrl: rp.parentPost.imageUrl ? String(rp.parentPost.imageUrl) : undefined,
                                createdAt: String(rp.parentPost.createdAt || "недавно"),
                                author: this.safeExtractAuthor(rp.parentPost.author),
                                comments: [],
                                likesCount: Number(rp.parentPost.likesCount) || 0,
                                retweetsCount: Number(rp.parentPost.retweetsCount) || 0,
                                repliesCount: Number(rp.parentPost.repliesCount) || 0,
                                isLiked: Boolean(rp.parentPost.isLiked),
                                isRetweeted: Boolean(rp.parentPost.isRetweeted)
                            } : null,
                            comments: [],
                            likesCount: Number(rp.likesCount) || 0,
                            retweetsCount: Number(rp.retweetsCount) || 0,
                            repliesCount: Number(rp.repliesCount) || 0,
                            isLiked: Boolean(rp.isLiked),
                            isRetweeted: Boolean(rp.isRetweeted)
                        };
                        this.posts.unshift(formattedRepost);
                    }
                });
            }
        } catch (error) {
            console.error("Ошибка ретвита:", error);
            runInAction(() => {
                this.syncPostInState(postId, (p) => {
                    p.isRetweeted = wasRetweeted;
                    p.retweetsCount = wasRetweeted ? p.retweetsCount + 1 : Math.max(0, p.retweetsCount - 1);
                });
            });
        }
    }

    async addComment(postId: number, content: string) {
        if (!content.trim()) return;

        const tempComment: IComment = {
            id: Date.now(),
            content: content,
            author: this.safeExtractAuthor(null)
        };

        runInAction(() => {
            this.syncPostInState(postId, (p) => {
                p.comments.push(tempComment);
                p.repliesCount += 1;
            });
        });

        try {
            await apiClient.post(`/api/v1/posts/${postId}/comments`, { content });
        } catch {
            console.error("Ошибка при сохранении комментария на сервере");
        }
    }
}

export const postStore = new PostStore();
