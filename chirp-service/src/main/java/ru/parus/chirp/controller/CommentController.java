package ru.parus.chirp.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.parus.chirp.model.CommentEntity;
import ru.parus.chirp.model.dto.comment.CommentDto;
import ru.parus.chirp.service.CommentService;

import java.util.List;


@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/comments", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
public class CommentController {

    private final CommentService commentService;

    @GetMapping(value = "/{post_id}")
    public ResponseEntity<List<CommentDto>> findByPost(@PathVariable(name = "post_id") Long postId, @PageableDefault Pageable pageable) {
        return ResponseEntity.ok(commentService.findByPost(postId, pageable));
    }

    @PostMapping(value = "/")
    public ResponseEntity<CommentDto> createComment(@Valid @RequestBody CommentDto dto) {
        return ResponseEntity.ok(commentService.createComment(dto));
    }

    @DeleteMapping("/{id}") // DELETE /comments/1
    public ResponseEntity<Void> deleteCommentById(@PathVariable(name = "id") Long id) {
        commentService.deleteCommentById(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}")
    public ResponseEntity<CommentDto> updateComment(@PathVariable(name = "id") Long id, @RequestBody CommentDto dto) {
        return ResponseEntity.ok(commentService.updateComment(id, dto));
    }

}
