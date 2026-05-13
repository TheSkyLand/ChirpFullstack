import { makeAutoObservable, runInAction } from "mobx";
import apiClient from "../api/config";

export interface INotification {
    id: number;
    type: 'like' | 'follow' | 'reply' | 'mention';
    userName: string;
    userAvatar: string;
    content: string;
    targetId: string;
    time: string;
    unread: boolean;
}

class NotificationStore {
    notifications: INotification[] = [];
    isLoading = false;

    constructor() {
        makeAutoObservable(this);
    }

    async fetchNotifications() {
        this.isLoading = true;
        try {
            const response = await apiClient.get<INotification[]>('/api/v1/notifications');
            runInAction(() => {
                this.notifications = response.data;
            });
        } catch (error) {
            console.error("Ошибка загрузки уведомлений:", error);
        } finally {
            runInAction(() => this.isLoading = false);
        }
    }

    // Метод для пометки всех как прочитанных
    async markAsRead() {
        try {
            await apiClient.post('/api/v1/notifications/read');
            runInAction(() => {
                this.notifications.forEach(n => n.unread = false);
            });
        } catch (e) {
            console.error(e);
        }
    }
}

export const notificationStore = new NotificationStore();
