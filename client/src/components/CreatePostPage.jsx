import MDEditor from "@uiw/react-md-editor";
import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import "react-quill/dist/quill.snow.css";

function CreatePostPage() {
  const { userInfo } = useContext(UserContext);
  const navigate = useNavigate();
  if (userInfo == null) navigate("/");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState(
    `
  An h1 header
============

Paragraphs are separated by a blank line.

2nd paragraph. *Italic*, **bold**, and \`monospace\`. 
Code blocks are formatted like this
\`\`\`java
public int gcd(int a, int b) {
  if (b==0) return a;
  return gcd(b,a%b);
}
\`\`\`
  `
  );
  const [files, setFiles] = useState("");

  const handleNewPost = async (e) => {
    e.preventDefault();

    const formdata = new FormData();
    formdata.append("title", title);
    formdata.append("subtitle", subtitle);
    formdata.append("content", content);
    formdata.append("cover", files[0]);

    fetch("http://localhost:4000/post/new", {
      method: "POST",
      body: formdata,
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => navigate(`/post/${data.id}`));
  };

  return (
    <>
      <form
        className="w-full flex items-center flex-col text-slate-200"
        onSubmit={handleNewPost}
      >
        <h2 className="text-3xl font-semibold mb-10 text-slate-100">
          Add new Post
        </h2>
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
          <MDEditor value={content} onChange={setContent} height={400} />
        </div>
        <input
          type="submit"
          value="Submit"
          className="bg-green-600 text-white bg-blend-lighten font-semibold mb-7 mt-10 py-2 px-5 w-3/4 md:w-64 rounded-md shadow-sm hover:shadow-lg cursor-pointer"
        />
      </form>
    </>
  );
}

export default CreatePostPage;
