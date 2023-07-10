import axios from "axios";
import PostListItem from "./post/PostListItem";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const HomePage = () => {
  const queryClient = useQueryClient();
  const getPosts = async () => {
    const { data } = await axios({ url: "/post" });
    return data;
  };
  const {
    data: posts,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["post"],
    queryFn: getPosts,
    retry: 2,
  });
  console.log(queryClient.getQueriesData(["post"]));
  if (isLoading)
    return <div className="text-white animate-pulse">Loading...</div>;
  if (isError) return <div className="text-red-300">Unable to fetch posts</div>;
  return posts.length > 0 ? (
    posts.map((post) => <PostListItem {...post} key={post._id} />)
  ) : (
    <div className="text-white">There are no posts. Add some!</div>
  );
};
export default HomePage;
