import React, { useEffect, useState, useContext } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import Axios from "axios"
import { useImmer } from "use-immer"
import SingleComment from "./SingleComment"
import { CSSTransition } from "react-transition-group"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import Loading from "./Loading"

function ViewSinglePost() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [post, setPost] = useState([])
  const [comments, setComments] = useState([])
  const loggedIn = Boolean(localStorage.getItem("constructionForumUserToken"))
  const appDispatch = useContext(DispatchContext)
  const [state, setState] = useImmer({
    author: "",
    commentToAdd: {
      content: "",
      userId: localStorage.getItem("constructionForumUserId"),
      token: localStorage.getItem("constructionForumUserToken"),
      postId: id,
      listener: 0,
      hasErrors: false,
      message: ""
    },
    isLoading: false,
    reloadCounter: 0,
    delete: 0
  })

  useEffect(() => {
    appDispatch({ type: "closeSearch" })
    const ourRequest = Axios.CancelToken.source()
    async function fetchPost() {
      try {
        setState(draft => {
          draft.isLoading = true
        })
        const response = await Axios.get(`/api/post/${id}`, { cancelToken: ourRequest.token })
        setPost(response.data)
        setState(draft => {
          draft.author = response.data.user
          draft.isLoading = false
        })
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
  }, [id, state.reloadCounter])

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

  useEffect(() => {
    if (state.delete) {
      const ourRequest = Axios.CancelToken.source()
      async function fetchData() {
        try {
          await Axios.delete(`/api/post/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem("constructionForumUserToken")}` } })
          appDispatch({ type: "flashMessage", value: "Post succesfully deleted !", messageType: "message-green" })
          navigate("/")
        } catch (e) {
          console.log("there was a problem deleting post" + e)
        }
      }
      fetchData()
      return () => {
        ourRequest.cancel()
      }
    }
  }, [state.delete])

  function handleSubmit(e) {
    e.preventDefault()

    setState(draft => {
      draft.commentToAdd.listener++
    })
  }

  function reload() {
    setState(draft => {
      draft.reloadCounter++
    })
  }

  if (state.isLoading) return <Loading />
  return (
    <div class="main d-flex flex-column container">
      <div class="content d-flex flex-column mt-4">
        <div class="content d-flex flex-row">
          <div class="mr-4 d-flex flex-column text-center" id="post-avatar">
            <span class="material-symbols-outlined"> person </span>
            <span> {state.author.username} </span>
          </div>
          <div class="post-content container mr-5">
            <div class="ml-4">
              <h5>{post.title}</h5>
              <p>{post.content}</p>
            </div>
          </div>
          <div class="d-flex flex-row ml-auto">
            <Link to={`/post/edit/${id}`} data-tip="Edit" data-for="edit" className="text-primary mr-2">
              <span class="material-symbols-outlined link-black mr-2"> edit </span>
            </Link>
            <span
              onClick={() =>
                setState(draft => {
                  draft.delete++
                })
              }
              class="material-symbols-outlined link-black"
            >
              {" "}
              delete{" "}
            </span>
          </div>
        </div>
        <div>
          <div class="d-flex flex-row">
            <div class="ml-auto"></div>
            <span class="material-symbols-outlined mr-3"> chat </span>
            <span class="material-symbols-outlined mr-3"> thumb_up </span>
            <span class="material-symbols-outlined mr-3"> share </span>
            <span class="material-symbols-outlined mr-3"> report </span>
            <span class="material-symbols-outlined mr-3"> bookmark </span>
          </div>
        </div>
      </div>
      {loggedIn ? (
        <>
          <div class="comments d-flex col-11 ml-auto mr-auto mt-3 align-items-center">
            <form onSubmit={handleSubmit} className="d-flex ml-auto mr-auto align-items-center container">
              <div class="container mt-3">
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
              <div className="ml-auto mr-4 mt-4">
                <button type="submit" class="material-symbols-outlined">
                  send
                </button>
              </div>
            </form>
          </div>
          <div class="comments d-flex flex-column ml-auto mr-auto col-11 mt-5">{comments.length > 0 ? comments.map(comment => <SingleComment comment={comment} key={comment.id} reload={reload} />) : <div className="single-topic container d-flex mt-4">No comments yet!</div>}</div>
        </>
      ) : null}
    </div>
  )
}

export default ViewSinglePost
