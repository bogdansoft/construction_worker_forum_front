import React, { useState } from "react"
import Axios from "axios"

function SingleComment(props) {
  const [isEdited, setIsEdited] = useState(false)
  const [content, setContent] = useState(props.comment.content)
  const token = localStorage.getItem("constructionForumUserToken")
  const date = new Date(props.comment.createdAt).toLocaleDateString("utc", {
    year: "numeric",
    month: "short",
    day: "numeric"
  })

  async function handleDelete() {
    const ourRequest = Axios.CancelToken.source()
    try {
      await Axios.delete(`/api/comment/${props.comment.id}`, { headers: { Authorization: `Bearer ${token}` } }, { cancelToken: ourRequest.token })
      props.reload()
    } catch (e) {
      console.log("There was a problem or the request was cancelled.")
    }

    return () => {
      ourRequest.cancel()
    }
  }
  async function handleSubmit(e) {
    e.preventDefault()
    console.log(props.comment.user.id)
    console.log(props.comment.post.id)
    console.log(content)
    const ourRequest = Axios.CancelToken.source()
    try {
      await Axios.put(
        `/api/comment/${props.comment.id}`,
        {
          userId: props.comment.user.id,
          content,
          postId: props.comment.post.id
        },
        { headers: { Authorization: `Bearer ${token}` } },
        { cancelToken: ourRequest.token }
      )
      props.reload()
      setIsEdited(false)
    } catch (e) {
      console.log("There was a problem or the request was cancelled." + e)
    }
    return () => {
      ourRequest.cancel()
    }
  }

  function handleUpdate() {
    setIsEdited(prevState => !prevState)
  }

  return (
    <div className="single-topic container d-flex mt-4">
      <div className="avatar align-self-center d-flex flex-column text-center">
        <span className="material-symbols-outlined"> person </span>
        <span>{props.comment.user.username}</span>
      </div>
      <div className="d-flex container">
        <div className="single-topic-content container d-flex ml-3 p-2 align-items-center col-11">
          {!isEdited && (
            <div className="d-flex align-items-center container">
              {" "}
              <div id="topic-name ">{props.comment.content}</div>
              <div className="ml-auto mr-3">
                <span className="ml-3">
                  Created: {date} <span className="ml-2">by {props.comment.user.username}</span>
                </span>
              </div>
              <div className="icon-black">
                <span onClick={handleUpdate} className="material-symbols-outlined">
                  edit
                </span>
                <span onClick={handleDelete} className="material-symbols-outlined">
                  {" "}
                  delete{" "}
                </span>
              </div>
            </div>
          )}
          {isEdited && (
            <form onSubmit={handleSubmit} className="d-flex ml-auto mr-auto align-items-center container">
              <div className="container">
                <input onChange={e => setContent(e.target.value)} value={content} type="text" className="container single-topic-content"></input>
              </div>
              <div className="ml-auto mr-4">
                <button type="submit" className="material-symbols-outlined">
                  send
                </button>
              </div>
            </form>
          )}
        </div>
        <div className="col-1 d-flex">
          <span className="material-symbols-outlined mr-2 mt-2"> thumb_up </span>
          <span className="material-symbols-outlined mt-2"> reply </span>
        </div>
      </div>
    </div>

    // <div className="comment mt-5 d-flex flex-row align-items-start ml-auto mr-auto">
    //   <div className="mr-3 col-2 text-center">
    //     <img src="https://www.nirix.com/uploads/files/Images/general/misc-marketing/avatar-2@2x.png" />
    //     <p className="font-weight-bold mt-2">{props.comment.user.username}</p>
    //   </div>
    //   {!isEdited && (
    //     <div className="comment-body mt-2 col-8">
    //       <p>{props.comment.content}</p>
    //     </div>
    //   )}
    //   {isEdited && <EditComment id={props.comment.id} userId={props.comment.user.id} content={props.comment.content} postId={props.comment.post.id} />}
    //   <div className="ml-auto d-flex flex-column align-self-start">
    //     <div className="align-items-start comment-date">{date}</div>
    //     <div className="align-self-end mt-4">
    //       <span onClick={handleUpdate} className="material-symbols-outlined ">
    //         edit{" "}
    //       </span>
    //       <span onClick={handleDelete} className="material-symbols-outlined pointer ml-2">
    //         {" "}
    //         delete{" "}
    //       </span>
    //     </div>
    //   </div>
    // </div>
  )
}

export default SingleComment
