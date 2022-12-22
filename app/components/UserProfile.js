import React, { useEffect, useState, useContext } from "react"
import { useParams, NavLink, Routes, Route, useNavigate, Link } from "react-router-dom"
import UserProfileComments from "./UserProfileComments"
import UserProfilePosts from "./UserProfilePosts"
import Axios from "axios"
import StateContext from "../StateContext"
import RenderAvatar from "./Avatar"
import DispatchContext from "../DispatchContext"
import UserProfileFollowedUsers from "./UserProfileFollowedUsers"
import UserProfileFollowers from "./UserProfileFollowers"
import FollowingUserButton from "./FollowingUserButton"
import {UserProfileFollowedPosts} from "./UserProfileFollowedPosts";

function UserProfile() {
  const navigate = useNavigate()
  const { username } = useParams()
  const [isBioPresent, setIsBioPresent] = useState(false)
  const appState = useContext(StateContext)
  const [isOwner, setIsOwner] = useState(false)
  const [isFollowed, setIsFollowed] = useState(false)
  const appDispatch = useContext(DispatchContext)
  const loggedIn = Boolean(localStorage.getItem("constructionForumUserToken"))
  const [reloadCounter, setReloadCounter] = useState(0)

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
        setIsOwner(username === loggedUsername ? true : false)
        if (state.bio !== "") {
          setIsBioPresent(true)
        }
        const followerId = appState.user.id
        const responseFollowing = await Axios.get(
          `/api/following/${username}`,
          {
            headers: { Authorization: `Bearer ${appState.user.token}` },
            params: { followerId },
          },
          { cancelToken: ourRequest.token }
        )
        setIsFollowed(responseFollowing.data)
      } catch (e) {
        console.log("There was a problem" + e.message)
        navigate(`/notfound`)
      }
    }
    fetchData()
    return () => {
      ourRequest.cancel()
    }
  }, [username, reloadCounter])

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

  function reload() {
    setReloadCounter((reloadCounter) => (reloadCounter += 1))
  }

  useEffect(() => {
    appDispatch({ type: "closeMenu" })
  }, [])

  return (
    <div className="main d-flex flex-column container">
      <div className="content d-flex flex-column mt-4">
        <div className="mobile-toggle-inverse mb-5">
          {isOwner && (
            <Link className="nav-button mt-2" to={`/profile/changebio/${username}`}>
              Change BIO
            </Link>
          )}
          {isOwner && (
            <button onClick={handleDelete} className="nav-button mt-2">
              Delete account
            </button>
          )}

          {!isOwner && <FollowingUserButton username={username} loggedIn={loggedIn} isFollowed={isFollowed} reload={reload} />}
        </div>
        <div className="d-flex text-center align-items-start">
          <div className="d-flex flex-column align-items-center">
            <div className="profile-avatar">
              <span className="material-symbols-outlined mr-3">
                {" "}
                <RenderAvatar username={state.username} isLoggedIn={isOwner} />{" "}
              </span>
            </div>
            <div className="" id="profile-username">
              {state.username}
            </div>
          </div>
          {state.bio ? <div className="bioField">About me : {state.bio.length > 3 ? state.bio : null}</div> : null}
          <div className="mobile-toggle">
            <div className="ml-4 d-flex flex-column">
              <div className="row">
                {isOwner && (
                  <Link className="nav-bio-button" to={`/profile/changebio/${username}`}>
                    Change BIO
                  </Link>
                )}
              </div>
              <div className="row">
                {isOwner && (
                  <button onClick={handleDelete} className="nav-bio-button">
                    Delete account
                  </button>
                )}
              </div>
              {!isOwner && <FollowingUserButton username={username} loggedIn={loggedIn} isFollowed={isFollowed} reload={reload} />}
            </div>
          </div>
        </div>
        {loggedIn && (
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
                  <NavLink className="single-tab-user-profile-light-brown" to="followers">
                    Followers
                  </NavLink>
                </div>
                <div class="col d-flex align-self-center justify-content-center">
                  <NavLink className="tab-posts-user-profile-light-blue" to="followedUsers">
                    Followed
                  </NavLink>
                </div>
                <div class="col d-flex align-self-center justify-content-center">
                  <NavLink className="single-tab-user-profile-light-brown" to="followedPosts">
                    Followed Posts
                  </NavLink>
                </div>
              </div>
            </div>

            <Routes>
              <Route path="posts" element={<UserProfilePosts />} />
              <Route path="comments" element={<UserProfileComments />} />
              <Route path="followedUsers" element={<UserProfileFollowedUsers />} />
              <Route path="followers" element={<UserProfileFollowers />} />
              <Route path="followedPosts" element={<UserProfileFollowedPosts />} />
            </Routes>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserProfile
