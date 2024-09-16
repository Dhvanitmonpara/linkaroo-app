import axios, { AxiosError } from "axios";
import { Button } from "@/components/ui/button.js";
import { Link, useNavigate } from "react-router-dom";
import { FormEvent, useState } from "react";
import { Loader2 } from "lucide-react";
import { Stepper } from "@/components/index.js";
import { IoArrowBack } from "react-icons/io5";
import { useMultistepForm } from "@/Hooks/useMultistepForm.js";
import {EmailVerification, EmailConfirmation, ConfirmPassword} from "@/components/Forms/index.js";
import toast from "react-hot-toast";
import { handleAxiosError } from "@/utils/handlerAxiosError.js";

type PasswordRecoveryFormProps = {
  email: string;
  password: string;
  confirmPassword: string;
  isOtpVerified?: boolean;
};

const initialData = {
  email: "",
  password: "",
  confirmPassword: "",
  isOtpVerified: false,
};

const PasswordRecoveryPage = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<PasswordRecoveryFormProps>(initialData);

  const updateFields = (fields: Partial<PasswordRecoveryFormProps>) => {
    setData((prev) => ({ ...prev, ...fields }));
  };

  const navigate = useNavigate();

  const emailReg =
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

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
    <EmailConfirmation {...data} updateFields={updateFields} />,
    <EmailVerification {...data} updateFields={updateFields} />,
    <ConfirmPassword {...data} updateFields={updateFields} />
  ]);

  const userRegister = async () => {
    try {
      setLoading(true);

      if (!data.isOtpVerified) {
        throw new Error("Please verify your email");
      }

      const userCredentials = {
        password: data.password,
        email: ""
      };

      if (emailReg.test(data.email)) {
        userCredentials.email = data.email;
      } else {
        toast.error("Invalid email");
        setLoading(false);
        return;
      }

      const response = await axios({
        method: "patch",
        url: `${import.meta.env.VITE_SERVER_API_URL}/users/recover-password`,
        data: userCredentials,
        withCredentials: true,
        headers: {
          "Access-control-Allow-Origin": import.meta.env
            .VITE_ACCESS_CONTROL_ORIGIN,
          "Content-Type": "application/json",
        },
      });

      if (!response.data.success) {
        toast.error("Failed to Recover Password");
        return;
      }

      navigate("/login");
      toast.success("Password recovered successfully")
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
        <h1 className="font-semibold text-4xl pt-5">Password recovery</h1>
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
          {currentStepIndex === 1 && (
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
              disabled={currentStepIndex === 1 && !data.isOtpVerified}
              className="bg-slate-800 text-white hover:bg-slate-700 w-full"
            >
              {isLastStep ? "Change password" : "Next"}
            </Button>
          )}
          <p className="text-center">
            Go back to {" "}
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

export default PasswordRecoveryPage;
