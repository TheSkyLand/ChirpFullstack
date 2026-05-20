import { useEffect, useState } from "react"
import { PostController } from "../api/controllers/posts/postController"
import type { postDto } from "../types/post.types"


const CustomPost = () => {
    const [data, setData] = useState<postDto[]>([])

    useEffect(() => {
        PostController.getPosts()
            .then(response => {
                setData(response.data)
            })


    })
            


    return (<div>

        <ul>
            {data.map(key => (
                <div>{key}</div>
            ))} 
        </ul>

    </div>)
}
export default CustomPost