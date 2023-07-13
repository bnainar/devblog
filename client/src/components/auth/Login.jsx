import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../helpers/zodSchemas";
import { useQueryClient } from "@tanstack/react-query";

const Login = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const handleLogin = async (formdata) => {
    try {
      const { data } = await axios({
        url: "/auth/login",
        method: "post",
        data: JSON.stringify(formdata),
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      queryClient.setQueryData(["userInfo"], data);
      navigate("/");
    } catch (error) {
      toast.error("Wrong credentials");
    }
  };
  return (
    <>
      <Toaster />
      <form
        className="w-full flex items-center flex-col text-slate-200"
        onSubmit={handleSubmit(handleLogin)}
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
            {...register("username")}
          />
          {errors.username?.message && (
            <p className="text-red-400">{errors.username?.message}</p>
          )}
        </div>
        <div className="w-3/4 md:w-64">
          <label
            htmlFor="password"
            className="py-4 pt-2 font-semibold text-lg mt-5"
          >
            Password
          </label>
          <input
            type="password"
            className="auth-input-control "
            {...register("password")}
          />
          {errors.password?.message && (
            <p className="text-red-400">{errors.password?.message}</p>
          )}
        </div>
        <input
          type="submit"
          value="Login"
          className="bg-purple-600 text-white font-semibold mt-5 py-2 px-5 w-3/4 md:w-64 rounded-md shadow-sm hover:shadow-lg hover:bg-purple-700 cursor-pointer"
        />
      </form>
    </>
  );
};
export default Login;
