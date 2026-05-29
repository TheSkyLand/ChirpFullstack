package ru.parus.chirp.mapper;

import org.mapstruct.BeanMapping;
import org.mapstruct.CollectionMappingStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.NullValueCheckStrategy;
import ru.parus.chirp.model.PostEntity;
import ru.parus.chirp.model.UserEntity;
import ru.parus.chirp.model.CommentEntity;
import ru.parus.chirp.model.dto.post.PostDto;

import java.util.List;

/**
 * PostMapper
 * <p>
 *     Маппер для преобразования постов из сущности в ДТО и обратно.
 *     Добавлена встроенная защита от null-коллекций и пустых полей.
 * </p>
 *
 * @author Grachev.D.G  (zhulvern-92@mail.ru)
 * @version 29.05.2026
 */
@Mapper(
        componentModel = "spring",
        nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS, // Проверяет исходные поля на null перед вызовом геттеров
        collectionMappingStrategy = CollectionMappingStrategy.ADDER_PREFERRED
)
public interface PostMapper {

    @Mapping(target = "author", source = "owner")
    @Mapping(target = "userId", source = "owner.id")
    @Mapping(target = "parentPost.parentPost", ignore = true)
    // ИСПРАВЛЕНО: Принудительно сопоставляем автора родительского поста напрямую из его сущности-владельца!
    @Mapping(target = "parentPost.author", source = "parentPost.owner")
    @Mapping(target = "parentPost.userId", source = "parentPost.owner.id")
    PostDto toDto(PostEntity entity);

    List<PostDto> toDtos(List<PostEntity> entities);

    @Mapping(target = "owner", ignore = true)
    PostEntity toEntity(PostDto dto);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void patchUpdate(PostDto dto, @MappingTarget PostEntity entity);

    PostDto.AuthorDto toAuthorDto(UserEntity userEntity);

    @Mapping(target = "author", source = "owner")
    PostDto.CommentDto toCommentDto(CommentEntity commentEntity);
}   
