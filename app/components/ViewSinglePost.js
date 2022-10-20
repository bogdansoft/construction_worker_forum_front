import React, { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import Axios from "axios"
import SingleComment from "./SingleComment"

function ViewSinglePost() {
  const { id } = useParams()
  const [post, setPost] = useState([])
  const [comments, setComments] = useState([])

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()

    async function fetchPost() {
      try {
        const response = await Axios.get(`http://localhost:8080/api/post/${id}`, { cancelToken: ourRequest.token })
        setPost(response.data)
      } catch (e) {
        console.log("There was a problem or the request was cancelled.")
      }
    }

    fetchPost()
    return () => {
      ourRequest.cancel()
    }
  }, [id])

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()

    async function fetchPost() {
      try {
        const response = await Axios.get(`http://localhost:8080/api/comment/post/${id}`, { cancelToken: ourRequest.token })
        setComments(response.data)
        console.log(response.data)
      } catch (e) {
        console.log("There was a problem or the request was cancelled.")
      }
    }

    fetchPost()
    return () => {
      ourRequest.cancel()
    }
  }, [id])

  function handleSubmit() {}

  return (
    <div className="d-flex flex-column">
      <div className="single-post container mt-3 d-flex flex-row">
        <div className="mr-3 col-2 text-center">
          <img src="https://th.bing.com/th/id/OIP.SOJ-Oat9i6WjYQ8SoFoe4AHaHa?pid=ImgDet&rs=1" />
          <p>
            by <span className="mt-2 font-weight-bold">Robur</span>
          </p>
        </div>
        <div className="post container">
          <div className="d-flex">
            <h2>{post.title}</h2>
            <Link to={`/post/${id}/edit`} data-tip="Edit" data-for="edit" className="text-primary mr-2"></Link>
            <span className="material-symbols-outlined ml-auto align-self-center"> edit </span>
            <span className="material-symbols-outlined ml-2 align-self-center"> delete </span>
          </div>
          <p className="mt-3 col-10">{post.content}</p>
          <span className="material-symbols-outlined mt-3"> thumb_up </span>
          <span className="material-symbols-outlined ml-3"> share </span>
          <span className="material-symbols-outlined ml-3"> report </span>
        </div>
      </div>
      <div className="comments mt-5 container">
        <hr className="mb-5" />
        <form onSubmit={handleSubmit}>
          <div className="col-6 ml-auto mr-auto d-flex flex-column comment-box">
            <div className="d-flex flex-row">
              <div className="mr-3 col-2 text-center">
                <img src="https://www.nirix.com/uploads/files/Images/general/misc-marketing/avatar-2@2x.png" />
                <p className="font-weight-bold mt-2">USER</p>
              </div>
              <div>
                <textarea rows="4" cols="50" className="no-resize"></textarea>
              </div>
            </div>
            <div className="align-self-end mt-2">
              <button className="btn btn-primary" type="submit">
                Comment
              </button>
            </div>
          </div>
        </form>
        {comments.map(comment => (
          <SingleComment comment={comment} key={comment.id} />
        ))}
      </div>
    </div>
  )
}

export default ViewSinglePost
