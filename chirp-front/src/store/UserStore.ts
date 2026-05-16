import { makeAutoObservable, runInAction } from "mobx";
import apiClient from "../api/config";
import type { userDto } from "../types/user.types";

class UserStore {
    users: userDto[] = [];          
    searchResults: userDto[] = [];  
    isLoading = false;

    constructor() {
        makeAutoObservable(this);
    }

    async fetchInitialUsers() {
        this.isLoading = true;
        try {
            const response = await apiClient.get("/api/v1/users/explore");
            runInAction(() => {
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
            runInAction(() => { this.searchResults = []; });
            return;
        }

        this.isLoading = true;
        try {
            // ИСПРАВЛЕНО: Убран лишний слэш после users, чтобы Spring Boot не выдавал 404
            const response = await apiClient.get("/api/v1/users", { params: { username: query } });
            runInAction(() => {
                this.searchResults = response.data.content || response.data || [];
            });
        } catch (error) {
            console.error("Ошибка при поиске юзеров:", error);
            runInAction(() => { this.searchResults = []; }); // Очищаем в случае ошибки
        } finally {
            runInAction(() => { this.isLoading = false; });
        }
    }
}

export const userStore = new UserStore();
