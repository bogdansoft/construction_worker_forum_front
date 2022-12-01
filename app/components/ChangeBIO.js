import React, { useContext, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { CSSTransition } from "react-transition-group"
import { useImmerReducer } from "use-immer"
import Axios from "axios"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"

function ChangeBIO() {
  const navigate = useNavigate()
  const { username } = useParams()
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const originalState = {
    body: {
      value: "",
      hasErrors: false,
      message: ""
    },
    IsSaving: false,
    sendCount: 0
  }

  function ourReducer(draft, action) {
    switch (action.type) {
      case "fetchComplete":
        draft.body.value = action.value.bio
        return
      case "bodyChange":
        draft.body.hasErrors = false
        draft.body.value = action.value
        return
      case "bodyRules":
        if (action.value.length < 5) {
          draft.body.hasErrors = true
          draft.body.message = "Invalid BIO. You must provide at least 5 characters"
        }
        return
      case "submitRequest":
        if (!draft.body.hasErrors) {
          draft.sendCount++
        }
        return
      case "saveRequestStarted":
        draft.IsSaving = true
        return
      case "saveRequestFinished":
        draft.IsSaving = false
        return
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, originalState)

  async function handleSubmit(e) {
    e.preventDefault()
    dispatch({ type: "bodyRules", value: state.body.value })
    dispatch({ type: "submitRequest" })
  }

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()

    async function fetchPost() {
      try {
        const response = await Axios.get(`/api/user/user?username=${username}`, { headers: { Authorization: `Bearer ${appState.user.token}` } }, { cancelToken: ourRequest.token })
        if (response.data) {
          dispatch({ type: "fetchComplete", value: response.data })
        }
      } catch (e) {
        console.log("There was a problem or the request was cancelled" + e)
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
          const response = await Axios.put(`/api/user/${username}/bio`, { newBio: state.body.value }, { headers: { Authorization: `Bearer ${appState.user.token}` } }, { cancelToken: ourRequest.token })
          dispatch({ type: "saveRequestFinished" })
          appDispatch({ type: "flashMessage", value: "Bio changed !", messageType: "message-green" })
          navigate(`/profile/${username}`)
        } catch (e) {
          console.log("There was a problem or the request was cancelled")
          console.log(e)
        }
      }
      fetchPost()
      return () => {
        ourRequest.cancel()
      }
    }
  }, [state.sendCount])

  return (
    <form onSubmit={handleSubmit}>
      <div className="main d-flex flex-column container">
        <div className="content d-flex flex-column mt-4">
          <Link className="text-primary medium font-weight-bold mb-3" to={`/profile/${username}`}>
            &laquo; Back to profile
          </Link>
          <div className="d-flex flex-row"></div>
          <label htmlFor="post-body" className="ml-3 add-post-title">
            <h3 className="display-3">New BIO</h3>
          </label>
          <div className="mt-3 ml-auto mr-auto mobile-toggle">
            <textarea onBlur={e => dispatch({ type: "bodyRules", value: e.target.value })} onChange={e => dispatch({ type: "bodyChange", value: e.target.value })} name="body" id="post-body" className="post-textarea p-2 ml-5" rows="10" cols="100" type="text" value={state.body.value} />
          </div>
          <div className="mt-3 ml-auto mr-auto mobile-toggle-inverse">
            <textarea onBlur={e => dispatch({ type: "bodyRules", value: e.target.value })} onChange={e => dispatch({ type: "bodyChange", value: e.target.value })} name="body" id="post-body" className="post-textarea p-2" rows="10" cols="40" type="text" value={state.body.value} />
          </div>
          <div className="d-flex align-items-center mt-3">
            <div className="ml-auto" disabled={state.IsSaving}>
              <button className="nav-button">Change</button>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}

export default ChangeBIO
