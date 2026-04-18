package ru.parus.chirp.model.dto.comment;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
public class CommentDto  implements Serializable {
    private Long id;
    @NotBlank
    @NotNull
    private String content;
    private LocalDateTime createdAt;
    private Long parentCommentId;
    private Long userId;
    @NotNull
    private Long postId;
}
