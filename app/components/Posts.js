import React, { useEffect } from "react"
import ReactTooltip from "react-tooltip"

function Posts() {
  return (
    <div className="main container">
      <div className="forum-content d-flex flex-column">
        <div className="posts p-3 ml-5 mr-3 d-flex col-8">
          <div className="avatar mr-3 col-2">
            <img src="https://www.nirix.com/uploads/files/Images/general/misc-marketing/avatar-2@2x.png" />
          </div>
          <div className="post-left col-8">
            <div>
              <h1>Vanilla Forum - bugs and others</h1>
              <p>
                Created by <strong>Robur</strong> 10 october 2022 • bugs other
              </p>
            </div>
          </div>
          <div className="post-right col-4 align-self-center">
            Comments : <strong>3</strong>
            <ReactTooltip place="bottom" id="edit" className="custom-tooltip" />{" "}
            <span data-for="edit" data-tip="Edit" className="material-symbols-outlined ml-4">
              Edit
            </span>
            <ReactTooltip place="bottom" id="delete" className="custom-tooltip" />{" "}
            <span data-for="delete" data-tip="Delete" className="material-symbols-outlined ml-2">
              delete
            </span>
          </div>
        </div>
        <div className="posts p-3 ml-5 mr-3 d-flex col-8 justify-content-between">
          <div className="avatar mr-3 col-2">
            <img src="https://th.bing.com/th/id/OIP.SOJ-Oat9i6WjYQ8SoFoe4AHaHa?pid=ImgDet&rs=1" />
          </div>
          <div className="post-left col-8">
            <div>
              <h1>These five things will make your work easy</h1>
              <p>
                Created by <strong>Marek</strong> 20 may 2022 • bugs other
              </p>
            </div>
          </div>
          <div className="post-right col-4 align-self-center">
            Comments : <strong>10</strong>
            <ReactTooltip place="bottom" id="edit" className="custom-tooltip" />{" "}
            <span data-for="edit" data-tip="Edit" className="material-symbols-outlined ml-4">
              Edit
            </span>
            <ReactTooltip place="bottom" id="delete" className="custom-tooltip" />{" "}
            <span data-for="delete" data-tip="Delete" className="material-symbols-outlined ml-2">
              delete
            </span>
          </div>
        </div>
        <div className="posts p-3 ml-5 mr-3 d-flex col-8 justify-content-between">
          <div className="avatar mr-3 col-2">
            <img src="https://th.bing.com/th/id/OIP.PXqXsWvKQKc18fg18kL3GQHaHa?pid=ImgDet&rs=1" />
          </div>
          <div className="post-left col-8">
            <div>
              <h1>Best helmet for your work !</h1>
              <p>
                Created by <strong>Darek</strong> 03 november 2022 • bugs other
              </p>
            </div>
          </div>
          <div className="post-right col-4 align-self-center">
            Comments : <strong>15</strong>
            <ReactTooltip place="bottom" id="edit" className="custom-tooltip" />{" "}
            <span data-for="edit" data-tip="Edit" className="material-symbols-outlined ml-4">
              Edit
            </span>
            <ReactTooltip place="bottom" id="delete" className="custom-tooltip" />{" "}
            <span data-for="delete" data-tip="Delete" className="material-symbols-outlined ml-2">
              delete
            </span>
          </div>
        </div>
        <div className="posts p-3 ml-5 mr-3 d-flex col-8 justify-content-between">
          <div className="avatar mr-3 col-2">
            <img src="https://th.bing.com/th/id/OIP.PXqXsWvKQKc18fg18kL3GQHaHa?pid=ImgDet&rs=1" />
          </div>
          <div className="post-left col-8">
            <div>
              <h1>Are you using docker? djhadjahdjashdjkashdjashdjas !</h1>
              <p>
                Created by <strong>Darek</strong> 03 november 2022 • bugs other
              </p>
            </div>
          </div>
          <div className="post-right col-4 align-self-center">
            Comments : <strong>15</strong>
            <ReactTooltip place="bottom" id="edit" className="custom-tooltip" />{" "}
            <span data-for="edit" data-tip="Edit" className="material-symbols-outlined ml-4">
              Edit
            </span>
            <ReactTooltip place="bottom" id="delete" className="custom-tooltip" />{" "}
            <span data-for="delete" data-tip="Delete" className="material-symbols-outlined ml-2">
              delete
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Posts
