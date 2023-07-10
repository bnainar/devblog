import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useTokenValidation } from "./helpers/queries/useTokenValidation";

const Header = () => {
  const queryClient = useQueryClient();

  const logout = async () => {
    try {
      await axios({
        url: "/auth/logout",
        method: "post",
        withCredentials: true,
      });
      queryClient.refetchQueries({ queryKey: ["userInfo"] });
      toast.success("Logged out");
    } catch (error) {
      toast.error("Unable to logout");
    }
  };
  const tokenQuery = useTokenValidation();

  const username = tokenQuery.data?.username;

  return (
    <header className="flex justify-between p-3 text-slate-300">
      <Link
        to="/"
        className="font-bold hover:underline hover:decoration-slate-300 hover:decoration-2"
      >
        DevBlog
      </Link>
      <nav className="flex gap-5">
        {(tokenQuery.isLoading ||
          tokenQuery.isRefetching ||
          tokenQuery.isFetching) && (
          <div className="animate-pulse">checking token...</div>
        )}
        {tokenQuery.isSuccess && (
          <>
            <Link
              to="/new"
              className="hover:underline hover:decoration-orange-400 hover:decoration-2"
            >
              Create new Post
            </Link>
            <span
              onClick={() => logout()}
              className="hover:underline hover:decoration-red-500 hover:decoration-2 cursor-pointer"
            >
              {username}
              <span className="text-slate-500"> (Logout)</span>
            </span>
          </>
        )}
        {tokenQuery.isError && (
          <>
            <Link
              to="/register"
              className="hover:underline hover:decoration-green-500 hover:decoration-2"
            >
              Register
            </Link>
            <Link
              to="/login"
              className="hover:underline hover:decoration-purple-500 hover:decoration-2"
            >
              Login
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};
export default Header;
