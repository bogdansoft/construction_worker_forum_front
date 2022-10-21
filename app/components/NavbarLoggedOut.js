import React, { useEffect, useState, useContext } from "react";
import Axios from "axios";
import DispatchContext from "../DispatchContext";
import {Link} from "react-router-dom";
import ReactTooltip from "react-tooltip";

function NavbarLoggedOut() {
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

                            <Link to="/user/create">
                                <li className="p-2 mr-4">
                                    <button className="signup-button">SIGN UP</button>
                                </li>
                            </Link>
                            <Link to="/login">
                                <li className="p-2 mr-4">
                                    <button className="login-barbutton">LOGIN</button>
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

export default NavbarLoggedOut;