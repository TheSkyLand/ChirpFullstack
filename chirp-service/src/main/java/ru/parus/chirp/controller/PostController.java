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
import ru.parus.chirp.model.dto.post.PostDto;
import ru.parus.chirp.service.PostService;

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
@RequestMapping(value = "/api/v1/posts", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    // Исправлено: поддержка отправки картинок и текста (FormData) вместо строгого @RequestBody JSON
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Создание поста с картинкой или без")
    public ResponseEntity<PostDto> create(
            @RequestPart("content") String content,
            @RequestPart(value = "image", required = false) MultipartFile file) {

        log.info("Создание нового чирпа. Текст: {}, Файл прикреплен: {}", content, file != null);
        return ResponseEntity.ok(postService.createWithFile(content, file));
    }

    // Дополнительный метод для обратной совместимости, если фронт шлет чистый JSON без картинок
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<PostDto> createJson(@RequestBody PostDto dto) {
        return ResponseEntity.ok(postService.create(dto));
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<PostDto> toggleLike(@PathVariable Long id) {
        return ResponseEntity.ok(postService.toggleLike(id));
    }

    // Создание простого репоста
    @PostMapping("/{id}/retweet")
    @Operation(summary = "Сделать репост записи")
    public ResponseEntity<PostDto> retweet(@PathVariable Long id) {
        return ResponseEntity.ok(postService.retweet(id));
    }

    // ИСПРАВЛЕНО: Добавлен эндпоинт отмены репоста (Unretweet) для оптимистичного UI фронтенда
    @DeleteMapping("/{id}/retweet")
    @Operation(summary = "Отменить репост записи")
    public ResponseEntity<Void> unretweet(@PathVariable Long id) {
        postService.unretweet(id);
        return ResponseEntity.noContent().build();
    }

    // ИСПРАВЛЕНО: Добавлен недостающий эндпоинт для комментариев
    @PostMapping("/{id}/comments")
    @Operation(summary = "Добавить комментарий к посту")
    public ResponseEntity<PostDto> addComment(
            @PathVariable Long id,
            @RequestBody PostDto commentDto) {

        log.info("Запрос на добавление комментария к посту ID: {}", id);
        return ResponseEntity.ok(postService.addComment(id, commentDto));
    }



    // Убран Trailing Slash для избежания 404 ошибок в Axios
    @GetMapping
    @Operation(summary = "Просмотр постов пользователя")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Успешный ответ"),
    })
    public ResponseEntity<Page<PostDto>> index(@PageableDefault Pageable pageable) {
        return ResponseEntity.ok(postService.index(pageable));
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
}
