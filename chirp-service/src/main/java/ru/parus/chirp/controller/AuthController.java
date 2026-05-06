package ru.parus.chirp.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.parus.chirp.model.UserEntity;
import ru.parus.chirp.model.dto.AuthResponseDto;
import ru.parus.chirp.model.dto.LoginRequestDto;
import ru.parus.chirp.model.dto.RegisterRequestDto;
import ru.parus.chirp.service.impl.AuthService;

/**
 * AuthController
 * <p>
 *     Контроллер для работы с авторизацией пользователя
 * </p>
 *
 * @author Grachev.D.G  (zhulvern-92@mail.ru)
 * @version 30.01.2026
 */
@RestController
@RequestMapping(value = "/api/v1/auth", produces = MediaType.APPLICATION_JSON_VALUE) // Оставляем только produces
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping(value = "/register", consumes = MediaType.APPLICATION_JSON_VALUE) // Переносим consumes сюда
    public ResponseEntity<AuthResponseDto> register(@Valid @RequestBody RegisterRequestDto request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping(value = "/login", consumes = MediaType.APPLICATION_JSON_VALUE) // И сюда
    public ResponseEntity<AuthResponseDto> login(@Valid @RequestBody LoginRequestDto request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/me") // Теперь GET-запрос не будет требовать JSON на вход
    public ResponseEntity<UserEntity> getCurrentUser() {
        return ResponseEntity.ok(authService.getCurrentUserEntity());
    }
}