import { makeAutoObservable, runInAction } from "mobx";
import apiClient from "../api/config";
import { authStore } from "./AuthStore";
import type { PostDto } from "../types/post/post.types";

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
    parentPost?: IPost; 
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
            const response = await apiClient.get<unknown>('/api/v1/posts');

            runInAction(() => {
                const dataObj = response.data as Record<string, unknown>;

                const rawPosts = (Array.isArray(dataObj.content)
                    ? dataObj.content
                    : (Array.isArray(response.data) ? response.data : [])) as Record<string, unknown>[];

                this.posts = rawPosts.map((p) => {
                    // ИСПРАВЛЕНИЕ АНОНИМОВ: Защита на фронтенде от null в поле author с бэкенда
                    let finalAuthor = { username: "user", name: "Пользователь" };
                    
                    if (p.author && typeof p.author === 'object') {
                        finalAuthor = p.author as { username: string; name: string };
                    } else if (authStore.user) {
                        // Если автор пустой, но мы авторизованы, подставляем текущего юзера, чтобы не было анонимов
                        finalAuthor = { username: authStore.user.username, name: authStore.user.username };
                    }

                    // Такая же проверка для вложенного репоста
                    let finalParentPost: IPost | undefined = undefined;
                    if (p.parentPost && typeof p.parentPost === 'object') {
                        const rawParent = p.parentPost as Record<string, unknown>;
                        finalParentPost = {
                            ...rawParent,
                            id: Number(rawParent.id),
                            content: String(rawParent.content || ""),
                            imageUrl: rawParent.imageUrl ? String(rawParent.imageUrl) : undefined,
                            createdAt: String(rawParent.createdAt || ""),
                            author: (rawParent.author as { username: string; name: string }) || { username: "user", name: "Пользователь" },
                            likesCount: Number(rawParent.likesCount) || 0,
                            retweetsCount: Number(rawParent.retweetsCount) || 0,
                            repliesCount: Number(rawParent.repliesCount) || 0,
                            isLiked: Boolean(rawParent.isLiked),
                            isRetweeted: Boolean(rawParent.isRetweeted)
                        } as IPost;
                    }

                    return {
                        ...p,
                        id: Number(p.id),
                        content: String(p.content || ""),
                        imageUrl: p.imageUrl ? String(p.imageUrl) : undefined,
                        createdAt: String(p.createdAt || ""),
                        author: finalAuthor,
                        parentPost: finalParentPost,
                        comments: p.comments as IComment[] | undefined,

                        likesCount: Number(p.likesCount) || Number(p.likeCount) || 0,
                        retweetsCount: Number(p.retweetsCount) || Number(p.retweetCount) || 0,
                        repliesCount: Number(p.repliesCount) || Number(p.replyCount) || 0,

                        isLiked: Boolean(p.isLiked),
                        isRetweeted: Boolean(p.isRetweeted)
                    };
                }) as unknown as IPost[];
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

    async toggleLike(postId: number) {
        const postIndex = this.posts.findIndex(p => p.id === postId);
        if (postIndex === -1) return;

        const post = this.posts[postIndex];
        const wasLiked = post.isLiked;

        runInAction(() => {
            post.isLiked = !wasLiked;
            post.likesCount = wasLiked ? post.likesCount - 1 : post.likesCount + 1;
        });

        try {
            const response = await apiClient.post<PostDto>(`/api/v1/posts/${postId}/like`);
            runInAction(() => {
                this.posts[postIndex].likesCount = Number(response.data.likesCount) || 0;
                this.posts[postIndex].isLiked = Boolean(response.data.isLiked);
            });
        } catch (error) {
            console.error("Ошибка лайка:", error);
            runInAction(() => {
                post.isLiked = wasLiked;
                post.likesCount = wasLiked ? post.likesCount + 1 : post.likesCount - 1;
            });
        }
    }

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

    // ИСПРАВЛЕНО: Полностью закрыт синтаксический обрыв метода репостов
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
                const response = await apiClient.post<unknown>('/api/v1/posts/' + postId + '/retweet');
                
                runInAction(() => {
                    const incomingPost = response.data as Record<string, unknown>;
                    const incomingAuthor = incomingPost.author as { username: string; name: string } | undefined;

                    const isAlreadyInFeed = this.posts.some((p, idx) => 
                        idx < 2 && p.id === Number(incomingPost.id) && p.author?.username === incomingAuthor?.username
                    );

                    if (!isAlreadyInFeed) {
                        const formattedRepost: IPost = {
                            id: Number(incomingPost.id),
                            content: String(incomingPost.content || ""),
                            imageUrl: incomingPost.imageUrl ? String(incomingPost.imageUrl) : undefined,
                            createdAt: String(incomingPost.createdAt || ""),
                            author: (incomingAuthor || { username: authStore.user?.username || "user", name: "Пользователь" }),
                            parentPost: incomingPost.parentPost as IPost | undefined,
                            comments: incomingPost.comments as IComment[] | undefined,
                            likesCount: Number(incomingPost.likesCount) || 0,
                            retweetsCount: Number(incomingPost.retweetsCount) || 0,
                            repliesCount: Number(incomingPost.repliesCount) || 0,
                            isLiked: Boolean(incomingPost.isLiked),
                            isRetweeted: true
                        };
                        this.posts.unshift(formattedRepost);
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
