import React, { useContext } from "react"
import Axios from "axios"
import DispatchContext from "../DispatchContext"
import StateContext from "../StateContext"

function FollowingUserButton(props) {
  const appDispatch = useContext(DispatchContext)
  const appState = useContext(StateContext)

  async function handleFollow(e) {
    e.preventDefault()
    const ourRequest = Axios.CancelToken.source()
    try {
      const followerId = appState.user.id
      await Axios.post(
        `/api/following/${props.username}`,
        {},
        {
          headers: { Authorization: `Bearer ${appState.user.token}` },
          params: { followerId },
        },
        { cancelToken: ourRequest.token }
      )
      appDispatch({ type: "flashMessage", value: "User successfully followed !", messageType: "message-green" })
      props.reload()
    } catch (e) {
      console.log("There was a problem following a user: " + e)
    }

    return () => {
      ourRequest.cancel()
    }
  }

  async function handleUnfollow(e) {
    e.preventDefault()
    const ourRequest = Axios.CancelToken.source()
    try {
      const followerId = appState.user.id
      await Axios.delete(
        `/api/following/${props.username}`,
        {
          headers: { Authorization: `Bearer ${appState.user.token}` },
          params: { followerId },
        },
        { cancelToken: ourRequest.token }
      )
      appDispatch({ type: "flashMessage", value: "User successfully unfollowed !", messageType: "message-green" })
      props.reload()
    } catch (e) {
      console.log("There was a problem following a user: " + e)
    }

    return () => {
      ourRequest.cancel()
    }
  }

  return (
    <>
      {props.loggedIn && props.isFollowed ? (
        <button onClick={handleUnfollow} className="nav-bio-button">
          Unfollow
        </button>
      ) : (
        <button onClick={handleFollow} className="nav-bio-button">
          Follow
        </button>
      )}
    </>
  )
}

export default FollowingUserButton
