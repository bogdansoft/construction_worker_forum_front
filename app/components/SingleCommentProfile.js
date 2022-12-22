import React, { useContext, useState } from "react"
import DeleteModal from "./DeleteModal"
import ReactTooltip from "react-tooltip"
import { CSSTransition } from "react-transition-group"
import DispatchContext from "../DispatchContext"
import Axios from "axios"
import StateContext from "../StateContext"

function SingleCommentProfile(props) {
  const date = new Date(props.comment.createdAt).toLocaleDateString("utc", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
  const [isDeleting, setIsDeleting] = useState(false)
  const appDispatch = useContext(DispatchContext)
  const appState = useContext(StateContext)
  const [isEdited, setIsEdited] = useState(false)
  const [error, setError] = useState(false)
  const [content, setContent] = useState(props.comment.content)

  async function handleDelete(e) {
    e.preventDefault()
    const ourRequest = Axios.CancelToken.source()
    try {
      const userId = props.comment.user.id
      await Axios.delete(
        `/api/comment/${props.comment.id}`,
        {
          headers: { Authorization: `Bearer ${appState.user.token}` },
          params: { userId },
        },
        { cancelToken: ourRequest.token }
      )
      appDispatch({ type: "flashMessage", value: "Comment succesfully deleted !", messageType: "message-green" })
      props.reload()
    } catch (e) {
      console.log("there was a problem deleting comment" + e)
    }
    return () => {
      ourRequest.cancel()
    }
  }

  function deletePopup() {
    setIsDeleting((prev) => !prev)
  }

  async function handleUpdate() {
    setIsEdited((prevState) => !prevState)
    setError(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (content.length <= 2) {
      setError(true)
      return
    }
    const ourRequest = Axios.CancelToken.source()
    try {
      await Axios.put(
        `/api/comment/${props.comment.id}`,
        {
          userId: props.comment.user.id,
          content: content,
          postId: props.comment.post.id,
        },
        { headers: { Authorization: `Bearer ${appState.user.token}` } },
        { cancelToken: ourRequest.token }
      )
      props.reload()
      appDispatch({ type: "flashMessage", value: "Comment edited !", messageType: "message-green" })
      setIsEdited(false)
    } catch (e) {
      console.log("There was a problem or the request was cancelled." + e)
    }
    return () => {
      ourRequest.cancel()
    }
  }

  return (
    <div>
      <div className="single-item-profile container d-flex mt-3 p-2 align-items-center">
        <div id="topic-name">{props.comment.content}</div>
        <div className="ml-auto mr-3">
          <span className="ml-3">Created: {date}</span>
        </div>
        <div className="icon-black">
          <span onClick={handleUpdate} className="material-symbols-outlined" data-tip="Edit" data-for="edit">
            edit
          </span>
          <ReactTooltip id="edit" className="custom-tooltip" />
          <span onClick={deletePopup} className="material-symbols-outlined" data-tip="Delete" data-for="delete">
            delete
          </span>

          <CSSTransition in={isDeleting} timeout={330} classNames="liveValidateMessage" unmountOnExit>
            <div className="delete-absolute container col-5 mt-2">
              <div className="delete-pop delete-profile-followed-users col-3 p-2 liveValidateMessage-delete">
                <DeleteModal delete={handleDelete} noDelete={deletePopup} />
              </div>
            </div>
          </CSSTransition>
          <ReactTooltip id="delete" className="custom-tooltip" />
        </div>
      </div>
      {isEdited && (
        <form onSubmit={handleSubmit} className="d-flex mt-2 ml-auto mr-auto align-items-center container">
          <div className="container">
            <input onChange={(e) => setContent(e.target.value)} value={content} type="text" className="container p-2 edit-comment-user-profile single-topic-content"></input>
            <CSSTransition in={error} timeout={330} classNames="liveValidateMessage" unmountOnExit>
              <div className="alert alert-danger small liveValidateMessage">Comment must be at least 2 characters long</div>
            </CSSTransition>
          </div>
          <div className="ml-auto mr-4">
            <button type="submit" className="btn material-symbols-outlined">
              send
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default SingleCommentProfile
