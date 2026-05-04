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
    async fetchProfile() {
        if (!localStorage.getItem('token')) return;

        this.isLoading = true;
        try {
            const response = await AuthController.getCurrentUser();
            // В MobX после await изменения должны быть внутри runInAction
            runInAction(() => {
                this.user = response.data;
                this.isAuthenticated = true;
            });
        } catch (error) {
            this.logout();
        } finally {
            runInAction(() => this.isLoading = false);
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