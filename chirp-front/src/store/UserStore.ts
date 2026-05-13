import { makeAutoObservable, runInAction } from "mobx";
import apiClient from "../api/config";
import type { userDto } from "../types/user.types";

class UserStore {
    users: userDto[] = [];
    isLoading = false;

    constructor() {
        makeAutoObservable(this);
    }

    async fetchInitialUsers() {
        this.isLoading = true;
        try {
            const response = await apiClient.get("/users"); // Или твой эндпоинт для списка
            runInAction(() => {
                // Если бэкенд возвращает Page, берем .content, если массив — берем .data
                this.users = response.data.content || response.data || [];
            });
        } catch (error) {
            console.error("Ошибка загрузки списка юзеров:", error);
        } finally {
            runInAction(() => { this.isLoading = false; });
        }
    }


    async searchUsers(query: string) {
        if (!query.trim()) {
            runInAction(() => { this.users = []; });
            return;
        }

        this.isLoading = true;
        try {
            // Указываем тип ответа в axios: <{ content: IUser[] }>
            const response = await apiClient.get("/users", { params: { username: query } })

            runInAction(() => {
                // Проверь, что здесь именно .data.content
                this.users = response.data.content || [];
                console.log("Found users:", this.users); // Добавь этот лог
            });

        } catch (error) {
            console.error("Ошибка при поиске юзеров:", error);
        } finally {
            runInAction(() => { this.isLoading = false; });
        }
    }
}



export const userStore = new UserStore();
