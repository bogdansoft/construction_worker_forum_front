import React, { useEffect, useState, useContext } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { CSSTransition } from "react-transition-group"
import ReactTooltip from "react-tooltip"
import Axios from "axios"
import { useImmer } from "use-immer"
import Loading from "./Loading"
import Post from "./Post"
import DeleteModal from "./DeleteModal"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"

function ViewSingleTopic(props) {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const navigate = useNavigate()
  const [isDeleting, setIsDeleting] = useState(false)
  const { id } = useParams()
  const [topic, setTopic] = useState([])
  const [posts, setPosts] = useState([])
  const loggedIn = Boolean(localStorage.getItem("constructionForumUserToken"))
  const [state, setState] = useImmer({
    isLoading: true,
    reloadCounter: 0,
    delete: 0
  })

  useEffect(() => {
    appDispatch({ type: "closeSearch" })
    const ourRequest = Axios.CancelToken.source()
    async function fetchTopic() {
      try {
        const response = await Axios.get(`/api/topic/${id}`, { cancelToken: ourRequest.token })
        setTopic(response.data)
        setState(draft => {
          draft.isLoading = false
        })
      } catch (e) {
        console.log("There was a problem or the request was cancelled.")
      }
    }

    fetchTopic()
    return () => {
      ourRequest.cancel()
    }
  }, [id])

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()

    async function fetchPosts() {
      try {
        const response = await Axios.get(`/api/post/all_by_topicid/${id}`, { cancelToken: ourRequest.token })
        setPosts(response.data)
      } catch (e) {
        console.log("There was a problem or the request was cancelled." + e)
      }
    }

    fetchPosts()
    return () => {
      ourRequest.cancel()
    }
  }, [id, state.reloadCounter])

  function reload() {
    setState(draft => {
      draft.reloadCounter++
    })
  }

  function deletePopup() {
    setIsDeleting(prev => !prev)
  }

  async function handleDelete() {
    const ourRequest = Axios.CancelToken.source()
    try {
      await Axios.delete(`/api/topic/${id}`, { headers: { Authorization: `Bearer ${appState.user.token}` } }, { cancelToken: ourRequest.token })
      appDispatch({ type: "flashMessage", value: "Topic successfully deleted!", messageType: "message-green" })
      navigate("/")
    } catch (e) {
      console.log("There was a problem while deleting the topic", e)
    }
    return () => {
      ourRequest.cancel()
    }
  }

  function showContextDependingOnPermission() {
    if (appState.user.isAdmin || appState.user.isSupport) {
      return (
        <div className="font-weight-bold text-left">
          <span className="mr-4" style={{ fontSize: "40px" }}>
            {topic.name}
          </span>{" "}
          <Link to={`/topic/edit/${id}`} data-tip="Edit" data-for="edit" className="text-primary mr-2">
            <span className="material-symbols-outlined link-black mr-2"> edit </span>
          </Link>
          <ReactTooltip id="edit" className="custom-tooltip" />
          <span onClick={deletePopup} className="material-symbols-outlined link-black" data-tip="Delete" data-for="delete">
            delete
          </span>
          <CSSTransition in={isDeleting} timeout={330} classNames="liveValidateMessage" unmountOnExit>
            <div class="delete-absolute container">
              <div className="delete-pop col-4 ml-auto mr-auto liveValidateMessage-delete ml-3">
                <DeleteModal delete={handleDelete} noDelete={deletePopup} />
              </div>
            </div>
          </CSSTransition>
          <ReactTooltip id="delete" className="custom-tooltip" />
        </div>
      )
    }
    return (
      <div className="font-weight-bold text-left">
        <span className="mr-4" style={{ fontSize: "40px" }}>
          {topic.name}
        </span>{" "}
      </div>
    )
  }

  if (state.isLoading) return <Loading />
  return (
    <div className="main container d-flex flex-column">
      <div className="mt-5"></div>
      <Link className="text-primary medium font-weight-bold mb-3" to={`/`}>
        &laquo; Back to topics
      </Link>
      {showContextDependingOnPermission()}
      <div className="content mt-2 mr-auto p-4">{topic.description}</div>
      <div className="content container d-flex flex-column mt-4">
        <div className="d-flex flex-row">
          <div className="ml-4">
            <h4 className="font-weight-bold">Posts</h4>
          </div>
          <div className="ml-auto d-flex flex-row align-items-center">
            {loggedIn ? (
              <button className="single-topic-content p-1 mr-3" style={{ backgroundColor: "DarkBlue" }} onClick={() => navigate(`/post/create`, { state: { topic: topic } })}>
                <text data-tip="Add new post!" data-for="add-new-post">
                  New Post
                </text>
                <ReactTooltip id="add-new-post" className="custom-tooltip" />
              </button>
            ) : null}
            <select className="mr-3" name="Pagination" id="pagination">
              <option>Pagination</option>
              <option>10</option>
              <option>20</option>
              <option>30</option>
              <option>40</option>
            </select>
            <select className="mr-3" name="Sorting" id="sorting">
              <option>Sorting</option>
              <option>Alphabetically</option>
              <option>Most popular</option>
              <option>Newest</option>
              <option>Last updated</option>
            </select>
            <div className="mr-4">
              <span className="material-symbols-outlined"> tune </span>
            </div>
          </div>
        </div>
        {posts.length == 0 ? (
          <span className="font-weight-bold text-center p-5">There are no posts for this topic yet. Feel free to create one!</span>
        ) : (
          posts.map(post => {
            return <Post post={post} key={post.id} author={post.user} reload={reload} />
          })
        )}
      </div>
    </div>
  )
}

export default ViewSingleTopic
