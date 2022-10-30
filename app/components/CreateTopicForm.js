import React, { useState, useContext } from "react"
import Axios from "axios"
import { useNavigate } from "react-router-dom"
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
      <div className="main d-flex flex-column container">
        <div className="content d-flex flex-column mt-4">
          <div className="d-flex flex-row">
            <div className="ml-1 add-post-title">
              Name: <input onChange={e => setName(e.target.value)} className="p-2" type="text" />
            </div>
          </div>
          <div className="mt-3 ml-auto mr-auto">
            <textarea onChange={e => setDescription(e.target.value)} className="post-textarea p-2 ml-5" rows="5" cols="99"></textarea>
          </div>
          <div className="ml-auto">
            <button className="nav-button">Create</button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default CreateTopicForm
