export type postDto = {
    id: number;
    content: string;
    imageUrl?: string;
    createdAt: string;
    // Объект автора, который возвращает Java-контроллер
    author: {
        username: string;
        name: string;
    };
    // Числовые счетчики с бэкенда
    likesCount: number;
    retweetsCount: number;
    repliesCount: number;
    // Флаги состояний для текущего пользователя
    isLiked: boolean;
    isRetweeted: boolean;
    // Рекурсивная связь для репостов
    parentPost?: postDto; 
    // Массив комментариев
    comments?: Array<{
        id: number;
        content: string;
        author: { username: string };
    }>;
}
