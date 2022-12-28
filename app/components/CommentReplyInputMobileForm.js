import React, { useEffect, useContext, useState, useRef } from "react"
import Axios from "axios"
import { useImmer } from "use-immer"
import { CSSTransition } from "react-transition-group"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"

function CommentReplyInputMobileForm(props) {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const [isFocused, setIsFocused] = useState(true)
  const [canBeRendered, setCanBeRendered] = useState(true)

  const [state, setState] = useImmer({
    commentToAdd: {
      content: "",
      parentCommentId: props.targetObject.id,
      postId: props.targetObject.post.id,
      userId: appState.user.id,
      listener: 0,
      sendCount: 0,
      hasErrors: false,
      message: ""
    },
    newComment: null
  })

  useEffect(() => {
    if (appState.mobileInputRenderCounter == 1) {
      setCanBeRendered(false)
    } else {
      setCanBeRendered(true)
    }
  }, [])

  useEffect(() => {
    if (isFocused && canBeRendered) {
      appDispatch({ type: "openMobileInput" })
    }
  }, [])

  useEffect(() => {
    if (state.commentToAdd.listener) {
      const ourRequest = Axios.CancelToken.source()

      async function postComment() {
        try {
          const response = await Axios.post(
            `/api/comment?commentForReplyId=${state.commentToAdd.parentCommentId}`,
            {
              content: state.commentToAdd.content,
              postId: state.commentToAdd.postId,
              userId: appState.user.id
            },
            { headers: { Authorization: `Bearer ${appState.user.token}` } },
            { cancelToken: ourRequest.token }
          )
          appDispatch({ type: "flashMessage", value: "Comment reply succesfully created !", messageType: "message-green" })

          if (response.data) {
            props.onSubmit(response.data)
          }
        } catch (e) {
          if (e.response.status === 404) {
            alert("Problem occured. Most probably this comment has been deleted. Please refresh the page.")
          }
          console.log("There was a problem or the request was cancelled." + e)
        }
      }
      setState(draft => {
        draft.commentToAdd.content = ""
      })
      postComment()
      return () => {
        ourRequest.cancel()
      }
    }
  }, [state.commentToAdd.listener])

  function handleSubmit(e) {
    e.preventDefault()
    if (state.commentToAdd.content.length < 2) {
      setState(draft => {
        draft.commentToAdd.hasErrors = true
        draft.commentToAdd.message = "Must be at least 2 characters long"
      })
      return
    }
    setState(draft => {
      draft.commentToAdd.listener++
    })
    if (!state.hasErrors) {
      appDispatch({ type: "closeMobileInput" })
      setCanBeRendered(true)
    }
  }

  if (isFocused && canBeRendered) {
    return (
      <div style={{ position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 1 }}>
        <div className="comments-reply-mobile ml-auto mr-auto mt-auto" style={{ width: window.innerWidth }}>
          <form onSubmit={handleSubmit} className="d-flex align-items-center container">
            <button
              onClick={() => {
                setIsFocused(false)
                appDispatch({ type: "closeMobileInput" })
              }}
              type="submit"
              className="material-symbols-outlined"
              style={{ fontSize: "30px", marginBottom: "5px", color: "brown" }}
            >
              cancel
            </button>
            <div className="container mt-3">
              <input
                autoFocus
                onChange={e =>
                  setState(draft => {
                    draft.commentToAdd.hasErrors = false
                    draft.commentToAdd.content = e.target.value
                  })
                }
                value={state.commentToAdd.content}
                type="text"
                className="container single-topic-content p-2"
                style={{ maxHeight: "35px", marginBottom: "15px" }}
              ></input>
            </div>
            <CSSTransition in={state.commentToAdd.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
              <div className="alert alert-danger small liveValidateMessage ml-3">{state.commentToAdd.message}</div>
            </CSSTransition>
            <div className="ml-auto mr-4 mt-4">
              <button type="submit" className="material-symbols-outlined" style={{ fontSize: "40px", marginBottom: "25px" }}>
                send
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

export default CommentReplyInputMobileForm
