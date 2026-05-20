package ru.parus.chirp.model.dto;

import jakarta.validation.constraints.NotBlank;

public class MessageDto {

    private int authorId;

    private int receiverId;

    @NotBlank(message = "Сообщение не может быть пустым")
    private String message;
}
