import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { UserContext } from "../context/UserContext";

const Header = () => {
  const { userInfo, setUserInfo } = useContext(UserContext);
  useEffect(() => {
    fetch("http://localhost:4000/token", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setUserInfo(data);
      })
      .catch(() => toast.error("Unable to verify token"));
  }, [setUserInfo]);

  const logout = async () => {
    try {
      await fetch("http://localhost:4000/logout", {
        credentials: "include",
        method: "POST",
      });
      setUserInfo(null);
      toast.success("Logged out");
    } catch (error) {
      toast.error("You're offline");
    }
  };

  const username = userInfo?.username;

  return (
    <header className="flex justify-between p-3">
      <Link
        to="/"
        className="font-bold hover:underline hover:decoration-slate-900 hover:decoration-2"
      >
        MERN Blog
      </Link>
      <Toaster />
      <nav className="flex gap-5">
        {username && (
          <>
            <Link
              to="/new"
              className="hover:underline hover:decoration-orange-400 hover:decoration-2"
            >
              Create new Post
            </Link>
            <span
              onClick={logout}
              className="hover:underline hover:decoration-red-500 hover:decoration-2 cursor-pointer"
            >
              {username}
              <span className="text-slate-500"> (Logout)</span>
            </span>
          </>
        )}
        {!username && (
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
