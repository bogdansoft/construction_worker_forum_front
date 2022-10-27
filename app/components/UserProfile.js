import React, { useContext, useEffect, useState } from "react"
import { useParams, NavLink, Routes, Route, useNavigate, Link } from "react-router-dom"
import UserProfileComments from "./UserProfileComments"
import UserProfilePosts from "./UserProfilePosts"
import Axios from "axios"
import StateContext from "../StateContext"
import { useImmerReducer } from "use-immer"

function UserProfile() {
  const { username } = useParams()
  const [isBioPresent, setIsBioPresent] = useState(false)
  const appState = useContext(StateContext)
  const navigate = useNavigate()
  const originalState = {
    user: {
      username: "",
      bio: ""
    },
    body: {
      value: "",
      hasErrors: false,
      message: ""
    },
    IsSaving: false,
    sendCount: 0,
    avatar: "https://www.nirix.com/uploads/files/Images/general/misc-marketing/avatar-2@2x.png",
    bio: ""
  }

  function ourReducer(draft, action) {
    switch (action.type) {
      case "fetchComplete":
        draft.body.value = action.value.bio
        return
      case "bodyChange":
        draft.body.hasErrors = false
        draft.body.value = action.value
        return
      case "bodyRules":
        if (action.value.length < 5) {
          draft.body.hasErrors = true
          draft.body.message = "Invalid BIO. You must provide at least 5 characters"
        }
        return
      case "submitRequest":
        if (!draft.body.hasErrors) {
          draft.sendCount++
        }
        return
      case "saveRequestStarted":
        draft.IsSaving = true
        return
      case "saveRequestFinished":
        draft.IsSaving = false
        return
      case "bioChange":
        draft.user.bio = action.value
        return
      case "getData":
        draft.user.username = action.value.username
        draft.user.bio = action.value.bio
        return
    }
  }
  const [state, dispatch] = useImmerReducer(ourReducer, originalState)

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()

    async function fetchData() {
      try {
        const response = await Axios.get(`/api/user?username=${username}`, { headers: { Authorization: `Bearer ${appState.user.token}` } }, { cancelToken: ourRequest.token })
        console.log("tutaj ")
        console.log(response.data)
        dispatch({ type: "getData", value: response.data })
        if (state.bio !== "") {
          setIsBioPresent(true)
        }
      } catch (e) {
        console.log("There was a problem" + e)
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
    } catch (e) {
      console.log("There was a problem")
    }
  }

  useEffect(() => {
    if (state.sendCount) {
      dispatch({ type: "saveRequestStarted" })
      const ourRequest = Axios.CancelToken.source()

      async function fetchPost() {
        try {
          const response = await Axios.post(`/api/user/${username}/changebio`, { newBio: state.user.bio }, { headers: { Authorization: `Bearer ${appState.user.token}` } }, { cancelToken: ourRequest.token })
          dispatch({ type: "saveRequestFinished" })
          navigate(`/profile/${username}`)
        } catch (e) {
          console.log("There was a problem or the request was cancelled" + e)
        }
      }
      fetchPost()
      return () => {
        ourRequest.cancel()
      }
    }
  }, [state.sendCount])

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
          <textarea
            onChange={e => {
              dispatch({ type: "bioChange", value: e.target.value })
            }}
            value={state.user.bio}
            className="ml-4 post-textarea p-2"
            rows="5"
            cols="50"
          ></textarea>
          <div className="ml-4 d-flex flex-column ml-5">
            <button onClick={() => dispatch({ type: "submitRequest" })} className="nav-button mt-2">
              Update
            </button>
            <button className="nav-button mt-3">Delete</button>
          </div>
        </div>
        <div>
          <div className="profile-tabs mt-5">
            <main>
              <input id="tab1" type="radio" name="tabs" checked />
              <label htmlFor="tab1">Posts</label>
              <input id="tab2" type="radio" name="tabs" />
              <label htmlFor="tab2">Comments</label>
              <section id="content1">
                {/* map(comments -> coment) */}
                <div className="single-item-profile container d-flex mt-3 ml-3 p-2 align-items-center">
                  <div id="topic-name">Post number one</div>
                  <div className="ml-auto mr-3">
                    Comments: 21 <span className="ml-3">Created: 01-01-2021</span>
                  </div>
                  <div className="icon-black">
                    <span className="material-symbols-outlined"> edit </span>
                    <span className="material-symbols-outlined"> delete </span>
                  </div>
                </div>
                <div className="single-item-profile container d-flex mt-3 ml-3 p-2 align-items-center">
                  <div id="topic-name">Post number one</div>
                  <div className="ml-auto mr-3">
                    Comments: 21 <span className="ml-3">Created: 01-01-2021</span>
                  </div>
                  <div className="icon-black">
                    <span className="material-symbols-outlined"> edit </span>
                    <span className="material-symbols-outlined"> delete </span>
                  </div>
                </div>
              </section>
              <section id="content2">
                {/* map(post -> post) */}
                <div className="single-item-profile container d-flex mt-3 ml-3 p-2 align-items-center">
                  <div id="topic-name">Comment number one</div>
                  <div className="ml-auto mr-3">
                    <span className="ml-3">Created: 01-01-2021</span>
                  </div>
                  <div className="icon-black">
                    <span className="material-symbols-outlined"> edit </span>
                    <span className="material-symbols-outlined"> delete </span>
                  </div>
                </div>
                <div className="single-item-profile container d-flex mt-3 ml-3 p-2 align-items-center">
                  <div id="topic-name">Comment number one</div>
                  <div className="ml-auto mr-3">
                    <span className="ml-3">Created: 01-01-2021</span>
                  </div>
                  <div className="icon-black">
                    <span className="material-symbols-outlined"> edit </span>
                    <span className="material-symbols-outlined"> delete </span>
                  </div>
                </div>
              </section>
            </main>
          </div>
        </div>
      </div>
    </div>

    // <div className={"container py-md-5"}>
    //   <h2>
    //     <img className="avatar" src="https://www.nirix.com/uploads/files/Images/general/misc-marketing/avatar-2@2x.png" />
    //   </h2>
    //   <div className="float-right">
    //     <Link className="btn btn-primary" to={`/profile/changebio/${username}`}>
    //       Change BIO
    //     </Link>{" "}
    //     <button onClick={handleDelete} className="btn btn-danger">
    //       Delete account
    //     </button>
    //   </div>
    //   <div className="col-lg-7 py-3 py-md-5">
    //     <h1 className="display-3">{username}</h1>
    //     <p className="lead text-muted">{isBioPresent ? state.bio : "There is no BIO yet"} </p>
    //   </div>
    //   <div className="profile-nav nav nav-tabs pt-2 mb-4">
    //     <NavLink to="posts" end className="nav-item nav-link">
    //       Posts:
    //     </NavLink>
    //     <NavLink to="comments" className="nav-item nav-link">
    //       Comments:
    //     </NavLink>
    //   </div>

    //   <Routes>
    //     <Route path="posts" element={<UserProfilePosts />} />
    //     <Route path="comments" element={<UserProfileComments />} />
    //   </Routes>
    // </div>
  )
}

export default UserProfile
