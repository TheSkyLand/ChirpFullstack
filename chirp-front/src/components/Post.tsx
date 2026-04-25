
interface PostProps{
    title: string,
    content: string,

}

const Post = (props: PostProps) => {
    return(
        
        <div>
            {props.content}
            {props.title}
        </div>
    )
}

export default Post;
