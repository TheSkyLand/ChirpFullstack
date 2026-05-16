package ru.parus.chirp.model.dto.post;

import java.io.Serializable;
import java.util.List;
import lombok.Data;

/**
 * PostDto
 * <p>
 *   DTO для передачи полной информации о посте на фронтенд
 * </p>
 *
 * @author Grachev.D.G  (zhulvern-92@mail.ru)
 * @version 30.01.2026
 */
@Data
public class PostDto implements Serializable {
    private Long id;
    private String content;
    private Long userId;
    private String imageUrl;
    private String createdAt;

    // 🔴 ИСПРАВЛЕНИЕ АНОНИМОВ: Объект автора, который так ждет React/MobX
    private AuthorDto author;

    // Рекурсивная связь для полноценных репостов
    private PostDto parentPost;

    // Персональные флаги состояний для авторизованного юзера
    private Boolean isLiked = false;
    private Boolean isRetweeted = false;

    // Счетчики активности
    private Integer likesCount = 0;
    private Integer retweetsCount = 0;
    private Integer repliesCount = 0;

    // Список комментариев (опционально)
    private List<CommentDto> comments;

    /**
     * Вложенный DTO для автора поста
     */
    @Data
    public static class AuthorDto implements Serializable {
        private String username;
        private String name;
    }

    /**
     * Вложенный DTO для комментариев к посту
     */
    @Data
    public static class CommentDto implements Serializable {
        private Long id;
        private String content;
        private AuthorDto author;
    }
}
