import React, { useEffect, useState } from "react"
import { useParams, NavLink, Routes, Route, useNavigate, Link } from "react-router-dom"
import UserProfileComments from "./UserProfileComments"
import UserProfilePosts from "./UserProfilePosts"
import Axios from "axios"

function UserProfile() {
  const { username } = useParams()
  const [isBioPresent, setIsBioPresent] = useState(false)
  const [state, setState] = useState({
    avatar: "https://www.nirix.com/uploads/files/Images/general/misc-marketing/avatar-2@2x.png",
    bio: ""
  })
  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()

    async function fetchData() {
      try {
        const response = await Axios.get(`/api/user?username=${username}`, { cancelToken: ourRequest.token })
        setState(response.data)
        console.log(response.data)
        if (state.bio !== "") {
          setIsBioPresent(true)
        }
      } catch {
        console.log("There was a problem")
      }
    }
    fetchData()
    return () => {
      ourRequest.cancel()
    }
  }, [username])

  async function handleDelete(e) {
    e.preventDefault()
    try {
      Axios.delete(`/api/user?username=${username}`)

      navigate(`/`)
      console.log("Account deleted")
    } catch {
      console.log("There was a problem")
    }
  }

  return (
    <div className={"container py-md-5"}>
      <h2>
        <img className="avatar" src="https://www.nirix.com/uploads/files/Images/general/misc-marketing/avatar-2@2x.png" />
      </h2>
      <div className="float-right">
        <Link className="btn btn-primary" to={`/profile/changebio/${username}`}>
          Change BIO
        </Link>{" "}
        <button onClick={handleDelete} className="btn btn-danger">
          Delete account
        </button>
      </div>
      <div className="col-lg-7 py-3 py-md-5">
        <h1 className="display-3">{username}</h1>
        <p className="lead text-muted">{isBioPresent ? state.bio : "There is no BIO yet"} </p>
      </div>
      <div className="profile-nav nav nav-tabs pt-2 mb-4">
        <NavLink to="posts" end className="nav-item nav-link">
          Posts:
        </NavLink>
        <NavLink to="comments" className="nav-item nav-link">
          Comments:
        </NavLink>
      </div>

      <Routes>
        <Route path="posts" element={<UserProfilePosts />} />
        <Route path="comments" element={<UserProfileComments />} />
      </Routes>
    </div>
  )
}

export default UserProfile
