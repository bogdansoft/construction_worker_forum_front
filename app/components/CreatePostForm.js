import React, { useContext, useEffect, useState } from "react"
import Axios from "axios"
import { useNavigate, Link, useLocation } from "react-router-dom"
import { CSSTransition } from "react-transition-group"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import Loading from "./Loading"

function CreatePost() {
  const [title, setTitle] = useState()
  const [content, setContent] = useState()
  const [topics, setTopics] = useState([])
  const [selectedTopic, setSelectedTopic] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()
  const [tags, setTags] = useState([])
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  const handleSubmit = e => {
    e.preventDefault()
    const ourRequest = Axios.CancelToken.source()

    if (!title || !content || title.length >= 50 || title.length < 3 || content.length >= 1000 || content.length < 3) {
      appDispatch({ type: "flashMessage", value: "Invalid title or content!", messageType: "message-red" })
      return
    } else if (selectedTopic === undefined) {
      appDispatch({ type: "flashMessage", value: "Please select a topic first!", messageType: "message-red" })
      return
    }

    async function fetchData() {
      try {
        const response = await Axios.post("/api/post", { title, content, userId: appState.user.id, topicId: selectedTopic.id }, { headers: { Authorization: `Bearer ${appState.user.token}` } }, { cancelToken: ourRequest.token })
        appDispatch({ type: "flashMessage", value: "Post successfully created !", messageType: "message-green" })
        navigate(`/post/${response.data.id}`)
      } catch (e) {
        console.log("There was a problem creating post")
      }
    }
    fetchData()
    return () => {
      ourRequest.cancel()
    }
  }

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()
    async function fetchTopics() {
      try {
        const response = await Axios.get("/api/topic", { cancelToken: ourRequest.token })
        setTopics(response.data)
        setIsLoading(false)
      } catch (e) {
        console.log("There was a problem fetching topics" + e.message)
      }
    }
    fetchTopics()

    if (location.state) {
      setSelectedTopic(location.state.topic)
    }

    return () => {
      ourRequest.cancel()
    }
  }, [])

  function handleCheckbox(e) {
    if (e.target.checked) {
      setTags(prev => prev.concat(e.target.value))
    } else {
      setTags(prev => prev.filter(tag => tag != e.target.value))
    }
  }

  function handleTopicSelect(e) {
    const foundTopic = topics.find(obj => {
      return obj.name === e.target.value
    })
    setSelectedTopic(foundTopic)
  }

  function showWarningIfDefaultTopicIsChanged() {
    if (location.state && location.state.topic.id != selectedTopic.id) {
      return (
        <div className="ml-auto col-4" style={{ color: "FireBrick", font: "small-caps bold 14px/30px Georgia, serif" }}>
          original topic [<a style={{ color: "Navy" }}>{location.state.topic.name}</a>] changed!
        </div>
      )
    }
  }

  if (isLoading) return <Loading />
  return (
    <form onSubmit={handleSubmit}>
      <div className="main d-flex flex-column container">
        <div className="content d-flex flex-column mt-4">
          <div className="d-flex flex-row">
            <div className="ml-3 add-post-title">
              Title: <input onChange={e => setTitle(e.target.value)} className="p-2 ml-3" type="text" />
            </div>

            <div className="ml-auto mr-5 col-2">
              <select className="mr-3" name="Topics" id="topics" onChange={e => handleTopicSelect(e)}>
                <option default>{selectedTopic ? selectedTopic.name : "Topics:"}</option>
                {topics.map(topic => {
                  if (selectedTopic && topic.id === selectedTopic.id) return
                  return <option>{topic.name}</option>
                })}
              </select>
            </div>
          </div>
          <CSSTransition in={!content} timeout={330} classNames="liveValidateMessage" unmountOnExit>
            <div className="alert alert-danger mt-3 ml-3 liveValidateMessage">Empty description!</div>
          </CSSTransition>
          {showWarningIfDefaultTopicIsChanged()}
          <div className="mt-3 ml-auto mr-auto">
            <textarea onChange={e => setContent(e.target.value)} className="post-textarea p-2 ml-5" rows="10" cols="100"></textarea>
          </div>
          <div className="d-flex align-items-center mt-3">
            <div className="d-flex mt-3">
              <span className="mr-4">Tags: </span>
              <div className="ml-2">
                <input type="checkbox" id="tag1" name="tag1" checked />
                <label for="scales">tag1</label>
              </div>
              <div className="ml-2">
                <input type="checkbox" id="tag2" name="tag2" checked />
                <label for="scales">tag2</label>
              </div>
              <div className="ml-2">
                <input type="checkbox" id="tag2" name="tag2" checked />
                <label for="scales">tag2</label>
              </div>
              <div className="ml-2">
                <input type="checkbox" id="tag3" name="tag3" checked />
                <label for="scales">tag3</label>
              </div>
              <div className="ml-2">
                <input type="checkbox" id="tag4" name="tag4" checked />
                <label for="scales">tag4</label>
              </div>
              <div className="ml-2">
                <input type="checkbox" id="tag5" name="tag5" checked />
                <label for="scales">tag5</label>
              </div>
              <div className="ml-2">
                <input type="checkbox" id="tag6" name="tag6" checked />
                <label for="scales">tag6</label>
              </div>
            </div>
            <div className="ml-auto">
              <button className="nav-button">Create</button>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}

export default CreatePost
