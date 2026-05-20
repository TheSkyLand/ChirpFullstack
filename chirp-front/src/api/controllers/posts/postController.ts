import { api } from "../.."
import type { postDto } from "../../../types/post.types"



export const PostController = {
    getPosts: () => {
        return api.get<postDto[]>('/api/v1/posts/')

    }
}