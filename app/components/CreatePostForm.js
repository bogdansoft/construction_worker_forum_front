import React, { useContext, useEffect, useState } from "react"
import Axios from "axios"
import { useNavigate, Link, useLocation } from "react-router-dom"
import { CSSTransition } from "react-transition-group"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import Loading from "./Loading"
import UnauthorizedAccessView from "./UnauthorizedAccessView"

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
        <div className="ml-auto" style={{ color: "FireBrick", font: "small-caps bold 14px/30px Georgia, serif" }}>
          original topic [<a style={{ color: "Navy" }}>{location.state.topic.name}</a>] changed!
        </div>
      )
    }
  }

  if (!appState.loggedIn) {
    return <UnauthorizedAccessView />
  } else if (isLoading) {
    return <Loading />
  }
  return (
    <form onSubmit={handleSubmit}>
      <div className="main d-flex flex-column container">
        <div className="content d-flex flex-column mt-4">
          <div className="d-flex flex-row">
            <div>
              {" "}
              <div className="ml-3 add-post-title">
                Title: <input onChange={e => setTitle(e.target.value)} className="p-2 ml-3" type="text" />
              </div>
              <span className="form-group ml-5 d-flex" style={{ fontSize: "13px" }}>
                <CSSTransition in={!title || title.length < 3 || title.length > 50} timeout={330} classNames="liveValidateMessage" unmountOnExit>
                  <div className="alert alert-danger mt-2 ml-5 liveValidateMessage">{!title || title.length > 50 ? "Empty title or too long (max. 50 sings)" : "Title too short (min. 3 signs)"}</div>
                </CSSTransition>
              </span>
            </div>
            <div className="mt-1 ml-auto">
              <select className="mr-3" name="Topics" id="topics" onChange={e => handleTopicSelect(e)}>
                <option default>{selectedTopic ? selectedTopic.name : "Topics:"}</option>
                {topics.map(topic => {
                  if (selectedTopic && topic.id === selectedTopic.id) return
                  return <option>{topic.name}</option>
                })}
              </select>
            </div>
          </div>
          {showWarningIfDefaultTopicIsChanged()}
          <div className="mt-3 ml-auto mr-auto">
            <textarea onChange={e => setContent(e.target.value)} className="post-textarea p-2 ml-5" rows="10" cols="100"></textarea>
          </div>
          <span className="form-group ml-5 d-flex" style={{ fontSize: "13px" }}>
            <CSSTransition in={!content || content.length > 1000} timeout={330} classNames="liveValidateMessage" unmountOnExit>
              <div className="alert alert-danger ml-5 liveValidateMessage">{"Empty description or too long (max. 1000 signs)"}</div>
            </CSSTransition>
          </span>
          <div className="d-flex  flex-colum mt-3">
            <div>
              <div className="d-flex mt-3 d-flex">
                <span className="mr-4">Tags: </span>
                <div className="ml-2">
                  <input
                    type="checkbox"
                    onClick={e => {
                      handleCheckbox(e)
                    }}
                    id="tag1"
                    value="tag1"
                    name="tags"
                    className="mr-1"
                  />
                  <label htmlFor="scales"> tag1</label>
                </div>
                <div className="ml-2">
                  <input type="checkbox" onClick={e => handleCheckbox(e)} value="tag2" id="tag2" name="tags" className="mr-1" />
                  <label htmlFor="scales"> tag2</label>
                </div>
                <div className="ml-2">
                  <input type="checkbox" onClick={e => handleCheckbox(e)} value="tag3" id="tag3" name="tags" className="mr-1" />
                  <label htmlFor="scales"> tag3</label>
                </div>
                <div className="ml-2">
                  <input type="checkbox" onClick={e => handleCheckbox(e)} value="tag4" id="tag4" name="tags" className="mr-1" />
                  <label htmlFor="scales"> tag4</label>
                </div>
              </div>
              <div>
                <p>
                  Selected:{" "}
                  {tags.map(tag => (
                    <span className="mr-2">{"• " + tag}</span>
                  ))}
                </p>
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
