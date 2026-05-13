import { api } from "../.."
import type { userDto } from "../../../types/user.types"

export const UserController = {
    // Получить рекомендации
    getExploreUsers: () => {
        return api.get<userDto[]>('/api/v1/users/explore')
    },

    // Подписаться/Отписаться
    toggleFollow: (userId: number) => {
        return api.post(`/api/v1/users/${userId}/follow`)
    }
}
