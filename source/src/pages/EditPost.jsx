import React, { useState, useEffect, useContext } from "react"
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { UserContext } from "../context/UserContext"


const modules = {
    toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ "list": "ordered" }, { "list": "bullet" }, { "indent": "-1" }, { "indent": "+1" }],
        ["link", "image"],
        ["clean"]
    ]
}
const POST_CATEGORIES = ["Agriculture", "Business", "Education", "Entertainment", "Art", "Investment", "Uncategorized", "Weather"]

const formats = [
    "header",
    "bold", "italic", "underline", "strike", "blockquote",
    "list", "bullet", "indent",
    "link", "image"
]

const EditPost = () => {
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("Uncategorized");
    const [description, setDescription] = useState("");
    const [thumbnail, setThumbnail] = useState("");
    const [error, setError] = useState();
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useContext(UserContext);

    useEffect(() => {
        const token = currentUser?.refreshToken;
        if (!token) navigate("/login");



        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/posts/${id}`)
            .then(res => {
                setTitle(res.data.data.title);
                setCategory(res.data.data.category);
                setDescription(res.data.data.description);
                setThumbnail(res.data.data.thumbnail);
            })
            .catch(err => { })
    }, [])

    const editPostHandler = (e) => {
        e.preventDefault();

        const postData = new FormData();
        postData.set("title", title)
        postData.set("category", category)
        postData.set("description", description)
        postData.set("thumbnail", thumbnail)

        axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/posts/${id}`, postData)
            .then(res => {
                if (res.data.statusCode === 200) return navigate("/");
            })
            .catch(err => {
                const index = err.response.data.indexOf("<pre>");
                const Lastindex = err.response.data.indexOf("</pre>");
                const errMsg = err.response.data.substring(index + 5, Lastindex);
                setError(errMsg)
            })
    }

    return (
        <section className="create-post">
            <div className="container">
                <h2>Edit Post</h2>
                {error && <p className="form__error-message">
                    {error}
                </p>}
                <form className="form create-post__form" onSubmit={editPostHandler}>
                    <input type="text" placeholder="Title" value={title}
                        onChange={(e) => setTitle(e.target.value)} autoFocus />
                    <select name="category" value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        {
                            POST_CATEGORIES.map(cat => <option key={cat}>{cat}</option>)
                        }
                    </select>
                    <ReactQuill modules={modules} formats={formats} value={description}
                        onChange={setDescription}
                    />
                    <input type="file" onChange={e => setThumbnail(e.target.files[0])} accept="png, jpg, jpeg" />
                    <button type="submit" className="btn primary">Update</button>
                </form>
            </div>
        </section>
    )
}

export default EditPost