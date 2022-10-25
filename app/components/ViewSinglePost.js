import React, { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import Axios from "axios"
import { useImmer } from "use-immer"
import SingleComment from "./SingleComment"
import { CSSTransition } from "react-transition-group"
import StateContext from "../StateContext"

function ViewSinglePost() {
  const { id } = useParams()
  const [post, setPost] = useState([])
  const [comments, setComments] = useState([])
  const appState = useState(StateContext)
  const [state, setState] = useImmer({
    commentToAdd: {
      content: "",
      userId: localStorage.getItem("constructionForumUserId"),
      token: localStorage.getItem("constructionForumUserToken"),
      postId: id,
      listener: 0,
      hasErrors: false,
      message: ""
    }
  })

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()

    async function fetchPost() {
      try {
        const response = await Axios.get(`/api/post/${id}`, { cancelToken: ourRequest.token })
        setPost(response.data)
      } catch (e) {
        console.log("There was a problem or the request was cancelled.")
      }
    }

    fetchPost()
    return () => {
      ourRequest.cancel()
    }
  }, [id])

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()

    async function fetchPost() {
      try {
        const response = await Axios.get(`/api/comment/post/${id}`, { headers: { Authorization: `Bearer ${state.commentToAdd.token}` } }, { cancelToken: ourRequest.token })
        setComments(response.data)
      } catch (e) {
        console.log("There was a problem or the request was cancelled." + e)
      }
    }

    fetchPost()
    return () => {
      ourRequest.cancel()
    }
  }, [id])

  useEffect(() => {
    console.log(appState)
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
            { headers: { Authorization: `Bearer ${state.commentToAdd.token}` } },
            { cancelToken: ourRequest.token }
          )

          setComments(comments.concat(response.data))
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

    setState(draft => {
      draft.commentToAdd.listener++
    })
  }

  return (
    <div className="d-flex flex-column">
      <div className="single-post container mt-3 d-flex flex-row">
        <div className="mr-3 col-2 text-center">
          <img src="https://th.bing.com/th/id/OIP.SOJ-Oat9i6WjYQ8SoFoe4AHaHa?pid=ImgDet&rs=1" />
          <p>
            by <span className="mt-2 font-weight-bold">Robur</span>
          </p>
        </div>
        <div className="post container">
          <div className="d-flex">
            <h2>{post.title}</h2>
            <Link to={`/post/${id}/edit`} data-tip="Edit" data-for="edit" className="text-primary mr-2"></Link>
            <span className="material-symbols-outlined ml-auto align-self-center"> edit </span>
            <span className="material-symbols-outlined ml-2 align-self-center"> delete </span>
          </div>
          <p className="mt-3 col-10">{post.content}</p>
          <span className="material-symbols-outlined mt-3"> thumb_up </span>
          <span className="material-symbols-outlined ml-3"> share </span>
          <span className="material-symbols-outlined ml-3"> report </span>
        </div>
      </div>
      <div className="comments mt-5 container">
        <hr className="mb-5" />
        <form onSubmit={handleSubmit}>
          <div className="col-6 ml-auto mr-auto d-flex flex-column comment-box">
            <div className="d-flex flex-row">
              <div className="mr-3 col-2 text-center">
                <img src="https://www.nirix.com/uploads/files/Images/general/misc-marketing/avatar-2@2x.png" />
                <p className="font-weight-bold mt-2">USER</p>
              </div>
              <div className="form-grup">
                <div className="form-control">
                  <textarea
                    onChange={e =>
                      setState(draft => {
                        draft.commentToAdd.hasErrors = false
                        draft.commentToAdd.content = e.target.value
                      })
                    }
                    value={state.commentToAdd.content}
                    rows="4"
                    cols="50"
                    className="no-resize"
                  ></textarea>
                </div>
                <CSSTransition in={state.commentToAdd.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
                  <div className="alert alert-danger small liveValidateMessage ml-2">{state.commentToAdd.message}</div>
                </CSSTransition>
              </div>
            </div>
            <div className="align-self-end mt-2">
              <button className="btn btn-primary" type="submit">
                Comment
              </button>
            </div>
          </div>
        </form>
        {comments.map(comment => (
          <SingleComment comment={comment} key={comment.id} />
        ))}
      </div>
    </div>
  )
}

export default ViewSinglePost
