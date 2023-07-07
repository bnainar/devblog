import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import TimeAgo from "react-timeago";

function ViewPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [postInfo, setPostInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:4000/post/${id}`)
      .then((res) => res.json())
      .then((data) => setPostInfo(data))
      .catch(() => navigate("/"));
    setLoading(false);
  }, [id, navigate]);
  return (
    <>
      <Toaster />
      {loading && <article>loading...</article>}
      {postInfo && (
        <article className="px-2">
          <h1 className="text-3xl font-semibold text-center mb-5">
            {postInfo.title}
          </h1>
          <span className="text-xl text-slate-600 text-center mb-5">
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
        </article>
      )}
    </>
  );
}

export default ViewPost;
