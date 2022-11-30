import React, { useEffect, useContext, useState } from "react"
import ReactTooltip from "react-tooltip"
import Axios from "axios"
import { Link } from "react-router-dom"
import { CSSTransition } from "react-transition-group"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import RenderAvatar from "./Avatar"
import DeleteModal from "./DeleteModal"

function Post(props) {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const [isDeleting, setIsDeleting] = useState(false)

  const date = new Date(props.post.createdAt).toLocaleDateString("utc", {
    year: "numeric",
    month: "short",
    day: "numeric"
  })

  async function handleDelete() {
    const ourRequest = Axios.CancelToken.source()
    try {
      await Axios.delete(`/api/post/${props.post.id}`, { headers: { Authorization: `Bearer ${appState.user.token}` } })
      appDispatch({ type: "flashMessage", value: "Post successfully deleted !", messageType: "message-green" })
      props.reload()
    } catch (e) {
      console.log("there was a problem deleting post")
    }
    return () => {
      ourRequest.cancel()
    }
  }

  function deletePopup() {
    setIsDeleting(prev => !prev)
  }

  function showEditButton() {
    if (appState.loggedIn && (appState.user.id == props.post.user.id || appState.user.isAdmin)) {
      return (
        <div>
          <Link to={`/post/edit/${props.post.id}`} data-tip="Edit" data-for="edit" className="text-primary mr-2">
            <span class="material-symbols-outlined link-black"> edit </span>
          </Link>
          <ReactTooltip id="edit" className="custom-tooltip" />
        </div>
      )
    }
  }

  function showDeleteButton() {
    if (appState.loggedIn && (appState.user.id == props.post.user.id || !appState.user.isUser)) {
      return (
        <a>
          <span onClick={deletePopup} className="material-symbols-outlined link-black mr-2" data-tip="Delete" data-for="delete">
            delete
          </span>
          <CSSTransition in={isDeleting} timeout={330} classNames="liveValidateMessage" unmountOnExit>
            <div class="delete-absolute container col-5 ml-1 mt-5">
              <div className="delete-pop col-5 p-2 liveValidateMessage-delete">
                <DeleteModal delete={handleDelete} noDelete={deletePopup} relatedItemsLength={props.post.comments.length} relatedItemsType={"comment"} />
              </div>
            </div>
          </CSSTransition>
          <ReactTooltip id="delete" className="custom-tooltip" />
        </a>
      )
    }
  }

  return (
    <div className="single-topic container d-flex mt-4">
      <div className="profile-avatar mobile-toggle">
        <span className="material-symbols-outlined mr-3">
          {" "}
          <RenderAvatar isLoggedIn={false} />{" "}
        </span>
      </div>
      <div className="single-topic-content container d-flex ml-3 p-2 align-items-center">
        <div className="d-flex flex-row container">
          <div id="topic-name">
            <Link to={`/post/${props.post.id}`}>
              <h4>{props.post.title}</h4>
            </Link>
          </div>
          <div className="mobile-toggle-inverse ml-auto">
            <div className="d-flex">
              {showEditButton()}
              {showDeleteButton()}
            </div>
          </div>
        </div>
        <div className="container ml-auto mr-5">
          Comments: {props.post.comments.length}{" "}
          <span className="ml-3">
            Created: {date} By {props.author.username}
          </span>
        </div>
        <div className="mobile-toggle">
          {showEditButton()}
          {showDeleteButton()}
        </div>
      </div>
    </div>
  )
}

export default Post
