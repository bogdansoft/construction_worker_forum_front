import React, { useState, useContext, useEffect } from "react"
import Axios from "axios"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import DeleteModal from "./DeleteModal"
import { CSSTransition } from "react-transition-group"
import { useImmer } from "use-immer"
import LikeButton from "./LikeButton"

function SingleComment(props) {
  const appDispatch = useContext(DispatchContext)
  const appState = useContext(StateContext)
  const [isEdited, setIsEdited] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [content, setContent] = useState(props.comment.content)
  const [error, setError] = useState(false)
  const token = localStorage.getItem("constructionForumUserToken")
  const date = new Date(props.comment.createdAt).toLocaleDateString("utc", {
    year: "numeric",
    month: "short",
    day: "numeric"
  })
  const [state, setState] = useImmer({
    commentId: props.comment.id,
    commentLikesCount: props.comment.likers.length,
    isCommentLikedByUser: props.comment.likers.filter(user => user.id == appState.user.id).length > 0,
    isCommentOwnedByUser: props.comment.user.id == appState.user.id,
    like: 0
  })

  async function handleDelete() {
    const ourRequest = Axios.CancelToken.source()
    try {
      const userId = props.comment.user.id
      await Axios.delete(`/api/comment/${props.comment.id}`, { headers: { Authorization: `Bearer ${appState.user.token}` }, params: { userId } }, { cancelToken: ourRequest.token })
      appDispatch({ type: "flashMessage", value: "Comment succesfully deleted !", messageType: "message-green" })
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
          content,
          postId: props.comment.post.id
        },
        { headers: { Authorization: `Bearer ${token}` } },
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

  function handleUpdate() {
    setIsEdited(prevState => !prevState)
    setError(false)
  }

  function deletePopup() {
    setIsDeleting(prev => !prev)
  }

  function showEditAndDeleteButtons() {
    if (appState.user.id == props.comment.user.id) {
      return (
        <div className="icon-black">
          <span onClick={handleUpdate} className="material-symbols-outlined">
            edit
          </span>
          <span onClick={deletePopup} className="material-symbols-outlined">
            {" "}
            delete{" "}
            <CSSTransition in={isDeleting} timeout={330} classNames="liveValidateMessage" unmountOnExit>
              <div class="delete-absolute col-7">
                <div className="delete-pop liveValidateMessage-delete ml-3">
                  <DeleteModal delete={handleDelete} noDelete={deletePopup} />
                </div>
              </div>
            </CSSTransition>
          </span>
        </div>
      )
    } else if (appState.user.roles.includes("ADMINISTRATOR") || appState.user.roles.includes("SUPPORT")) {
      return (
        <div className="icon-black">
          <span onClick={deletePopup} className="material-symbols-outlined">
            {" "}
            delete{" "}
            <CSSTransition in={isDeleting} timeout={330} classNames="liveValidateMessage" unmountOnExit>
              <div class="delete-absolute col-7">
                <div className="delete-pop liveValidateMessage-delete ml-3">
                  <DeleteModal delete={handleDelete} noDelete={deletePopup} />
                </div>
              </div>
            </CSSTransition>
          </span>
        </div>
      )
    }
  }

  useEffect(() => {
    if (state.like) {
      const ourRequest = Axios.CancelToken.source()
      async function fetchLikeCommentData() {
        try {
          if (!state.isCommentLikedByUser) {
            await Axios.post(`/api/comment/like?userId=${appState.user.id}&commentId=${state.commentId}`, {}, { headers: { Authorization: `Bearer ${appState.user.token}` } }, { cancelToken: ourRequest.token })
            appDispatch({ type: "flashMessage", value: "Comment liked successfully!", messageType: "message-green" })
            setState(draft => {
              draft.isCommentLikedByUser = true
              draft.commentLikesCount++
            })
          } else {
            await Axios.delete(`/api/comment/like?userId=${appState.user.id}&commentId=${state.commentId}`, { headers: { Authorization: `Bearer ${appState.user.token}` } }, { cancelToken: ourRequest.token })
            appDispatch({ type: "flashMessage", value: "Comment unliked successfully!", messageType: "message-green" })
            setState(draft => {
              draft.isCommentLikedByUser = false
              draft.commentLikesCount--
            })
          }
        } catch (e) {
          console.log("There was a problem or the request was cancelled." + e)
        }
      }
      fetchLikeCommentData()
      return () => {
        ourRequest.cancel()
      }
    }
  }, [state.like])

  return (
    <div className="single-topic container d-flex mt-4">
      <div className="mobile-toggle">
        <span>{props.comment.user.username}</span>
      </div>
      <div className="d-flex container">
        <div className="single-topic-content container d-flex p-2 align-items-center col-11">
          {!isEdited && (
            <div className="d-flex align-items-center container">
              {" "}
              <div id="comment-content ">{props.comment.content}</div>
              <div className="mobile-toggle-inverse">
                <div className="container"></div>
              </div>
              <div className="ml-auto mr-3">
                <span>
                  Created: {date} <span>by {props.comment.user.username}</span>
                </span>
              </div>
              {showEditAndDeleteButtons()}
            </div>
          )}
          {isEdited && (
            <form onSubmit={handleSubmit} className="d-flex ml-auto mr-auto align-items-center container">
              <div className="container">
                <input onChange={e => setContent(e.target.value)} value={content} type="text" className="container single-topic-content"></input>
                <CSSTransition in={error} timeout={330} classNames="liveValidateMessage" unmountOnExit>
                  <div className="alert alert-danger small liveValidateMessage">Comment must be at least 2 characters long</div>
                </CSSTransition>
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
          <div style={{ fontSize: "15px" }}>{state.commentLikesCount}</div>
          <a
            onClick={
              !state.isCommentOwnedByUser
                ? () =>
                    setState(draft => {
                      draft.like++
                    })
                : null
            }
          >
            <LikeButton isLiked={state.isCommentLikedByUser} isOwner={state.isCommentOwnedByUser}></LikeButton>
          </a>
        </div>
      </div>
    </div>
  )
}

export default SingleComment
