import React, { useEffect, useContext } from "react"
import ReactTooltip from "react-tooltip"
import { useImmer } from "use-immer"
import Axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"

function Post(props) {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const [state, setState] = useImmer({
    delete: 0
  })

  useEffect(() => {
    if (state.delete) {
      const ourRequest = Axios.CancelToken.source()

      async function fetchData() {
        try {
          await Axios.delete(`/api/post/${props.post.id}`, { headers: { Authorization: `Bearer ${appState.user.token}` } })
          appDispatch({ type: "flashMessage", value: "Post succesfully deleted !", messageType: "message-green" })
          props.reload()
        } catch (e) {
          console.log("there was a problem deleting post")
        }
      }
      fetchData()
      return () => {
        ourRequest.cancel()
      }
    }
  }, [state.delete])

  const date = new Date(props.post.createdAt).toLocaleDateString("utc", {
    year: "numeric",
    month: "short",
    day: "numeric"
  })
  return (
    <div className="single-topic container d-flex mt-4">
      <div className="avatar">
        <span className="material-symbols-outlined"> person </span>
      </div>
      <div className="single-topic-content container d-flex ml-3 p-2 align-items-center">
        <div id="topic-name">
          <Link to={`post/${props.post.id}`}>{props.post.title}</Link>
        </div>
        <div className="ml-auto mr-5">
          Comments: 21{" "}
          <span className="ml-3">
            Created: {date} By {props.post.user.username}
          </span>
        </div>
      </div>
    </div>
  )
}

export default Post
