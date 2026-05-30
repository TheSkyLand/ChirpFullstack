package ru.parus.chirp.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ru.parus.chirp.model.PostEntity;
import ru.parus.chirp.model.dto.post.PostDto;
import ru.parus.chirp.service.PostService;

import java.security.Principal;
import java.util.List;

/**
 * PostController
 * <p>
 *     Контроллер для работы с постами пользователей
 * </p>
 *
 * @author Grachev.D.G  (zhulvern-92@mail.ru)
 * @version 27.01.2026
 */
@Slf4j
@RestController
@RequestMapping(value = "/api/v1/posts/", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Создание поста с картинкой или без")
    public ResponseEntity<PostDto> create(
            @RequestPart("content") String content,
            @RequestPart(value = "image", required = false) MultipartFile file) {

        log.info("Создание нового чирпа. Текст: {}, Файл прикреплен: {}", content, file != null);
        return ResponseEntity.ok(postService.createWithFile(content, file));
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<PostDto> createJson(@RequestBody PostDto dto) {
        return ResponseEntity.ok(postService.create(dto));
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<PostDto> toggleLike(@PathVariable Long id) {
        return ResponseEntity.ok(postService.toggleLike(id));
    }

    @PostMapping("/{id}/retweet")
    @Operation(summary = "Сделать репост записи")
    public ResponseEntity<PostDto> retweet(@PathVariable Long id) {
        return ResponseEntity.ok(postService.retweet(id));
    }

    @DeleteMapping("/{id}/retweet")
    @Operation(summary = "Отменить репост записи")
    public ResponseEntity<Void> unretweet(@PathVariable Long id) {
        postService.unretweet(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/comments")
    @Operation(summary = "Добавить комментарий к посту")
    public ResponseEntity<PostDto> addComment(
            @PathVariable Long id,
            @RequestBody PostDto commentDto) {

        log.info("Запрос на добавление комментария к посту ID: {}", id);
        return ResponseEntity.ok(postService.addComment(id, commentDto));
    }

    @GetMapping
    @Operation(summary = "Просмотр постов пользователя")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Успешный ответ"),
    })
    public ResponseEntity<Page<PostDto>> index(
            @PageableDefault
            Pageable pageable,
            Principal principal) {

        String username = (principal != null) ? principal.getName() : null;
        log.info("Запрос ленты постов для пользователя: {}", username);

        // ИСПРАВЛЕНО: Передаем 3 аргумента (pageable, username, и 0 в качестве userId),
        // чтобы строго соответствовать сигнатуре вашего PostServiceImpl.java
        return ResponseEntity.ok(postService.index(pageable, username, 0));
    }


    @GetMapping("/{id}")
    @Operation(summary = "Просмотр поста пользователя")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Успешный ответ"),
    })
    public ResponseEntity<PostDto> show(@PathVariable Long id) {
        return ResponseEntity.ok(postService.show(id));
    }



    @PatchMapping("/{id}")
    @Operation(summary = "Обновление поста пользователя", description = "Требуется авторизация")
    public ResponseEntity<PostDto> update(@PathVariable Long id, @RequestBody PostDto dto) {
        return ResponseEntity.ok(postService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Удаление поста пользователя", description = "Требуется авторизация")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        postService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/wall/")
    @Operation(summary = "получить ВСЕ посты пользователя", description = "если не заработает даю сальтуху")
    public ResponseEntity<Page<PostDto>> wall() {
        return ResponseEntity.ok(postService.wall());
    }
}
