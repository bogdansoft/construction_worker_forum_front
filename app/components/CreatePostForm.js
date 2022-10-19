import React, { useEffect, useState } from "react"
import Axios from "axios"
import { useNavigate } from "react-router-dom"
import { useImmer } from "use-immer"

function CreatePost() {
  const [title, setTitle] = useState()
  const [content, setContent] = useState()
  const navigate = useNavigate()
  const [tags, setTags] = useState([])
  const handleSubmit = e => {
    e.preventDefault()
    const ourRequest = Axios.CancelToken.source()
    async function fetchData() {
      try {
        await Axios.post("http://localhost:8080/api/post/add", { title, content }, { cancelToken: ourRequest.token })
        //navigate(`http://localhost:8080/api/post/${response.data.id}`)
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
      <form onSubmit={handleSubmit}>
        <div className="">
          <div className="form-group container mt-4 row justify-content-center ">
            <div className="col-6 p-2">
              <span className="col-3">Title: </span> <input onChange={e => setTitle(e.target.value)} type="text" className="col-9" placeholder="title" />
            </div>
            <div className=" col-10 mt-4 post-body ">
              <textarea onClick={e => setContent(e.target.value)} id="post-text-area" cols="100" rows="10" type="text" className="" placeholder="" />
            </div>
            <div className=" col-10 mt-4 post-body ">
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

            <button className="col-5 mt-5 btn btn-primary btn-round" type="submit">
              Create
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default CreatePost
