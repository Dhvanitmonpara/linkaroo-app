import axios from "axios";
// import { useEffect } from "react";
import useProfileStore from "../store/profileStore.js";
import { Input } from "@/components/ui/input.js";
import { Button } from "@/components/ui/button.js";
import { Link } from "react-router-dom";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { useState } from "react";
import { useForm } from "react-hook-form";

const LoginPage = () => {
  const { addProfile } = useProfileStore();
  const [isPasswordShowing, setIsPasswordShowing] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit } = useForm<LoginFormData>();

  // class ApiError extends Error {
  //   response?: { data: { message: string } };

  //   constructor(message: string, response?: { data: { message: string } }) {
  //     super(message);
  //     this.response = response;
  //   }
  // }

  // function isApiError(err: unknown): err is ApiError {
  //   return (
  //     err instanceof ApiError &&
  //     typeof (err as ApiError).response?.data?.message === "string"
  //   );
  // }

  // const handleError = (err: unknown) => {
  //   if (err instanceof ApiError) {
  //     setError(err.message);
  //   } else if (isAxiosError(err)) {
  //     const axiosError = err as AxiosError;
  //     const errorMessage =
  //       axiosError.response?.data?.message || axiosError.message;
  //     setError(errorMessage);
  //   } else {
  //     setError("An unexpected error occurred.");
  //   }
  // };

  // Type guard to check if error is an AxiosError
  // function isAxiosError(err: any): err is AxiosError {
  //   return err.isAxiosError === true;
  // }

  // // Replace this with your actual error setting function
  // function setError(message: string) {
  //   console.error(message);
  // }

  // // Assuming you are using Axios
  // import axios, { AxiosError } from "axios";

  const emailReg =
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
  const usernameReg = /[a-zA-Z][a-zA-Z0-9-_]{3,32}/;

  const userLogin = async (data: { text: string; password: string }) => {
    try {
      setLoading(true);
      setError(null);

      const userCredentials = {
        password: data.password,
        email: "",
        username: "",
      };

      if (emailReg.test(data.text)) {
        userCredentials.email = data.text;
      } else if (usernameReg.test(data.text)) {
        userCredentials.username = data.text;
      } else {
        setError("Invalid email or username");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_API_URL}/users/login`,
        userCredentials
      );

      if (response?.data) {
        addProfile(response.data);
      }
    } catch (err) {
      // FIXME: handle error appropriately
      console.log(err);
      // handleError(err);
      if (
        typeof err === "object" &&
        "response" in err &&
        err !== null &&
        err instanceof ApiError
      ) {
        setError(err.response?.data.message);
      }

      // if (isApiError(err)) {
      //   setError(err?.response?.data.message);
      // }
    } finally {
      setLoading(false);
    }
  };

  type LoginFormData = {
    text: string;
    password: string;
  };

  return (
    <div className="min-h-screen select-none bg-gradient-to-r from-slate-900 to-zinc-900 flex justify-center items-center">
      <div className="text-white bg-[#00000025] flex flex-col space-y-8 justify-center items-center p-8 rounded-xl">
        <h1 className="font-semibold text-4xl">Login to Linkaroo</h1>
        <form
          action="post"
          className="h-4/5 flex flex-col space-y-6 w-96 justify-center items-center"
          onSubmit={handleSubmit(userLogin)}
        >
          <div className="w-full space-y-2">
            <label htmlFor="username-or-email">Username or Email</label>
            <Input
              id="username-or-email"
              type="text"
              placeholder="Enter Username or Email"
              className="bg-slate-800"
              {...register("text", {
                required: true,
              })}
            />
          </div>
          <div className="w-full space-y-2">
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
            <div className="flex justify-between items-center w-full">
              <span>Remember me</span>
              <Link
                to="/password-recovery"
                className="hover:underline text-blue-500 cursor-pointer"
              >
                Forget password
              </Link>
            </div>
          </div>
          <Button className="bg-slate-800 hover:bg-slate-700 w-full">
            {loading ? "Loading..." : "Login"}
          </Button>
          <p className="text-center">
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              className="hover:underline text-blue-500 cursor-pointer"
            >
              Signup
            </Link>
            <br />
            {error && <span className="text-red-500">{error}</span>}
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
