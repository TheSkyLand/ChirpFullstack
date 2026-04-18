package ru.parus.chirp.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import ru.parus.chirp.model.CommentEntity;
import ru.parus.chirp.model.dto.comment.CommentDto;

import java.util.List;

public interface CommentService {

    CommentDto createComment(CommentDto dto);

    void deleteCommentById(Long id);

    CommentDto updateComment(Long id, CommentDto dto);

    List<CommentDto> findByPost(Long postId, Pageable pageable);

}
