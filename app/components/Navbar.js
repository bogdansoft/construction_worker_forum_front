import React, { useContext } from "react";
import StateContext from "../StateContext";
import NavbarLoggedIn from "./NavbarLoggedIn";
import NavbarLoggedOut from "./NavbarLoggedOut";

function Navbar() {
  const appState = useContext(StateContext);

  return <>{appState.loggedIn ? <NavbarLoggedIn /> : <NavbarLoggedOut />}</>;
}

export default Navbar;
