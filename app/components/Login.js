import React, { useEffect } from "react"

function Login() {
  return (
    <div className="login container col-3">
      <form>
        <div className="d-flex flex-column align-items-center">
          <div className="mt-3 mr-2 p-2">
            <span className="material-symbols-outlined"> account_circle </span>
            <input type="text" placeholder="username" />
          </div>
          <div className="mt-3 mr-2 p-2">
            <span className="material-symbols-outlined"> lock </span>
            <input type="password" placeholder="*********" />
          </div>
          <div className="mt-2 align-self-center p-3">
            <button className="btn btn-primary login-button">Login</button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Login
