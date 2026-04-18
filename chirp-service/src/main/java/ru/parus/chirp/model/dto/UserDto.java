package ru.parus.chirp.model.dto;

import java.io.Serializable;

import lombok.Builder;
import lombok.Data;

/**
 * UserDto
 * <p>
 *     Сущность пользователя в системе для просмотра на фронте
 * </p>
 *
 * @author Grachev.D.G  (zhulvern-92@mail.ru)
 * @version 21.02.2026
 */
@Data
@Builder
public class UserDto implements Serializable {
 private Long id;
 private String username;
 // подписан ли текущией пользователь на этого?
 @Builder.Default
 private Boolean isFollowing  = false;
}
