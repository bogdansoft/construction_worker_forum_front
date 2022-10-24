import React, { useContext, useState } from "react"
import Axios from "axios"
import { useNavigate, Link } from "react-router-dom"
import StateContext from "../StateContext"

function CreatePost() {
  const [title, setTitle] = useState()
  const [content, setContent] = useState()
  const navigate = useNavigate()
  const [tags, setTags] = useState([])
  const appState = useContext(StateContext)

  const handleSubmit = e => {
    e.preventDefault()
    const ourRequest = Axios.CancelToken.source()
    console.log(appState.user.id)
    async function fetchData() {
      try {
        await Axios.post("/api/post", { userId: appState.user.id, title, content }, { headers: { Authorization: `Bearer ${appState.user.token}` } }, { cancelToken: ourRequest.token })
        navigate("/")
      } catch (e) {
        console.log("There was a problem creating post")
      }
    }
    fetchData()
    return () => {
      ourRequest.cancel()
    }
  }

  function handleCheckbox(e) {
    if (e.target.checked) {
      setTags(prev => prev.concat(e.target.value))
    } else {
      setTags(prev => prev.filter(tag => tag != e.target.value))
    }
  }

  return (
    <div className="container">
      <Link className="text-primary medium font-weight-bold" to={`/`}>
        &laquo; Back to post permalink
      </Link>

      <form onSubmit={handleSubmit}>
        <div className="form-group container mt-4 justify-content-center">
          <div className="row justify-content-center mt-4">
            <span className="d-flex justify-content-center col-2">
              <h3>Title: </h3>{" "}
            </span>{" "}
            <input onChange={e => setTitle(e.target.value)} type="text" className="justify-content-end col-7" placeholder="title" />
          </div>
          <div className="row justify-content-center mt-4">
            <textarea onChange={e => setContent(e.target.value)} className="no-resize" cols="100" rows="10" type="text" placeholder="" />
          </div>
          <div className="row justify-content-center mt-4">
            <div className="mt-4 post-body ">
              <p>
                Tags:{" "}
                {tags.map(tag => (
                  <span className="mr-2">{"• " + tag}</span>
                ))}
              </p>
            </div>
            <div className=" col-8 mt-4 post-body d-flex flex-wrap justify-content-around">
              <div>
                <input onClick={e => handleCheckbox(e)} type="checkbox" name="tags" className="mr-2" value="Construction" />
                Construction
              </div>
              <div>
                <input onClick={e => handleCheckbox(e)} type="checkbox" name="tags" className="mr-2" value="Helmets" />
                Helmets
              </div>
              <div>
                <input onClick={e => handleCheckbox(e)} type="checkbox" name="tags" className="mr-2" value="Machinery" />
                Machinery
              </div>
              <div>
                <input onClick={e => handleCheckbox(e)} type="checkbox" name="tags" className="mr-2" value="Projects" />
                Projects
              </div>
              <div>
                <input onClick={e => handleCheckbox(e)} type="checkbox" name="tags" className="mr-2" value="Problem" />
                Problem
              </div>
              <div>
                <input onClick={e => handleCheckbox(e)} type="checkbox" name="tags" className="mr-2" value="Offtopic" />
                Offtopic
              </div>
            </div>
          </div>
          <div className="row justify-content-center mt-4">
            <button className="col-5 btn btn-success btn-round" type="submit">
              Create
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default CreatePost
