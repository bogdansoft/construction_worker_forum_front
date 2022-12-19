import React, { useEffect, useState } from "react";
import { useImmerReducer } from "use-immer";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import jwtDecode from "jwt-decode";
import ReactDOM from "react-dom/client";
import DispatchContext from "./DispatchContext";
import StateContext from "./StateContext";
import { CSSTransition } from "react-transition-group";
import Axios from "axios";
import Navbar from "./components/Navbar";
import Topics from "./components/Topics";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Search from "./components/Search";
import RegisterForm from "./components/RegisterForm";
import CreatePostForm from "./components/CreatePostForm";
import CreateTopicForm from "./components/CreateTopicForm";
import UserProfile from "./components/UserProfile";
import ChangeBIO from "./components/ChangeBIO";
import EditPost from "./components/EditPost";
import EditTopic from "./components/EditTopic";
import ViewSinglePost from "./components/ViewSinglePost";
import FlashMessages from "./components/FlashMessages";
import ViewSingleTopic from "./components/ViewSingleTopic";
import NotFound from "./components/NotFound";
import Logout from "./components/Logout";
import Chat from "./components/chat/Chat";
import { notification } from "antd";

Axios.defaults.baseURL = "https://localhost:443";

function Main() {
  const [newNotifications, setNewNotifications] = useState([]);

  const initialState = {
    loggedIn: Boolean(localStorage.getItem("constructionForumUserId")),
    searchIsOpen: false,
    menuIsOpen: false,
    user: {
      id: localStorage.getItem("constructionForumUserId"),
      username: localStorage.getItem("constructionForumUsername"),
      token: localStorage.getItem("constructionForumUserToken"),
      roles: [],
      isUser: false,
      isAdmin: false,
      isSupport: false,
    },
    flashMessages: [],
    badgeNumber: 0,
    notificationList: [],
  };

  function ourReducer(state, action) {
    switch (action.type) {
      case "login":
        state.loggedIn = true;
        state.user = action.data;
        state.user.roles = jwtDecode(state.user.token).roles;
        state.user.isUser = state.user.roles.includes("USER");
        state.user.isAdmin = state.user.roles.includes("ADMINISTRATOR");
        state.user.isSupport = state.user.roles.includes("SUPPORT");
        state.menuIsOpen = false;
        break;
      case "logout":
        state.loggedIn = false;
        state.user.roles = [];
        state.user.isUser = false;
        state.user.isAdmin = false;
        state.user.isSupport = false;
        state.menuIsOpen = false;
        break;
      case "openSearch":
        state.searchIsOpen = true;
        state.menuIsOpen = false;
        return;
      case "closeSearch":
        state.searchIsOpen = false;
        return;
      case "toggleMenu":
        state.menuIsOpen = !state.menuIsOpen;
        return;
      case "closeMenu":
        state.menuIsOpen = false;
        return;
      case "refreshNotifications":
        state.badgeNumber = state.notificationList.length;
        return;
      case "fetchNotifications":
        state.notificationList = action.data;
        return;
      case "flashMessage":
        state.flashMessages.push({
          value: action.value,
          messageType: action.messageType,
        });
        return;
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState);

  const handleNotification = (event) => {
    const jsonNotification = JSON.parse(event.data);
    console.log(newNotifications);
    let newNotificationsArray = newNotifications;

    newNotificationsArray.unshift({
      senderName: jsonNotification.senderName,
      message: jsonNotification.message,
      redirectTo: jsonNotification.redirectTo,
      isRead: jsonNotification.isRead,
    });

    setNewNotifications(newNotificationsArray);
    dispatch({ type: "refreshNotifications" });

    notification.open({
      message: (
        <div>
          <b>{jsonNotification.senderName}</b> {jsonNotification.message}
        </div>
      ),
      placement: "topLeft",
      duration: 5,
      onClick: () => {
        redirectTo(jsonNotification.redirectTo);
      },
    });
  };

  //TODO use navigate?
  const redirectTo = (url) => {
    window.location.href = url;
  };

  useEffect(() => {
    if (state.loggedIn) {
      let notificationListener = new EventSource(
        `https://localhost:444/notification-service/stream/${state.user.id}`
      );

      notificationListener.onopen = (e) => console.log("OPEN");
      notificationListener.onerror = (e) => {
        e.readyState === EventSource.CLOSED.valueOf()
          ? console.log("ERROR")
          : console.log(e);
        notificationListener.close();
      };

      notificationListener.onmessage = (event) => {
        console.log("NOTIFICATION ARRIVED" + event);
        handleNotification(event);
      };

      return () => {
        notificationListener.close();
        console.log("Component clean up - listener closed");
      };
    }
  }, [state.loggedIn]);

  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem("constructionForumUserId", state.user.id);
      localStorage.setItem("constructionForumUsername", state.user.username);
      localStorage.setItem("constructionForumUserToken", state.user.token);
      initialState.user.roles = jwtDecode(
        localStorage.getItem("constructionForumUserToken")
      ).roles;
      initialState.user.isUser = initialState.user.roles.includes("USER");
      initialState.user.isAdmin =
        initialState.user.roles.includes("ADMINISTRATOR");
      initialState.user.isSupport = initialState.user.roles.includes("SUPPORT");
    } else {
      localStorage.removeItem("constructionForumUserId");
      localStorage.removeItem("constructionForumUsername");
      localStorage.removeItem("constructionForumUserToken");
    }
  }, [state.loggedIn]);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <FlashMessages messages={state.flashMessages} />
          <Navbar newNotificationsArray={newNotifications} />
          <CSSTransition
            timeout={330}
            in={state.searchIsOpen}
            classNames="search-overlay"
            unmountOnExit
          >
            <div className="search-overlay">
              <Search />
            </div>
          </CSSTransition>
          <Routes>
            <Route path="/" element={<Topics />} />
            <Route path="/profile/:username/*" element={<UserProfile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/user/create" element={<RegisterForm />} />
            <Route path="/post/create" element={<CreatePostForm />} />
            <Route path="/topic/create" element={<CreateTopicForm />} />
            <Route
              path="/profile/changebio/:username"
              element={<ChangeBIO />}
            />
            <Route path="/post/edit/:id" element={<EditPost />} />
            <Route path="/topic/edit/:id" element={<EditTopic />} />
            <Route path="/post/:id" element={<ViewSinglePost />} />
            <Route path="/topic/:id" element={<ViewSingleTopic />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/chat" element={<Chat />} />
          </Routes>
          {state.loggedIn ? <Logout /> : null}
          <Footer />
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

const root = ReactDOM.createRoot(document.querySelector("#app"));
root.render(<Main />);

if (module.hot) {
  module.hot.accept();
}
