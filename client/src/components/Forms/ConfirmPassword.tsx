import { useState } from "react";
import { Input } from "../ui/input";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";

type ConfirmPasswordProps = {
  password: string;
  confirmPassword: string;
  updateFields: (fields: Partial<ConfirmPasswordProps>) => void;
};

const ConfirmPassword = ({
  password,
  confirmPassword,
  updateFields,
}: ConfirmPasswordProps) => {
  const [isPasswordShowing, setIsPasswordShowing] = useState(false);
  return (
    <>
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

export default ConfirmPassword;
