import axios from "axios";
import { useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { sampleContent } from "./helpers/sampleContent";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function CreatePostPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState(sampleContent);
  const [files, setFiles] = useState("");

  const queryClient = useQueryClient();

  const newPostMutation = (formdata) => {
    return axios({
      url: "/post",
      method: "post",
      data: formdata,
      withCredentials: true,
    });
  };

  const postMutation = useMutation({
    mutationFn: newPostMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append("title", title);
    formdata.append("subtitle", subtitle);
    formdata.append("content", content);
    formdata.append("cover", files[0]);
    postMutation.mutate(formdata);
  };

  if (postMutation.isSuccess) {
    navigate(`/post/${postMutation.data.data.id}`);
  }
  if (postMutation.isError) {
    toast.error("Unable to add post");
  }
  return (
    <>
      <Toaster />
      <form
        className="w-full flex items-center flex-col text-slate-200"
        onSubmit={(e) => handleSubmit(e)}
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
          disabled={postMutation.isLoading}
          className="bg-green-600 text-white bg-blend-lighten font-semibold mb-7 mt-10 py-2 px-5 w-3/4 md:w-64 rounded-md shadow-sm hover:shadow-lg cursor-pointer"
        />
      </form>
    </>
  );
}

export default CreatePostPage;
