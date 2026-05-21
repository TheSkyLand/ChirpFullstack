import { useEffect, useState } from "react"
import { postsController } from "../api/controllers/posts/postController"
import type { PostDto } from "../types/post/post.types"
import { getDefaultPageable, type Pageable } from "../types/common/pageable.types"


const CustomPost = () => {
    const [data, setData] = useState<PostDto[]>([])
    const [error, setError] = useState('')
    const [contentPost, setContentPost] = useState('')
    const [postActiveId, setPostActiveId] = useState< | undefined>(undefined)   


    const [pageable] = useState<Pageable>(getDefaultPageable());


   const fetchPosts = () => {
    if (!contentPost.trim()) return


        postsController.getPosts(pageable)
            .then(response => {
                setData(response.data.content as PostDto[])
            })
            .catch(() => setError('Ошибка создания')); 
   }

       useEffect(() => {
        fetchPosts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    const createNewPost = () => {
        if (!contentPost.trim()) return;

        postsController.createPost({ content: contentPost })
            .then(() => {
                fetchPosts();
                setContentPost('');
                setError('');
            })
            .catch(() => setError('Ошибка создания'));
    };


    return (<div>
        <div>test</div>
        <ul>
            {data.map((item, key) => (
                <div>
                    <li key={key}>{item.author.name}</li>
                    <li key={key}>{item.author.username}</li>
                    <li key={key}>{item.content}</li>
                    <li key={key}>{item.likesCount}</li>
                    <li key={key}>{item.repliesCount}</li>
                    <li key={key}>{item.retweetsCount}</li>
                </div>
            ))}
        </ul>

    </div>)
}
export default CustomPost