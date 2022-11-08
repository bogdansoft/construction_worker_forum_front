import React, { useContext, useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { CSSTransition } from "react-transition-group"
import { useImmerReducer } from "use-immer"
import Axios from "axios"
import StateContext from "../StateContext"
import Loading from "./Loading"
import DispatchContext from "../DispatchContext"
import UnauthorizedAccessView from "./UnauthorizedAccessView"
import ShowAuthor from "./ShowAuthor"

function EditPost() {
  const appState = useContext(StateContext)
  const navigate = useNavigate()
  const [topics, setTopics] = useState([])
  const [selectedTopic, setSelectedTopic] = useState()
  const appDispatch = useContext(DispatchContext)

  const originalState = {
    title: "",
    originalTitle: "",
    content: "",
    postAuthor: undefined,
    topic: undefined,
    isFetching: true,
    isSaving: false,
    id: useParams().id,
    userId: undefined,
    sendCount: 0,
    hasTitleErrors: false,
    hasContentErrors: false,
    massage: ""
  }

  function ourReducer(draft, action) {
    switch (action.type) {
      case "fetchComplete":
        draft.title = action.value.title
        draft.originalTitle = action.value.title
        draft.content = action.value.content
        draft.postAuthor = action.value.user
        draft.topic = action.value.topic
        draft.isFetching = false
        draft.userId = appState.user.id
        return
      case "titleChange":
        draft.title = action.value
        return
      case "contentChange":
        draft.content = action.value
        return
      case "submitRequest":
        draft.sendCount++
        return
      case "saveRequestStarted":
        draft.isSaving = true
        return
      case "saveRequestFinished":
        draft.isSaving = false
        return
      case "notFound":
        draft.notFound = true
        return
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, originalState)

  function handleSubmit(e) {
    e.preventDefault()
    dispatch({ type: "submitRequest" })
  }

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()

    async function fetchPost() {
      try {
        const response = await Axios.get(`/api/post/${state.id}`, { headers: { Authorization: `Bearer ${appState.user.token}` } }, { cancelToken: ourRequest.token })
        if (response.data) {
          dispatch({ type: "fetchComplete", value: response.data })
          setSelectedTopic(response.data.topic)
        } else {
          dispatch({ type: "notFound" })
        }
      } catch (e) {
        console.log("There was a problem or the request was cancelled." + e)
      }
    }

    fetchPost()
    return () => {
      ourRequest.cancel()
    }
  }, [])

  useEffect(() => {
    if (state.sendCount) {
      dispatch({ type: "saveRequestStarted" })
      const ourRequest = Axios.CancelToken.source()

      if (!state.title || state.title.length >= 50 || state.title.length < 3) {
        appDispatch({ type: "flashMessage", value: "Invalid title", messageType: "message-red" })
        return
      } else if (!state.content || state.content.length >= 1000 || state.content.length < 3) {
        appDispatch({ type: "flashMessage", value: "Invalid content", messageType: "message-red" })
        return
      }

      async function fetchPost() {
        try {
          await Axios.put(
            `/api/post/${state.id}`,
            {
              title: state.title,
              content: state.content,
              userId: state.userId,
              topicId: selectedTopic.id
            },
            { headers: { Authorization: `Bearer ${appState.user.token}` } }
          )
          navigate(`/post/${state.id}`)
          dispatch({ type: "saveRequestFinished" })
        } catch (e) {
          console.log("There was a problem or the request was cancelled.")
        }
      }

      fetchPost()
      return () => {
        ourRequest.cancel()
      }
    }
  }, [state.sendCount])

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()

    async function fetchTopics() {
      try {
        const response = await Axios.get("/api/topic", { cancelToken: ourRequest.token })
        setTopics(response.data)
      } catch (e) {
        console.log("There was a problem fetching topics" + e.message)
      }
    }

    fetchTopics()
    return () => {
      ourRequest.cancel()
    }
  }, [])

  function handleTopicSelect(e) {
    const foundTopic = topics.find(obj => {
      return obj.name === e.target.value
    })
    setSelectedTopic(foundTopic)
  }

  function showWarningIfDefaultTopicIsChanged() {
    if (state.topic.id !== selectedTopic.id) {
      return (
        <div className="ml-auto" style={{ color: "FireBrick", font: "small-caps bold 14px/30px Georgia, serif" }}>
          original topic [<a style={{ color: "Navy" }}>{state.topic.name}</a>] changed!
        </div>
      )
    }
  }

  if (!appState.loggedIn) {
    return <UnauthorizedAccessView />
  } else if (state.isFetching) {
    return <Loading />
  }
  return (
    <form onSubmit={handleSubmit}>
      <div className="main d-flex flex-column container">
        <div className="content d-flex flex-column mt-4">
          <div className="p-2">
            <Link className="text-primary medium font-weight-bold mb-3" to={`/post/${state.id}`}>
              &laquo; Back to post [{state.originalTitle}]
            </Link>
            <ShowAuthor contentAuthor={state.postAuthor} onlyForAdmin={true} />
          </div>
          <div className="d-flex flex-row mt-2">
            <div className="ml-3 add-post-title">
              Title: <input onChange={e => dispatch({ type: "titleChange", value: e.target.value })} value={state.title} className="p-2 ml-3" type="text" />
            </div>
            <div className="mt-1 ml-auto">
              <select className="mr-3" name="Topics" id="topics" onChange={e => handleTopicSelect(e)}>
                <option default>{state.topic.name}</option>
                {topics.map(topic => {
                  if (topic.id === state.topic.id) return
                  return <option>{topic.name}</option>
                })}
              </select>
            </div>
          </div>
          <span className="form-group ml-5 d-flex" style={{ fontSize: "13px" }}>
            <CSSTransition in={!state.title || state.title.length < 3 || state.title.length > 50} timeout={330} classNames="liveValidateMessage" unmountOnExit>
              <div className="alert alert-danger mt-2 ml-5 liveValidateMessage">{!state.title || state.title.length > 50 ? "Empty title or too long (max. 50 sings)" : "Title too short (min. 3 signs)"}</div>
            </CSSTransition>
          </span>
          {showWarningIfDefaultTopicIsChanged()}
          <div className="mt-3 ml-auto mr-auto">
            <textarea onChange={e => dispatch({ type: "contentChange", value: e.target.value })} value={state.content} className="post-textarea p-2 ml-5" rows="10" cols="100"></textarea>
          </div>
          <span className="form-group ml-5 d-flex" style={{ fontSize: "13px" }}>
            <CSSTransition in={!state.content || state.content.length > 1000} timeout={330} classNames="liveValidateMessage" unmountOnExit>
              <div className="alert alert-danger ml-5 liveValidateMessage">{"Empty description or too long (max. 1000 signs)"}</div>
            </CSSTransition>
          </span>
          <div className="d-flex align-items-center mt-3">
            <div className="d-flex mt-3">
              <span className="mr-4">Tags: </span>
              <div className="ml-2">
                <input type="checkbox" id="tag1" name="tag1" checked />
                <label htmlFor="scales">tag1</label>
              </div>
              <div className="ml-2">
                <input type="checkbox" id="tag2" name="tag2" checked />
                <label htmlFor="scales">tag2</label>
              </div>
              <div className="ml-2">
                <input type="checkbox" id="tag2" name="tag2" checked />
                <label htmlFor="scales">tag2</label>
              </div>
              <div className="ml-2">
                <input type="checkbox" id="tag3" name="tag3" checked />
                <label htmlFor="scales">tag3</label>
              </div>
              <div className="ml-2">
                <input type="checkbox" id="tag4" name="tag4" checked />
                <label htmlFor="scales">tag4</label>
              </div>
              <div className="ml-2">
                <input type="checkbox" id="tag5" name="tag5" checked />
                <label htmlFor="scales">tag5</label>
              </div>
              <div className="ml-2">
                <input type="checkbox" id="tag6" name="tag6" checked />
                <label htmlFor="scales">tag6</label>
              </div>
            </div>
            <div className="ml-auto">
              <button className="nav-button">Update</button>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}

export default EditPost
