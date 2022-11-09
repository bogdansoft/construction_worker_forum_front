import React, { useEffect, useContext } from "react"
import ReactTooltip from "react-tooltip"
import { useImmer } from "use-immer"
import Axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"

function Topic(props) {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const [state, setState] = useImmer({
    delete: 0,
    postsSize: props.topic.posts.length
  })

  useEffect(() => {
    if (state.delete) {
      const ourRequest = Axios.CancelToken.source()

      async function fetchData() {
        try {
          await Axios.delete(`/api/topic/${props.topic.id}`, { headers: { Authorization: `Bearer ${appState.user.token}` } })
          appDispatch({ type: "flashMessage", value: "Topic succesfully deleted !", messageType: "message-green" })
          props.reload()
        } catch (e) {
          console.log("There was a problem while deleting the topic!")
        }
      }
      fetchData()
      return () => {
        ourRequest.cancel()
      }
    }
  }, [state.delete])

  const date = new Date(props.topic.createdAt).toLocaleDateString("utc", {
    year: "numeric",
    month: "short",
    day: "numeric"
  })

  return (
    <div className="single-topic container d-flex mt-4">
      <div className="single-topic-content container d-flex ml-3 p-2 align-items-center">
        <div id="topic-name">
          <Link to={`topic/${props.topic.id}`}>{props.topic.name}</Link>
        </div>
        <div className="ml-auto mr-5">
          Posts: {state.postsSize}
          <span className="ml-3">
            Created: {date} By {props.author.username}{" "}
          </span>
        </div>
      </div>
    </div>
  )
}

export default Topic
