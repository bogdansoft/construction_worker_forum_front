import React, { useContext, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Axios from "axios"
import DispatchContext from "../DispatchContext"

function Login() {
  const [username, setUsername] = useState()
  const [password, setPassword] = useState()
  const navigate = useNavigate()

  const appDispatch = useContext(DispatchContext)

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      const response = await Axios.post("/api/login", { username, password })

      if (response.data) {
        console.log(response.data)
        appDispatch({ type: "login", data: response.data })
        appDispatch({ type: "flashMessage", value: "Succesfully logged in !", messageType: "message-green" })
        navigate("/")
      }
    } catch (e) {
      if (e.response.status === 401) {
        appDispatch({ type: "flashMessage", value: "Wrong credentials !", messageType: "message-red" })
        console.log("Incorrect user credentials!")
      } else {
        console.log("There was a problem!")
      }
    }
  }

  return (
    <div className=" login container col-3 ">
      <form onSubmit={handleSubmit} className="mb-0 pt-2 pt-md-0">
        <div className="d-flex flex-column align-items-center ">
          <div className="mt-3 mr-2 p-2 ">
            <span className="material-symbols-outlined mr-2"> account_circle </span>
            <input onChange={e => setUsername(e.target.value)} type="text" placeholder="username" />
          </div>
          <div className="mt-3 mr-2 p-2">
            <span className="material-symbols-outlined mr-2"> lock </span>
            <input onChange={e => setPassword(e.target.value)} type="password" placeholder="*********" />
          </div>
          <div className="mt-2 align-self-center p-3">
            <button className="btn btn-primary login-button">Login</button>
          </div>
        </div>
      </form>
      <div className="p-1 ml-auto mr-auto container text-center">
        <p id="create-account">
          Not a member yet?{" "}
          <Link to="/user/create">
            <span>Create an account</span>
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
