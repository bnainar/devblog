import axios from "axios";
import MDEditor from "@uiw/react-md-editor";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFetchPostInfo } from "../helpers/queries/useFetchPostInfo";
import rehypeSanitize from "rehype-sanitize";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSchema } from "../helpers/zodSchemas";

function EditPost() {
  const { id } = useParams();
  const postQuery = useFetchPostInfo(id);

  const { data: post } = postQuery;
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(postSchema),
  });
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const editPostMutationFn = (data) => {
    data.postId = id;
    return axios({
      url: "/post",
      method: "put",
      data: JSON.stringify(data),
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
  };

  const editPostMutation = useMutation({
    mutationFn: editPostMutationFn,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["post", { id }] });
      // queryClient.setQueryData(["post", { id }], data);
      navigate(`/post/${id}`);
    },
  });
  if (postQuery.isLoading)
    return <div className="animate-pulse">Loading...</div>;
  if (postQuery.isError) return <div>Unable to fetch Post info</div>;
  return (
    <>
      <form
        className="w-full flex items-center flex-col text-slate-200"
        onSubmit={handleSubmit((data) => editPostMutation.mutate(data))}
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
            {...register("title")}
            defaultValue={post.title}
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
            defaultValue={post.subtitle}
          />
          {errors.subtitle?.message && (
            <p className="text-red-400">{errors.subtitle?.message}</p>
          )}
        </div>
        <div className="w-3/4 mt-4">
          <label htmlFor="coverimg" className="py-4 pt-2 font-semibold text-lg">
            Cover Image
          </label>
          <input
            type="url"
            className="auth-input-control"
            {...register("cover")}
            defaultValue={post.cover}
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
            defaultValue={post.content}
          />
          {errors.content?.message && (
            <p className="text-red-400 mt-3">{errors.content?.message}</p>
          )}
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

export default EditPost;
