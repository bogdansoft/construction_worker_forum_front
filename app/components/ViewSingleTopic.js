import React, { useEffect, useState, useContext } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import Axios from "axios"
import { useImmer } from "use-immer"
import SingleComment from "./SingleComment"
import { CSSTransition } from "react-transition-group"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import Loading from "./Loading"
import Post from "./Post"

function ViewSingleTopic(props) {
  const navigate = useNavigate()
  const { id } = useParams()
  const [topic, setTopic] = useState([])
  const [posts, setPosts] = useState([])
  const loggedIn = Boolean(localStorage.getItem("constructionForumUserToken"))
  const appDispatch = useContext(DispatchContext)
  const [state, setState] = useImmer({
    isLoading: false,
    reloadCounter: 0,
    delete: 0
  })

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()

    async function fetchTopic() {
      try {
        setState(draft => {
          draft.isLoading = true
        })
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

  if (state.isLoading) return <Loading />
  return (
    <div className="main container d-flex flex-column">
      <div className="mt-5">
        <h3 className="font-weight-bold text-left">{topic.name}</h3>
      </div>
      <div className="content container d-flex flex-column mt-4">
        <div className="d-flex flex-row">
          <div className="ml-4">
            <h4 className="font-weight-bold">Posts</h4>
          </div>
          <div className="ml-auto d-flex flex-row align-items-center">
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
          <span className="font-weight-bold text-center">There are no posts for this topic yet. Feel free to create one!</span>
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
