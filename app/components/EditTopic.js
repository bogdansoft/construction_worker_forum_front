import React, { useEffect, useContext } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { useImmerReducer } from "use-immer"
import Axios from "axios"
import StateContext from "../StateContext"

function EditTopic() {
  const appState = useContext(StateContext)
  const navigate = useNavigate()
  const originalState = {
    name: "",
    description: "",
    isFetching: true,
    isSaving: false,
    id: useParams().id,
    userId: null,
    sendCount: 0
  }

  function ourReducer(draft, action) {
    switch (action.type) {
      case "fetchComplete":
        draft.name = action.value.name
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
        } else {
          dispatch({ type: "notFound" })
        }
      } catch (e) {
        console.log("There was a problem or the request was cancelled.")
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

      async function fetchTopic() {
        try {
          console.log(state)
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

  return (
    <form onSubmit={handleSubmit}>
      <div className="main d-flex flex-column container">
        <div className="content d-flex flex-column mt-4">
          <Link className="text-primary medium font-weight-bold mb-3" to={`/topic/${state.id}`}>
            &laquo; Back to topic
          </Link>
          <div className="d-flex flex-row">
            <div className="ml-3 add-post-title">
              Name: <input onChange={e => dispatch({ type: "nameChange", value: e.target.value })} value={state.name} className="p-2 ml-3" type="text" />
            </div>
          </div>
          <div className="mt-3 ml-auto mr-auto">
            <textarea onChange={e => dispatch({ type: "descriptionChange", value: e.target.value })} value={state.description} className="post-textarea p-2 ml-5" rows="10" cols="100"></textarea>
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
