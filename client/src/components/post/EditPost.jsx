import axios from "axios";
import MDEditor from "@uiw/react-md-editor";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFetchPostInfo } from "../helpers/queries/useFetchPostInfo";

function EditPost() {
  const { id } = useParams();
  const { data: post, isLoading, isError } = useFetchPostInfo(id);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setSubtitle(post.subtitle);
      setContent(post.content);
    }
  }, [post, isLoading]);

  const editPostMutationFn = (data) => {
    return axios({
      url: "/post",
      method: "put",
      data,
      withCredentials: true,
    });
  };

  const editPostMutation = useMutation({
    mutationFn: editPostMutationFn,
    onSuccess: (data) => {
      queryClient.setQueryData(["post", { id }], data);
      navigate(`/post/${id}`);
    },
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append("title", title);
    formdata.append("subtitle", subtitle);
    formdata.append("content", content);
    formdata.append("postId", post._id);
    if (files?.[0]) formdata.append("cover", files[0]);
    editPostMutation.mutate(formdata);
  };
  if (isLoading) return <div className="animate-pulse">Loading...</div>;
  if (isError) return <div>Unable to fetch Post info</div>;
  return (
    <>
      <form
        className="w-full flex items-center flex-col text-slate-200"
        onSubmit={handleSubmit}
      >
        <h2 className="text-3xl font-semibold mb-10 text-slate-100">
          Edit Post
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
            onChange={(e) => setFiles(e.target.files)}
          />
        </div>
        <div className="w-3/4 mt-5 bg-white">
          <MDEditor value={content} onChange={setContent} height={400} />
        </div>
        <input
          type="submit"
          value="Submit"
          disabled={false}
          className="bg-green-600 text-white bg-blend-lighten font-semibold mb-7 mt-10 py-2 px-5 w-3/4 md:w-64 rounded-md shadow-sm hover:shadow-lg cursor-pointer"
        />
      </form>
    </>
  );
}

export default EditPost;
