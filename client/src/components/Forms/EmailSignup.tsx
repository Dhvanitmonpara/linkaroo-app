import { useState } from "react";
import { Input } from "../ui/input";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";

type EmailSignupProps = {
  email: string;
  password: string;
  confirmPassword: string;
  updateFields: (fields: Partial<EmailSignupProps>) => void;
};

const EmailSignup = ({
  email,
  password,
  confirmPassword,
  updateFields,
}: EmailSignupProps) => {
  const [isPasswordShowing, setIsPasswordShowing] = useState(false);
  return (
    <>
      <div className="w-full space-y-2">
        <label htmlFor="email">Email</label>
        <Input
          id="email"
          type="email"
          placeholder="Enter Email"
          className="bg-slate-800"
          value={email}
          onChange={(e) => updateFields({ email: e.target.value })}
          required
          autoFocus
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
            value={password}
            onChange={(e) => updateFields({ password: e.target.value })}
            required
            autoFocus
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
      <div className="w-full space-y-2">
        <label htmlFor="confirm-password">Confirm password</label>
        <div className="w-full flex relative">
          <Input
            id="confirm-password"
            type={isPasswordShowing ? "text" : "password"}
            placeholder="Enter Password"
            value={confirmPassword}
            onChange={(e) => updateFields({ confirmPassword: e.target.value })}
            className="bg-slate-800"
            required
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
    </>
  );
};

export default EmailSignup;
