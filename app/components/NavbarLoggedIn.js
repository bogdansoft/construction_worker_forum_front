import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DispatchContext from "../DispatchContext";
import { CSSTransition } from "react-transition-group";
import StateContext from "../StateContext";
import { Badge, List, Popover } from "antd";
import { BellOutlined } from "@ant-design/icons";

function NavbarLoggedIn(props) {
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);
  const navigate = useNavigate();
  const [profileOptions, setProfileOptions] = useState(false);
  const [addOptions, setAddOptions] = useState(false);

  function handleLoggedOut() {
    appDispatch({ type: "logout" });
    appDispatch({
      type: "flashMessage",
      value: "Succesfully logged out !",
      messageType: "message-green",
    });
    navigate("/");
  }

  function toggleProfileOptions() {
    setProfileOptions((prev) => !prev);
  }

  function toggleAddOptions() {
    setAddOptions((prev) => !prev);
  }

  function showAddOptionsDependingOnUserRole() {
    const postLink = (
      <Link onClick={() => setAddOptions((prev) => !prev)} to={`/post/create`}>
        <div className="mt-4">Post</div>
      </Link>
    );

    if (appState.user.isAdmin || appState.user.isSupport) {
      return (
        <div className="option-box small userOptions ml-3">
          <Link
            onClick={() => setAddOptions((prev) => !prev)}
            to={`/topic/create`}
          >
            <div>Topic</div>
          </Link>
          {postLink}
        </div>
      );
    }
    return (
      <div
        className="option-box small userOptions ml-3"
        style={{ padding: "2px 50px 20px 20px" }}
      >
        {postLink}
      </div>
    );
  }

  const notificationTitle = (
    <span>
      <b>Notifications</b>
    </span>
  );

  const notificationList = (
    <div>
      <List
        dataSource={appState.notificationList}
        renderItem={(item) => (
          <List.Item
            className="item-not-read mt-2"
            onClick={(e) => {
              handleItemClick(item);
              if (item.isRead) e.currentTarget.style.backgroundColor = "white";
            }}
          >
            <b>{item.senderName}</b> {item.message}
          </List.Item>
        )}
      />
    </div>
  );

  const handleItemClick = (notification) => {
    notification.isRead = true;
  };

  const rendererBadge = () => {
    return (
      <Badge offset={[-4, 6]} count={appState.badgeNumber}>
        <BellOutlined style={{ fontSize: "34px", color: "" }} />
      </Badge>
    );
  };

  return (
    <div className="mt-3">
      <nav className="nav container d-flex flex-row p-4">
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
          <div className="mobile-toggle">
            <div className="relative">
              <span
                onClick={toggleAddOptions}
                className="material-symbols-outlined mr-3"
              >
                add
              </span>
              <CSSTransition
                in={addOptions}
                timeout={330}
                classNames="userOptions"
                unmountOnExit
              >
                {showAddOptionsDependingOnUserRole()}
              </CSSTransition>
            </div>
            <span
              onClick={() => {
                appDispatch({ type: "openSearch" });
              }}
              className="material-symbols-outlined mr-3"
            >
              {" "}
              search{" "}
            </span>
            <Link to="chat" className="mr-1 p-1">
              <span className="material-symbols-outlined mr-3 mt-1">
                {" "}
                chat{" "}
              </span>
            </Link>
            <div className="mr-3">
              <Popover
                placement="bottomRight"
                title={notificationTitle}
                content={notificationList}
                trigger="click"
              >
                {rendererBadge()}
              </Popover>
            </div>
            <div className="relative">
              <span
                onClick={toggleProfileOptions}
                className="material-symbols-outlined mr-3"
              >
                {" "}
                account_circle{" "}
              </span>
              <CSSTransition
                in={profileOptions}
                timeout={330}
                classNames="userOptions"
                unmountOnExit
              >
                <div className="option-box small userOptions ml-3">
                  <Link
                    onClick={() => setProfileOptions((prev) => !prev)}
                    to={`/profile/${appState.user.username}`}
                  >
                    <div>Profile</div>
                  </Link>
                  <div onClick={handleLoggedOut} className="mt-4">
                    Logout
                  </div>
                </div>
              </CSSTransition>
            </div>
          </div>
          <span
            onClick={() => {
              appDispatch({ type: "toggleMenu" });
            }}
            className="material-symbols-outlined mobile-toggle-inverse"
          >
            {" "}
            menu{" "}
          </span>
        </div>
      </nav>
      {appState.menuIsOpen ? (
        <div className="hamb-menu d-flex flex-column">
          {appState.user.isAdmin || appState.user.isSupport ? (
            <Link to={`/topic/create`}>
              <div>Add Topic</div>
            </Link>
          ) : null}

          <Link to={`/post/create`}>
            <div className="">Add Post</div>
          </Link>
          <span
            onClick={() => {
              appDispatch({ type: "openSearch" });
            }}
          >
            <span> Search </span>
          </span>
          <Link to="chat" className="">
            <span> Chat </span>
          </Link>
          <Link
            onClick={() => setProfileOptions((prev) => !prev)}
            to={`/profile/${appState.user.username}`}
          >
            <div>Profile</div>
          </Link>
          <div onClick={handleLoggedOut}>Logout</div>
        </div>
      ) : null}
    </div>
  );
}

export default NavbarLoggedIn;
