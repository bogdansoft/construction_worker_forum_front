import React, { useEffect, useContext } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { useImmerReducer } from "use-immer"
import Axios from "axios"
import StateContext from "../StateContext"

function EditPost() {
  const appState = useContext(StateContext)
  const navigate = useNavigate()
  const originalState = {
    title: "",
    content: "",
    isFetching: true,
    isSaving: false,
    id: useParams().id,
    userId: null,
    sendCount: 0
  }

  function ourReducer(draft, action) {
    switch (action.type) {
      case "fetchComplete":
        draft.title = action.value.title
        draft.content = action.value.content
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
        } else {
          dispatch({ type: "notFound" })
        }
      } catch (e) {
        console.log("There was a problem or the request was cancelled.")
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

      async function fetchPost() {
        try {
          console.log(state)
          const response = await Axios.put(`/api/post/${state.id}`, { title: state.title, content: state.content, userId: state.userId }, { headers: { Authorization: `Bearer ${appState.user.token}` } })
          console.log(response)
          navigate("/post")
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

  return (
    <div className="container">
      <Link className="text-primary medium font-weight-bold" to={`/post`}>
        &laquo; Back to post permalink
      </Link>

      <form onSubmit={handleSubmit}>
        <div className="form-group container mt-4 justify-content-center">
          <div className="row justify-content-center mt-4">
            <span className="d-flex justify-content-center col-2">
              <h3>Title:</h3>{" "}
            </span>{" "}
            <input onChange={e => dispatch({ type: "titleChange", value: e.target.value })} value={state.title} type="text" className="justify-content-end col-7" placeholder="title" />
          </div>
          <div className="row justify-content-center mt-4">
            <textarea onChange={e => dispatch({ type: "contentChange", value: e.target.value })} id="post-text-area" cols="100" rows="10" type="text" className="" placeholder="" value={state.content} />
          </div>
          <div className="row justify-content-center mt-4">
            <button className="row justify-content-center col-3  btn btn-success btn-rounded" type="submit">
              Edit
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default EditPost
