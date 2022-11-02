import React, { useEffect, useState, useContext } from "react"
import { useParams, NavLink, Routes, Route, useNavigate, Link } from "react-router-dom"
import UserProfileComments from "./UserProfileComments"
import UserProfilePosts from "./UserProfilePosts"
import Axios from "axios"
import StateContext from "../StateContext"

function UserProfile() {
  const { username } = useParams()
  const [isBioPresent, setIsBioPresent] = useState(false)
  const appState = useContext(StateContext)
  const [state, setState] = useState({
    avatar: "https://www.nirix.com/uploads/files/Images/general/misc-marketing/avatar-2@2x.png",
    bio: ""
  })
  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()

    async function fetchData() {
      try {
        const response = await Axios.get(`/api/user/user?username=${username}`, { headers: { Authorization: `Bearer ${appState.user.token}` } }, { cancelToken: ourRequest.token })
        setState(response.data)
        console.log(response.data)
        if (state.bio != "") {
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
    <div className="main d-flex flex-column container">
      <div className="content d-flex flex-column mt-4">
        <div className="d-flex text-center align-items-start">
          <div className="d-flex align-items-center">
            <div className="profile-avatar">
              <span className="material-symbols-outlined mr-3"> person </span>
            </div>
            <div className="mt" id="profile-username">
              {username}
            </div>
          </div>
          <textarea value={state.bio} className="ml-4 post-textarea p-2" rows="5" cols="50"></textarea>
          <div className="ml-4 d-flex flex-column ml-5">
            <Link className="nav-button mt-2" to={`/profile/changebio/${username}`}>
              Change BIO
            </Link>{" "}
            <button onClick={handleDelete} className="nav-button mt-3">
              Delete account
            </button>
          </div>
        </div>
        <div>
          <div className="profile-tabs mt-5">
            <main>
              <NavLink to="posts">
                <input id="tab1" type="radio" name="tabs" />
                <label htmlFor="tab1">Posts</label>
              </NavLink>
              <NavLink to="comments">
                <input id="tab2" type="radio" name="tabs" />
                <label htmlFor="tab2">Comments</label>
              </NavLink>
            </main>
          </div>
        </div>
        <Routes>
          <Route path="posts" element={<UserProfilePosts />} />
          <Route path="comments" element={<UserProfileComments />} />
        </Routes>
      </div>
    </div>
  )
}

export default UserProfile
