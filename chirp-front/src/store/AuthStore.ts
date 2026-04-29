import { makeAutoObservable } from "mobx";

class AuthStore {
    isAuthenticated = false;
    user: { username: string; email: string } | null = null;
    isLoading = false;

    constructor() {
        // Делает все свойства стора отслеживаемыми (observable)
        makeAutoObservable(this);
    }

    // Экшены (действия)
    login(userData: { username: string; email: string }) {
        this.isAuthenticated = true;
        this.user = userData;
    }

    logout() {
        this.isAuthenticated = false;
        this.user = null;
    }

    setLoading(status: boolean) {
        this.isLoading = status;
    }
}

export const authStore = new AuthStore();
