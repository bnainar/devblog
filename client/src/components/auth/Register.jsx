import { useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../helpers/zodSchemas";
import { useQueryClient } from "@tanstack/react-query";

const Register = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });
  const handleRegister = async (data) => {
    try {
      setIsLoading(true);
      await axios({
        url: "/auth/register",
        method: "post",
        data: JSON.stringify(data),
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      queryClient.refetchQueries({ queryKey: ["userInfo"] });
      navigate("/login");
    } catch (error) {
      setIsLoading(false);
      if (error.response?.data?.code === 11000) {
        return toast.error("Username already exists");
      }
      toast.error("Failed to login");
    }
  };
  return (
    <>
      <Toaster />
      <form
        className="w-full flex items-center flex-col text-slate-200"
        onSubmit={handleSubmit(handleRegister)}
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
            {...register("username")}
          />
          {errors.username?.message && (
            <p className="text-red-400">{errors.username?.message}</p>
          )}
        </div>
        <div className="w-3/4 md:w-64">
          <label htmlFor="password" className="py-4 pt-2 font-semibold text-lg">
            Password
          </label>
          <input
            type="password"
            className="auth-input-control"
            {...register("password")}
          />
          {errors.password?.message && (
            <p className="text-red-400">{errors.password?.message}</p>
          )}
        </div>
        <div className="w-3/4 md:w-64">
          <label htmlFor="password" className="py-4 pt-2 font-semibold text-lg">
            Confirm Password
          </label>
          <input
            type="password"
            className="auth-input-control"
            {...register("confirmpassword")}
          />
          {errors.confirmpassword?.message && (
            <p className="text-red-400">{errors.confirmpassword?.message}</p>
          )}
        </div>
        <input
          type="submit"
          value={isLoading ? "Registering..." : "Register"}
          disabled={isLoading}
          className="bg-green-600 disabled:bg-slate-700 disabled:text-slate-400 text-white font-semibold mt-4 py-2 px-5 w-3/4 md:w-64 rounded-md shadow-sm hover:shadow-lg hover:bg-green-700 cursor-pointer"
        />
      </form>
    </>
  );
};
export default Register;
