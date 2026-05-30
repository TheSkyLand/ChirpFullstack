package ru.parus.chirp.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.parus.chirp.exception.NotExistException;
import ru.parus.chirp.exception.PermissionDeniedException;
import ru.parus.chirp.mapper.PostMapper;
import ru.parus.chirp.model.PostEntity;
import ru.parus.chirp.model.UserEntity;
import ru.parus.chirp.model.dto.post.PostDto;
import ru.parus.chirp.repository.PostRepository;
import ru.parus.chirp.service.NotificationService;
import ru.parus.chirp.service.PostService;
import ru.parus.chirp.service.UserService;

import java.util.List;

/**
 * PostServiceImpl
 * <p>
 *     Сервис для работы с публикациями пользователей, репостами и лайками.
 *     Исправлена ленивая инициализация авторов оригинальных постов.
 * </p>
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final PostMapper postMapper;
    private final UserService userService;
    private final NotificationService notificationService;

    @Override
    @Transactional
    public PostDto create(PostDto dto) {
        UserEntity user = userService.getCurrentUserEntity();
        PostEntity postEntity = postMapper.toEntity(dto);
        postEntity.setOwner(user);

        var result = postMapper.toDto(postRepository.save(postEntity));
        notificationService.notifyAsyncNewPost(user.getId());
        return result;
    }

    @Override
    @Transactional
    public PostDto addComment(Long id, PostDto commentDto) {
        log.info("Добавление комментария к посту с ID: {}", id);

        // Используем findWithGraphById, чтобы избежать LazyInitializationException для авторов
        PostEntity originalPost = postRepository.findWithGraphById(id)
                .orElseThrow(NotExistException::new);

        UserEntity currentUser = userService.getCurrentUserEntity();

        PostEntity commentEntity = new PostEntity();
        commentEntity.setOwner(currentUser);
        commentEntity.setContent(commentDto.getContent());
        commentEntity.setParentPost(originalPost);

        PostEntity savedComment = postRepository.save(commentEntity);

        PostEntity cleanComment = postRepository.findWithGraphById(savedComment.getId())
                .orElseThrow(NotExistException::new);

        return postMapper.toDto(cleanComment);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PostDto> index(Pageable pageable, String username, int userId) {
        Page<PostEntity> pageEntities = postRepository.findAll(pageable);
        UserEntity currentUser = userService.getCurrentUserEntity();

        List<PostDto> dtoList = pageEntities.getContent().stream().map(postEntity -> {
            PostDto dto = postMapper.toDto(postEntity);

            if (currentUser != null) {
                dto.setIsLiked(postEntity.getLikes() != null && postEntity.getLikes().contains(currentUser));
                dto.setIsRetweeted(postRepository.existsByParentPostAndOwner(postEntity, currentUser));
            }

            dto.setLikesCount(postEntity.getLikes() != null ? postEntity.getLikes().size() : 0);
            return dto;
        }).toList();

        return new PageImpl<>(dtoList, pageable, pageEntities.getTotalElements());
    }

    @Override
    @Transactional(readOnly = true)
    public PostDto show(Long id) {
        // ИСПРАВЛЕНО: Загружаем через граф, чтобы parentPost.author не был null
        PostEntity post = postRepository.findWithGraphById(id)
                .orElseThrow(NotExistException::new);
        return postMapper.toDto(post);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PostDto> wall() {
        UserEntity user = userService.getCurrentUserEntity();
        Pageable pageable = PageRequest.of(0, 10);
        return postRepository.findAllByOwner(user, pageable)
                .map(postMapper::toDto);
    }

    @Override
    @Transactional
    public PostDto update(Long id, PostDto dto) {
        UserEntity user = userService.getCurrentUserEntity();
        PostEntity post = postRepository.findWithGraphById(id).orElseThrow(NotExistException::new);

        if (post.getOwner().getId().equals(user.getId())) {
            postMapper.patchUpdate(dto, post);
            postRepository.save(post);
            return postMapper.toDto(post);
        }
        throw new PermissionDeniedException();
    }

    @Override
    @Transactional
    public void delete(Long id) {
        UserEntity user = userService.getCurrentUserEntity();
        PostEntity post = postRepository.findById(id)
                .orElseThrow(NotExistException::new);

        if (post.getOwner().getId().equals(user.getId())) {
            postRepository.delete(post);
            return;
        }
        throw new PermissionDeniedException();
    }

    @Override
    @Transactional
    public PostDto createWithFile(String content, org.springframework.web.multipart.MultipartFile file) {
        UserEntity user = userService.getCurrentUserEntity();

        PostEntity postEntity = new PostEntity();
        postEntity.setContent(content);
        postEntity.setOwner(user);

        if (file != null && !file.isEmpty()) {
            postEntity.setImageUrl(file.getOriginalFilename());
        }

        var result = postMapper.toDto(postRepository.save(postEntity));
        notificationService.notifyAsyncNewPost(user.getId());
        return result;
    }

    @Override
    @Transactional
    public PostDto toggleLike(Long id) {
        // ИСПРАВЛЕНО: Загружаем через граф, чтобы не затереть авторов при обновлении лайка
        PostEntity post = postRepository.findWithGraphById(id).orElseThrow(NotExistException::new);
        UserEntity user = userService.getCurrentUserEntity();

        if (post.getLikes().contains(user)) {
            post.getLikes().remove(user);
        } else {
            post.getLikes().add(user);
        }

        return postMapper.toDto(postRepository.save(post));
    }

    @Override
    @Transactional
    public PostDto retweet(Long id) {
        PostEntity original = postRepository.findWithGraphById(id).orElseThrow(NotExistException::new);
        UserEntity user = userService.getCurrentUserEntity();

        if (original.getParentPost() != null) {
            original = original.getParentPost();
        }

        boolean alreadyRetweeted = postRepository.existsByParentPostAndOwner(original, user);
        if (alreadyRetweeted) {
            log.warn("Пользователь {} уже делал репост публикации {}", user.getUsername(), original.getId());
            return postMapper.toDto(original);
        }

        PostEntity retweet = new PostEntity();
        retweet.setOwner(user);
        retweet.setParentPost(original);
        retweet.setContent("");

        PostEntity savedRetweet = postRepository.save(retweet);

        notificationService.notifyAsyncRepost(original.getOwner().getId(), user.getUsername());

        // 🟢 ИСПРАВЛЕНО: Перезапрашиваем репост с полной цепочкой связей перед отправкой, чтобы убрать null на фронте
        PostEntity cleanRetweet = postRepository.findWithGraphById(savedRetweet.getId())
                .orElseThrow(NotExistException::new);

        return postMapper.toDto(cleanRetweet);
    }

    @Override
    @Transactional
    public void unretweet(Long id) {
        PostEntity original = postRepository.findById(id).orElseThrow(NotExistException::new);
        UserEntity user = userService.getCurrentUserEntity();

        if (original.getParentPost() != null) {
            original = original.getParentPost();
        }

        PostEntity retweetToDelete = postRepository.findByParentPostAndOwner(original, user)
                .orElseThrow(NotExistException::new);

        postRepository.delete(retweetToDelete);
        log.info("Репост пользователя {} к публикации {} успешно отменен", user.getUsername(), original.getId());
    }
}
