package ru.parus.chirp.model.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Builder;
import lombok.Data;
import ru.parus.chirp.model.dto.post.PostDto;

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

 //private List<PostDto> retweets;



 // подписан ли текущией пользователь на этого?
 @Builder.Default
 private Boolean isFollowing  = false;
}
