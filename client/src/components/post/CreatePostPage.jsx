import axios from "axios";
import MDEditor from "@uiw/react-md-editor";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { sampleContent } from "../helpers/sampleContent";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSchema } from "../helpers/zodSchemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import rehypeSanitize from "rehype-sanitize";

function CreatePostPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(postSchema),
  });

  const queryClient = useQueryClient();

  const newPostMutation = (data) => {
    return axios({
      url: "/post",
      method: "post",
      data: JSON.stringify(data),
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
  };

  const postMutation = useMutation({
    mutationFn: newPostMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  if (postMutation.isSuccess) {
    navigate(`/post/${postMutation.data.data.post._id}`);
  }
  if (postMutation.isError) {
    toast.error("Unable to add post");
  }
  return (
    <>
      <Toaster />
      <form
        className="w-full flex items-center flex-col text-slate-200"
        onSubmit={handleSubmit((data) => postMutation.mutate(data))}
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
            {...register("title")}
          />
          {errors.title?.message && (
            <p className="text-red-400">{errors.title?.message}</p>
          )}
        </div>
        <div className="w-3/4 ">
          <label htmlFor="subtitle" className="py-4 pt-2 font-semibold text-lg">
            Subtitle
          </label>
          <input
            type="text"
            className="auth-input-control"
            {...register("subtitle")}
          />
          {errors.subtitle?.message && (
            <p className="text-red-400">{errors.subtitle?.message}</p>
          )}
        </div>
        <div className="w-3/4 mt-4">
          <label htmlFor="coverimg" className="py-4 pt-2 font-semibold text-lg">
            Cover Image URL
          </label>
          <input
            type="url"
            className="auth-input-control"
            {...register("cover")}
          />
          {errors.cover?.message && (
            <p className="text-red-400">{errors.cover?.message}</p>
          )}
        </div>
        <div className="w-3/4 mt-5">
          <Controller
            render={({ field }) => (
              <MDEditor
                {...field}
                height={400}
                previewOptions={{
                  rehypePlugins: [[rehypeSanitize]],
                }}
              />
            )}
            control={control}
            name="content"
            defaultValue={sampleContent}
          />
          {errors.content?.message && (
            <p className="text-red-400 mt-3">{errors.content?.message}</p>
          )}
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
