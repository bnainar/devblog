import { useState } from "react";
import { Toaster } from "react-hot-toast";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";

const Register = () => {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  const [usernameErr, setUsernameErr] = useState("");
  const queryClient = useQueryClient();
  const handleRegister = async (e) => {
    e.preventDefault();

    if (user.length < 4) {
      setUsernameErr("Username should be atleast 4 characters");
      return null;
    }
    try {
      await axios({
        url: "/auth/register",
        method: "post",
        data: JSON.stringify({ username: user, password: pass }),
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      queryClient.invalidateQueries({ queryKey: ["userInfo"] });
      // navigate("/");
    } catch (error) {
      console.log({ error });
    }
  };
  return (
    <>
      <Toaster />
      <form
        className="w-full flex items-center flex-col text-slate-200"
        onSubmit={handleRegister}
      >
        <h2 className="text-4xl font-semibold mb-10 text-slate-100">
          Create a new Account
        </h2>
        <div className="w-3/4 md:w-64">
          <label htmlFor="name" className="my-4 font-semibold text-lg">
            Username
          </label>
          <input
            type="text"
            className="auth-input-control"
            value={user}
            autoFocus
            onChange={(e) => setUser(e.target.value)}
            required
          />
          <span
            hidden={usernameErr === ""}
            className="text-red-500 text-sm mb-2 block"
          >
            {usernameErr}
          </span>
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
          value="Register"
          className="bg-green-600 text-white font-semibold mt-4 py-2 px-5 w-3/4 md:w-64 rounded-md shadow-sm hover:shadow-lg hover:bg-green-700 cursor-pointer"
        />
      </form>
    </>
  );
};
export default Register;
