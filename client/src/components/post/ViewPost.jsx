import axios from "axios";
import { useState } from "react";
import { format } from "date-fns";
import { toast, Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import ViewPostLoading from "./loading";
import { Dialog } from "@headlessui/react";
import MDEditor from "@uiw/react-md-editor";
import rehypeSanitize from "rehype-sanitize";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useFetchPostInfo } from "../helpers/queries/useFetchPostInfo";
import { useTokenValidation } from "../helpers/queries/useTokenValidation";

function ViewPost() {
  const tokenQuery = useTokenValidation();
  const navigate = useNavigate();
  let [isOpen, setIsOpen] = useState(false);
  const { id } = useParams();
  const { data: postInfo, isError } = useFetchPostInfo(id);
  const deletePost = async () => {
    console.log(postInfo._id);
    try {
      await axios({
        url: "/post",
        method: "delete",
        data: { postId: postInfo._id },
        withCredentials: true,
      });
      navigate("/");
    } catch (error) {
      setIsOpen(false);
      toast.error("Unable to delete post");
    }
  };

  if (isError) {
    return <div className="text-red-300">Post not found</div>;
  }
  if (!postInfo) return <ViewPostLoading />;
  return (
    <>
      <Toaster />
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm"
          aria-hidden="true"
        />
        <div className="fixed inset-0 flex items-center justify-center p-4 ">
          <Dialog.Panel className="w-full max-w-sm rounded-lg bg-[#0d1117] px-5 py-5 shadow-lg">
            <Dialog.Title
              as="h3"
              className="text-xl font-medium leading-6 text-gray-200"
            >
              Do you want to delete the Post?
            </Dialog.Title>

            <div className="mt-2">
              <p className="text-gray-500">This action is irreversible.</p>
            </div>
            <div className="flex flex-row justify-end gap-5 mt-4">
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 px-5 py-2 rounded-md hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={() => deletePost()}
                className="bg-red-600 text-white px-5 py-2 rounded-md hover:bg-red-700 shadow-sm"
              >
                Delete
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      <article className="px-2 text-white">
        <h1 className="text-3xl text-slate-200 font-semibold text-center mb-5">
          {postInfo.title}
        </h1>
        <span className="text-xl text-slate-500 text-center block mb-5">
          {postInfo.subtitle}
        </span>
        <img
          src={postInfo.cover}
          alt="Post cover"
          onError={(e) => (e.target.style.display = "none")}
          className="rounded-lg shadow-sm m-auto object-cover h-64"
        />

        <div className="flex gap-5 justify-center text-slate-600 mt-5">
          <span
            onClick={() => navigate(`/author/${postInfo.author?.username}`)}
            className="hover:underline hover:cursor-pointer"
          >
            @{postInfo.author?.username}
          </span>
          <time>{format(new Date(postInfo.createdAt), "MMM d, y")}</time>
          {tokenQuery.isSuccess &&
            tokenQuery.data?.id === postInfo.author._id && (
              <span
                onClick={() => setIsOpen(true)}
                className="hover:underline hover:cursor-pointer"
              >
                delete
              </span>
            )}
          {tokenQuery.isSuccess &&
            tokenQuery.data?.id === postInfo.author._id && (
              <Link to={`/post/edit/${postInfo._id}`}>edit</Link>
            )}
        </div>
        <main className="mt-5">
          {postInfo.content ? (
            <MDEditor.Markdown
              source={postInfo.content}
              style={{ whiteSpace: "pre-wrap" }}
              className="md:px-5"
              rehypePlugins={[[rehypeSanitize]]}
            />
          ) : (
            <p className="text-white animate-pulse text-center">
              Loading post body...
            </p>
          )}
        </main>
      </article>
    </>
  );
}

export default ViewPost;
