import React, { useState, useContext, useRef, useEffect } from "react"
import Axios from "axios"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import DeleteModal from "./DeleteModal"
import { CSSTransition } from "react-transition-group"
import { useImmer } from "use-immer"
import LikeButton from "./LikeButton"
import { Link } from "react-router-dom"
import ReactTooltip from "react-tooltip"
import RenderAvatar from "./Avatar"
import CreateCommentReplyForm from "./CreateCommentReplyForm"
import { Button } from "antd"
import RefreshButton from "./RefreshButton"
import { rgbToHex } from "@material-ui/core"

function SingleComment(props) {
  const ref = useRef(null)
  const appDispatch = useContext(DispatchContext)
  const appState = useContext(StateContext)
  const [isEdited, setIsEdited] = useState(false)
  const [isReplied, setIsReplied] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [content, setContent] = useState(props.comment.content)
  const [subComments, setSubComments] = useState([])
  const [newSubComment, setNewSubComment] = useState()
  const [error, setError] = useState(false)
  const [maxWidth, setMaxWidth] = useState()
  const [isPrimaryComment, setIsPrimaryComment] = useState(props.comment.parentComment === null)
  const [isInitialSubCommentsFetching, setIsInitialSubCommentsFetching] = useState(true)
  const [refreshRequest, setRefreshRequest] = useState(false)
  const token = localStorage.getItem("constructionForumUserToken")
  const date = new Date(props.comment.createdAt).toLocaleDateString("utc", {
    year: "numeric",
    month: "short",
    day: "numeric"
  })

  const [state, setState] = useImmer({
    commentId: props.comment.id,
    postId: props.comment.post.id,
    commentLikesCount: props.comment.likers.length,
    isCommentLikedByUser: props.comment.likers.filter(user => user.id == appState.user.id).length > 0,
    isCommentOwnedByUser: props.comment.user.id == appState.user.id,
    subCommentsQuantity: props.comment.subCommentsQuantity,
    loadSubComments: 0,
    reloadCounter: 0,
    like: 0
  })

  async function handleDelete() {
    const ourRequest = Axios.CancelToken.source()
    try {
      const userId = props.comment.user.id
      const response = await Axios.delete(`/api/comment/${props.comment.id}`, { headers: { Authorization: `Bearer ${appState.user.token}` }, params: { userId } }, { cancelToken: ourRequest.token })
      appDispatch({ type: "flashMessage", value: "Comment succesfully deleted !", messageType: "message-green" })
      props.reload()
      if (!isPrimaryComment && response.status === 200) props.handleSubCommentDelete(props.comment.id)
    } catch (e) {
      if (e.response.status === 404) {
        alert("Problem occured. Most probably this comment has been deleted. Please refresh the page.")
      }
      console.log("There was a problem or the request was cancelled.")
    }

    return () => {
      ourRequest.cancel()
    }
  }

  async function handleEditSubmit(e) {
    e.preventDefault()
    if (content.length <= 2) {
      setError(true)
      return
    }
    const ourRequest = Axios.CancelToken.source()
    try {
      const response = await Axios.put(
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
      if (!isPrimaryComment && response.status === 200) props.handleSubCommentEdit(props.comment.id, content)
    } catch (e) {
      console.log("There was a problem or the request was cancelled." + e)
    }
    return () => {
      ourRequest.cancel()
    }
  }

  function handleSubCommentEdit(subCommentId, subCommentNewContent) {
    if (isPrimaryComment) {
      subComments.filter(comment => comment.id === subCommentId).at(0).content = subCommentNewContent
    }
  }

  function handleSubCommentDelete(subCommentId) {
    if (isPrimaryComment) {
      const updatedSubCommentsList = subComments.filter(comment => comment.id != subCommentId)
      setSubComments(updatedSubCommentsList)
      setState(draft => {
        draft.subCommentsQuantity > 0 ? draft.subCommentsQuantity-- : null
      })
    }
  }

  function handleSubCommentLike(operationType, subCommentId) {
    if (isPrimaryComment) {
      const subComment = subComments.filter(comment => comment.id === subCommentId).at(0)
      if (operationType === true) {
        const id = appState.user.id
        const username = appState.user.username
        subComment.likers = subComment.likers.concat({ id, username })
      } else {
        const updatedSubCommentLikersList = subComment.likers.filter(liker => liker.id != appState.user.id)
        subComment.likers = updatedSubCommentLikersList
      }
    }
  }

  function handleRefreshContent(shouldRefreshContent) {
    if (isPrimaryComment && shouldRefreshContent) {
      setRefreshRequest(true)
      reload()
    }
  }

  function reload() {
    setState(draft => {
      draft.reloadCounter++
    })
  }

  function handleUpdate() {
    setIsEdited(prevState => !prevState)
    reload()
    setError(false)
  }

  function handleReply() {
    setIsReplied(prevState => !prevState)
    setError(false)
  }

  function deletePopup() {
    setIsDeleting(prevState => !prevState)
    reload()
  }

  function showDeleteButton() {
    if (appState.user.id == props.comment.user.id || appState.user.isAdmin || appState.user.isSupport)
      return (
        <div className="icon-black">
          <span onClick={deletePopup} data-for="deleteComment" data-tip="delete comment" className="material-symbols-outlined">
            delete
            <CSSTransition in={isDeleting} timeout={330} classNames="liveValidateMessage" unmountOnExit>
              <div class="delete-absolute col-7">
                <div className="delete-pop liveValidateMessage-delete ml-3">
                  <DeleteModal delete={handleDelete} noDelete={() => false} relatedItemsLength={state.subCommentsQuantity} relatedItemsType={"sub-comment"} />
                </div>
              </div>
            </CSSTransition>
          </span>
          <ReactTooltip id="deleteComment" className="custom-tooltip" />
        </div>
      )
  }

  function showEditButton() {
    if (appState.user.id == props.comment.user.id) {
      return (
        <div className="icon-black" data-for="edit" data-tip="edit comment">
          <span onClick={handleUpdate} className="material-symbols-outlined">
            edit
          </span>
          <ReactTooltip id="edit" className="custom-tooltip" />
        </div>
      )
    }
  }

  function showReplyButton() {
    if (isPrimaryComment)
      return (
        <div className="icon-black" data-for="reply" data-tip="reply to comment">
          <span onClick={handleReply} className="material-symbols-outlined">
            reply
          </span>
          <ReactTooltip id="reply" className="custom-tooltip" />
        </div>
      )
  }

  function getSubCommentStyle() {
    return {
      maxWidth: maxWidth - 100
    }
  }

  useEffect(() => {
    if (state.subCommentsQuantity == 0) {
      setState(draft => {
        draft.loadSubComments = 0
      })
    }
  }, [state.subCommentsQuantity])

  useEffect(() => {
    if (isPrimaryComment && ref.current) setMaxWidth(ref.current.getBoundingClientRect().width)
  }, [])

  useEffect(() => {
    setState(draft => {
      draft.commentLikesCount = props.comment.likers.length
    })
  }, [props.comment.likers.length])

  useEffect(() => {
    if (newSubComment) {
      setSubComments(subComments.concat(newSubComment))
      setNewSubComment(null)
      setIsReplied(false)
      setState(draft => {
        draft.loadSubComments++
        draft.subCommentsQuantity++
      })
    }
  }, [newSubComment])

  useEffect(() => {
    if ((isPrimaryComment && state.subCommentsQuantity > 0 && state.loadSubComments && isInitialSubCommentsFetching) || refreshRequest) {
      const ourRequest = Axios.CancelToken.source()

      async function fetchSubCommentsData() {
        try {
          const response = await Axios.get(`/api/comment/all_by_parent_id/${state.commentId}`, { headers: { Authorization: `Bearer ${appState.user.token}` } }, { cancelToken: ourRequest.token })
          setSubComments(response.data)
          setState(draft => {
            draft.subCommentsQuantity = response.data.length
          })
          setIsInitialSubCommentsFetching(false)
          setRefreshRequest(false)
        } catch (e) {
          console.log("There was a problem or the request was cancelled." + e)
        }
      }

      fetchSubCommentsData()
      return () => {
        ourRequest.cancel()
      }
    }
  }, [state.loadSubComments, state.reloadCounter])

  useEffect(() => {
    if (state.like) {
      const ourRequest = Axios.CancelToken.source()
      async function fetchLikeCommentData() {
        try {
          if (!state.isCommentLikedByUser) {
            const response = await Axios.post(`/api/comment/like?userId=${appState.user.id}&commentId=${state.commentId}`, {}, { headers: { Authorization: `Bearer ${appState.user.token}` } }, { cancelToken: ourRequest.token })
            appDispatch({ type: "flashMessage", value: "Comment liked successfully!", messageType: "message-green" })
            setState(draft => {
              draft.isCommentLikedByUser = true
              draft.commentLikesCount++
            })
            if (!isPrimaryComment && response.status === 201) props.handleSubCommentLike(true, state.commentId)
          } else {
            const response = await Axios.delete(`/api/comment/like?userId=${appState.user.id}&commentId=${state.commentId}`, { headers: { Authorization: `Bearer ${appState.user.token}` } }, { cancelToken: ourRequest.token })
            appDispatch({ type: "flashMessage", value: "Comment unliked successfully!", messageType: "message-green" })
            setState(draft => {
              draft.isCommentLikedByUser = false
              draft.commentLikesCount--
            })
            if (!isPrimaryComment && response.status === 200) props.handleSubCommentLike(false, state.commentId)
          }
        } catch (e) {
          if (e.response.status === 404) {
            alert("Problem occured. Most probably this comment has been deleted. Please refresh the page.")
          }
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
    <div>
      <div ref={ref} className="single-topic container d-flex mt-4">
        <div className="profile-avatar">
          <div className="material-symbols-outlined mr-3"></div>
        </div>

        <div className="mobile-toggle">
          <Link to={`/profile/${props.comment.user.username}`}>
            <span>{props.comment.user.username}</span>
          </Link>
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
                {showReplyButton()}
                {showEditButton()}
                {showDeleteButton()}
              </div>
            )}
            {isEdited && (
              <form onSubmit={handleEditSubmit} className="d-flex ml-auto mr-auto align-items-center container">
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
      {isReplied && (
        <div className="ml-5 col-11">
          <CreateCommentReplyForm targetObject={props.comment} onSubmit={setNewSubComment} />
        </div>
      )}
      {state.subCommentsQuantity > 0 && (
        <div className="p-1">
          <Button
            className="btn d-flex ml-auto mr-auto sub-comment-button"
            onClick={
              !state.loadSubComments
                ? () =>
                    setState(draft => {
                      draft.loadSubComments++
                    })
                : () =>
                    setState(draft => {
                      draft.loadSubComments--
                    })
            }
          >
            {state.loadSubComments ? "Hide sub-comments" : "Show sub-comments"}
          </Button>
        </div>
      )}
      {state.loadSubComments > 0 && (
        <div className="comments-reply-list" style={getSubCommentStyle()}>
          <RefreshButton handleRefreshContent={handleRefreshContent} />
          {subComments.map(subComment => (
            <SingleComment comment={subComment} key={subComment.id} reload={reload} handleSubCommentEdit={handleSubCommentEdit} handleSubCommentDelete={handleSubCommentDelete} handleSubCommentLike={handleSubCommentLike} />
          ))}
        </div>
      )}
    </div>
  )
}

export default SingleComment
