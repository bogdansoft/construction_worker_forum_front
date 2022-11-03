import React, {useContext, useEffect, useState} from "react"
import {Link} from "react-router-dom"
import {CSSTransition} from "react-transition-group"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import {useRecoilState} from "recoil";
import {loggedInUser} from "../atom/GlobalState";

function NavbarLoggedIn() {
    const appDispatch = useContext(DispatchContext)
    const appState = useContext(StateContext)
    const [options, setOptions] = useState(false)
    const [, setLoggedInUser] = useRecoilState(loggedInUser);

    useEffect(() => {
        loadCurrentUser();
    }, []);

    const loadCurrentUser = () => {
        setLoggedInUser({
            id: localStorage.getItem("constructionForumUserId"),
            username: localStorage.getItem("constructionForumUsername"),
            token: localStorage.getItem("constructionForumUserToken")
        })
    }

    function handleLoggedOut() {
        appDispatch({type: "logout"})
        appDispatch({type: "flashMessage", value: "Successfully logged out !", messageType: "message-green"})
    }

    function toggleOptions() {
        setOptions(prev => !prev)
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
                    <Link to="/post/create" className="mr-auto p-3">
                        <span className="material-symbols-outlined"> add </span>
                    </Link>
                    <span className="material-symbols-outlined mr-3"> search </span>
                    <Link to="chat" className="mr-auto p-3">
                        <span className="material-symbols-outlined mr-3 mt-1"> chat </span>
                    </Link>
                    <div className="relative">
                        <span onClick={toggleOptions} className="material-symbols-outlined mr-3">
                            {" "}
                            account_circle{" "}
                        </span>
                        <CSSTransition in={options} timeout={330} classNames="userOptions" unmountOnExit>
                            <div className="option-box small userOptions ml-3">
                                <Link onClick={() => setOptions(prev => !prev)}
                                      to={`/profile/${appState.user.username}`}>
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
