import { makeAutoObservable } from "mobx";

// Тип для поста (подгони под свой бэк позже)
export interface IPost {
    id: number;
    author: string;
    username: string;
    content: string;
    time: string;
    likes: number;
    replies: number;
}

class PostStore {
    posts: IPost[] = [
        { id: 1, author: "Алексей Петров", username: "@alex_java", content: "Наконец-то настроил Spring Security. Это было потно... 🔒🐘", time: "45м", likes: 124, replies: 12 },
        { id: 2, author: "Мария и Ко", username: "@mary_design", content: "Как вам обновленный дизайн Chirp? ✨", time: "2ч", likes: 89, replies: 45 },
    ];

    constructor() {
        makeAutoObservable(this);
    }

    // Метод для добавления поста
    addPost(content: string, username: string) {
        const newPost: IPost = {
            id: Date.now(), // Временный ID
            author: username,
            username: `@${username.toLowerCase()}`,
            content: content,
            time: "только что",
            likes: 0,
            replies: 0
        };
        
        // Добавляем в начало списка
        this.posts.unshift(newPost);
    }
}

export const postStore = new PostStore();
