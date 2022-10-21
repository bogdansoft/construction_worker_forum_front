import React, {useContext} from "react"
import {Link} from "react-router-dom"
import DispatchContext from "../DispatchContext"
import ReactTooltip from "react-tooltip"

function NavbarLoggedIn() {
    const appDispatch = useContext(DispatchContext)

    function handleLoggedOut() {
        appDispatch({ type: "logout" });
    }

    return (
        <div className="main container">
            <div className="navbar row mt-3">
                <div className="col">
                    <nav>
                        <ul className="d-flex flex-row justify-content-end align-items-center">
                            <Link to="/" className="mr-auto p-3">
                                <li>CONSTRUCTORS</li>
                            </Link>
                            <ReactTooltip place="bottom" id="add" className="custom-tooltip" />{" "}
                            <Link to="/post/create" data-for="add" data-tip="Add Post" className="p-2 mr-4 ">
                                <span className="material-symbols-outlined"> add </span>
                            </Link>
                            <ReactTooltip place="bottom" id="search" className="custom-tooltip" />{" "}
                            <li data-for="search" data-tip="Search" className="p-2 mr-4 pointer" onClick={() => appDispatch({ type: "openSearch" })}>
                                <span className="material-symbols-outlined"> search </span>
                            </li>
                            <ReactTooltip place="bottom" id="chat" className="custom-tooltip" />{" "}
                            <li data-for="chat" data-tip="Chat" className="p-2 mr-4 pointer">
                                <span className="material-symbols-outlined"> chat </span>
                            </li>
                            <ReactTooltip place="bottom" id="settings" className="custom-tooltip" />{" "}
                            <li data-for="settings" data-tip="Settings" className="p-2 mr-4 pointer">
                                <span className="material-symbols-outlined"> settings </span>
                            </li>
                            <Link to="/login">
                                <li className="p-2 mr-4">
                                    <button onClick={handleLoggedOut} className="login-barbutton">LOGOUT</button>
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

export default NavbarLoggedIn
