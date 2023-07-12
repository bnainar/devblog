import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

const Login = () => {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (user.length < 4 || pass.length < 6) {
      toast.error("Username should be atleast 4 chars long and 6 for password");
      return;
    }
    try {
      await axios({
        url: "/auth/login",
        method: "post",
        data: JSON.stringify({ username: user, password: pass }),
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      queryClient.invalidateQueries({ queryKey: ["userInfo"] });
      navigate("/");
    } catch (error) {
      toast.error("Wrong credentials");
    }
  };
  return (
    <>
      <form
        className="w-full flex items-center flex-col text-slate-200"
        onSubmit={handleLogin}
      >
        <h2 className="text-4xl font-semibold mb-10 text-slate-100">
          Login to Continue
        </h2>
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
