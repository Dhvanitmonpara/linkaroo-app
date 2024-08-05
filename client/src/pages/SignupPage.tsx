import axios, { AxiosError } from "axios";
// import { useEffect } from "react";
import useProfileStore from "../store/profileStore.js";
import { Input } from "@/components/ui/input.js";
import { Button } from "@/components/ui/button.js";
import { Link, useNavigate } from "react-router-dom";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { useState } from "react";
import { useForm } from "react-hook-form";
import getErrorFromAxios from "@/utils/getErrorFromAxios.js";
import { Loader2 } from "lucide-react";

const SignupPage = () => {
  const { addProfile } = useProfileStore();
  const [isPasswordShowing, setIsPasswordShowing] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit } = useForm<SignupFormData>();

  const navigate = useNavigate();

  const emailReg =
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
  const usernameReg = /[a-zA-Z][a-zA-Z0-9-_]{3,32}/;

  const userLogin = async (data: {
    username: string;
    email: string;
    password: string;
  }) => {
    try {
      setLoading(true);
      setError(null);

      const userCredentials = {
        password: data.password,
        email: "",
        username: "",
      };

      if (emailReg.test(data.email) && usernameReg.test(data.username)) {
        userCredentials.email = data.email;
        userCredentials.username = data.username;
      } else {
        setError("Invalid email or username");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_API_URL}/users/signup`,
        userCredentials
      );

      if (response?.data) {
        addProfile(response.data);
        navigate("/");
      }
    } catch (err) {
      const errorMsg = getErrorFromAxios(err as AxiosError);
      if (errorMsg !== undefined) {
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  type SignupFormData = {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
  };

  return (
    <div className="min-h-screen select-none bg-gradient-to-r from-slate-900 to-zinc-900 flex justify-center items-center">
      <div className="text-white bg-[#00000025] flex flex-col space-y-8 justify-center items-center p-8 rounded-xl">
        <h1 className="font-semibold text-4xl">Signup to Linkaroo</h1>
        <form
          action="post"
          className="h-4/5 flex flex-col space-y-6 w-96 justify-center items-center"
          onSubmit={handleSubmit(userLogin)}
        >
          <div className="flex space-x-2">
            <div className="w-full space-y-2">
              <label htmlFor="first-name">First name</label>
              <Input
                id="first-name"
                type="text"
                placeholder="Enter First name"
                className="bg-slate-800"
                {...register("firstName", {
                  required: true,
                })}
              />
            </div>
            <div className="w-full space-y-2">
              <label htmlFor="last-name">Last name</label>
              <Input
                id="last-name"
                type="text"
                placeholder="Enter Last name"
                className="bg-slate-800"
                {...register("lastName")}
              />
            </div>
          </div>
          <div className="w-full space-y-2">
            <label htmlFor="username">Username</label>
            <Input
              id="username"
              type="text"
              placeholder="Enter Username"
              className="bg-slate-800"
              {...register("username", {
                required: true,
              })}
            />
          </div>
          <div className="w-full space-y-2">
            <label htmlFor="email">Email</label>
            <Input
              id="email"
              type="email"
              placeholder="Enter Email"
              className="bg-slate-800"
              {...register("email", {
                required: true,
              })}
            />
          </div>
          <div className="w-full space-y-2 pb-4">
            <label htmlFor="confirm-password">Password</label>
            <div className="w-full flex relative">
              <Input
                id="confirm-password"
                type={isPasswordShowing ? "text" : "password"}
                placeholder="Enter Password"
                className="bg-slate-800"
                {...register("password", {
                  required: true,
                })}
              />
              <div
                className="w-12 absolute right-0 flex justify-center items-center h-full cursor-pointer"
                onClick={() => {
                  setIsPasswordShowing((prev) => !prev);
                }}
              >
                {isPasswordShowing ? <IoMdEyeOff /> : <IoMdEye />}
              </div>
            </div>
          </div>
          <div className="w-full space-y-2 pb-4">
            <label htmlFor="password">Password</label>
            <div className="w-full flex relative">
              <Input
                id="password"
                type={isPasswordShowing ? "text" : "password"}
                placeholder="Enter Password"
                className="bg-slate-800"
                {...register("password", {
                  required: true,
                })}
              />
              <div
                className="w-12 absolute right-0 flex justify-center items-center h-full cursor-pointer"
                onClick={() => {
                  setIsPasswordShowing((prev) => !prev);
                }}
              >
                {isPasswordShowing ? <IoMdEyeOff /> : <IoMdEye />}
              </div>
            </div>
          </div>
          {loading ? (
            <Button
              disabled
              className="bg-slate-800 hover:bg-slate-700 w-full cursor-wait"
            >
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
            </Button>
          ) : (
            <Button className="bg-slate-800 hover:bg-slate-700 w-full">
              Create an Account
            </Button>
          )}
          <p className="text-center">
            Already have an account?{" "}
            <Link
              to="/login"
              className="hover:underline text-blue-500 cursor-pointer"
            >
              Login
            </Link>
            <br />
            {error && <span className="text-red-500">{error}</span>}
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
