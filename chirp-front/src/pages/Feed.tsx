import { Image, X } from 'lucide-react'; // Добавил иконку удаления X
import { observer } from 'mobx-react-lite';
import { useRef, useState } from 'react';
import { postStore } from '../store/PostStore';
import Post from '../components/Post';

const Feed = observer(() => {
    const [text, setText] = useState("");
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Функция выбора файла
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file)); // Создаем временную ссылку для <img>
        }
    };

    // Очистка картинки
    const removeImage = () => {
        setSelectedImage(null);
        setPreviewUrl(null);
    };

    // В компоненте, где форма создания поста
    const handlePostSubmit = () => {
        if (!text.trim() && !selectedImage) return;

        // Вызываем метод стора, который мы написали
        postStore.createPost(text, selectedImage);

        // Очищаем локальное состояние формы
        setText("");
        setSelectedImage(null);
        setPreviewUrl(null);
    };


    return (
        <>
            {/* Блок создания поста */}
            <div className="p-4 border-b border-gray-100">
                <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500 shrink-0" />
                    <div className="flex-1">
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Что нового?"
                            className="w-full text-xl outline-none resize-none"
                        />

                        {previewUrl && (
                            <div className="relative mt-3 mb-2 w-fit">
                                <button onClick={removeImage} className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full">
                                    <X size={18} />
                                </button>
                                <img src={previewUrl} alt="Preview" className="rounded-2xl max-h-80 object-cover border border-gray-100" />
                            </div>
                        )}

                        <div className="flex justify-between items-center pt-3 border-t border-gray-50">
                            <div className="flex gap-2 text-blue-500">
                                <button onClick={() => fileInputRef.current?.click()} className="p-2 hover:bg-blue-50 rounded-full">
                                    <Image size={22} />
                                </button>
                                <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                            </div>
                            <button
                                onClick={handlePostSubmit}
                                className="bg-blue-500 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-600 transition-all"
                            >
                                Chirp
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Список постов (ТЕПЕРЬ ВНУТРИ RETURN) */}
            <div className="flex flex-col divide-y divide-gray-50">
                {/* Было: key={postItem.id} */}
                {/* Стало: если у поста есть родитель, мы создаем уникальную строку ключа */}
                {/* Список постов (ТЕПЕРЬ С ГАРАНТИРОВАННО УНИКАЛЬНЫМИ КЛЮЧАМИ) */}
{/* Список постов (Гарантированная уникальность через индекс) */}
{/* Список постов с предварительной фильтрацией от битых данных бэкенда */}
<div className="flex flex-col divide-y divide-gray-50">
    {postStore.posts
        .filter(postItem => postItem && postItem.author) // ИСПРАВЛЕНО: Пропускаем только посты, у которых точно есть автор!
        .map((postItem, index) => {
            const uniqueKey = postItem.parentPost 
                ? `repost-${postItem.id}-${postItem.author?.username || 'user'}-${index}` 
                : `post-${postItem.id}-${index}`;

            return (
                <Post key={uniqueKey} post={postItem} />
            );
        })
    }
</div>




            </div>
        </>
    );
});


export default Feed