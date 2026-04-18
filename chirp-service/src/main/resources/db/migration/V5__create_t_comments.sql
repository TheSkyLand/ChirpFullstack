CREATE TABLE IF NOT EXISTS post_comments (
    id BIGINT GENERATED ALWAYS AS IDENTITY primary key,
    content varchar(256),
    created_at timestamp not null default now(),
    parent_comment_id   bigint,
    user_id bigint references users(id),
    post_id bigint references posts(id)
);

CREATE INDEX IF NOT EXISTS post_comments_post_id_idx ON post_comments(post_id);
-- CREATE INDEX IF NOT EXISTS post_comments_created_at_idx ON post_comments(created_at);
