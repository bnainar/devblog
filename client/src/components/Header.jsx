import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="flex justify-between p-3">
      <Link
        to="/"
        className="font-bold hover:underline hover:decoration-slate-900 hover:decoration-2"
      >
        MERN Blog
      </Link>
      <nav className="flex gap-5">
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
      </nav>
    </header>
  );
};
export default Header;
