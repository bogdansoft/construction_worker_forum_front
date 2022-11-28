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
    numberOfRecords: 1,
    orderBy: "",
    isMounted: false,
  })

  useEffect(() => {
    function fetchData() {
      try {
        fetchingTopicsOnMount()
      } catch (e) {
        console.log("there was a problem fetching the data" + e)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    async function fetchData() {
      try {
        if (state.isMounted) {
          if (state.orderBy !== "") {
            getSortedAndPaginatedTopics()
          } else {
            getPaginatedTopics()
          }
        }
      } catch (e) {
        console.log("there was a problem fetching the data" + e)
      }
    }
    fetchData()
  }, [state.pageNumber, state.paginationValue])

  useEffect(() => {
    async function fetchData() {
      try {
        if (state.isMounted) {
          getSortedTopics()
        }
      } catch (e) {
        console.log("there was a problem fetching the data" + e)
      }
    }
    fetchData()
  }, [state.orderBy])

  async function getSortedTopics() {
    const resposne = await Axios.get(`/api/topic?orderby=${state.orderBy}`)
    setState((draft) => {
      draft.feed = resposne.data.slice(0, state.paginationValue)
      draft.isLoading = false
      renderTopics
    })
  }

  async function fetchingTopicsOnMount() {
    const resposne = await Axios.get("/api/topic")
    setState((draft) => {
      draft.numberOfRecords = resposne.data.length
      draft.feed = resposne.data.slice(0, 10)
      draft.isLoading = false
      draft.pagesNumber = Math.ceil(resposne.data.length / 10)
      draft.isMounted = true
    })
  }

  async function getPaginatedTopics() {
    const resposne = await Axios.get(`/api/topic?limit=${state.paginationValue}&page=${state.pageNumber}`)
    setState((draft) => {
      draft.feed = resposne.data
      draft.isLoading = false
      renderTopics
    })
  }

  async function getSortedAndPaginatedTopics() {
    const response = await Axios.get(`/api/topic?orderby=${state.orderBy}&limit=${state.paginationValue}&page=${state.pageNumber}`)
    setState((draft) => {
      draft.feed = response.data
      draft.isLoading = false
      renderTopics
    })
  }

  function handlePage(event) {
    setState((draft) => {
      draft.pageNumber = parseInt(event.target.textContent)
    })
  }

  function paginate(value) {
    setState((draft) => {
      draft.pageNumber = 1
      draft.paginationValue = value
      draft.pagesNumber = Math.ceil(state.numberOfRecords / value)
    })
  }

  function sort(value) {
    setState((draft) => {
      draft.pageNumber = 1
      draft.orderBy = value
    })
  }

  function renderTopics() {
    return state.feed.map((topic) => {
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
              <option value="10" disabled selected>
                Pagination
              </option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
              <option value="40">40</option>
            </select>
            <select
              className="mr-3"
              name="Sorting"
              id="sorting"
              onChange={(e) => {
                sort(e.target.value)
              }}
            >
              <option value="id.asc" disabled selected>
                Sorting
              </option>
              <option value="name.asc">Alphabetically</option>
              <option value="createdAt.asc">The newest topics</option>
              <option value="createdAt.desc">The oldest topics</option>
              <option value="updatedAt.desc">Last updated</option>
            </select>
            <div className="mr-4">
              <span className="material-symbols-outlined"> tune </span>
            </div>
          </div>
        </div>
        {renderTopics()}
        <div className="mt-2 align-items-right">
          <Pagination count={state.pagesNumber} page={state.pageNumber} defaultPage={1} shape="rounded" onChange={handlePage} />
        </div>
      </div>
    </div>
  )
}

export default Topics
