package ru.parus.chirp.mapper;

import org.mapstruct.*;
import ru.parus.chirp.model.CommentEntity;
import ru.parus.chirp.model.dto.comment.CommentDto;

@Mapper(componentModel = "spring")
public interface CommentMapper {


    @Mapping(source = "entity.owner.id", target = "userId")
    @Mapping(source = "entity.post.id", target = "postId")
    CommentDto toDto(CommentEntity entity);

    @Mapping(target = "createdAt", ignore = true)
    CommentEntity toEntity(CommentDto dto);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void patchUpdate(CommentDto dto, @MappingTarget CommentEntity entity);
}
