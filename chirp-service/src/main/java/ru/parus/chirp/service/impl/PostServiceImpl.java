package ru.parus.chirp.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
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

/**
 * PostServiceImpl
 * <p>
 *     Базовая реализация сервиса постов
 * </p>
 *
 * @author Grachev.D.G  (zhulvern-92@mail.ru)
 * @version 30.01.2026
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

        // 1. Находим оригинальный пост, под которым пишется комментарий
        PostEntity originalPost = postRepository.findById(id)
                .orElseThrow(NotExistException::new);

        // 2. Получаем текущего авторизованного пользователя
        UserEntity currentUser = userService.getCurrentUserEntity();

        // 3. Создаем новую сущность поста, которая будет выступать в роли комментария
        PostEntity commentEntity = new PostEntity();
        commentEntity.setOwner(currentUser);
        commentEntity.setContent(commentDto.getContent()); // Берем текст из пришедшего JSON
        commentEntity.setParentPost(originalPost);         // Привязываем к родительскому посту

        // 4. Сохраняем в базу данных
        PostEntity savedComment = postRepository.save(commentEntity);

        // 5. Асинхронно отправляем уведомление автору оригинального поста (опционально, если нужно)
        // notificationService.notifyAsyncNewComment(originalPost.getOwner().getId(), currentUser.getUsername());

        // 6. Маппим в DTO и возвращаем на фронтенд
        return postMapper.toDto(savedComment);
    }


    @Override
    @Transactional(readOnly = true)
    public Page<PostDto> index(final Pageable pageable) {
        // Подразумевается, что метод репозитория возвращает посты, отсортированные по дате создания
        Page<PostEntity> pageEntities = postRepository.findAll(pageable);

        // ИСПРАВЛЕНО: Передаем реальное общее количество записей из БД (pageEntities.getTotalElements())
        return new PageImpl<>(
                pageEntities.getContent().stream().map(postMapper::toDto).toList(),
                pageable,
                pageEntities.getTotalElements()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public PostDto show(Long id) {
        PostEntity post = postRepository.findById(id)
                .orElseThrow(NotExistException::new);
        return postMapper.toDto(post);
    }

    @Override
    @Transactional
    public PostDto update(Long id, PostDto dto) {
        UserEntity user = userService.getCurrentUserEntity();
        PostEntity post = postRepository.findById(id).orElseThrow(NotExistException::new);
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
        PostEntity post = postRepository.findById(id).orElseThrow(NotExistException::new);
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
        PostEntity original = postRepository.findById(id).orElseThrow(NotExistException::new);
        UserEntity user = userService.getCurrentUserEntity();

        // Если пользователь пытается репостнуть уже существующий репост,
        // мы автоматически привязываем новый репост к первоисточнику (оригинальному автору контента)
        if (original.getParentPost() != null) {
            original = original.getParentPost();
        }

        // ИСПРАВЛЕНО: Предотвращаем дублирование репостов от одного и того же человека
        boolean alreadyRetweeted = postRepository.existsByParentPostAndOwner(original, user);
        if (alreadyRetweeted) {
            log.warn("Пользователь {} уже делал репост публикации {}", user.getUsername(), original.getId());
            return postMapper.toDto(original);
        }

        PostEntity retweet = new PostEntity();
        retweet.setOwner(user);
        retweet.setParentPost(original);
        retweet.setContent(""); // Для простого репоста текст пустой

        PostEntity savedRetweet = postRepository.save(retweet);

        // Отправляем системное асинхронное уведомление автору оригинального контента
        notificationService.notifyAsyncRepost(original.getOwner().getId(), user.getUsername());

        return postMapper.toDto(savedRetweet);
    }

    // РЕАЛИЗОВАНО: Метод отмены репоста для обработки DELETE-запроса с фронтенда
    @Override
    @Transactional
    public void unretweet(Long id) {
        PostEntity original = postRepository.findById(id).orElseThrow(NotExistException::new);
        UserEntity user = userService.getCurrentUserEntity();

        if (original.getParentPost() != null) {
            original = original.getParentPost();
        }

        // Ищем конкретный репост текущего пользователя к этому оригинальному посту
        PostEntity retweetToDelete = postRepository.findByParentPostAndOwner(original, user)
                .orElseThrow(NotExistException::new);

        postRepository.delete(retweetToDelete);
        log.info("Репост пользователя {} к публикации {} успешно отменен", user.getUsername(), original.getId());
    }
}