import { api } from "../.."
import type { loginDto, resLoginDto } from "../../../types/auth/login.types"
import type { resRegisterDto, registerDto } from "../../../types/auth/register.types"
import type { userDto } from "../../../types/user.types"




export const AuthController = {
    login: (data: loginDto) => {
        console.log("Данные, которые улетают на бэк:", data); // Проверь в консоли браузера, что тут не пусто!
        return api.post<resLoginDto>('/api/v1/auth/login', {
            login: data.login,
            password: data.password
        });
    },

    register: (data: registerDto) => {
        console.log("Отправка на бэк:", JSON.stringify(data));
        return api.post<resRegisterDto>('/api/v1/auth/register', data)
    },

    getCurrentUser: () => {
        console.log("Отправка на бэк:");
        return api.get<userDto>('/api/v1/auth/me')
    }
} 
