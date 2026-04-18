package ru.parus.chirp.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import ru.parus.chirp.model.CommentEntity;
import ru.parus.chirp.model.PostEntity;

import java.util.List;

@Repository
public interface CommentRepository extends CrudRepository<CommentEntity, Long> {
    List<CommentEntity> findByPost(PostEntity post);
}
