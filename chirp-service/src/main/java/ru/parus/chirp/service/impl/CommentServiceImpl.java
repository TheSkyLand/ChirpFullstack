package ru.parus.chirp.service.impl;

import jakarta.persistence.EntityNotFoundException;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.parus.chirp.mapper.CommentMapper;
import ru.parus.chirp.model.CommentEntity;
import ru.parus.chirp.model.PostEntity;
import ru.parus.chirp.model.UserEntity;
import ru.parus.chirp.model.dto.comment.CommentDto;
import ru.parus.chirp.repository.CommentRepository;
import ru.parus.chirp.repository.PostRepository;
import ru.parus.chirp.service.CommentService;
import ru.parus.chirp.service.UserService;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final CommentMapper commentMapper;
    private final PostRepository postRepository;
    private final UserService userService;

    @Override
    @Transactional
    public CommentDto createComment(CommentDto dto) {
        PostEntity post = postRepository.findById(dto.getPostId())
                .orElseThrow(EntityNotFoundException::new);
        UserEntity user = userService.getCurrentUserEntity();
        CommentEntity entity = commentMapper.toEntity(dto);
        entity.setPost(post);
        entity.setOwner(user);
        entity = commentRepository.save(entity);
        return commentMapper.toDto(entity);
    }

    @Override
    @Transactional
    public void deleteCommentById(Long id) {
        CommentEntity entity = commentRepository.findById(id)
                .orElseThrow(EntityNotFoundException::new);
        if (entity.getOwner().getId().equals(userService.getCurrentUserEntity().getId())) {
            commentRepository.deleteById(id);
        }
    }

    @Override
    @Transactional
    public CommentDto updateComment(Long id, CommentDto dto) {
        CommentEntity entity = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("comment not found"));
        commentMapper.patchUpdate(dto, entity);
        commentRepository.save(entity);
        return commentMapper.toDto(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CommentDto> findByPost(Long postId, Pageable pageable) {
        PostEntity post =  postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("post not found"));
        List<CommentEntity> list = commentRepository.findByPost(post);
        return list.stream()
                .map(commentMapper::toDto)
                .collect(Collectors.toList());
    }
}
