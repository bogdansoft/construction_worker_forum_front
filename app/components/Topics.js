import React, { useEffect, useContext } from "react"
import { useImmer } from "use-immer"
import { useNavigate } from "react-router-dom"
import Axios from "axios"
import Topic from "./Topic"
import Loading from "./Loading"
import StateContext from "../StateContext"
import ReactTooltip from "react-tooltip"
import { Pagination } from "@mui/material"

function Topics(props) {
  const appState = useContext(StateContext)
  const navigate = useNavigate()
  const [state, setState] = useImmer({
    feed: [],
    isLoading: true,
    paginationValue: 10,
    pagesNumber: 1,
    pageNumber: 1,
  })

  useEffect(() => {
    async function fetchData() {
      try {
        const resposne = await Axios.get("/api/topic")
        setState((draft) => {
          draft.feed = resposne.data
          draft.isLoading = false
          draft.pagesNumber = Math.ceil(resposne.data.length / 10)
        })
      } catch (e) {
        console.log("there was a problem fetching the data" + e)
      }
    }
    fetchData()
  }, [])

  function handlePage(event) {
    setState((draft) => {
      draft.pageNumber = event.target.textContent
    })
  }

  function paginate(value) {
    setState((draft) => {
      draft.paginationValue = value
      draft.pagesNumber = Math.ceil(draft.feed.length / value)
    })
  }

  function renderTopics(value) {
    const sliceTopics = state.feed.slice((state.pageNumber - 1) * 10, value * state.pageNumber)
    return sliceTopics.map((topic) => {
      return <Topic topic={topic} key={topic.id} author={topic.user} />
    })
  }

  if (state.isLoading) return <Loading />
  return (
    <div className="main container d-flex flex-column">
      <div className="mt-5">
        <h3 className="font-weight-bold text-center">Welcome to the forum about every aspect of construction working !</h3>
      </div>
      <div className="content container d-flex flex-column mt-4">
        <div className="d-flex flex-row">
          <div className="ml-4">
            <h4 className="font-weight-bold">Topics</h4>
          </div>
          <div className="ml-auto d-flex flex-row align-items-center">
            {appState.user.isAdmin || appState.user.isSupport ? (
              <button className="single-topic-content p-1 mr-3" style={{ backgroundColor: "DarkBlue" }} onClick={() => navigate(`/topic/create`)}>
                <text data-tip="Add new topic!" data-for="add-new-topic">
                  New Topic
                </text>
                <ReactTooltip id="add-new-topic" className="custom-tooltip" />
              </button>
            ) : null}
            <select
              className="mr-3"
              name="Pagination"
              id="pagination"
              onChange={(e) => {
                paginate(e.target.value)
              }}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
              <option value="40">40</option>
            </select>
            <select className="mr-3" name="Sorting" id="sorting">
              <option>Sorting</option>
              <option>Alphabetically</option>
              <option>Most popular</option>
              <option>Newest</option>
              <option>Last updated</option>
            </select>
            <div className="mr-4">
              <span className="material-symbols-outlined"> tune </span>
            </div>
          </div>
        </div>
        {renderTopics(state.paginationValue)}
        <div className="mt-2 align-items-right">
          <Pagination count={state.pagesNumber} shape="rounded" onChange={handlePage} />
        </div>
      </div>
    </div>
  )
}

export default Topics
