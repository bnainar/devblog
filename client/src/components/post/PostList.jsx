import PostListItem from "./PostListItem";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { PostListLoading } from "../loading";
import { useQuery } from "@tanstack/react-query";
import { getAllPosts, getPostsByUser } from "../helpers/queries/getPosts";

export function PostList({ homePage = false }) {
  const limit = 3;
  const [pageNo, setPageNo] = useState(0);
  const params = useParams();
  const username = params.username;

  const { data, isLoading, isFetching, isError, isPreviousData } = useQuery({
    queryKey: homePage ? ["posts", pageNo] : ["post", { username }, pageNo],
    queryFn: homePage
      ? () => getAllPosts(pageNo, limit)
      : () => getPostsByUser(username, pageNo, limit),
    keepPreviousData: true,
  });
  if (isLoading) {
    return Array.apply(null, Array(limit)).map((_, i) => (
      <PostListLoading key={i} />
    ));
  }
  if (isError) return <div className="text-red-300">Unable to fetch posts</div>;
  const { posts, count } = data;
  console.log({ posts, count, limit, pageNo });
  return (
    <>
      {username && (
        <h2 className="font-semibold text-2xl text-center">
          Posts by {username}
        </h2>
      )}
      {posts.length > 0 ? (
        posts.map((post) => <PostListItem {...post} key={post._id} />)
      ) : (
        <div className="text-white">There are no posts by this user</div>
      )}
      <div className="flex flex-row justify-center items-center gap-5">
        <button
          className="px-5 py-2 rounded-lg bg-slate-800 text-slate-200 cursor-pointer disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed"
          onClick={() => setPageNo((old) => Math.max(old - 1, 0))}
          disabled={pageNo === 0 || isLoading}
        >
          Previous Page
        </button>{" "}
        <button
          onClick={() => {
            if (!isPreviousData) {
              setPageNo((old) => old + 1);
            }
          }}
          className="px-5 py-2 rounded-lg bg-slate-800 text-slate-200 cursor-pointer disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed"
          disabled={isLoading || limit * (pageNo + 1) >= count}
        >
          Next Page
        </button>
      </div>
    </>
  );
}
