package ru.parus.chirp.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/**
 * PostEntity
 * <p>
 *     Сущность описывающая посты пользователя
 * </p>
 *
 * @author Grachev.D.G  (zhulvern-92@mail.ru)
 * @version 30.01.2026
 */
@Getter
@Setter
@Entity
@Table(name = "posts")
public class PostEntity extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private UserEntity owner;

    @Column(name = "content", nullable = false)
    private String content;

    // --- ДОБАВЬ ЭТО: ---

    @Column(name = "image_url")
    private String imageUrl; // Путь к картинке

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private PostEntity parentPost; // Для репостов

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "post_likes",
            joinColumns = @JoinColumn(name = "post_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private java.util.Set<UserEntity> likes = new java.util.HashSet<>();

    @OneToMany(mappedBy = "post", cascade = jakarta.persistence.CascadeType.ALL)
    private java.util.List<CommentEntity> comments = new java.util.ArrayList<>();
}

