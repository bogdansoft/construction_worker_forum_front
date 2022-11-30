import React, { useState, useContext } from "react"
import Axios from "axios"
import { useNavigate, Link } from "react-router-dom"
import { CSSTransition } from "react-transition-group"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import { useEffect } from "react"

function CreateTopicForm() {
  const [name, setName] = useState()
  const [description, setDescription] = useState()
  const navigate = useNavigate()
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  const handleSubmit = e => {
    e.preventDefault()
    const ourRequest = Axios.CancelToken.source()

    if (!name || !description || name.length >= 50 || name.length < 3) {
      appDispatch({ type: "flashMessage", value: "Invalid name or description!", messageType: "message-red" })
      return
    }

    async function fetchData() {
      try {
        const response = await Axios.post("/api/topic", { name, description, userId: appState.user.id }, { headers: { Authorization: `Bearer ${appState.user.token}` } }, { cancelToken: ourRequest.token })
        appDispatch({ type: "flashMessage", value: "Topic successfully created !", messageType: "message-green" })
        navigate(`/topic/${response.data.id}`)
      } catch (e) {
        console.log("There was a problem creating topic " + e.message)
      }
    }
    fetchData()
    return () => {
      ourRequest.cancel()
    }
  }

  useEffect(() => {
    appDispatch({ type: "toggleMenu" })
  }, [])

  // if (!appState.loggedIn || !appState.user.isAdmin) return <UnauthorizedAccessView />
  return (
    <form onSubmit={handleSubmit}>
      <div className="main d-flex flex-column container create-post">
        <div className=" content d-flex flex-column mt-4">
          <div className="d-flex flex-row">
            <div>
              <div className="ml-3 add-post-title">
                Title: <input onChange={e => setName(e.target.value)} type="text" />
              </div>
              <span className="form-group ml-5 d-flex" style={{ fontSize: "13px" }}>
                <CSSTransition in={!name || name.length < 3 || name.length > 50} timeout={330} classNames="liveValidateMessage" unmountOnExit>
                  <div className="alert alert-danger mt-2 ml-5 liveValidateMessage">{!name || name.length > 50 ? "Empty title or too long (max. 50 sings)" : "Title too short (min. 3 signs)"}</div>
                </CSSTransition>
              </span>
            </div>
          </div>
          <div className="mt-5 mobile-toggle-inverse">
            <textarea onChange={e => setDescription(e.target.value)} className="post-textarea p-2" rows="10" cols="40"></textarea>
          </div>
          <div className="mt-4 ml-auto mr-auto mobile-toggle">
            <textarea onChange={e => setDescription(e.target.value)} className="post-textarea p-2" rows="10" cols="100"></textarea>
          </div>
          <span className="form-group ml-5 d-flex" style={{ fontSize: "13px" }}>
            <CSSTransition in={!description || description.length > 1000} timeout={330} classNames="liveValidateMessage" unmountOnExit>
              <div className="alert alert-danger ml-5 liveValidateMessage">{"Empty description or too long (max. 1000 signs)"}</div>
            </CSSTransition>
          </span>
          <div className="d-flex  flex-colum mt-5">
            <div></div>
            <div className="mobile-toggle ml-auto">
              <button className="nav-button">Create</button>
            </div>
          </div>
          <div className="mobile-toggle-inverse ml-auto">
            <button className="nav-button">Create</button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default CreateTopicForm
