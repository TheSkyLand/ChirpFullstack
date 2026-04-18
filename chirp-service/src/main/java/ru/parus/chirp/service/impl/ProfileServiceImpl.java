package ru.parus.chirp.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.parus.chirp.exception.NotExistUserException;
import ru.parus.chirp.mapper.ProfileMapper;
import ru.parus.chirp.model.UserEntity;
import ru.parus.chirp.model.dto.ProfileDto;
import ru.parus.chirp.repository.FollowerRepository;
import ru.parus.chirp.repository.PostRepository;
import ru.parus.chirp.repository.UserRepository;
import ru.parus.chirp.service.ProfileService;
import ru.parus.chirp.service.UserService;

/**
 * ProfileServiceImpl
 * <p>
 *     Сервис для работ с профилем пользователей
 * </p>
 *
 * @author Grachev.D.G  (zhulvern-92@mail.ru)
 * @version 30.01.2026
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {

    private final UserRepository userRepository;
    private final UserService  userService;
    private final ProfileMapper profileMapper;
    private final PostRepository postRepository;
    private final FollowerRepository followerRepository;

    // FIXME вообще так писать плохо, догадаетесь почему?)
    /**
     * Метод для получения информации профиля текущего пользователя
     * */
    @Override
    @Transactional(readOnly = true)
    public ProfileDto currentUserShow() {
        UserEntity userAuth  = userService.getCurrentUserEntity();
        UserEntity user = userRepository.findById(userAuth.getId())
                .orElseThrow(NotExistUserException::new);
        ProfileDto profileDto = profileMapper.toDto(user);

        // Узнаем сколько у на пользователя подписано
        profileDto.setFollowersCount(followerRepository.countByFollower(user));
        // На сколько текущий пользователь подписан
        profileDto.setFollowingCount(followerRepository.countByUser(user));
        profileDto.setPostsTotalCount(postRepository.countByOwner(user));
        return profileDto;
    }
}
