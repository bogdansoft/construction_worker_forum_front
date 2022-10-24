import React, { useEffect, useState } from "react"
import { useParams, NavLink, Routes, Route, useNavigate, Link } from "react-router-dom"

function ChangeBIO() {
  const navigate = useNavigate()
  const [body, setBody] = useState()
  const { username } = useParams()
  const [error, setError] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      Axios.post(`/api/user/${username}/changebio`, { newBio: body })
      navigate(`/profile/${username}`)
      console.log("New post was created")
    } catch {
      console.log("There was a problem")
    }
  }

  function handleValidation(e) {
    if (!e.value.trim()) {
      setError(false)
    }
  }

  return (
    <div className={"container py-md-5"}>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <h1 className="display-3">New BIO</h1>
          </label>
          <textarea onBlur={e => handleValidation(e.target.value)} onChange={e => setBody(e.target.value)} name="body" id="post-body" className="body-content tall-textarea form-control" type="text" />
          {error && <div className="alert alert-danger small liveValidateMessage">Invalid BIO</div>}
        </div>

        <button className="btn btn-primary">Save Changes</button>
      </form>
    </div>
  )
}

export default ChangeBIO
