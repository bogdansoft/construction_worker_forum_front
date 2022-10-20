import React, { useEffect, useState } from "react"
import { useParams, NavLink, Routes, Route, useNavigate, Link } from "react-router-dom"
import UserProfileComments from "./UserProfileComments"
import UserProfilePosts from "./UserProfilePosts"
import Axios from "axios"

function UserProfile() {
  const { username } = useParams()
  const [state, setState] = useState({
    username: "...",
    avatar: "https://gravatar.com/avatar/placeholder?s=128",
    bio: "..."
  })

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()

    async function fetchData() {
      try {
        const response = await Axios.get(`/profile/${username}`, { token: appState.user.token }, { cancelToken: ourRequest.token })
        setState(response.data)
        console.log(response.data)
      } catch {
        console.log("There was a problem")
      }
    }
    fetchData()
    return () => {
      ourRequest.cancel()
    }
  }, [username])

  return (
    <div className={"container py-md-5"}>
      <h2>
        <img className="avatar" src="https://www.nirix.com/uploads/files/Images/general/misc-marketing/avatar-2@2x.png" />
      </h2>
      <div className="float-right">
        <Link className="btn btn-primary" to={`/profile/changebio/${username}`}>
          Change BIO
        </Link>{" "}
        <button className="btn btn-danger">Delete account</button>
      </div>
      <div className="col-lg-7 py-3 py-md-5">
        <h1 className="display-3">Jacek</h1>
        <p className="lead text-muted">Z wyksztalcenia technik informatyk. Pracuje jako operator maszyn CNC. Moje zainteresowania to kino, podroze i zona kolegi Darka.</p>
      </div>
      <div className="profile-nav nav nav-tabs pt-2 mb-4">
        <NavLink to="" end className="nav-item nav-link">
          Posts:
        </NavLink>
        <NavLink to="comments" className="nav-item nav-link">
          Comments:
        </NavLink>
      </div>

      <Routes>
        <Route path="" element={<UserProfilePosts />} />
        <Route path="comments" element={<UserProfileComments />} />
      </Routes>
    </div>
  )
}

export default UserProfile
