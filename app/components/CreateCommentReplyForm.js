import React, { useEffect, useContext } from "react"
import ReactTooltip from "react-tooltip"
import Axios from "axios"
import { useImmer } from "use-immer"
import { CSSTransition } from "react-transition-group"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"

function CreateCommentReplyForm(props) {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
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
  }

  return (
    <div className="p-2 ml-4" style={{ height: "100px" }}>
      <div className="comments-reply mr-auto ml-auto mt-auto" style={{ width: "600px" }}>
        <form onSubmit={handleSubmit} className="d-flex ml-auto mr-auto align-items-center container">
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
            <button type="submit" className="material-symbols-outlined" data-tip="Send reply!" data-for="send" style={{ fontSize: "40px", marginBottom: "25px" }}>
              send
            </button>
            <ReactTooltip id="send" className="custom-tooltip" />
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateCommentReplyForm
