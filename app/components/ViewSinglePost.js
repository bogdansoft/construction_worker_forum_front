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
import RefreshButton from "./RefreshButton"

function ViewSinglePost() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [post, setPost] = useState([])
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState()
  const [refreshRequest, setRefreshRequest] = useState(false)
  const loggedIn = Boolean(localStorage.getItem("constructionForumUserToken"))
  const appDispatch = useContext(DispatchContext)
  const appState = useContext(StateContext)
  const [isDeleting, setIsDeleting] = useState(false)
  const [focus, setFocus] = useState(true)
  const [color, setColor] = useState("")
  const [state, setState] = useImmer({
    author: "",
    postLikesCount: 0,
    isPostLikedByUser: false,
    isPostOwnedByUser: false,
    isPostBookmarkedByUser: false,
    commentToAdd: {
      content: "",
      userId: localStorage.getItem("constructionForumUserId"),
      token: localStorage.getItem("constructionForumUserToken"),
      postId: id,
      listener: 0,
      sendCount: 0,
      hasErrors: false,
      message: ""
    },
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
          draft.isPostBookmarkedByUser = response.data.followers.filter(user => user.id == appState.user.id).length > 0
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
      console.log(state.isPostBookmarkedByUser)
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
        setComments(extractOnlyPrimaryComments(response.data))
        setRefreshRequest(false)
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
          appDispatch({
            type: "flashMessage",
            value: "Comment successfully created !",
            messageType: "message-green"
          })
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
          if (e.response.status === 404) {
            alert("Problem occured. Most probably this post has been deleted. Please refresh the page.")
          }
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
      setComments(comments.concat(newComment))
      setNewComment(null)
    }
  }, [newComment])

  async function changeBookmark() {
    const ourRequest = Axios.CancelToken.source()
    try {
      if (!state.isPostBookmarkedByUser) {
        await Axios.post(`/api/post/follow?userId=${appState.user.id}&postId=${id}`, {}, { headers: { Authorization: `Bearer ${appState.user.token}` } }, { cancelToken: ourRequest.token })
        appDispatch({
          type: "flashMessage",
          value: "Post bookmarked successfully!",
          messageType: "message-green"
        })
        setState(draft => {
          draft.isPostBookmarkedByUser = true
        })
      } else {
        await Axios.delete(`/api/post/follow?userId=${appState.user.id}&postId=${id}`, { headers: { Authorization: `Bearer ${appState.user.token}` } }, { cancelToken: ourRequest.token })
        appDispatch({
          type: "flashMessage",
          value: "Post unbookmarked successfully!",
          messageType: "message-green"
        })
        setState(draft => {
          draft.isPostBookmarkedByUser = false
        })
      }
    } catch (e) {
      console.log("There was a problem or the request was cancelled." + e)
    }
    return () => {
      ourRequest.cancel()
    }
  }

  useEffect(() => {
    state.isPostBookmarkedByUser ? setColor("grey") : setColor("black")
  }, [state.isPostBookmarkedByUser])

  async function handleDelete() {
    const ourRequest = Axios.CancelToken.source()
    try {
      await Axios.delete(`/api/post/${id}`, { headers: { Authorization: `Bearer ${appState.user.token}` } })
      appDispatch({ type: "flashMessage", value: "Post successfully deleted !", messageType: "message-green" })
      navigate("/")
    } catch (e) {
      console.log("there was a problem deleting post" + e)
    }
    return () => {
      ourRequest.cancel()
    }
  }

  function extractOnlyPrimaryComments(postComments) {
    return postComments.filter(comment => comment.parentComment === null)
  }

  function handleFocus(componentOnFocus) {
    setFocus(componentOnFocus)
  }

  function handleRefreshContent(shouldRefreshContent) {
    if (shouldRefreshContent) {
      setRefreshRequest(true)
      reload()
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
      const windowStyle = appState.isMobileDevice
        ? {
            position: "absolute",
            left: "90%",
            top: "90%",
            maxWidth: "75%",
            transform: "translate(-200%, 5%)",
            border: "1px solid black"
          }
        : { position: "absolute", left: "-42%", top: "-50%", border: "1px solid black" }

      return (
        <a>
          <span onClick={deletePopup} className="material-symbols-outlined link-black" data-tip="Delete" data-for="delete">
            delete
          </span>
          <CSSTransition in={isDeleting} timeout={330} classNames="liveValidateMessage" unmountOnExit>
            <div className={appState.isMobileDevice ? "delete-absolute container" : "delete-absolute container col-5 mt-2"}>
              <div className="delete-pop col-6 liveValidateMessage-delete" style={windowStyle}>
                <DeleteModal delete={handleDelete} noDelete={deletePopup} relatedItemsLength={comments.length} relatedItemsType={"primary comment"} />
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
      <div className="mobile-toggle">
        <h2 className="d-flex ml-auto col-2 mobile-toggle">
          <text className="d-flex" style={{ fontSize: "20px", fontFamily: "Georgia" }}>
            <a style={{ fontSize: "16px", fontVariantCaps: "small-caps", marginRight: ".5rem" }}>topic: </a>
            <b className="ml-auto mr-5">{post.topic.name}</b>
          </text>
        </h2>
      </div>
      <div className="content d-flex flex-column mt-4">
        <div className="content single-post-layout">
          <div className="single-post-layout-row">
            <div className="profile-avatar d-flex flex-column align-items-center">
              <Link to={`/profile/${state.author.username}`}>
                <RenderAvatar isLoggedIn={false} username={state.author.username} />{" "}
              </Link>
              <Link to={`/profile/${state.author.username}`}>
                <p className="mt-3">{post.user.username}</p>
              </Link>
            </div>
            <div className="mobile-toggle-inverse">
              <div className="d-flex flex-row ml-5">
                {showEditButton()}
                {showDeleteButton()}
              </div>
            </div>
          </div>
          <div className="post-content container mr-5">
            <h5>{post.title}</h5>
            <p>{post.content}</p>
          </div>
          <div className="mobile-toggle">
            {showEditButton()}
            {showDeleteButton()}
          </div>
        </div>
        {loggedIn ? (
          <div>
            <div className="container d-flex flex-row mt-3 ">
              <div className="d-flex keywords align-items-center">
                {post.keywords.map(keyword => (
                  <div className="mr-2" id="post-keyword">
                    {keyword.name}
                  </div>
                ))}
              </div>

              <div className="ml-auto" style={appState.isMobileDevice ? {} : {}}>
                <div className="mobile-toggle-inverse">
                  <div className="container"></div>
                </div>
                <span className={appState.isMobileDevice ? "" : "d-flex"} style={appState.isMobileDevice ? { display: "inline-block", justifyItems: "center" } : {}}>
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
                    <LikeButton isLiked={state.isPostLikedByUser} isOwner={state.isPostOwnedByUser} likesCount={state.postLikesCount}></LikeButton>
                  </a>
                  {appState.isMobileDevice ? <div>---------------</div> : null}
                  <span type="bookmarked" className="material-symbols-outlined mr-3" data-for="bookmark" style={{ color: color }} onClick={() => changeBookmark()}>
                    bookmark
                  </span>
                  <span className="material-symbols-outlined mr-3"> chat </span>
                  {appState.isMobileDevice ? <div></div> : null}
                  <span className="material-symbols-outlined mr-3"> share </span>
                  <span className="material-symbols-outlined mr-3"> report </span>
                </span>
              </div>
            </div>
          </div>
        ) : null}
      </div>
      {loggedIn ? (
        <>
          <CreateCommentForm targetId={id} onSubmit={setNewComment} handleFocus={handleFocus} />
          <div className="comments d-flex flex-column ml-auto mr-auto col-11 mt-5" style={focus ? { opacity: 0.5 } : {}}>
            <RefreshButton handleRefreshContent={handleRefreshContent} />
            {comments.length > 0 ? comments.map(comment => <SingleComment comment={comment} key={comment.id} reload={reload} parentRefreshRequest={refreshRequest} />) : <div className="single-topic container d-flex mt-4 justify-content-center">No comments yet!</div>}
          </div>
        </>
      ) : null}
    </div>
  )
}

export default ViewSinglePost
