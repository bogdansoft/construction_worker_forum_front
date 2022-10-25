import React, { useEffect, useContext } from "react"
import DispatchContext from "../DispatchContext"
import { useImmerReducer } from "use-immer"
import { CSSTransition } from "react-transition-group"
import Axios from "axios"
import { useNavigate } from "react-router-dom"
function RegisterForm() {
  const appDispatch = useContext(DispatchContext)
  const navigate = useNavigate()
  const initialState = {
    submitCount: 0,
    username: {
      value: "",
      hasErrors: false,
      message: ""
    },
    password: {
      value: "",
      hasErrors: false,
      message: ""
    },
    email: {
      value: "",
      hasErrors: false,
      message: ""
    },
    firstName: {
      value: "",
      hasErrors: false,
      message: ""
    },
    lastName: {
      value: "",
      hasErrors: false,
      message: ""
    }
  }

  function ourReducer(draft, action) {
    switch (action.type) {
      case "usernameImmediately":
        draft.username.hasErrors = false
        draft.username.value = action.value
        if (draft.username.value && !/^([a-zA-Z0-9]+)$/.test(draft.username.value)) {
          draft.username.hasErrors = true
          draft.username.message = "Username can only contain letters and numbers"
        }
        return
      case "usernameAfterDelay":
        if (draft.username.value.length < 4) {
          draft.username.hasErrors = true
          draft.username.message = "Username must be over 4 characters long"
        }
        return
      case "passwordImmediately":
        draft.password.hasErrors = false
        draft.password.value = action.value
        return
      case "passwordAfterDelay":
        if (draft.password.value.length < 8) {
          draft.password.hasErrors = true
          draft.password.message = "Password must be over 8 characters long"
        }
        return
      case "emailImmediately":
        draft.email.hasErrors = false
        draft.email.value = action.value
        return
      case "emailAfterDelay":
        if (!/^\S+@\S+$/.test(draft.email.value)) {
          draft.email.hasErrors = true
          draft.email.message = "You must provide a valid email adress"
        }
        return
      case "firstNameImmediately":
        draft.firstName.hasErrors = false
        draft.firstName.value = action.value
        if (draft.firstName.value && !/^([a-zA-Z0-9]+)$/.test(draft.firstName.value)) {
          draft.firstName.hasErrors = true
          draft.firstName.message = "First name can only contain letters and numbers"
        }
        if (draft.firstName.value.length < 1) {
          draft.firstName.hasErrors = true
          draft.firstName.message = "First name must be not empty"
        }
        return
      case "lastNameImmediately":
        draft.lastName.hasErrors = false
        draft.lastName.value = action.value
        if (draft.lastName.value && !/^([a-zA-Z0-9]+)$/.test(draft.lastName.value)) {
          draft.lastName.hasErrors = true
          draft.lastName.message = "Last name can only contain letters and numbers"
        }
        if (draft.lastName.value.length < 1) {
          draft.lastName.hasErrors = true
          draft.lastName.message = "Last name must be not empty"
        }
        return
      case "submitForm": {
        if (!draft.username.hasErrors && !draft.password.hasErrors && !draft.email.hasErrors && !draft.firstName.hasErrors && !draft.lastName.hasErrors) {
          draft.submitCount++
        }
      }
    }
  }
  const [state, dispatch] = useImmerReducer(ourReducer, initialState)

  useEffect(() => {
    if (state.username.value) {
      const delay = setTimeout(() => dispatch({ type: "usernameAfterDelay" }), 700)
      return () => clearTimeout(delay)
    }
  }, [state.username.value])

  useEffect(() => {
    if (state.password.value) {
      const delay = setTimeout(() => dispatch({ type: "passwordAfterDelay" }), 700)
      return () => clearTimeout(delay)
    }
  }, [state.password.value])

  useEffect(() => {
    if (state.email.value) {
      const delay = setTimeout(() => dispatch({ type: "emailAfterDelay" }), 700)
      return () => clearTimeout(delay)
    }
  }, [state.email.value])

  useEffect(() => {
    if (state.submitCount) {
      const ourRequest = Axios.CancelToken.source()
      async function register() {
        try {
          const response = await Axios.post("/api/user", { username: state.username.value, password: state.password.value, email: state.email.value, firstName: state.firstName.value, lastName: state.lastName.value }, { cancelToken: ourRequest.token })
          appDispatch({ type: "flashMessage", value: "Account succesfully created !", messageType: "message-green" })
          navigate("/login")
        } catch (e) {
          console.log("There was a problem creating an account")
        }
      }
      register()
      return () => ourRequest.cancel()
    }
  }, [state.submitCount])

  function handleSubmit(e) {
    e.preventDefault()
    dispatch({ type: "usernameImmediately", value: state.username.value })
    dispatch({ type: "usernameAfterDelay", value: state.username.value })
    dispatch({ type: "emailImmediately", value: state.email.value })
    dispatch({ type: "emailAfterDelay", value: state.email.value })
    dispatch({ type: "passwordImmediately", value: state.password.value })
    dispatch({ type: "passwordAfterDelay", value: state.password.value })
    dispatch({ type: "firstNameImmediately", value: state.firstName.value })
    dispatch({ type: "lastNameImmediately", value: state.lastName.value })
    dispatch({ type: "submitForm" })
  }

  return (
    <div className=" login container col-3 ">
      <form onSubmit={handleSubmit}>
        <div className="d-flex flex-column">
          <div className="mt-3 mr-2 p-2 form-group">
            <div className="form-control">
              Username : <input onChange={e => dispatch({ type: "usernameImmediately", value: e.target.value })} type="text" className="ml-3" placeholder="username" />
            </div>
            <CSSTransition in={state.username.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
              <div className="alert alert-danger small liveValidateMessage">{state.username.message}</div>
            </CSSTransition>
          </div>
          <div className="mr-2 p-2 form-group">
            <div className="form-control">
              Password : <input onChange={e => dispatch({ type: "passwordImmediately", value: e.target.value })} type="password" className="ml-3" placeholder="*******" />
            </div>
            <CSSTransition in={state.password.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
              <div className="alert alert-danger small liveValidateMessage">{state.password.message}</div>
            </CSSTransition>
          </div>
          <div className="mr-2 p-2 form-group">
            <div className="form-control">
              Email : <input onChange={e => dispatch({ type: "emailImmediately", value: e.target.value })} type="text" className="ml-5" placeholder="johndoe@gmail.com" />
            </div>
            <CSSTransition in={state.email.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
              <div className="alert alert-danger small liveValidateMessage">{state.email.message}</div>
            </CSSTransition>
          </div>
          <div className="mr-2 p-2 form-group">
            <div className="form-control">
              First name : <input onChange={e => dispatch({ type: "firstNameImmediately", value: e.target.value })} type="text" className="ml-3" placeholder="John" />
            </div>
            <CSSTransition in={state.firstName.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
              <div className="alert alert-danger small liveValidateMessage">{state.firstName.message}</div>
            </CSSTransition>
          </div>
          <div className="mr-2 p-2 form-group">
            <div className="form-control">
              Last name : <input onChange={e => dispatch({ type: "lastNameImmediately", value: e.target.value })} type="text" className="ml-3" placeholder="Doe" />
            </div>
            <CSSTransition in={state.lastName.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
              <div className="alert alert-danger small liveValidateMessage">{state.lastName.message}</div>
            </CSSTransition>
          </div>
          <div className="mr-2 p-2 form-group ml-auto mr-auto">
            <div className="form-control">
              <button type="submit" className="btn btn-primary">
                Register
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default RegisterForm
