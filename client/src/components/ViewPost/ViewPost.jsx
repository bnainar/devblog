import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import MDEditor from "@uiw/react-md-editor";
import { useNavigate, useParams } from "react-router-dom";
import TimeAgo from "react-timeago";
import ViewPostLoading from "./loading";

function ViewPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [postInfo, setPostInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:4000/post/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setPostInfo(data);
        setLoading(false);
      })
      .catch(() => navigate("/"));
  }, [id, navigate]);
  return (
    <>
      <Toaster />
      {loading && <ViewPostLoading />}
      {postInfo && (
        <article className="px-2">
          <h1 className="text-3xl text-slate-200 font-semibold text-center mb-5">
            {postInfo.title}
          </h1>
          <span className="text-xl text-slate-500 text-center block mb-5">
            {postInfo.subtitle}
          </span>
          <img
            src={`http://localhost:4000/${postInfo.cover}`}
            alt="Post cover"
            className="rounded-lg shadow-sm md:max-h-72 m-auto"
          />
          <div className="flex gap-5 justify-center text-slate-600 mt-5">
            <span>@{postInfo.author.username}</span>
            <time>
              <TimeAgo date={postInfo.createdAt} />
            </time>
          </div>
          <main className="md:px-10 mt-5 px-5">
            <MDEditor.Markdown
              source={postInfo.content}
              style={{ whiteSpace: "pre-wrap" }}
              className="px-5"
            />
          </main>
        </article>
      )}
    </>
  );
}

export default ViewPost;
