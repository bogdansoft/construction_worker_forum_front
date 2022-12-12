import React, { useContext } from "react";
import StateContext from "../StateContext";
import NavbarLoggedIn from "./NavbarLoggedIn";
import NavbarLoggedOut from "./NavbarLoggedOut";

function Navbar(props) {
  const appState = useContext(StateContext);

  return (
    <>
      {appState.loggedIn ? (
        <NavbarLoggedIn newNotificationsArray={props.newNotificationsArray} />
      ) : (
        <NavbarLoggedOut />
      )}
    </>
  );
}

export default Navbar;
