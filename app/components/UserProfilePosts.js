import React, { useEffect, useState } from "react"
import Axios from "axios"
import Post from "./Post"
import { useParams, Link } from "react-router-dom"
import SinglePostProfile from "./SinglePostProfile"

function UserProfilePosts() {
  const [posts, setPosts] = useState([])
  const { username } = useParams()

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()

    async function fetchPosts() {
      try {
        const response = await Axios.get(`/api/post/all_by_username/${username}`, { cancelToken: ourRequest.token })
        setPosts(response.data)
      } catch {
        console.log("There was a problem")
      }
    }
    fetchPosts()
    return () => {
      ourRequest.cancel()
    }
  }, [username])

  return (
    <section id="content1">
      {posts.map(post => {
        return <SinglePostProfile post={post} key={post.id} />
      })}
    </section>
  )
}

export default UserProfilePosts
