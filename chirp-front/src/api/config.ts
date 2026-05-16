import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor: добавляем токен
apiClient.interceptors.request.use(
    (config) => {
        // Каждый раз при отправке запроса принудительно лезем в localStorage за токеном
        const token = localStorage.getItem("token");
        
        if (token) {
            // Если токен найден, внедряем его в заголовки авторизации Spring Security
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
// Response interceptor: обрабатываем ошибки без жестких редиректов
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Логируем для дебага в консоль браузера
        console.error("[API Error]", error.response?.status, error.config?.url, error.response?.data);

        if (error.response) {
            // Если токен протух (401), можно просто очистить стор или увести на логин
            if (error.response.status === 401 || error.response.status === 403) {
                console.warn("Сессия истекла или нет доступа");
                // localStorage.removeItem('token'); // Раскомментируй, если хочешь сброс
            }
        } else {
            // Ошибка сети (сервер выключен)
            console.error("Сервер недоступен или ошибка сети");
        }

        // ВАЖНО: Просто пробрасываем ошибку дальше, чтобы сработал try/catch в UserStore
        return Promise.reject(error);
    }
);

export default apiClient;
