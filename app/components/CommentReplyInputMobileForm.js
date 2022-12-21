import React, { useEffect } from "react"
import { useState } from "react"
import ReactTooltip from "react-tooltip"
import { CSSTransition } from "react-transition-group"

function CommentReplyInputMobileForm(props) {
  const [isFocused, setIsFocused] = useState(true)

  if (isFocused) {
    return (
      <div style={{ position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 1 }}>
        <div className="comments-reply-mobile ml-auto mr-auto mt-auto" style={{ width: window.innerWidth }}>
          <form className="d-flex align-items-center container">
            <div className="container mt-3">
              <input autoFocus onBlur={() => setIsFocused(false)} type="text" className="container single-topic-content p-2" style={{ maxHeight: "35px", marginBottom: "15px" }}></input>
            </div>
            <CSSTransition timeout={330} classNames="liveValidateMessage" unmountOnExit>
              <div className="alert alert-danger small liveValidateMessage ml-3"></div>
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
}

export default CommentReplyInputMobileForm
