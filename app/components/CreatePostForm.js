import React, { useEffect, useState } from "react"
import Axios from "axios"
import { useNavigate } from "react-router-dom"
function CreatePost() {
  const [title, setTitle] = useState()
  const [content, setContent] = useState()
  const navigate = useNavigate()

  const handleSubmit = e => {
    e.preventDefault()
    const ourRequest = Axios.CancelToken.source()
    async function fetchData() {
      try {
        await Axios.post("http://localhost:8080/api/post/add", { title, content }, { cancelToken: ourRequest.token })
        navigate(`http://localhost:8080/api/post/${response.data.id}`)
      } catch (e) {
        console.log("There was a problem creating post")
      }
    }
    fetchData()
    return () => {
      ourRequest.cancel()
    }
  }

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="">
          <div className="form-group container mt-4 row justify-content-center ">
            <div className="col-6 p-2">
              <span className="col-3">Title: </span> <input onChange={e => setTitle(e.target.value)} type="text" className="col-9" placeholder="title" />
            </div>
            <div className=" col-10 mt-4 post-body ">
              <textarea onChange={e => setContent(e.target.value)} id="post-text-area" cols="100" rows="10" type="text" className="" placeholder="" />
            </div>
            <button className="col-3 mt-4 btn btn-primary" type="submit">
              Create
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default CreatePost
