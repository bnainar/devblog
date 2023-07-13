import PostListItem from "./PostListItem";
import { useParams } from "react-router-dom";
import { Fragment } from "react";
import { PostListLoading } from "../loading";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getAllPosts, getPostsByUser } from "../helpers/queries/getPosts";

export function PostList({ homePage = false }) {
  const limit = 3;
  const { username } = useParams();

  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: homePage ? ["posts"] : ["post", { username }],
    queryFn: homePage
      ? ({ pageParam = 0 }) => getAllPosts(pageParam, limit)
      : ({ pageParam = 0 }) => getPostsByUser(username, pageParam, limit),
    keepPreviousData: true,
    getNextPageParam: (lastPage, _) => lastPage.nextPageCursor,
  });
  if (isLoading) {
    return Array.apply(null, Array(limit)).map((_, i) => (
      <PostListLoading key={i} />
    ));
  }
  if (isError) return <div className="text-red-300">Unable to fetch posts</div>;
  const { pages } = data;
  return (
    <>
      {username && (
        <h2 className="font-semibold text-2xl text-center">
          Posts by {username}
        </h2>
      )}
      {pages?.length > 0 ? (
        pages.map((group, i) => (
          <Fragment key={i}>
            {group.posts.map((post) => (
              <PostListItem {...post} key={post._id} />
            ))}
          </Fragment>
        ))
      ) : (
        <div className="text-white">There are no posts by this user</div>
      )}
      <div>
        <button
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
          className="px-5 py-2 rounded-lg m-auto flex items-center mt-5 bg-slate-800 text-slate-200 cursor-pointer disabled:bg-inherit disabled:text-slate-600 disabled:cursor-not-allowed"
        >
          {isFetchingNextPage
            ? "Loading more..."
            : hasNextPage
            ? "Load More"
            : "Nothing more to load"}
        </button>
      </div>
      <div className="text-center">
        {isFetching && !isFetchingNextPage ? "Fetching..." : null}
      </div>
    </>
  );
}
