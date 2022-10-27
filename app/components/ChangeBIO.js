import React, { useContext, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { CSSTransition } from "react-transition-group"
import { useImmerReducer } from "use-immer"
import Axios from "axios"
import StateContext from "../StateContext"

function ChangeBIO() {
  const navigate = useNavigate()
  const { username } = useParams()
  const appState = useContext(StateContext)
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
        const response = await Axios.get(`/api/user?username=${username}`, { headers: { Authorization: `Bearer ${appState.user.token}` } }, { cancelToken: ourRequest.token })
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
          const response = await Axios.post(`/api/user/${username}/changebio`, { newBio: state.body.value }, { headers: { Authorization: `Bearer ${appState.user.token}` } }, { cancelToken: ourRequest.token })
          dispatch({ type: "saveRequestFinished" })
          navigate(`/profile/${username}`)
        } catch {
          console.log("There was a problem or the request was cancelled")
        }
      }
      fetchPost()
      return () => {
        ourRequest.cancel()
      }
    }
  }, [state.sendCount])

  return (
    <>
      <div className={"container py-md-5"}>
        <div className="float-right">
          <Link className="btn btn-primary" to={`/profile/${username}`}>
            Go Back
          </Link>
        </div>
        <br />
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="post-body" className="text-muted mb-1 d-block">
              <h3 className="display-3">New BIO</h3>
            </label>
            <textarea onBlur={e => dispatch({ type: "bodyRules", value: e.target.value })} onChange={e => dispatch({ type: "bodyChange", value: e.target.value })} name="body" id="post-body" className="body-content tall-textarea form-control" type="text" value={state.body.value} />
            <CSSTransition in={state.body.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
              <div className="alert alert-danger large liveValidateMessage">{state.body.message}</div>
            </CSSTransition>
          </div>
          <button className="btn btn-primary" disabled={state.IsSaving}>
            Save Changes
          </button>
        </form>
      </div>
    </>
  )
}

export default ChangeBIO
