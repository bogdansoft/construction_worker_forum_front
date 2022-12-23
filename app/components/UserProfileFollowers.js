import React, { useEffect, useState, useContext } from "react"
import Axios from "axios"
import StateContext from "../StateContext"
import { useParams } from "react-router-dom"
import SingleFollowerUserProfile from "./SingleFollowerUserProfile"

function UserProfileFollowers() {
  const [reloadCounter, setReloadCounter] = useState()
  const [followers, setFollowers] = useState([])
  const { username } = useParams()
  const appState = useContext(StateContext)

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()

    async function fetchFollowers() {
      try {
        const response = await Axios.get(`/api/following/followers/${username}`, { headers: { Authorization: `Bearer ${appState.user.token}` } }, { cancelToken: ourRequest.token })
        setFollowers(response.data)
      } catch (e) {
        console.log("There was a problem: " + e)
      }
    }
    fetchFollowers()
    return () => {
      ourRequest.cancel()
    }
  }, [username, reloadCounter])

  function reload() {
    setReloadCounter((reloadCounter) => (reloadCounter += 1))
  }

  return (
    <section id="content2">
      {followers.map((follower) => {
        return <SingleFollowerUserProfile follower={follower} key={follower.id} reload={reload} />
      })}
    </section>
  )
}

export default UserProfileFollowers
