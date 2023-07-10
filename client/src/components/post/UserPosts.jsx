import { useParams } from "react-router-dom";
import axios from "axios";
import PostListItem from "./PostListItem";
import { useQuery, useQueryClient } from "@tanstack/react-query";

function UserPosts() {
  const { username } = useParams();
  const queryClient = useQueryClient();

  const getPosts = async () => {
    const { data } = await axios({ url: `/post/author/${username}` });
    return data;
  };
  const {
    data: posts,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["post", { username }],
    queryFn: getPosts,
    retry: 2,
    initialData: () =>
      queryClient
        .getQueryData(["post"])
        ?.filter((post) => post.author.username === username),
  });
  if (isLoading)
    return <div className="text-white animate-pulse">Loading...</div>;
  if (isError) return <div className="text-red-300">Unable to fetch posts</div>;
  return (
    <>
      <h2 className="font-semibold text-2xl text-center">
        Posts by {username}
      </h2>
      {posts.length > 0 ? (
        posts.map((post) => <PostListItem {...post} key={post._id} />)
      ) : (
        <div className="text-white">There are no posts by {username} </div>
      )}
    </>
  );
}

export default UserPosts;
