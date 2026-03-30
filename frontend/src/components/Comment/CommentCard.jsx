import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import {useState} from "react";


export default function CommentCard() {

    const [liked, setLiked] = useState(false);
    const [count, setCount] = useState(120)

    const comment = {
        username: "kenny",
        content: "This is a comment"
    }

    const handleLike = () => {
        if (liked) {
            setCount(count - 1);
        } else {
            setCount(count + 1);
        }

    }

    return (
        <div className="py-2 px-2 comment-card w-full grid grid-cols-[50px_1fr] bg-white rounded-lg">
            <div className="image-container">
                <img src={`../../public/test.jpg`} className="w-10 h-10 rounded-full"/>
            </div>

            <div className="ml-2comment-container">
                <a className="username font-semibold" href={``}>
                    {
                        comment.username
                    }
                </a>
                <p className="text-sm">
                    {
                        comment.content
                    }
                </p>
            </div>
            
            <div className="likebtn-container my-2 w-full mx-auto"> 
                {
                    liked ? 
                    <AiFillLike className="cursor-pointer text-blue-800"/> : (
                        <AiOutlineLike className="text-blue-800" />
                    )
                }      
            </div>
        </div>
    )
}