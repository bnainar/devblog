export const PostListLoading = () => {
  return (
    <div className="max-w-md m-auto md:max-w-2xl my-3 pt-3">
      <div className="md:flex md:flex-row rounded-lg p-2">
        <div className="md:shrink-0 ">
          <div className="w-full h-40 animate-pulse md:h-40 md:w-56 rounded-lg bg-slate-600 border-0 shadow-md"></div>
        </div>
        <div className="py-3 md:px-5 md:pt-0 md:flex-1">
          <div className="bg-slate-600 h-3 w-2/3 animate-pulse mt-2"></div>
          <div className="bg-slate-600 h-3 w-1/3 my-5 animate-pulse"></div>

          <div className="flex justify-start gap-2">
            <span className="bg-slate-600 h-3 w-10 animate-pulse mr-5"></span>
            <span className="bg-slate-600 h-3 w-10 animate-pulse"></span>
          </div>
        </div>
      </div>
    </div>
  );
};
