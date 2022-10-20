import React, { useEffect } from "react"
import ReactTooltip from "react-tooltip"
import { useImmer } from "use-immer"
import Axios from "axios"
import { Link } from "react-router-dom"

function Post(props) {
  const [state, setState] = useImmer({
    delete: 0,
  })

  useEffect(() => {
    if (state.delete) {
      const ourRequest = Axios.CancelToken.source()
      async function fetchData() {
        try {
          await Axios.delete(`http://localhost:8080/api/post/${props.post.id}`, { cancelToken: ourRequest.token })
          window.location.reload(true)
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

  const date = new Date(props.post.createdAt).toLocaleDateString("utc", { year: "numeric", month: "short", day: "numeric" })
  return (
    <div className="posts p-3 ml-5 mr-3 d-flex col-8">
      <div className="avatar mr-3 col-2">
        <img src="https://www.nirix.com/uploads/files/Images/general/misc-marketing/avatar-2@2x.png" />
      </div>
      <div className="post-left col-8">
        <div>
          <Link to={`post/${props.post.id}`}>
            <h1>{props.post.title}</h1>
          </Link>
          <p>
            Created by <strong>Robur</strong> {date} • bugs other
          </p>
        </div>
      </div>
      <div className="post-right col-4 align-self-center">
        Comments : <strong>3</strong>
        <ReactTooltip place="bottom" id="edit" className="custom-tooltip" />{" "}
        <Link to={`/post/edit/${props.post.id}`} data-for="edit" data-tip="Edit" className="material-symbols-outlined ml-4">
          Edit
        </Link>
        <ReactTooltip place="bottom" id="delete" className="custom-tooltip" />{" "}
        <span
          onClick={() => {
            setState((draft) => {
              draft.delete += 1
            })
          }}
          data-for="delete"
          data-tip="Delete"
          className="material-symbols-outlined ml-2 pointer"
        >
          delete
        </span>
      </div>
    </div>
  )
}

export default Post
