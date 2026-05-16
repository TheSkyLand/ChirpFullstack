import { Image, X } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useRef, useState, useEffect } from 'react';
import { postStore } from '../store/PostStore';
import Post from '../components/Post';

const Feed = observer(() => {
    const [text, setText] = useState("");
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Очистка памяти от картинок
    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setSelectedImage(null);
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handlePostSubmit = () => {
        if (!text.trim() && !selectedImage) return;
        postStore.createPost(text, selectedImage);
        setText("");
        removeImage(); 
    };

    return (
        <>
            {/* Блок создания поста (ТЕПЕРЬ ВСЕГДА ДОСТУПЕН) */}
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
                                <button onClick={removeImage} className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full transition-colors hover:bg-black/70">
                                    <X size={18} />
                                </button>
                                <img src={previewUrl} alt="Preview" className="rounded-2xl max-h-80 object-cover border border-gray-100" />
                            </div>
                        )}

                        <div className="flex justify-between items-center pt-3 border-t border-gray-50">
                            <div className="flex gap-2 text-blue-500">
                                <button onClick={() => fileInputRef.current?.click()} className="p-2 hover:bg-blue-50 rounded-full transition-colors">
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

            {/* Список постов с изолированным лоадером */}
            <div className="flex flex-col divide-y divide-gray-50">
                {postStore.isLoading && postStore.posts.length === 0 ? (
                    // Лоадер крутится только внизу, не мешая писать новый пост
                    <div className="p-8 text-center text-gray-500 font-medium animate-pulse">
                        Синхронизация ленты...
                    </div>
                ) : postStore.posts.length > 0 ? (
                    postStore.posts.map((postItem, index) => {
                        const uniqueKey = postItem.parentPost
                            ? `repost-${postItem.id}-${index}`
                            : `post-${postItem.id}-${index}`;

                        return <Post key={uniqueKey} post={postItem} />;
                    })
                ) : (
                    // Если в базе 0 постов, форма создания останется сверху, а внизу покажется заглушка
                    <div className="p-8 text-center text-gray-400">Лента пуста. Напишите первый чирп!</div>
                )}
            </div>
        </>
    );
});

export default Feed;
