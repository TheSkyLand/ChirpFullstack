package ru.parus.chirp.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import ru.parus.chirp.model.PostEntity;
import ru.parus.chirp.model.UserEntity;

import java.util.List;
import java.util.Optional;

/**
 * PostRepository
 * <p>
 *     Репозиторий для доступа к бд для работы с постами
 *     пользователей с жадной загрузкой авторов репостов.
 * </p>
 *
 * @author Grachev.D.G  (zhulvern-92@mail.ru)
 * @version 29.05.2026
 */
public interface PostRepository extends JpaRepository<PostEntity, Long> {

    // ИСПРАВЛЕНО: Переопределяем стандартный метод findAll(), чтобы подтянуть всю цепочку авторов
// Добавьте это внутрь PostRepository.java для исправления главной ленты
    @Override
    @EntityGraph(attributePaths = {
            "owner",
            "parentPost",
            "parentPost.owner"
    })
    Page<PostEntity> findAll(org.springframework.data.domain.Pageable pageable);


    boolean existsByParentPostAndOwner(PostEntity parentPost, UserEntity owner);
    Optional<PostEntity> findByParentPostAndOwner(PostEntity parentPost, UserEntity owner);

    // ИСПРАВЛЕНО: Для загрузки постов конкретного юзера (например, в профиле) тоже нужен граф, иначе там репосты сломаются
    @EntityGraph(attributePaths = {"owner", "parentPost", "parentPost.owner"})
    List<PostEntity> findAllByOwner(UserEntity userEntity);

    @EntityGraph(attributePaths = {"owner", "parentPost", "parentPost.owner"})
    List<PostEntity> findByOwnerId(Long owner);

    @EntityGraph(attributePaths = {"owner", "parentPost", "parentPost.owner"})
    Optional<PostEntity> findWithGraphById(Long id);


    long countByOwner(UserEntity userEntity);
}
