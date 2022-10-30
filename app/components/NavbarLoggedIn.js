import React, { useContext, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import DispatchContext from "../DispatchContext"
import ReactTooltip from "react-tooltip"
import { CSSTransition } from "react-transition-group"
import StateContext from "../StateContext"

function NavbarLoggedIn() {
  const appDispatch = useContext(DispatchContext)
  const appState = useContext(StateContext)
  const navigate = useNavigate()
  const [profileOptions, setProfileOptions] = useState(false)
  const [addOptions, setAddOptions] = useState(false)

  function handleLoggedOut() {
    appDispatch({ type: "logout" })
    appDispatch({ type: "flashMessage", value: "Succesfully logged out !", messageType: "message-green" })
    navigate("/")
  }

  function toggleProfileOptions() {
    setProfileOptions(prev => !prev)
  }

  function toggleAddOptions() {
    setAddOptions(prev => !prev)
  }

  function showAddOptionsDependingOnUserRole() {
    const postLink = (
      <Link onClick={() => setAddOptions(prev => !prev)} to={`/post/create`}>
        <div className="mt-4">Post</div>
      </Link>
    )

    if (appState.user.isAdmin || appState.user.isSupport) {
      return (
        <div className="option-box small userOptions ml-3">
          <Link onClick={() => setAddOptions(prev => !prev)} to={`/topic/create`}>
            <div>Topic</div>
          </Link>
          {postLink}
        </div>
      )
    }
    return (
      <div className="option-box small userOptions ml-3" style={{ padding: "2px 50px 20px 20px" }}>
        {postLink}
      </div>
    )
  }

  return (
    <div className=" mt-3">
      <nav className="container d-flex flex-row p-4">
        <div className="nav-left d-flex align-items-center">
          <div>
            <Link to="/" className="mr-auto p-3">
              <span className="material-symbols-outlined"> settings </span>
            </Link>
          </div>
          <div className="ml-3">
            <h1>Constructor Worker Forum</h1>
          </div>
        </div>
        <div className="nav-right d-flex ml-auto align-items-center">
          <div class="relative">
            <span onClick={toggleAddOptions} className="material-symbols-outlined mr-3">
              add
            </span>
            <CSSTransition in={addOptions} timeout={330} classNames="userOptions" unmountOnExit>
              {showAddOptionsDependingOnUserRole()}
            </CSSTransition>
          </div>
          <span className="material-symbols-outlined mr-3"> search </span>
          <span className="material-symbols-outlined mr-3"> chat </span>
          <div class="relative">
            <span onClick={toggleProfileOptions} className="material-symbols-outlined mr-3">
              {" "}
              account_circle{" "}
            </span>
            <CSSTransition in={profileOptions} timeout={330} classNames="userOptions" unmountOnExit>
              <div className="option-box small userOptions ml-3">
                <Link onClick={() => setProfileOptions(prev => !prev)} to={`/profile/${appState.user.username}`}>
                  <div>Profile</div>
                </Link>
                <div onClick={handleLoggedOut} className="mt-4">
                  Logout
                </div>
              </div>
            </CSSTransition>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default NavbarLoggedIn
