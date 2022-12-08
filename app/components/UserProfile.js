import React, { useEffect, useState, useContext } from "react"
import { useParams, NavLink, Routes, Route, useNavigate, Link } from "react-router-dom"
import UserProfileComments from "./UserProfileComments"
import UserProfilePosts from "./UserProfilePosts"
import Axios from "axios"
import StateContext from "../StateContext"
import RenderAvatar from "./Avatar"
import DispatchContext from "../DispatchContext"

function UserProfile() {
  const navigate = useNavigate()
  const { username } = useParams()
  const [isBioPresent, setIsBioPresent] = useState(false)
  const appState = useContext(StateContext)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const appDispatch = useContext(DispatchContext)

  const [state, setState] = useState({
    avatar: "https://www.nirix.com/uploads/files/Images/general/misc-marketing/avatar-2@2x.png",
    bio: "There is no BIO yet",
    username: "",
  })
  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()

    async function fetchData() {
      const loggedUsername = localStorage.getItem("constructionForumUsername")
      try {
        const response = await Axios.get(`/api/user/user?username=${username}`, { headers: { Authorization: `Bearer ${appState.user.token}` } }, { cancelToken: ourRequest.token })
        setState(response.data)
        console.log(response.data)
        if (username === loggedUsername) {
          setIsLoggedIn(true)
        }
        if (state.bio !== "") {
          setIsBioPresent(true)
        }
      } catch (e) {
        console.log("There was a problem" + e.message)
        navigate(`/notfound`)
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

  async function handleFollow() {}

  useEffect(() => {
    appDispatch({ type: "closeMenu" })
  }, [])
  return (
    <div className="main d-flex flex-column container">
      <div className="content d-flex flex-column mt-4">
        <div className="mobile-toggle-inverse mb-5">
          {isLoggedIn && (
            <Link className="nav-button mt-2" to={`/profile/changebio/${username}`}>
              Change BIO
            </Link>
          )}

          {isLoggedIn && (
            <button onClick={handleDelete} className="nav-button mt-3">
              Delete account
            </button>
          )}
        </div>
        <div className="d-flex text-center align-items-start">
          <div className="d-flex flex-column align-items-center">
            <div className="profile-avatar">
              <span className="material-symbols-outlined mr-3">
                {" "}
                <RenderAvatar username={state.username} isLoggedIn={isLoggedIn} />{" "}
              </span>
            </div>
            <div className="" id="profile-username">
              {state.username}
            </div>
          </div>
          {state.bio ? <div className="bioField">About me : {state.bio.length > 3 ? state.bio : null}</div> : null}
          <div className="mobile-toggle">
            <div className="ml-4 d-flex flex-column">
              <div className="row pt-3">
                {isLoggedIn && (
                  <Link className="nav-bio-button" to={`/profile/changebio/${username}`}>
                    Change BIO
                  </Link>
                )}
              </div>
              <div className="row">
                {isLoggedIn && (
                  <button onClick={handleDelete} className="nav-bio-button">
                    Delete account
                  </button>
                )}
              </div>
              <div className="row">
                {isLoggedIn && (
                  <button onClick={handleFollow} className="nav-bio-button">
                    Follow
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        {isLoggedIn && (
          <div>
            <div class="container text-center tabs-user-profile mt-3">
              <div class="row">
                <div class="col d-flex align-self-center justify-content-center">
                  <NavLink className="single-tab-user-profile-light-brown" to="posts">
                    Posts
                  </NavLink>
                </div>
                <div class="col d-flex align-self-center justify-content-center">
                  <NavLink className="tab-posts-user-profile-light-blue" to="comments">
                    Comments
                  </NavLink>
                </div>
                <div class="col d-flex align-self-center justify-content-center">
                  <NavLink className="single-tab-user-profile-light-brown" to="comments">
                    Followers
                  </NavLink>
                </div>
                <div class="col d-flex align-self-center justify-content-center">
                  <NavLink className="tab-posts-user-profile-light-blue" to="comments">
                    Followed
                  </NavLink>
                </div>
                <div class="col d-flex align-self-center justify-content-center">
                  <NavLink className="single-tab-user-profile-light-brown" to="posts">
                    Followed Posts
                  </NavLink>
                </div>
              </div>
            </div>

            <Routes>
              <Route path="posts" element={<UserProfilePosts />} />
              <Route path="comments" element={<UserProfileComments />} />
            </Routes>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserProfile
