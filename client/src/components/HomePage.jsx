import PostListItem from "./PostListItem";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const HomePage = () => {
  const getPosts = async () => {
    try {
      const { data } = await axios({ url: "/post" });
      return data;
    } catch (error) {
      toast.error("Unable to fetch posts");
      console.log({ error });
    }
  };
  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
  });
  if (isLoading) return <div className="text-white">Loading...</div>;
  return (
    <>
      <Toaster />
      {posts.length > 0 &&
        posts.map((post) => <PostListItem {...post} key={post._id} />)}
    </>
  );
};
export default HomePage;
