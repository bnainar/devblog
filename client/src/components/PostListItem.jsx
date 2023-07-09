import { Link } from "react-router-dom";
import TimeAgo from "react-timeago";
const PostListItem = ({ _id, title, subtitle, cover, createdAt, author }) => {
  return (
    <div className="max-w-md m-auto md:max-w-2xl my-3 cursor-pointer pt-3">
      <Link to={`post/${_id}`}>
        <div className="md:flex hover:ring-2 hover:ring-slate-400 rounded-lg p-2">
          <div className="md:shrink-0">
            <img
              src={`http://localhost:4000/${cover}`}
              alt=""
              className="w-full h-40 object-cover md:h-40 md:w-56 rounded-lg bg-slate-500 border-0 shadow-md"
            ></img>
          </div>
          <div className="py-3 md:px-5 md:pt-0 md:flex-1">
            <span className="text-lg font-bold text-slate-100">{title}</span>

            <p className="py-1 text-slate-400">{subtitle}</p>
            <div className="flex justify-start gap-2 text-gray-500">
              <span>@{author.username} • </span>
              <time>
                <TimeAgo date={createdAt} />
              </time>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};
export default PostListItem;
