import React, { useEffect, useContext } from "react"
import DispatchContext from "../DispatchContext"
import { Link } from "react-router-dom"
function Search() {
  const appDispatch = useContext(DispatchContext)
  return (
    <div className="search-overlay container">
      <div className="search-overlay-top shadow-sm">
        <div className="container container--narrow">
          <label htmlFor="live-search-field" className="search-overlay-icon">
            <i className="fas fa-search"></i>
          </label>
          <div className="container ml-auto mr-auto search-bar">
            <input autoFocus type="text" autoComplete="off" id="live-search-field" className="live-search-field" placeholder="What are you interested in?" />
          </div>
          <span
            id="close-search-bar"
            onClick={() => {
              appDispatch({ type: "closeSearch" })
            }}
            className="material-symbols-outlined"
          >
            cancel
          </span>
        </div>
      </div>

      <div className="search-overlay-bottom">
        <div className="container container--narrow py-3">
          <div className="live-search-results live-search-results--visible">
            <div className="list-group shadow-sm">
              Topics
              <div class="search-result mt-2">
                <a href="#" className="d-flex">
                  Topic number one
                  <span className=" ml-auto mr-3">Created: 01-01-2021 By login </span>
                </a>
              </div>
              <div class="search-result mt-2">
                <a href="#" className="d-flex">
                  Topic number one
                  <span className="ml-auto mr-3">Created: 01-01-2021 By login </span>
                </a>
              </div>
              <div class="search-result mt-2">
                <a href="#" className="d-flex">
                  Topic number one
                  <span className="ml-auto mr-3">Created: 01-01-2021 By login </span>
                </a>
              </div>
            </div>
            <div className="list-group shadow-sm mt-2">
              Posts
              <div class="search-result mt-2">
                <a href="#" className="d-flex">
                  Post number one
                  <span className=" ml-auto mr-3">Created: 01-01-2021 By login </span>
                </a>
              </div>
              <div class="search-result mt-2">
                <a href="#" className="d-flex">
                  Post number one
                  <span className="ml-auto mr-3">Created: 01-01-2021 By login </span>
                </a>
              </div>
              <div class="search-result mt-2">
                <a href="#" className="d-flex">
                  Post number one
                  <span className="ml-auto mr-3">Created: 01-01-2021 By login </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Search
