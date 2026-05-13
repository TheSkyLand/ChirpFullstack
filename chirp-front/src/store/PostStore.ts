import { makeAutoObservable, runInAction } from "mobx";
import apiClient from "../api/config";
import { authStore } from "./AuthStore";

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
    repliesCount: number; // Добавил счетчик
    isLiked: boolean;
    isRetweeted: boolean;
    parentPost?: IPost;
    comments?: IComment[]; // Заменяем 'comment: string' на массив объектов
}

class PostStore {
    
    posts: IPost[] = [];
    isLoading = false;

    constructor() {
        makeAutoObservable(this);
    }

    // Загрузка ленты
    async fetchPosts() {
        this.isLoading = true;
        try {
            const response = await apiClient.get('/api/v1/posts');
            runInAction(() => {
                this.posts = response.data;
            });
        } catch (e) {
            console.error("Ошибка загрузки постов", e);
        } finally {
            runInAction(() => this.isLoading = false);
        }
    }

    async createPost(text: string, _file: File | null) {
        try {
            const response = await apiClient.post('/api/v1/posts/',
                { content: text }, // Тело запроса
                {
                    headers: {
                        'Content-Type': 'application/json' // Принудительно ставим JSON
                    }
                }
            );
            runInAction(() => {
                const newPost = response.data;

                // Если бэк не прислал автора, подставляем текущего юзера вручную
                if (!newPost.author) {
                    newPost.author = {
                        name: authStore.user?.username || "Пользователь",
                        username: authStore.user?.username || "user"
                    };
                }

                this.posts.unshift(newPost);
            });

        } catch (e) {
            console.error(e);
        }
    }


    // Лайк
    async toggleLike(postId: number) {
        const post = this.posts.find(p => p.id === postId);
        if (!post) return;

        const wasLiked = post.isLiked;

        runInAction(() => {
            post.isLiked = !wasLiked;
            post.likesCount += wasLiked ? -1 : 1;
        });

        try {
            await apiClient.post(`/api/v1/posts/${postId}/like`);
        } catch { // Просто catch без (er)
            runInAction(() => {
                post.isLiked = wasLiked;
                post.likesCount += wasLiked ? 1 : -1;
            });
        }

    }

    async addComment(postId: number, content: string) {
        if (!content.trim()) return;

        // Создаем временный коммент для мгновенного отображения
        const tempComment: IComment = {
            id: Date.now(),
            content: content,
            author: {
                username: authStore.user?.username || "me"
            }
        };

        runInAction(() => {
            const post = this.posts.find(p => p.id === postId);
            if (post) {
                if (!post.comments) post.comments = [];
                post.comments.push(tempComment); // Пушим сразу на фронт
                post.repliesCount += 1;
            }
        });

        // А дальше попытка отправить на бэк
        try {
            await apiClient.post(`/api/v1/posts/${postId}/comments`, { content });
        } catch {
            console.error("Бэк не сохранил коммент, но на фронте он пока висит");
        }
    }
    async toggleRetweet(postId: number) {
        const originalPost = this.posts.find(p => p.id === postId);
        if (!originalPost) return;

        try {
            // 1. Шлем на бэк запрос на репост
            // Бэк должен создать новый пост, где parent_id = postId
            const response = await apiClient.post(`/api/v1/posts/${postId}/retweet`);

            runInAction(() => {
                // 2. Добавляем репост в начало ленты
                this.posts.unshift(response.data);

                // 3. Увеличиваем счетчик у оригинала
                originalPost.retweetsCount += 1;
                originalPost.isRetweeted = true;
            });
        } catch (er) {
            console.error("Ошибка при репосте", er);
        }
    }

}

export const postStore = new PostStore();
