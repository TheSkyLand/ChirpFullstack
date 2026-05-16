package ru.parus.chirp.mapper;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import ru.parus.chirp.model.PostEntity;       // ИСПРАВЛЕНО: Правильный пакет сущности поста
import ru.parus.chirp.model.UserEntity;       // ИСПРАВЛЕНО: Правильный пакет сущности пользователя
import ru.parus.chirp.model.CommentEntity;    // ИСПРАВЛЕНО: Добавлен импорт сущности комментариев
import ru.parus.chirp.model.dto.post.PostDto;

/**
 * PostMapper
 * <p>
 *     Маппер для преобразования постов из сущности в ДТО и обратно
 * </p>
 *
 * @author Grachev.D.G  (zhulvern-92@mail.ru)
 * @version 31.01.2026
 */
@Mapper(componentModel = "spring")
public interface PostMapper {

    @Mapping(target = "author", source = "owner")
    @Mapping(target = "userId", source = "owner.id")
    @Mapping(target = "parentPost.parentPost", ignore = true) // Пресекаем бесконечную вложенность
    PostDto toDto(PostEntity entity);

    @Mapping(target = "owner", ignore = true)
    PostEntity toEntity(PostDto dto);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void patchUpdate(PostDto dto, @MappingTarget PostEntity entity);

    // Подсказка для MapStruct: как собрать объект автора из сущности пользователя
    PostDto.AuthorDto toAuthorDto(UserEntity userEntity);

    // Подсказка для MapStruct: как собирать комментарии (из CommentEntity в CommentDto)
    @Mapping(target = "author", source = "owner") // Предполагается, что в CommentEntity создатель тоже называется owner
    PostDto.CommentDto toCommentDto(CommentEntity commentEntity);
}
