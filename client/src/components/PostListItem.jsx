import TimeAgo from "react-timeago";
const PostListItem = ({ title, subtitle, cover, createdAt }) => {
  return (
    <div className="max-w-md m-auto md:max-w-2xl my-3 group cursor-pointer">
      <div className="md:flex md:justify-between">
        <div className="md:shrink-0">
          <img
            src="https://images.unsplash.com/photo-1685648042049-6138b9d12905?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1157&q=80"
            alt=""
            className="w-full h-40 object-cover md:h-40 md:w-48 rounded-lg bg-slate-300 shadow-md"
          ></img>
        </div>
        <div className="py-3 md:px-5 md:pt-0">
          <span className="text-lg font-bold group-hover:underline group-hover:underline-offset-1 group-hover:decoration-sky-500">
            {title}
          </span>

          <p className="py-1">{subtitle}</p>
          <div className="flex justify-start gap-2 text-gray-500">
            <span>@alex</span>
            <time>
              <TimeAgo date={createdAt} />
            </time>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PostListItem;
