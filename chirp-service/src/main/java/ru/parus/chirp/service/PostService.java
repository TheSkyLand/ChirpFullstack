package ru.parus.chirp.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import ru.parus.chirp.model.PostEntity;
import ru.parus.chirp.model.dto.post.PostDto;

/**
 * PostService
 * <p>
 *      Интерфейс для работы с постами
 * </p>
 *
 * @author Grachev.D.G  (zhulvern-92@mail.ru)
 * @version 30.01.2026
 */
public interface PostService {
    PostDto create(final PostDto dto);
    Page<PostDto> index(Pageable pageable, String username, int userId);
    PostDto show(Long id);

    PostDto showUserPosts(Long owner);

    PostDto update(Long id, final PostDto dto);
    PostDto createWithFile(String content, MultipartFile file);
    PostDto toggleLike(Long id);



    PostDto addComment(Long id, PostDto commentDto);

    PostDto retweet(Long id);

    void unretweet(Long id);

    void delete(Long id);
}
