import { makeAutoObservable, runInAction } from "mobx";
import { AuthController } from "../api/controllers/auth/authController";
import type { userDto } from "../types/user.types";

class AuthStore {
    isAuthenticated = !!localStorage.getItem('token'); // Начальное состояние зависит от наличия токена
    user: userDto | null = null;
    isLoading = false;

    constructor() {
        makeAutoObservable(this);
    }

    // Метод для загрузки данных профиля
    // Внутри AuthStore
    // Внутри AuthStore
    async fetchProfile(): Promise<boolean> {
        const token = localStorage.getItem('token');
        if (!token) return false;

        runInAction(() => { this.isLoading = true; });

        try {
            const response = await AuthController.getCurrentUser();
            runInAction(() => {
                this.user = response.data;
                this.isAuthenticated = true;
            });
            return true; // Успешно загрузили
        } catch (error) {
            console.error("Profile load failed", error);
            this.logout();
            return false;
        } finally {
            runInAction(() => { this.isLoading = false; });
        }
    }



    login(token: string) {
        localStorage.setItem('token', token);
        this.isAuthenticated = true;
        this.fetchProfile(); // Сразу грузим данные профиля
    }

    logout() {
        this.user = null;
        this.isAuthenticated = false;
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
    }
}

export const authStore = new AuthStore();