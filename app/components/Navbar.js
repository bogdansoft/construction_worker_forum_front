import React, { useState } from "react"
import { Link } from "react-router-dom"
import DispatchContext from "../DispatchContext"
import { useContext } from "react"
function Navbar() {
  const appDispatch = useContext(DispatchContext)

  return (
    <div className="main container">
      <div className="navbar row mt-3">
        <div className="col">
          <nav>
            <ul className="d-flex flex-row justify-content-end align-items-center">
              <Link to="/" className="mr-auto p-3">
                <li>CONSTRUCTORS</li>
              </Link>
              <li className="p-2 mr-4" onClick={() => appDispatch({ type: "openSearch" })}>
                <span className="material-symbols-outlined"> search </span>
              </li>
              <li className="p-2 mr-4">
                <span className="material-symbols-outlined"> chat </span>
              </li>
              <li className="p-2 mr-4">
                <span className="material-symbols-outlined"> settings </span>
              </li>
              <Link to="/login">
                <li className="p-2 mr-4">
                  <button className="btn btn-primary">LOGIN</button>
                </li>
              </Link>
            </ul>
          </nav>
          <hr />
        </div>
      </div>
    </div>
  )
}

export default Navbar
