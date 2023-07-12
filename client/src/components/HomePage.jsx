import axios from "axios";
import { PostListLoading } from "./loading";
import PostListItem from "./post/PostListItem";
import { useQuery } from "@tanstack/react-query";

const HomePage = () => {
  const getPosts = async () => {
    const { data } = await axios({ url: "/post" });
    return data;
  };
  const {
    data: posts,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
    retry: 2,
  });
  if (isLoading) {
    return Array.apply(null, Array(5)).map((_, i) => (
      <PostListLoading key={i} />
    ));
  }
  if (isError) {
    return <div className="text-red-300">Unable to fetch posts</div>;
  }
  return posts.length > 0 ? (
    posts.map((post) => <PostListItem {...post} key={post._id} />)
  ) : (
    <div className="text-white">There are no posts. Add some!</div>
  );
};
export default HomePage;
