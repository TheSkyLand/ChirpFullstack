package ru.parus.chirp.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import ru.parus.chirp.model.UserEntity;
import ru.parus.chirp.model.dto.ProfileDto;

@Mapper(componentModel = "spring", uses =  {UserMapper.class})
public interface ProfileMapper {

    @Mapping(target="user", source = "userEntity")
    ProfileDto toDto(UserEntity userEntity);

}
