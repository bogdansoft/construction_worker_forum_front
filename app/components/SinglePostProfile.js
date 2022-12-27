import React, { useContext, useState } from "react"
import { Link } from "react-router-dom"
import Axios from "axios"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import DeleteModal from "./DeleteModal"
import ReactTooltip from "react-tooltip"
import { CSSTransition } from "react-transition-group"

function SinglePostProfile(props) {
  const date = new Date(props.post.createdAt).toLocaleDateString("utc", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete(e) {
    e.preventDefault()
    const ourRequest = Axios.CancelToken.source()
    try {
      await Axios.delete(`/api/post/${props.post.id}`, { headers: { Authorization: `Bearer ${appState.user.token}` } })
      appDispatch({ type: "flashMessage", value: "Post succesfully deleted !", messageType: "message-green" })
      props.reload()
    } catch (e) {
      console.log("there was a problem deleting post" + e)
    }
    return () => {
      ourRequest.cancel()
    }
  }

  function deletePopup() {
    setIsDeleting((prev) => !prev)
  }

  return (
    <>
      <div className="single-item-profile container d-flex mt-3 p-2 align-items-center">
        <div id="topic-name">
          <Link to={`/post/${props.post.id}`}>{props.post.title}</Link>
        </div>
        <div className="ml-auto mr-3">
          <span className="ml-3">Created: {date}</span>
        </div>
        <div className="icon-black">
          <Link to={`/post/edit/${props.post.id}`} className="text-primary mr-2">
            <span className="material-symbols-outlined link-black" data-tip="Edit" data-for="edit">
              edit
            </span>
          </Link>
          <ReactTooltip id="edit" className="custom-tooltip" />
          <span onClick={deletePopup} className="material-symbols-outlined link-black" data-tip="Delete" data-for="delete">
            delete
          </span>

          <CSSTransition in={isDeleting} timeout={330} classNames="liveValidateMessage" unmountOnExit>
            <div className="delete-absolute container col-5 mt-2">
              <div className="delete-pop delete-profile col-5 p-2 liveValidateMessage-delete">
                <DeleteModal delete={handleDelete} noDelete={deletePopup} relatedItemsLength={props.comments} relatedItemsType={"comment"} />
              </div>
            </div>
          </CSSTransition>
          <ReactTooltip id="delete" className="custom-tooltip" />
        </div>
      </div>
    </>
  )
}

export default SinglePostProfile
