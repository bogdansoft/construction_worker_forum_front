import React, {useContext, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import StateContext from "../StateContext";
import Axios from "axios";
import {SingleBookmarkedPostProfile} from "./SingleBookmarkedPostProfile";

export const UserProfileFollowedPosts = () => {
    const [posts, setPosts] = useState([])
    const {id} = useParams()
    const appState = useContext(StateContext)

    useEffect(() => {
        const ourRequest = Axios.CancelToken.source()

        async function fetchPosts() {
            try {
                const response = await Axios.get(`/api/user/following_posts?userId=${appState.user.id}`, {headers: {Authorization: `Bearer ${appState.user.token}`}}, {cancelToken: ourRequest.token})
                setPosts(response.data)
            } catch (e) {
                console.log("There was a problem" + e)
            }
        }

        fetchPosts()
        return () => {
            ourRequest.cancel()
        }
    }, [id])

    return (
        <section id="content1">
            {posts.map((post) => {
                return <SingleBookmarkedPostProfile post={post} key={post.id} comments={post.comments.length}/>
            })}
        </section>
    )
}