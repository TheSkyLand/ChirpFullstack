import apiClient from "../../config";
import { PostDto } from "../../../types/post/post.types";
import { Pageable } from "../../../types/common/pageable.types";
import { PageableObject } from "../../../types/page/page.types";

export const postsController = {
    getPosts: (pageable: Pageable) => {
        return apiClient.get<PageableObject>(`/posts/?page=${pageable.page}&size=${pageable.size}&sort=${pageable.sort?.join(",")}`);
    },

    getPostId: (id: number) => {
        return apiClient.get<PostDto>(`/posts/${id}`)
    },

    editPost: (id: number, data: PostDto) => {
        return apiClient.patch<PostDto>(`/posts/${id}`, data);
    },

    createPost: (data: PostDto) => {
        return apiClient.post<PageableObject>(`/posts/`, data);
    }
}