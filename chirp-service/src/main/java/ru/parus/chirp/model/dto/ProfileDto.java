package ru.parus.chirp.model.dto;


import lombok.Builder;
import lombok.Data;

import java.io.Serializable;


/**
 * ДТО Профиля пользователя
 * Показывает кол-во подписчиков (всего)
 * Показывает кол-во подписок (всего)
 * **/
@Data
@Builder
public class ProfileDto implements Serializable {

    private UserDto user;
    // Подписчики (кол-во)
    @Builder.Default
    private Long followersCount = 0L;
    // Подписки (кол-во)
    @Builder.Default
    private Long followingCount = 0L;

    // Кол-во постов
    @Builder.Default
    private Long postsTotalCount = 0L;

}
