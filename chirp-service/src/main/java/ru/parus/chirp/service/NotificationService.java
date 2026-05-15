package ru.parus.chirp.service;

/**
 * NotificationService
 * <p>
 *      Интерфейс для работы с уведомлениями
 * </p>
 */
public interface NotificationService {

    // Ваш существующий метод
    void notifyAsyncNewPost(Long userId);

    // ДОБАВИТЬ: Метод для асинхронного уведомления о репосте
    void notifyAsyncRepost(Long targetUserId, String reposterUsername);
}
