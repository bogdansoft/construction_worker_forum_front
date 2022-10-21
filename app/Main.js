import React, {useEffect} from "react"
import {useImmerReducer} from "use-immer"
import {BrowserRouter, Route, Routes} from "react-router-dom"
import ReactDOM from "react-dom/client"
import DispatchContext from "./DispatchContext"
import StateContext from "./StateContext"
import {CSSTransition} from "react-transition-group"
import Axios from "axios"
import Navbar from "./components/Navbar"
import Posts from "./components/Posts"
import Footer from "./components/Footer"
import Login from "./components/Login"
import Search from "./components/Search"
import SinglePost from "./components/SinglePost"
import RegisterForm from "./components/RegisterForm"
import CreatePostForm from "./components/CreatePostForm"
import UserProfile from "./components/UserProfile"
import ChangeBIO from "./components/ChangeBIO"
import EditPost from "./components/EditPost"

Axios.defaults.baseURL = "http://localhost:8080"

function Main() {
  //
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("constructionForumUserId")),
    searchIsOpen: false,
    user: {
      id: localStorage.getItem("constructionForumUserId"),
      username: localStorage.getItem("constructionForumUsername"),
      token: localStorage.getItem("constructionForumUserToken")
    }
  }

  function ourReducer(state, action) {
    switch (action.type) {
      case "login":
        state.loggedIn = true
        state.user = action.data
        break
      case "logout":
        state.loggedIn = false
        break
      case "openSearch":
        return { searchIsOpen: true }
      case "closeSearch":
        return { searchIsOpen: false }
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState)

  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem("constructionForumUserId", state.user.id)
      localStorage.setItem("constructionForumUsername", state.user.username)
      localStorage.setItem("constructionForumUserToken", state.user.token)
    } else {
      localStorage.removeItem("constructionForumUserId")
      localStorage.removeItem("constructionForumUsername")
      localStorage.removeItem("constructionForumUserToken")
    }
  }, [state.loggedIn])

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <Navbar />
          <CSSTransition timeout={330} in={state.searchIsOpen} classNames="search-overlay" unmountOnExit>
            <div className="search-overlay">
              <Search />
            </div>
          </CSSTransition>
          <Routes>
            <Route path="/" element={<Posts />} />
            <Route path="/profile/:username/*" element={<UserProfile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/post" element={<SinglePost />} />
            <Route path="/user/create" element={<RegisterForm />} />
            <Route path="/post/create" element={<CreatePostForm />} />
            <Route path="/profile/changebio/:username" element={<ChangeBIO />} />
            <Route path="/post/edit/:id" element={<EditPost />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}

const root = ReactDOM.createRoot(document.querySelector("#app"))
root.render(<Main />)

if (module.hot) {
  module.hot.accept()
}
