import React, { useEffect, useContext } from "react"
import ReactTooltip from "react-tooltip"
import Axios from "axios"
import { useImmer } from "use-immer"
import { CSSTransition } from "react-transition-group"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"

function CreateCommentForm(props) {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const [state, setState] = useImmer({
    commentToAdd: {
      content: "",
      postId: props.targetId,
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
            `/api/comment`,
            {
              content: state.commentToAdd.content,
              postId: state.commentToAdd.postId,
              userId: state.commentToAdd.userId
            },
            { headers: { Authorization: `Bearer ${appState.user.token}` } },
            { cancelToken: ourRequest.token }
          )
          appDispatch({ type: "flashMessage", value: "Comment succesfully created !", messageType: "message-green" })

          if (response.data) {
            props.onSubmit(response.data)
            console.log("TUTAJ" + response.data)
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
    <div className="comments d-flex col-11 ml-auto mr-auto mt-5 align-items-center">
      <form onSubmit={handleSubmit} className="d-flex ml-auto mr-auto align-items-center container">
        <div className="container mt-3">
          <input
            onChange={e =>
              setState(draft => {
                draft.commentToAdd.hasErrors = false
                draft.commentToAdd.content = e.target.value
              })
            }
            value={state.commentToAdd.content}
            type="text"
            className="container single-topic-content p-2"
          ></input>
        </div>
        <CSSTransition in={state.commentToAdd.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
          <div className="alert alert-danger small liveValidateMessage ml-3">{state.commentToAdd.message}</div>
        </CSSTransition>
        <div className="ml-auto mr-4 mt-4">
          <button type="submit" className="material-symbols-outlined" data-tip="Send comment!" data-for="send">
            send
          </button>
          <ReactTooltip id="send" className="custom-tooltip" />
        </div>
      </form>
    </div>
  )
}

export default CreateCommentForm
