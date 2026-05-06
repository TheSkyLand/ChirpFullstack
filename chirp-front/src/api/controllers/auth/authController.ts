import { api } from "../.."
import type { loginDto, resLoginDto } from "../../../types/auth/login.types"
import type { resRegisterDto, registerDto } from "../../../types/auth/register.types"
import type { userDto } from "../../../types/user.types"




export const AuthController = {
    login: (data: loginDto) => {
        console.log("Отправка на бэк:", JSON.stringify(data));
        return api.post<resLoginDto>('/api/v1/auth/login', data)
    },
    
    register: (data: registerDto) => {
        console.log("Отправка на бэк:", JSON.stringify(data));
        return api.post<resRegisterDto>('/api/v1/auth/register', data)
    },

    getCurrentUser: (data: userDto) => {
        console.log("Отправка на бэк:", JSON.stringify(data));
        return api.get<userDto>('/api/v1/auth/me', data)
    }
} 
