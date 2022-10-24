import React, {useState} from "react"
import Axios from "axios"
import EditComment from "./EditComment";

function SingleComment(props) {

    const [isEdited, setIsEdited] = useState(false)

    const date = new Date(props.comment.createdAt).toLocaleDateString("utc", {
        year: "numeric",
        month: "short",
        day: "numeric"
    })

    async function handleDelete() {
        const ourRequest = Axios.CancelToken.source()
        try {
            const response = await Axios.delete(`/api/comment/${props.comment.id}`, {cancelToken: ourRequest.token})
            window.location.reload(true)
        } catch (e) {
            console.log("There was a problem or the request was cancelled.")
        }

        return () => {
            ourRequest.cancel()
        }
    }

    function handleUpdate() {
        setIsEdited(prevState => !prevState)
    }

    return (
        <div className="comment mt-5 d-flex flex-row align-items-start ml-auto mr-auto">
            <div className="mr-3 col-2 text-center">
                <img src="https://www.nirix.com/uploads/files/Images/general/misc-marketing/avatar-2@2x.png"/>
                <p className="font-weight-bold mt-2">{props.comment.user.username}</p>
            </div>
            {!isEdited && (<div className="comment-body mt-2 col-8">
                <p>{props.comment.content}</p>
            </div>)}
            {isEdited && (<EditComment
                id={props.comment.id}
                userId={props.comment.user.id}
                content={props.comment.content}
                postId={props.comment.post.id}/>)}
            <div className="ml-auto d-flex flex-column align-self-start">
                <div className="align-items-start comment-date">{date}</div>
                <div className="align-self-end mt-4">
                    <span onClick={handleUpdate} className="material-symbols-outlined ">
                        edit </span>
                    <span onClick={handleDelete} className="material-symbols-outlined pointer ml-2">
            {" "}
                        delete{" "}
          </span>
                </div>
            </div>
        </div>
    )
}

export default SingleComment;
