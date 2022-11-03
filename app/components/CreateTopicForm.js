import React, { useState, useContext } from "react"
import Axios from "axios"
import { useNavigate } from "react-router-dom"
import { CSSTransition } from "react-transition-group"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"

function CreateTopicForm(props) {
  const [name, setName] = useState()
  const [description, setDescription] = useState()
  const navigate = useNavigate()
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  const handleSubmit = e => {
    e.preventDefault()
    const ourRequest = Axios.CancelToken.source()

    if (!(appState.user.isAdmin || appState.user.isSupport)) {
      appDispatch({ type: "flashMessage", value: "No permission to perform this action!", messageType: "message-red" })
      return
    } else if (!name || !description || name.length >= 50 || name.length < 3) {
      appDispatch({ type: "flashMessage", value: "Invalid name (min. 3 signs) or description!", messageType: "message-red" })
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

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-label mt-4">
        <div className="main d-flex flex-column container">
          <div className="content d-flex flex-column mt-4">
            <div className="d-flex flex-row">
              <div className="ml-1 add-post-title">
                <text style={{ fontSize: "40px" }}>Title:</text>

                <input onChange={e => setName(e.target.value)} className="ml-3" type="text" style={{ fontSize: "20px" }} />
              </div>
            </div>
            <span className="form-group  ml-5 d-flex ">
              <CSSTransition in={!name} timeout={330} classNames="liveValidateMessage" unmountOnExit>
                <div className="alert alert-danger mt-3 ml-3 liveValidateMessage">{"Empty title!"}</div>
              </CSSTransition>
            </span>
            <div className="mt-3 ml-auto mr-auto">
              <textarea onChange={e => setDescription(e.target.value)} className="post-textarea p-2 ml-5" rows="5" cols="99"></textarea>
              <span className="form-group">
                <CSSTransition in={!description} timeout={330} classNames="liveValidateMessage" unmountOnExit>
                  <div className="alert alert-danger mt-3 liveValidateMessage">{"Empty description!"}</div>
                </CSSTransition>
              </span>
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

export default CreateTopicForm
