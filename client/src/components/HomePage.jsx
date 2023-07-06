import PostListItem from "./PostListItem";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetch("http://localhost:4000/post")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
      })
      .catch(() => toast.error("Unable to fetch posts"));
  }, []);
  return (
    <>
      <Toaster />
      {posts.length > 0 &&
        posts.map((post) => <PostListItem {...post} key={post._id} />)}
    </>
  );
};
export default HomePage;
