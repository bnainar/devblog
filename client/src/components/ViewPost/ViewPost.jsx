import axios from "axios";
import TimeAgo from "react-timeago";
import ViewPostLoading from "./loading";
import { Toaster } from "react-hot-toast";
import MDEditor from "@uiw/react-md-editor";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useTokenValidation } from "../helpers/useTokenValidation";

function ViewPost() {
  const { id } = useParams();
  const tokenQuery = useTokenValidation();
  const userId = tokenQuery?.data?.id;

  const getPostInfo = async (id) => {
    const { data } = await axios({ url: `/post/${id}` });
    return data;
  };

  const postQuery = useQuery({
    queryKey: ["postInfo", id],
    queryFn: () => getPostInfo(id),
    retry: 2,
  });
  if (postQuery.isLoading) {
    return <ViewPostLoading />;
  }
  if (postQuery.isError) {
    return <div className="text-white">Post not found</div>;
  }
  const { data: postInfo } = postQuery;
  return (
    <>
      <Toaster />

      <article className="px-2 text-white">
        {JSON.stringify(postInfo.author._id)}
        {JSON.stringify(userId)}
        <h1 className="text-3xl text-slate-200 font-semibold text-center mb-5">
          {postInfo.title}
        </h1>
        <span className="text-xl text-slate-500 text-center block mb-5">
          {postInfo.subtitle}
        </span>
        <img
          src={`http://localhost:4000/${postInfo.cover}`}
          alt="Post cover"
          onError={(event) => (event.target.style.display = "none")}
          className="rounded-lg shadow-sm md:max-h-72 m-auto"
        />
        <div className="flex gap-5 justify-center text-slate-600 mt-5">
          <span>@{postInfo.author.username}</span>
          <time>
            <TimeAgo date={postInfo.createdAt} />
          </time>
          {postInfo.author._id === userId && <span>delete</span>}
          {postInfo.author._id === userId && <span>edit</span>}
        </div>
        <main className="md:px-10 mt-5 px-5">
          <MDEditor.Markdown
            source={postInfo.content}
            style={{ whiteSpace: "pre-wrap" }}
            className="px-5"
          />
        </main>
      </article>
    </>
  );
}

export default ViewPost;
