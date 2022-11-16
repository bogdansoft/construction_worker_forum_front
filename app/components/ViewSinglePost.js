import React, { useEffect, useState, useContext } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import ReactTooltip from "react-tooltip"
import Axios from "axios"
import { useImmer } from "use-immer"
import SingleComment from "./SingleComment"
import { CSSTransition } from "react-transition-group"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import Loading from "./Loading"
import NotFound from "./NotFound"
import LikeButton from "./LikeButton"
import RenderAvatar from "./Avatar"
import DeleteModal from "./DeleteModal"
import CreateCommentForm from "./CreateCommentForm"

function ViewSinglePost() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [post, setPost] = useState([])
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState()
  const loggedIn = Boolean(localStorage.getItem("constructionForumUserToken"))
  const appDispatch = useContext(DispatchContext)
  const appState = useContext(StateContext)
  const [isDeleting, setIsDeleting] = useState(false)
  const [state, setState] = useImmer({
    author: "",
    postLikesCount: 0,
    isPostLikedByUser: false,
    isPostOwnedByUser: false,
    isLoading: true,
    notFound: false,
    reloadCounter: 0,
    like: 0
  })

  useEffect(() => {
    appDispatch({ type: "closeSearch" })
    const ourRequest = Axios.CancelToken.source()
    async function fetchPost() {
      try {
        const response = await Axios.get(`/api/post/${id}`, { cancelToken: ourRequest.token })
        setPost(response.data)
        setState(draft => {
          draft.author = response.data.user
          draft.postLikesCount = response.data.likers.length
          draft.isPostLikedByUser = response.data.likers.filter(user => user.id == appState.user.id).length > 0
          draft.isPostOwnedByUser = response.data.user.id == appState.user.id
          draft.isLoading = false
        })
      } catch (e) {
        if (e.response.status === 404) {
          setState(draft => {
            draft.notFound = true
          })
          console.log("Resource not found.")
        } else {
          console.log("There was a problem or the request was cancelled.")
          navigate(`/`)
        }
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
        const response = await Axios.get(`/api/comment/post/${id}`, { headers: { Authorization: `Bearer ${appState.user.token}` } }, { cancelToken: ourRequest.token })
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
    if (state.like) {
      const ourRequest = Axios.CancelToken.source()
      async function fetchLikePostData() {
        try {
          if (!state.isPostLikedByUser) {
            await Axios.post(`/api/post/like?userId=${appState.user.id}&postId=${id}`, {}, { headers: { Authorization: `Bearer ${appState.user.token}` } }, { cancelToken: ourRequest.token })
            appDispatch({ type: "flashMessage", value: "Post liked successfully!", messageType: "message-green" })
            setState(draft => {
              draft.isPostLikedByUser = true
              draft.postLikesCount++
            })
          } else {
            await Axios.delete(`/api/post/like?userId=${appState.user.id}&postId=${id}`, { headers: { Authorization: `Bearer ${appState.user.token}` } }, { cancelToken: ourRequest.token })
            appDispatch({ type: "flashMessage", value: "Post unliked successfully!", messageType: "message-green" })
            setState(draft => {
              draft.isPostLikedByUser = false
              draft.postLikesCount--
            })
          }
        } catch (e) {
          console.log("There was a problem or the request was cancelled." + e)
        }
      }
      fetchLikePostData()
      return () => {
        ourRequest.cancel()
      }
    }
  }, [state.like])

  useEffect(() => {
    if (newComment) {
      console.log(newComment)
      setComments(comments.concat(newComment))
      setNewComment(null)
    }
  }, [newComment])

  async function handleDelete() {
    const ourRequest = Axios.CancelToken.source()
    try {
      await Axios.delete(`/api/post/${id}`, { headers: { Authorization: `Bearer ${appState.user.token}` } })
      appDispatch({ type: "flashMessage", value: "Post succesfully deleted !", messageType: "message-green" })
      navigate("/")
    } catch (e) {
      console.log("there was a problem deleting post" + e)
    }
    return () => {
      ourRequest.cancel()
    }
  }

  function reload() {
    setState(draft => {
      draft.reloadCounter++
    })
  }

  function deletePopup() {
    setIsDeleting(prev => !prev)
  }

  function showEditButton() {
    if (loggedIn && (appState.user.id == state.author.id || appState.user.isAdmin)) {
      return (
        <div className="d-flex flex-row ml-auto">
          <Link to={`/post/edit/${id}`} data-tip="Edit" data-for="edit" className="text-primary mr-2">
            <span className="material-symbols-outlined link-black mr-2"> edit </span>
          </Link>
          <ReactTooltip id="edit" className="custom-tooltip" />
        </div>
      )
    }
  }

  function showDeleteButton() {
    if (loggedIn && (appState.user.id == state.author.id || appState.user.isAdmin || appState.user.isSupport)) {
      return (
        <a>
          <span onClick={deletePopup} className="material-symbols-outlined link-black" data-tip="Delete" data-for="delete">
            delete
          </span>
          <CSSTransition in={isDeleting} timeout={330} classNames="liveValidateMessage" unmountOnExit>
            <div class="delete-absolute container col-5 ml-1 mt-5">
              <div className="delete-pop col-5 p-2 liveValidateMessage-delete">
                <DeleteModal delete={handleDelete} noDelete={deletePopup} relatedItemsLength={comments.length} relatedItemsType={"comment"} />
              </div>
            </div>
          </CSSTransition>
          <ReactTooltip id="delete" className="custom-tooltip" />
        </a>
      )
    }
  }

  if (state.notFound) return <NotFound />
  if (state.isLoading) return <Loading />
  return (
    <div className="main d-flex flex-column container">
      <div className="mt-5"></div>
      <Link className="text-primary medium font-weight-bold mb-3" to={`/topic/${post.topic.id}`}>
        &laquo; Back to topic [{post.topic.name}]
      </Link>
      <h2 className="d-flex ml-auto col-2">
        <text className="d-flex" style={{ fontSize: "20px", fontFamily: "Georgia" }}>
          <a style={{ fontSize: "16px", fontVariantCaps: "small-caps", marginRight: ".5rem" }}>topic: </a>
          <b className="ml-auto mr-5">{post.topic.name}</b>
        </text>
      </h2>
      <div className="content d-flex flex-column mt-4">
        <div className="content d-flex flex-row">
          <div className="profile-avatar d-flex flex-column align-items-center">
            <span className="material-symbols-outlined mr-3">
              {" "}
              <RenderAvatar isLoggedIn={false} />
            </span>
            <p className="mt-3">{post.user.username}</p>
          </div>
          <div className="post-content container mr-5">
            <div className="ml-4">
              <h5>{post.title}</h5>
              <p>{post.content}</p>
            </div>
          </div>
          {showEditButton()}
          {showDeleteButton()}
        </div>
        {loggedIn ? (
          <div>
            <div className="d-flex flex-row mt-3">
              <div className="ml-auto"></div>
              <div style={{ fontSize: "15px" }}>{state.postLikesCount}</div>
              <a
                onClick={
                  !state.isPostOwnedByUser
                    ? () =>
                        setState(draft => {
                          draft.like++
                        })
                    : null
                }
              >
                <LikeButton isLiked={state.isPostLikedByUser} isOwner={state.isPostOwnedByUser}></LikeButton>
              </a>
              <span className="material-symbols-outlined mr-3"> chat </span>
              <span className="material-symbols-outlined mr-3"> share </span>
              <span className="material-symbols-outlined mr-3"> report </span>
              <span className="material-symbols-outlined mr-3"> bookmark </span>
            </div>
          </div>
        ) : null}
      </div>
      {loggedIn ? (
        <>
          <CreateCommentForm targetId={id} onSubmit={setNewComment} />
          <div className="comments d-flex flex-column ml-auto mr-auto col-11 mt-5">{comments.length > 0 ? comments.map(comment => <SingleComment comment={comment} key={comment.id} reload={reload} />) : <div className="single-topic container d-flex mt-4">No comments yet!</div>}</div>
        </>
      ) : null}
    </div>
  )
}

export default ViewSinglePost
