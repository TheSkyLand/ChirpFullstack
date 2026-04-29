import { api } from "../.."
import type { loginDto, resLoginDto } from "../../../types/auth/login.types"
import { type registerDto } from "../../../types/auth/register.types"




export const AuthController = {
    login: (data: loginDto) => {
        return api.post<resLoginDto>('/api/v1/auth/login', data)
    },
    
    register: (data: registerDto) => {
        return api.post('/api/v1/auth/register', data)
    }
} 