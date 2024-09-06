import axios, { AxiosError } from "axios";
import useProfileStore from "../store/profileStore.js";
import { Button } from "@/components/ui/button.js";
import { Link, useNavigate } from "react-router-dom";
import { FormEvent, useState } from "react";
import { Loader2 } from "lucide-react";
import { Stepper } from "@/components/index.js";
import { IoArrowBack } from "react-icons/io5";
import { useMultistepForm } from "@/Hooks/useMultistepForm.js";
import EmailSignup from "@/components/Forms/EmailSignup.js";
import ProfileSetup from "@/components/Forms/ProfileSetup.js";
import EmailVerification from "@/components/Forms/EmailVerification.js";
import toast from "react-hot-toast";
import { handleAxiosError } from "@/utils/handlerAxiosError.js";
import { useMediaQuery } from "react-responsive";

type SignupFormData = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  avatarImage?: File;
  isOtpVerified?: boolean;
};

const initialData = {
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  isOtpVerified: false,
};

const SignupPage = () => {
  const { addProfile } = useProfileStore();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SignupFormData>(initialData);

  const isSmallScreen = useMediaQuery({ query: "(max-width: 1024px)" });

  const updateFields = (fields: Partial<SignupFormData>) => {
    setData((prev) => ({ ...prev, ...fields }));
  };

  const navigate = useNavigate();

  const emailReg =
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
  const usernameReg = /[a-zA-Z][a-zA-Z0-9-_]{3,32}/;

  const {
    steps,
    step,
    currentStepIndex,
    isLastStep,
    isFirstStep,
    next,
    back,
    goTo,
  } = useMultistepForm([
    <EmailSignup {...data} updateFields={updateFields} />,
    <ProfileSetup {...data} updateFields={updateFields} />,
    <EmailVerification {...data} updateFields={updateFields} />,
  ]);

  const userRegister = async () => {
    try {
      setLoading(true);

      if (!data.isOtpVerified) {
        throw new Error("Please verify your email");
      }

      const userCredentials = {
        password: data.password,
        email: "",
        username: "",
        fullName: data.lastName
          ? data.firstName + " " + data.lastName
          : data.firstName,
        avatarImage: data.avatarImage,
      };

      if (emailReg.test(data.email) && usernameReg.test(data.username)) {
        userCredentials.email = data.email;
        userCredentials.username = data.username;
      } else {
        toast.error("Invalid email or username");
        setLoading(false);
        return;
      }

      const response = await axios({
        method: "POST",
        url: `${import.meta.env.VITE_SERVER_API_URL}/users/register${
          userCredentials.avatarImage != undefined ? "/avatar" : ""
        }`,
        data: userCredentials,
        withCredentials: true,
        headers: {
          "Access-control-Allow-Origin": import.meta.env
            .VITE_ACCESS_CONTROL_ORIGIN,
          "Content-Type": "application/json",
        },
      });

      if (!response.data.success) {
        toast.error("Failed to Register");
        return;
      }

      const currentUser = await axios({
        method: "GET",
        url: `${import.meta.env.VITE_SERVER_API_URL}/users/current-user`,
        withCredentials: true,
      });

      addProfile(currentUser.data.data);
      isSmallScreen ? navigate("/list") : navigate("/");
    } catch (err) {
      handleAxiosError(err as AxiosError, navigate);
    } finally {
      setLoading(false);
    }
  };

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!isLastStep) return next();
    userRegister();
  };

  return (
    <div className="min-h-screen select-none bg-gradient-to-r from-slate-900 to-zinc-900 flex justify-center items-center">
      <div className="text-white relative overflow-hidden bg-[#00000025] flex flex-col space-y-8 justify-center items-center sm:p-8 p-6 rounded-xl">
        <Stepper
          className="absolute top-0 right-0"
          stepIndex={currentStepIndex}
        />
        <span className="absolute top-0 right-10 text-sm">
          {currentStepIndex + 1} / {steps.length}
        </span>
        <h1 className="font-semibold text-4xl pt-5">Signup to Linkaroo</h1>
        <form
          action="post"
          className="h-4/5 flex flex-col space-y-6 sm:w-96 w-72 justify-center items-center"
          onSubmit={submitHandler}
        >
          {step}
          {!isFirstStep && (
            <Button
              type="button"
              onClick={back}
              className="!bg-transparent absolute top-0 left-5 text-zinc-300 hover:text-white space-x-2"
            >
              <IoArrowBack />
              <span>Back</span>
            </Button>
          )}
          {currentStepIndex === 2 && (
            <p className="text-sm text-foreground/60 text-center">
              If the email address is incorrect,{" "}
              <span
                onClick={() => {
                  goTo(0);
                }}
                className="text-blue-500 hover:underline cursor-pointer"
              >
                click here
              </span>{" "}
              to change it.
            </p>
          )}
          {loading ? (
            <Button
              disabled
              className="bg-slate-800 text-white hover:bg-slate-700 w-full cursor-wait"
            >
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
            </Button>
          ) : (
            <Button
              type="submit"
              className="bg-slate-800 text-white hover:bg-slate-700 w-full"
            >
              {isLastStep ? "Create an Account" : "Next"}
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
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
