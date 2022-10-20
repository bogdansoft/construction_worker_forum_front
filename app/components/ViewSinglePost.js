import React, {useEffect, useState} from "react"
import {Link, useParams} from "react-router-dom"
import Axios from "axios"

function ViewSinglePost(props) {
    const {id} = useParams()
    const [post, setPost] = useState([])

    useEffect(() => {
        const ourRequest = Axios.CancelToken.source()

        async function fetchPost() {
            try {
                const response = await Axios.get(`http://localhost:8080/api/post/${id}`, {cancelToken: ourRequest.token})
                setPost(response.data)
                console.log(response.data)
            } catch (e) {
                console.log("There was a problem or the request was cancelled.")
            }
        }

        fetchPost()
        return () => {
            ourRequest.cancel()
        }
    }, [])

    function handleSubmit() {

    }

    return (
        <div className="d-flex flex-column">
            <div className="single-post container mt-3 d-flex flex-row">
                <div className="mr-3 col-2 text-center">
                    <img src="https://th.bing.com/th/id/OIP.SOJ-Oat9i6WjYQ8SoFoe4AHaHa?pid=ImgDet&rs=1"/>
                    <p>
                        by <span className="mt-2 font-weight-bold">Robur</span>
                    </p>
                </div>
                <div className="post container">
                    <div className="d-flex">
                        <h2>{post.title}</h2>
                        <Link to={`/post/${id}/edit`} data-tip="Edit" data-for="edit" className="text-primary mr-2">
                        </Link>
                        <span className="material-symbols-outlined ml-auto align-self-center"> edit </span>
                        <span className="material-symbols-outlined ml-2 align-self-center"> delete </span>
                    </div>
                    <p className="mt-3 col-10">
                        {post.content}
                    </p>
                    <span className="material-symbols-outlined mt-3"> thumb_up </span>
                    <span className="material-symbols-outlined ml-3"> share </span>
                    <span className="material-symbols-outlined ml-3"> report </span>
                </div>
            </div>
            <div className="comments mt-5 container">
                <hr className="mb-5"/>
                <form onSubmit={handleSubmit}>
                    <div className="col-6 ml-auto mr-auto d-flex flex-column comment-box">
                        <div className="d-flex flex-row">
                            <div className="mr-3 col-2 text-center">
                                <img
                                    src="https://www.nirix.com/uploads/files/Images/general/misc-marketing/avatar-2@2x.png"/>
                                <p className="font-weight-bold mt-2">USER</p>
                            </div>
                            <div>
                                <textarea rows="4" cols="50" className="no-resize"></textarea>
                            </div>
                        </div>
                        <div className="align-self-end mt-2">
                            <button className="btn btn-primary" type="submit">
                                Comment
                            </button>
                        </div>
                    </div>
                </form>
                <div className="comment mt-5 d-flex flex-row align-items-start ml-auto mr-auto">
                    <div className="mr-3 col-2 text-center">
                        <img src="https://www.nirix.com/uploads/files/Images/general/misc-marketing/avatar-2@2x.png"/>
                        <p className="font-weight-bold mt-2">Robur</p>
                    </div>
                    <div className="comment-body mt-2 col-8">
                        <p>Hey ! Nice article. I really needed this. Have a nice day !Hey ! Nice article. I really
                            needed this. Have a nice day ! Hey ! Nice article. I really needed this. Have a nice day
                            !</p>
                    </div>
                    <div className="ml-auto d-flex flex-column align-self-start">
                        <div className="align-items-start comment-date">Oct 19, 2022</div>
                        <div className="align-self-end mt-4">
                            <span className="material-symbols-outlined"> edit </span>
                            <span className="material-symbols-outlined"> delete </span>
                        </div>
                    </div>
                </div>
                <div className="mt-4"></div>
                <div className="comment d-flex flex-row align-items-start ml-auto mr-auto">
                    <div className="mr-3 col-2 text-center">
                        <img src="https://th.bing.com/th/id/OIP.PXqXsWvKQKc18fg18kL3GQHaHa?pid=ImgDet&rs=1"/>
                        <p className="font-weight-bold mt-2">Darek</p>
                    </div>
                    <div className="comment-body mt-2 col-8">
                        <p>Your article sucks. I will report you. Get banned</p>
                    </div>
                    <div className="ml-auto d-flex flex-column align-self-start">
                        <div className="align-items-start comment-date">Oct 19, 2022</div>
                        <div className="align-self-end mt-4">
                            <span className="material-symbols-outlined"> edit </span>
                            <span className="material-symbols-outlined"> delete </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewSinglePost