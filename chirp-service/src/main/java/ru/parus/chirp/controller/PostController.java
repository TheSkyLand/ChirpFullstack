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


    @PostMapping("/")
    public ResponseEntity<PostDto> create(@RequestBody PostDto dto) { // @RequestBody ОБЯЗАТЕЛЕН
        return ResponseEntity.ok(postService.create(dto));
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<PostDto> toggleLike(@PathVariable Long id) {
        return ResponseEntity.ok(postService.toggleLike(id));
    }

    @PostMapping("/{id}/retweet")
    public ResponseEntity<PostDto> retweet(@PathVariable Long id) {
        return ResponseEntity.ok(postService.retweet(id));
    }

    @GetMapping("/")
    @Operation(summary = "Просмотр постов пользователя",
            description = "")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Успешный ответ"),
    })
    public ResponseEntity<Page<PostDto>> index(@PageableDefault Pageable pageable) {
        return ResponseEntity.ok(postService.index(pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Просмотр поста пользователя",
            description = "")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Успешный ответ"),
    })
    public ResponseEntity<PostDto> show(@PathVariable Long id) {
        return ResponseEntity.ok(postService.show(id));
    }


    @PatchMapping("/{id}")
    @Operation(summary = "Обновление поста пользователя",
            description = "Требуется авторизация")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Успешный ответ"),
    })
    public ResponseEntity<PostDto> update(@PathVariable Long id, @RequestBody PostDto dto) {
        return ResponseEntity.ok(postService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Удаление поста пользователя",
            description = "Требуется авторизация")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Успешный ответ"),
    })
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        postService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
