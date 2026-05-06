import { Image, X } from 'lucide-react'; // Добавил иконку удаления X
import { observer } from 'mobx-react-lite';
import { useRef, useState } from 'react';

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

    const handlePostSubmit = () => {
        if (!text.trim() && !selectedImage) return;

        // ВАЖНО: Для отправки файлов на бэк мы будем использовать FormData
        const formData = new FormData();
        formData.append('content', text);
        if (selectedImage) {
            formData.append('file', selectedImage);
        }

        console.log("Отправляем форму с файлом:", formData);
        
        // Очищаем всё после "отправки"
        setText("");
        removeImage();
    };

    return (
        <div className="p-4 border-b border-gray-100">
            <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500 shrink-0" /> {/* Аватар */}
                <div className="flex-1">
                    <textarea 
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Что нового?" 
                        className="w-full text-xl outline-none resize-none"
                    />

                    {/* --- ПРЕВЬЮ КАРТИНКИ --- */}
                    {previewUrl && (
                        <div className="relative mt-3 mb-2 w-fit">
                            <button 
                                onClick={removeImage}
                                className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                            >
                                <X size={18} />
                            </button>
                            <img 
                                src={previewUrl} 
                                alt="Preview" 
                                className="rounded-2xl max-h-80 object-cover border border-gray-100" 
                            />
                        </div>
                    )}

                    <div className="flex justify-between items-center pt-3 border-t border-gray-50">
                        <div className="flex gap-2 text-blue-500">
                            {/* Кнопка-обертка над скрытым инпутом */}
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="p-2 hover:bg-blue-50 rounded-full transition-colors"
                            >
                                <Image size={22} />
                            </button>
                            <input 
                                type="file" 
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                accept="image/*"
                                className="hidden" 
                            />
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
    );
});


export default Feed