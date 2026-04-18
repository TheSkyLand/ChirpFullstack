package ru.parus.chirp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.parus.chirp.model.PostEntity;
import ru.parus.chirp.model.UserEntity;

import java.util.List;

/**
 * PostRepository
 * <p>
 *     Репозиторий для доступа к бд для работы с постами
 *     пользователей
 * </p>
 *
 * @author Grachev.D.G  (zhulvern-92@mail.ru)
 * @version 30.01.2026
 */
public interface PostRepository extends JpaRepository<PostEntity, Long> {

    List<PostEntity> findAllByOwner(UserEntity userEntity);
    long countByOwner(UserEntity userEntity);
}
