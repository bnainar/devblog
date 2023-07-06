import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { UserContext } from "../context/UserContext";

const Login = () => {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const { setUserInfo } = useContext(UserContext);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (user.length < 4 || pass.length < 6) {
      toast.error("Enter valid credentials");
      return null;
    }
    try {
      const res = await fetch("http://localhost:4000/login", {
        method: "POST",
        body: JSON.stringify({ username: user, password: pass }),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      console.log(res);
      if (res.ok) {
        setUserInfo({ username: user });
        navigate("/");
      } else {
        toast.error("Wrong Credentials");
      }
    } catch (error) {
      toast.error("You're offline");
    }
  };
  return (
    <>
      <form
        className="w-full flex items-center flex-col"
        onSubmit={handleSubmit}
      >
        <h2 className="text-4xl font-semibold mb-10">Login to Continue</h2>
        <div className="w-3/4 md:w-64">
          <label htmlFor="name" className="my-4 font-semibold text-lg">
            Name
          </label>
          <input
            type="text"
            className="auth-input-control"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            required
          />
        </div>
        <div className="w-3/4 md:w-64">
          <label htmlFor="password" className="py-4 pt-2 font-semibold text-lg">
            Password
          </label>
          <input
            type="password"
            className="auth-input-control"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            required
          />
        </div>
        <input
          type="submit"
          value="Login"
          className="bg-purple-600 text-white font-semibold mt-4 py-2 px-5 w-3/4 md:w-64 rounded-md shadow-sm hover:shadow-lg hover:bg-purple-700 cursor-pointer"
        />
      </form>
      <Toaster />
    </>
  );
};
export default Login;
