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
import ru.parus.chirp.model.dto.UserDto;
import ru.parus.chirp.service.UserService;

/**
 * UserController
 * <p>
 *     Контроллер для взаимодействия с другими пользователями
 * </p>
 *
 * @author Grachev.D.G  (zhulvern-92@mail.ru)
 * @version 27.01.2026
 */
@Slf4j
@RestController
@RequestMapping(value = "/users", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
public class UserController {


    private final UserService userService;

    @Operation(summary = "Просмотр текущихх пользователей в системе")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Успешный ответ"),
    })
    @GetMapping("/")
    public ResponseEntity<Page<UserDto>> index(@PageableDefault Pageable pageable, @RequestParam(required = false) String username) {
        return ResponseEntity.ok(userService.index(pageable, username));
    }

    @Operation(summary = "Просмотр информации о пользователе")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Успешный ответ"),
    })

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> show(@PathVariable Long id) {
        return ResponseEntity.ok(userService.show(id));
    }

}
