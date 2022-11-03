import React, {useEffect} from "react"
import {useImmerReducer} from "use-immer"
import {BrowserRouter, Route, Routes} from "react-router-dom"
import jwtDecode from "jwt-decode"
import ReactDOM from "react-dom/client"
import DispatchContext from "./DispatchContext"
import StateContext from "./StateContext"
import {CSSTransition} from "react-transition-group"
import Axios from "axios"
import Navbar from "./components/Navbar"
import Topics from "./components/Topics"
import Footer from "./components/Footer"
import Login from "./components/Login"
import Search from "./components/Search"
import SinglePost from "./components/SinglePost"
import RegisterForm from "./components/RegisterForm"
import CreatePostForm from "./components/CreatePostForm"
import CreateTopicForm from "./components/CreateTopicForm"
import UserProfile from "./components/UserProfile"
import ChangeBIO from "./components/ChangeBIO"
import EditPost from "./components/EditPost"
import EditTopic from "./components/EditTopic"
import ViewSinglePost from "./components/ViewSinglePost"
import FlashMessages from "./components/FlashMessages"
import TestChat from "./components/chat/TestChat";
import {RecoilRoot} from "recoil";
import ViewSingleTopic from "./components/ViewSingleTopic"
import Logout from "./components/Logout"

Axios.defaults.baseURL = "http://localhost:8080"

function Main() {
    //
    const initialState = {
        loggedIn: Boolean(localStorage.getItem("constructionForumUserId")),
        searchIsOpen: false,
        user: {
            id: localStorage.getItem("constructionForumUserId"),
            username: localStorage.getItem("constructionForumUsername"),
            token: localStorage.getItem("constructionForumUserToken"),
            roles: [],
            isAdmin: false,
            isSupport: false
        },
        flashMessages: []
    }

    function ourReducer(state, action) {
        switch (action.type) {
            case "login":
                state.loggedIn = true
                state.user = action.data
                state.user.roles = jwtDecode(state.user.token).roles
                state.user.isAdmin = state.user.roles.includes("ADMINISTRATOR") ? true : false
                state.user.isSupport = state.user.roles.includes("SUPPORT") ? true : false
                break
            case "logout":
                state.loggedIn = false
                state.user.roles = []
                state.user.isAdmin = false
                state.user.isSupport = false
                break
            case "openSearch":
                state.searchIsOpen = true
                return
            case "closeSearch":
                state.searchIsOpen = false
                return
            case "flashMessage":
                state.flashMessages.push({value: action.value, messageType: action.messageType})
                return
        }
    }

    const [state, dispatch] = useImmerReducer(ourReducer, initialState)

    useEffect(() => {
        if (state.loggedIn) {
            localStorage.setItem("constructionForumUserId", state.user.id)
            localStorage.setItem("constructionForumUsername", state.user.username)
            localStorage.setItem("constructionForumUserToken", state.user.token)
            initialState.user.roles = jwtDecode(localStorage.getItem("constructionForumUserToken")).roles
            initialState.user.isAdmin = initialState.user.roles.includes("ADMINISTRATOR") ? true : false
            initialState.user.isSupport = initialState.user.roles.includes("SUPPORT") ? true : false
        } else {
            localStorage.removeItem("constructionForumUserId")
            localStorage.removeItem("constructionForumUsername")
            localStorage.removeItem("constructionForumUserToken")
        }
    }, [state.loggedIn])

    return (
        <RecoilRoot>
            <StateContext.Provider value={state}>
                <DispatchContext.Provider value={dispatch}>
                    <BrowserRouter>
                        <FlashMessages messages={state.flashMessages}/>
                        <Navbar/>
                        <CSSTransition timeout={330} in={state.searchIsOpen} classNames="search-overlay" unmountOnExit>
                            <div className="search-overlay">
                                <Search/>
                            </div>
                        </CSSTransition>
                        <Routes>
                            <Route path="/" element={<Topics/>}/>
                            <Route path="/profile/:username/*" element={<UserProfile/>}/>
                            <Route path="/login" element={<Login/>}/>
                            <Route path="/logout" element={<Logout/>}/>
                            <Route path="/post" element={<SinglePost/>}/>
                            <Route path="/user/create" element={<RegisterForm/>}/>
                            <Route path="/post/create" element={<CreatePostForm/>}/>
                            <Route path="/topic/create" element={<CreateTopicForm/>}/>
                            <Route path="/profile/changebio/:username" element={<ChangeBIO/>}/>
                            <Route path="/post/edit/:id" element={<EditPost/>}/>
                            <Route path="/topic/edit/:id" element={<EditTopic/>}/>
                            <Route path="/post/:id" element={<ViewSinglePost/>}/>
                            <Route path="/topic/:id" element={<ViewSingleTopic/>}/>
                            <Route path="/chat" element={<TestChat/>}/>
                        </Routes>
                        {state.loggedIn ? <Logout/> : null}
                        <Footer/>
                    </BrowserRouter>
                </DispatchContext.Provider>
            </StateContext.Provider>
        </RecoilRoot>
    )
}

const root = ReactDOM.createRoot(document.querySelector("#app"))
root.render(
    <Main/>
);

if (module.hot) {
    module.hot.accept()
}
