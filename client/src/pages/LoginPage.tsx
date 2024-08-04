import axios from "axios";
// import { useEffect } from "react";
import useProfileStore from "../store/profileStore.js";
import { Input } from "@/components/ui/input.js";
import { Button } from "@/components/ui/button.js";
import { Link } from "react-router-dom";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { useState } from "react";

const LoginPage = () => {
  const { addProfile } = useProfileStore();

  const [isPasswordShowing, setIsPasswordShowing] = useState(false);

  const userLogin = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_API_URL}/users/login`,
        {
          username: "dhavnitmonpara",
          email: "test@test.com",
          password: "12345678",
        }
      );

      if (response?.data) {
        addProfile(response.data);
      }

      return response?.data;
    } catch (error) {
      console.error("Error while logging user: ", error);
    }
  };

  // useEffect(() => {
  //   (async () => {

  //     const loggedInUser = await userLogin();

  //     if (loggedInUser) {
  //       addProfile(loggedInUser);
  //     }

  //   })();
  // }, [addProfile]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-slate-900 to-zinc-900 flex justify-center items-center">
      <div className="text-white bg-[#00000025] flex flex-col space-y-8 justify-center items-center p-8 rounded-xl">
        <h1 className="font-semibold text-4xl">Login to Linkaroo</h1>
        <form
          action="post"
          className="h-4/5 flex flex-col space-y-6 w-96 justify-center items-center"
          onSubmit={userLogin}
        >
          <div className="w-full space-y-2">
            <label htmlFor="username-or-email">Username/Email</label>
            <Input
              id="username-or-email"
              type="text"
              placeholder="Enter Username or Email"
              className="bg-slate-800"
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
              <span className="hover:underline text-blue-500 cursor-pointer">
                Forget password
              </span>
            </div>
          </div>
          <Button className="bg-slate-800 hover:bg-slate-700 w-full">
            Login
          </Button>
          <p>
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              className="hover:underline text-blue-500 cursor-pointer"
            >
              here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
