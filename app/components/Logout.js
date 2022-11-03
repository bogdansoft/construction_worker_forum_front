import React, { useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import jwtDecode from "jwt-decode"

function Logout() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (appState.loggedIn) {
      const tokenExpTime = jwtDecode(appState.user.token).exp * 1000
      const interval = setInterval(() => {
        if (tokenExpTime < Date.now() && appState.loggedIn) {
          appDispatch({ type: "logout" })
          appDispatch({ type: "flashMessage", value: "YOUR AUTHENTICATION EXPIRED. PLEASE LOG IN AGAIN.", messageType: "message-red" })
          navigate("/")
          console.log("User logged out automatically due to expired token time!")
        }
      }, tokenExpTime - Date.now() + 10000)
      return () => (appState.loggedIn ? clearInterval(interval) : null)
    }
  }, [])

  return null
}

export default Logout
