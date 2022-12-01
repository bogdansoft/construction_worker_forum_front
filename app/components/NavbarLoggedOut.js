import React, { useContext } from "react"
import DispatchContext from "../DispatchContext"
import { Link } from "react-router-dom"
import StateContext from "../StateContext"

function NavbarLoggedOut() {
  const appDispatch = useContext(DispatchContext)
  const appState = useContext(StateContext)
  return (
    <div>
      <nav className="container nav">
        <div className="nav-left ">
          <div>
            <Link to="/" className="mr-auto p-3">
              <span className="material-symbols-outlined"> settings </span>
            </Link>
          </div>
          <div className="ml-3">
            <h1>Constructor Worker Forum</h1>
          </div>
        </div>
        <div className="nav-right ml-auto">
          <div className="mobile-toggle">
            <span
              onClick={() => {
                appDispatch({ type: "openSearch" })
              }}
              className="material-symbols-outlined mr-3"
            >
              {" "}
              search{" "}
            </span>
            <Link to="/user/create">
              <button className="nav-button mr-4">Sign up</button>
            </Link>
            <Link to="/login">
              <button className="nav-button mr-4">Login</button>
            </Link>
          </div>
          <span
            onClick={() => {
              appDispatch({ type: "toggleMenu" })
            }}
            className="material-symbols-outlined mobile-toggle-inverse"
          >
            {" "}
            menu{" "}
          </span>
        </div>
      </nav>
      {appState.menuIsOpen ? (
        <div className="hamb-menu d-flex flex-column">
          <Link to="/user/create">
            <span>Register</span>
          </Link>
          <Link to="/login">
            <span>Login</span>
          </Link>
          <span
            onClick={() => {
              appDispatch({ type: "openSearch" })
            }}
          >
            Search
          </span>
          <Link to="chat" className="">
            <span> Chat </span>
          </Link>
        </div>
      ) : null}
    </div>
  )
}

export default NavbarLoggedOut
