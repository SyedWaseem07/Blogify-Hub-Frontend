import React, { useState, useEffect } from "react"
import axios from "axios"
import PostItem from "./PostItem"
import Loader from "../pages/Loader"


const Posts = () => {
    const [allPosts, setAllPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchPosts =  () => {
            setIsLoading(true)
            axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/posts/`)
            .then(res => {
                setIsLoading(false);
                setAllPosts(res?.data.data);
            })
            .catch(err => {})
        }

        fetchPosts();
    }, [])

    if(isLoading) return <Loader />
  return (
    <section className="posts">
        {allPosts.length>0 ? <div className="container posts__container">
            {
                allPosts.map(
                    ({_id: id, thumbnail, category, title, desc, creator, createdAt}) => 
                        <PostItem key={id}  id={id} thumbnail={thumbnail} title={title} category={category} desc={desc} creator={creator} createdAt={createdAt} />
                )
            }
        </div> : <h2 className="center">No post found</h2>}
    </section>
  )
}

export default Posts