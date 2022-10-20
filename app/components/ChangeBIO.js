import React, { useEffect, useState } from "react"
import { useParams, NavLink, Routes, Route, useNavigate, Link } from "react-router-dom"

function ChangeBIO() {
  const navigate = useNavigate()
  const [body, setBody] = useState()
  const { username } = useParams()

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      //const response = await Axios.post("/api/user/changebio", { body, token: appState.user.token })
      navigate(`/profile/${username}`)
      console.log("New post was created")
    } catch {
      console.log("There was a problem")
    }
  }

  return (
    <div className={"container py-md-5"}>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <h1 className="display-3">New BIO</h1>
          </label>
          <textarea onChange={e => setBody(e.target.value)} name="body" id="post-body" className="body-content tall-textarea form-control" type="text"></textarea>
        </div>

        <button className="btn btn-primary">Save Changes</button>
      </form>
    </div>
  )
}

export default ChangeBIO
