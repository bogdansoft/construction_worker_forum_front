import React, { useEffect, useState } from "react"
import Axios from "axios"
import Post from "./Post"
import { useParams, Link } from "react-router-dom"

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
    <div className="list-group">
      {posts.map(post => {
        return <Post post={post} key={post.id} />
      })}
    </div>
  )
}

export default UserProfilePosts
