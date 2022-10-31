import React, { useContext } from "react"
import DispatchContext from "../DispatchContext"
import { Link } from "react-router-dom"

function NavbarLoggedOut() {
  const appDispatch = useContext(DispatchContext)

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
      </nav>
    </div>
  )
}

export default NavbarLoggedOut
