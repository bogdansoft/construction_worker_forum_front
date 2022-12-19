import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Axios from "axios";
import DispatchContext from "../DispatchContext";
import StateContext from "../StateContext";

function Login() {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const navigate = useNavigate();
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await Axios.post("/api/login", { username, password });
      const notifications = await Axios.get(
        `https://localhost:444/notification-service/all?userId=${appState.user.id}`
      );

      if (response.data) {
        appDispatch({ type: "login", data: response.data });
        appDispatch({
          type: "flashMessage",
          value: "Succesfully logged in !",
          messageType: "message-green",
        });
        console.log(notifications.data);
        appDispatch({ type: "fetchNotifications", data: notifications.data });
        appDispatch({ type: "refreshNotifications" });
        navigate("/");
      }
    } catch (e) {
      if (e.response.status === 401 || e.response.status === 400) {
        appDispatch({
          type: "flashMessage",
          value: "Wrong credentials !",
          messageType: "message-red",
        });
        console.log("Incorrect user credentials!");
      } else {
        console.log("There was a problem!" + e);
      }
    }
  }

  return (
    <div className="main login container">
      <div className="content d-flex mt-4">
        <div className="d-flex flex-column align-items-center">
          <div className="mt-4">
            <h6 className="input-text text-center">
              Log into Construction
              <br />
              Worker forum
            </h6>
          </div>
          <form
            onSubmit={handleSubmit}
            className="d-flex flex-column container"
          >
            <div className="ml-5 form-label mt-4">
              <span>Username</span>
              <br />
              <input
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                className="form-button"
              />
              <br />
              <span>Password</span>
              <br />
              <input
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                className="form-button"
                data-testid="password-field"
              />
            </div>
            <div className="mt-4 mr-5 centered">
              <button type="submit" className="nav-button ">
                LOGIN
              </button>
            </div>
          </form>
          <div className="mt-3 form-label centered">
            <span id="login-white">
              No Account? Sign Up{" "}
              <Link to="/user/create">
                <span id="login-blue">Here</span>
              </Link>
            </span>
          </div>
        </div>
        <div className="col-6 align-self-center mobile-toggle">
          <img src="https://static.timesofisrael.com/www/uploads/2017/12/managers.jpg" />
        </div>
      </div>
    </div>
  );
}

export default Login;
