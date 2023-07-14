import { Link } from "react-router-dom";
import { format } from "date-fns";
const PostListItem = ({ _id, title, subtitle, cover, createdAt, author }) => {
  return (
    <div className="max-w-md m-auto md:max-w-2xl my-3 cursor-pointer pt-3">
      <Link to={`/post/${_id}`}>
        <div className="md:flex md:flex-row hover:ring-2 hover:ring-slate-400 rounded-lg p-2">
          {cover && (
            <div className="md:shrink-0 ">
              <img
                src={cover}
                alt="Cover of Post"
                className="w-full h-40 object-cover md:h-40 md:w-56 rounded-lg bg-slate-500 border-0 shadow-md"
              ></img>
            </div>
          )}
          <div className="py-3 md:px-5 md:pt-0 md:flex-1">
            <span className="text-lg font-bold text-slate-100">{title}</span>

            <p className="py-1 text-slate-400">{subtitle}</p>
            <div className="flex justify-start gap-2 text-gray-500">
              <span>@{author.username} • </span>
              <time>{format(new Date(createdAt), "MMM d, y")}</time>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};
export default PostListItem;
