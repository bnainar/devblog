import ReactQuill from "react-quill";
import { useNavigate } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import { useState } from "react";

function CreatePostPage() {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const navigate = useNavigate();

  const handleNewPost = async (e) => {
    e.preventDefault();

    const formdata = new FormData();
    formdata.append("title", title);
    formdata.append("subtitle", subtitle);
    formdata.append("content", content);
    formdata.append("cover", files[0]);

    const res = await fetch("http://localhost:4000/post", {
      method: "POST",
      body: formdata,
      credentials: "include",
    });
    if (res.ok) {
      navigate("/");
    }
  };

  return (
    <>
      <form
        className="w-full flex items-center flex-col"
        onSubmit={handleNewPost}
      >
        <h2 className="text-3xl font-semibold mb-10">Add new Post</h2>
        <div className="w-3/4">
          <label htmlFor="name" className="my-4 font-semibold text-lg">
            Title
          </label>
          <input
            type="text"
            className="auth-input-control"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="w-3/4 ">
          <label htmlFor="subtitle" className="py-4 pt-2 font-semibold text-lg">
            Subtitle
          </label>
          <input
            type="text"
            className="auth-input-control"
            required
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
          />
        </div>
        <div className="w-3/4 mt-4">
          <label htmlFor="coverimg" className="py-4 pt-2 font-semibold text-lg">
            Cover Image
          </label>
          <input
            type="file"
            className="file-input mt-3 w-full"
            required
            onChange={(e) => setFiles(e.target.files)}
          />
        </div>
        <div className="w-3/4 mt-5 bg-white">
          <ReactQuill
            theme="snow"
            value={content}
            onChange={(val) => setContent(val)}
            className="ring-1 ring-slate-500 rounded-sm"
          />
        </div>
        <input
          type="submit"
          value="Submit"
          className="bg-green-600 text-white font-semibold mt-4 py-2 px-5 w-3/4 md:w-64 rounded-md shadow-sm hover:shadow-lg hover:bg-green-700 cursor-pointer"
        />
      </form>
    </>
  );
}

export default CreatePostPage;
