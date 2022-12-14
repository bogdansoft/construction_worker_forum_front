import React, { useEffect, useState, useContext } from "react"
import { Link } from "react-router-dom"
import ReactTooltip from "react-tooltip"
import { CSSTransition } from "react-transition-group"
import DeleteModal from "./DeleteModal"
import StateContext from "../StateContext"
import Axios from "axios"
import DispatchContext from "../DispatchContext"

function SingleFollowedUserProfile(props) {
  const [isUnFollowing, setIsUnFollowing] = useState(false)
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  async function handleUnfollow() {
    const ourRequest = Axios.CancelToken.source()
    try {
      const followerId = appState.user.id
      await Axios.delete(`/api/following/${props.followedUser.id}`, { headers: { Authorization: `Bearer ${appState.user.token}` }, params: { followerId } }, { cancelToken: ourRequest.token })
      appDispatch({ type: "flashMessage", value: "User successfully unfollowed !", messageType: "message-green" })
      props.reload()
    } catch (e) {
      console.log("there was a problem unfollowing user" + e)
    }
    return () => {
      ourRequest.cancel()
    }
  }

  function handleFollowing() {}

  function deletePopup() {
    setIsUnFollowing((prev) => !prev)
  }

  return (
    <>
      <div className="single-item-profile container d-flex mt-3 p-2 align-items-center">
        <div id="topic-name" className="ml-3">
          <Link to={`/profile/${props.followedUser.username}`}>{props.followedUser.username}</Link>
        </div>

        <div className="ml-auto mr-3 mt-1 icon-black">
          <span onClick={deletePopup} className="material-symbols-outlined link-black" data-tip="Unfollow" data-for="unFollow">
            cancel
          </span>

          <CSSTransition in={isUnFollowing} timeout={330} classNames="liveValidateMessage" unmountOnExit>
            <div className="delete-absolute container col-5 mt-2">
              <div className="delete-pop delete-profile-followed-users col-3 p-2 liveValidateMessage-delete">
                <DeleteModal delete={handleUnfollow} noDelete={deletePopup} />
              </div>
            </div>
          </CSSTransition>
          <ReactTooltip id="unFollow" className="custom-tooltip" />
        </div>
      </div>
    </>
  )
}

export default SingleFollowedUserProfile
