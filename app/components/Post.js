import React, { useEffect } from "react"

function Post() {
  return (
    <div className="d-flex flex-column">
      <div className="single-post container mt-3 d-flex flex-row">
        <div className="mr-3 col-2 text-center">
          <img src="https://th.bing.com/th/id/OIP.SOJ-Oat9i6WjYQ8SoFoe4AHaHa?pid=ImgDet&rs=1" />
          <p>
            by <span className="mt-2 font-weight-bold">Robur</span>
          </p>
        </div>
        <div className="post">
          <div className="d-flex">
            <h2>These five things will make your work easy</h2>
            <span className="material-symbols-outlined ml-auto align-self-center"> edit </span>
            <span className="material-symbols-outlined ml-2 align-self-center"> delete </span>
          </div>
          <p className="mt-3">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Commodo ullamcorper a lacus vestibulum sed arcu non odio euismod. Scelerisque mauris pellentesque pulvinar pellentesque habitant morbi tristique senectus et. <br />
            <br />
            Tincidunt vitae semper quis lectus nulla at. Vitae tempus quam pellentesque nec nam aliquam sem. In ornare quam viverra orci sagittis eu.
          </p>
          <span className="material-symbols-outlined mt-3"> thumb_up </span>
          <span className="material-symbols-outlined ml-3"> share </span>
          <span className="material-symbols-outlined ml-3"> report </span>
        </div>
      </div>
      <div className="comments mt-5 container">
        <hr className="mb-5" />
        <div className="comment d-flex flex-row align-items-center ml-auto mr-auto">
          <div className="mr-3 col-2 text-center">
            <img src="https://www.nirix.com/uploads/files/Images/general/misc-marketing/avatar-2@2x.png" />
            <p className="font-weight-bold mt-2">Robur</p>
          </div>
          <div className="comment-body">
            <p>Hey ! Nice article. I really needed this. Have a nice day !</p>
          </div>
          <div className="ml-auto">
            <span className="material-symbols-outlined"> edit </span>
            <span className="material-symbols-outlined"> delete </span>
          </div>
        </div>
        <div className="mt-4"></div>
        <div className="comment d-flex flex-row align-items-center ml-auto mr-auto">
          <div className="mr-3 col-2 text-center">
            <img src="https://th.bing.com/th/id/OIP.PXqXsWvKQKc18fg18kL3GQHaHa?pid=ImgDet&rs=1" />
            <p className="font-weight-bold mt-2">Darek</p>
          </div>
          <div className="comment-body">
            <p>Your article sucks. I will report you. Get banned</p>
          </div>
          <div className="ml-auto">
            <span className="material-symbols-outlined"> edit </span>
            <span className="material-symbols-outlined"> delete </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Post
