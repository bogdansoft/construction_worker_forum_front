import React, { useContext, useState } from "react"
import Axios from "axios"
import { useNavigate, Link } from "react-router-dom"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"

function CreatePost() {
  const [title, setTitle] = useState()
  const [content, setContent] = useState()
  const navigate = useNavigate()
  const [tags, setTags] = useState([])
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  const handleSubmit = e => {
    e.preventDefault()
    const ourRequest = Axios.CancelToken.source()

    async function fetchData() {
      try {
        const response = await Axios.post("/api/post", { title, content, userId: appState.user.id, topicId: 1 }, { headers: { Authorization: `Bearer ${appState.user.token}` } }, { cancelToken: ourRequest.token })
        appDispatch({ type: "flashMessage", value: "Post succesfully created !", messageType: "message-green" })
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
    <form onSubmit={handleSubmit}>
      <div class="main d-flex flex-column container">
        <div class="content d-flex flex-column mt-4">
          <div class="d-flex flex-row">
            <div class="ml-3 add-post-title">
              Title: <input onChange={e => setTitle(e.target.value)} class="p-2 ml-3" type="text" />
            </div>
            <div class="ml-auto mr-5 col-2">
              <select class="mr-3" name="Topics" id="topics">
                <option>Topics</option>
                <option>Work</option>
                <option>Work</option>
                <option>Work</option>
                <option>Sandbox</option>
              </select>
            </div>
          </div>
          <div class="mt-3 ml-auto mr-auto">
            <textarea onChange={e => setContent(e.target.value)} class="post-textarea p-2 ml-5" rows="10" cols="100"></textarea>
          </div>
          <div class="d-flex align-items-center mt-3">
            <div class="d-flex mt-3">
              <span class="mr-4">Tags: </span>
              <div class="ml-2">
                <input type="checkbox" id="tag1" name="tag1" checked />
                <label for="scales">tag1</label>
              </div>
              <div class="ml-2">
                <input type="checkbox" id="tag2" name="tag2" checked />
                <label for="scales">tag2</label>
              </div>
              <div class="ml-2">
                <input type="checkbox" id="tag2" name="tag2" checked />
                <label for="scales">tag2</label>
              </div>
              <div class="ml-2">
                <input type="checkbox" id="tag3" name="tag3" checked />
                <label for="scales">tag3</label>
              </div>
              <div class="ml-2">
                <input type="checkbox" id="tag4" name="tag4" checked />
                <label for="scales">tag4</label>
              </div>
              <div class="ml-2">
                <input type="checkbox" id="tag5" name="tag5" checked />
                <label for="scales">tag5</label>
              </div>
              <div class="ml-2">
                <input type="checkbox" id="tag6" name="tag6" checked />
                <label for="scales">tag6</label>
              </div>
            </div>
            <div class="ml-auto">
              <button class="nav-button">Create</button>
            </div>
          </div>
        </div>
      </div>
    </form>

    // <div className="container">
    //   <Link className="text-primary medium font-weight-bold" to={`/`}>
    //     &laquo; Back to post permalink
    //   </Link>

    //   <form onSubmit={handleSubmit}>
    //     <div className="form-group container mt-4 justify-content-center">
    //       <div className="row justify-content-center mt-4">
    //         <span className="d-flex justify-content-center col-2">
    //           <h3>Title: </h3>{" "}
    //         </span>{" "}
    //         <input onChange={e => setTitle(e.target.value)} type="text" className="justify-content-end col-7" placeholder="title" />
    //       </div>
    //       <div className="row justify-content-center mt-4">
    //         <textarea onChange={e => setContent(e.target.value)} className="no-resize" cols="100" rows="10" type="text" placeholder="" />
    //       </div>
    //       <div className="row justify-content-center mt-4">
    //         <div className="mt-4 post-body ">
    //           <p>
    //             Tags:{" "}
    //             {tags.map(tag => (
    //               <span className="mr-2">{"• " + tag}</span>
    //             ))}
    //           </p>
    //         </div>
    //         <div className=" col-8 mt-4 post-body d-flex flex-wrap justify-content-around">
    //           <div>
    //             <input onClick={e => handleCheckbox(e)} type="checkbox" name="tags" className="mr-2" value="Construction" />
    //             Construction
    //           </div>
    //           <div>
    //             <input onClick={e => handleCheckbox(e)} type="checkbox" name="tags" className="mr-2" value="Helmets" />
    //             Helmets
    //           </div>
    //           <div>
    //             <input onClick={e => handleCheckbox(e)} type="checkbox" name="tags" className="mr-2" value="Machinery" />
    //             Machinery
    //           </div>
    //           <div>
    //             <input onClick={e => handleCheckbox(e)} type="checkbox" name="tags" className="mr-2" value="Projects" />
    //             Projects
    //           </div>
    //           <div>
    //             <input onClick={e => handleCheckbox(e)} type="checkbox" name="tags" className="mr-2" value="Problem" />
    //             Problem
    //           </div>
    //           <div>
    //             <input onClick={e => handleCheckbox(e)} type="checkbox" name="tags" className="mr-2" value="Offtopic" />
    //             Offtopic
    //           </div>
    //         </div>
    //       </div>
    //       <div className="row justify-content-center mt-4">
    //         <button className="col-5 btn btn-success btn-round" type="submit">
    //           Create
    //         </button>
    //       </div>
    //     </div>
    //   </form>
    // </div>
  )
}

export default CreatePost
