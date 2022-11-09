import React, { useEffect, useContext } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { useImmerReducer } from "use-immer"
import Axios from "axios"
import { CSSTransition } from "react-transition-group"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import UnauthorizedAccessView from "./UnauthorizedAccessView"
import NotFound from "./NotFound"
import Loading from "./Loading"

function EditTopic() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const navigate = useNavigate()
  const originalState = {
    name: "",
    originalName: "",
    description: "",
    isFetching: true,
    isSaving: false,
    id: useParams().id,
    userId: null,
    sendCount: 0,
    notFound: undefined
  }

  function ourReducer(draft, action) {
    switch (action.type) {
      case "fetchComplete":
        draft.name = action.value.name
        draft.originalName = action.value.name
        draft.description = action.value.description
        draft.isFetching = false
        draft.userId = appState.user.id
        return
      case "nameChange":
        draft.name = action.value
        return
      case "descriptionChange":
        draft.description = action.value
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

    async function fetchTopic() {
      try {
        const response = await Axios.get(`/api/topic/${state.id}`, { headers: { Authorization: `Bearer ${appState.user.token}` } }, { cancelToken: ourRequest.token })
        if (response.data) {
          dispatch({ type: "fetchComplete", value: response.data })
        }
      } catch (e) {
        console.log("There was a problem or the request was cancelled.")
        dispatch({ type: "notFound" })
      }
    }
    fetchTopic()
    return () => {
      ourRequest.cancel()
    }
  }, [])

  useEffect(() => {
    if (state.sendCount) {
      dispatch({ type: "saveRequestStarted" })
      const ourRequest = Axios.CancelToken.source()

      if (!(appState.user.isAdmin || appState.user.isSupport)) {
        appDispatch({ type: "flashMessage", value: "No permission to perform this action!", messageType: "message-red" })
        return
      } else if (!state.name || !state.description || state.name.length >= 50 || state.name.length < 3) {
        appDispatch({ type: "flashMessage", value: "Invalid name or description!", messageType: "message-red" })
        return
      }

      async function fetchTopic() {
        try {
          await Axios.put(`/api/topic/${state.id}`, { name: state.name, description: state.description, userId: state.userId }, { headers: { Authorization: `Bearer ${appState.user.token}` } })
          navigate(`/topic/${state.id}`)
          dispatch({ type: "saveRequestFinished" })
        } catch (e) {
          console.log("There was a problem or the request was cancelled.")
        }
      }
      fetchTopic()
      return () => {
        ourRequest.cancel()
      }
    }
  }, [state.sendCount])

  if ((state.isFetching && !appState.loggedIn) || !appState.user.isAdmin) return <UnauthorizedAccessView />
  if (state.notFound) return <NotFound />
  if (state.isFetching) return <Loading />
  return (
    <form onSubmit={handleSubmit}>
      <div className="main d-flex flex-column container">
        <Link className="text-primary medium font-weight-bold mb-3 mt-5" to={`/topic/${state.id}`}>
          &laquo; Back to topic [{state.originalName}]
        </Link>
        <div className="content d-flex flex-column mt-4">
          <div className="d-flex flex-row">
            <div className="ml-3 add-post-title">
              <text style={{ fontSize: "40px" }}>Title:</text>
              <input onChange={e => dispatch({ type: "nameChange", value: e.target.value })} value={state.name} className="p-2 ml-3" type="text" />
            </div>
          </div>
          <span className="form-group  ml-5 d-flex ">
            <CSSTransition in={!state.name || state.name.length < 3} timeout={330} classNames="liveValidateMessage" unmountOnExit>
              <div className="alert alert-danger mt-3 ml-3 liveValidateMessage">{!state.name ? "Empty title!" : "Title too short (min. 3 signs)"}</div>
            </CSSTransition>
          </span>
          <div className="mt-3 ml-auto mr-auto">
            <textarea onChange={e => dispatch({ type: "descriptionChange", value: e.target.value })} value={state.description} className="post-textarea p-2 ml-5" rows="10" cols="100"></textarea>
            <span className="form-group">
              <CSSTransition in={!state.description} timeout={330} classNames="liveValidateMessage" unmountOnExit>
                <div className="alert alert-danger mt-3 liveValidateMessage">{"Empty description!"}</div>
              </CSSTransition>
            </span>
          </div>
          <div className="d-flex align-items-center mt-3">
            <div className="ml-auto">
              <button className="nav-button">Update</button>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}

export default EditTopic
