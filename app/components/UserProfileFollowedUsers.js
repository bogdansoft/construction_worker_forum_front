import React, { useEffect, useState, useContext } from "react"
import Axios from "axios"
import StateContext from "../StateContext"
import { useParams } from "react-router-dom"
import SingleFollowedUserProfile from "./SingleFollowedUserProfile"

function UserProfileFollowedUsers() {
  const [reloadCounter, setReloadCounter] = useState(0)
  const [followedUsers, setFollowedUsers] = useState([])
  const { username } = useParams()
  const appState = useContext(StateContext)

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()

    async function fetchFollowedUsers() {
      try {
        const response = await Axios.get(`/api/following/followed/${username}`, { headers: { Authorization: `Bearer ${appState.user.token}` } }, { cancelToken: ourRequest.token })
        setFollowedUsers(response.data)
      } catch (e) {
        console.log("There was a problem: " + e)
      }
    }
    fetchFollowedUsers()
    return () => {
      ourRequest.cancel()
    }
  }, [username, reloadCounter])

  function reload() {
    setReloadCounter((reloadCounter) => (reloadCounter += 1))
  }

  return (
    <section id="content2">
      {followedUsers.map((followedUser) => {
        return <SingleFollowedUserProfile followedUser={followedUser} key={followedUser.id} reload={reload} />
      })}
    </section>
  )
}

export default UserProfileFollowedUsers
