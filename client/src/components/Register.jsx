import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";

const Register = () => {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  const [usernameErr, setUsernameErr] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    if (user.length < 4) {
      setUsernameErr("Username should be atleast 4 characters");
      return null;
    }
    try {
      const data = await fetch("http://localhost:4000/register", {
        method: "POST",
        body: JSON.stringify({ username: user, password: pass }),
        headers: { "Content-Type": "application/json" },
      }).then((res) => res.json());

      console.log(data);
      if (data.code === 11000) {
        setUsernameErr("Username already exists");
      } else {
        console.error(data._message);
      }
    } catch (error) {
      toast.error("You're offline");
    }
  };
  return (
    <>
      <Toaster />
      <form
        className="w-full flex items-center flex-col"
        onSubmit={handleRegister}
      >
        <h2 className="text-4xl font-semibold mb-10">Create a new Account</h2>
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
