function ViewPostLoading() {
  return (
    <article className="px-2">
      <div className="text-3xl font-semibold text-center mb-5 bg-slate-700 animate-pulse h-7 w-1/2 m-auto rounded-sm"></div>
      <div className="text-xl text-slate-600 text-center mb-5 bg-slate-700 animate-pulse h-4 w-3/4 m-auto rounded-sm"></div>
      <div className="rounded-lg shadow-sm h-72 m-auto w-1/2 bg-slate-700 animate-pulse"></div>
      <div className="flex gap-5 justify-center text-slate-600 mt-5">
        <span className="bg-slate-400 animate-pulse w-20 h-2"></span>
        <span className="bg-slate-400 animate-pulse w-20 h-2"></span>
      </div>
    </article>
  );
}

export default ViewPostLoading;
