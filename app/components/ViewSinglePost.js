import React, {useEffect, useState} from "react"
import {Link, useParams} from "react-router-dom"
import Axios from "axios"

function ViewSinglePost(props) {
    const { id } = useParams()
    const [post, setPost] = useState()

    useEffect(() => {
        const ourRequest = Axios.CancelToken.source()

        async function fetchPost() {
            try {
                const response = await Axios.get(`localhost:8080/api/post/${id}`, { cancelToken: ourRequest.token })
                setPost(response.data)
                setIsLoading(false)
            } catch (e) {
                console.log("There was a problem or the request was cancelled.")
            }
        }
        fetchPost()
        return () => {
            ourRequest.cancel()
        }
    }, [id])

    return (
    <div className="main container">
        <div className="forum-content d-flex flex-column">
            <div className="list-group">
                <Link to={`/post/${post._id}/edit`} data-tip="Edit" data-for="edit" className="text-primary mr-2">
                    <i className="fas fa-edit"></i>
                </Link>
            </div>
        </div>
    </div>
    )
}

export default ViewSinglePost