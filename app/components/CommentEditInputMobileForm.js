import React, { useEffect, useContext, useState, useRef } from "react"
import { CSSTransition } from "react-transition-group"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"

function CommentEditInputMobileForm(props) {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const [isFocused, setIsFocused] = useState(true)
  const [canBeRendered, setCanBeRendered] = useState(true)
  const [content, setContent] = useState(props.value)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (content.length > 2) {
      setError(false)
    }
  }, [content.length])

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

  function handleEdit(e) {
    e.preventDefault()
    if (error) {
      return
    }
    appDispatch({ type: "closeMobileInput" })
    setCanBeRendered(true)
    props.setIsMobileEdited(false)
    props.handleEditSubmit(e, content)
  }

  if (isFocused && canBeRendered) {
    return (
      <div style={{ position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 1 }}>
        <div className="comments-reply-mobile ml-auto mr-auto mt-auto" style={{ width: window.innerWidth }}>
          <form onSubmit={handleEdit} className="d-flex align-items-center container">
            <button
              onClick={() => {
                setIsFocused(false)
                appDispatch({ type: "closeMobileInput" })
                props.setIsMobileEdited(false)
              }}
              type="submit"
              className="material-symbols-outlined"
              style={{ fontSize: "30px", marginBottom: "5px", color: "brown" }}
            >
              cancel
            </button>
            <div className="container mt-3">
              <input autoFocus onChange={e => setContent(e.target.value)} value={content} type="text" className="container single-topic-content p-2" style={{ maxHeight: "35px", marginBottom: "15px" }}></input>
            </div>
            <CSSTransition in={error} timeout={330} classNames="liveValidateMessage" unmountOnExit>
              <div className="alert alert-danger small liveValidateMessage">Comment must be at least 2 characters long</div>
            </CSSTransition>
            <div className="ml-auto mr-4 mt-4">
              <button onClick={content.length <= 2 ? () => setError(true) : null} type="submit" className="material-symbols-outlined" style={{ fontSize: "40px", marginBottom: "25px" }}>
                send
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

export default CommentEditInputMobileForm
