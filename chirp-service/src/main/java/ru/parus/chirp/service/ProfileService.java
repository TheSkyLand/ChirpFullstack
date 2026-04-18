package ru.parus.chirp.service;

import ru.parus.chirp.model.dto.ProfileDto;

/**
 * ProfileService
 * <p>
 *     Интерфейс для просмотра профиля пользователя
 * </p>
 *
 * @author Grachev.D.G  (zhulvern-92@mail.ru)
 * @version 30.01.2026
 */
public interface ProfileService {
    ProfileDto currentUserShow();
}
