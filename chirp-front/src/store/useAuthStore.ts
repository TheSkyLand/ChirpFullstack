import { create } from 'zustand'
import type { userDto } from '../types/userTypes'

interface AuthState {
    user: userDto | null;
    isAuthenticated: boolean;
    setUser: (user: userDto | null) => void;
    logout: () => void;
}

export const  useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,

    setUser:(user) => set({
        user: user,
        isAuthenticated: !!user
    }),

    logout: () => {
        localStorage.removeItem('token');
        set({user:null, isAuthenticated: false})
    },
}));