import { useState, useEffect } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import axios, { AxiosResponse } from "axios";

type EmailVerificationProps = {
  email: string;
  isOtpVerified?: boolean;
  updateFields: (fields: Partial<EmailVerificationProps>) => void;
};

const EmailVerification = ({ email, updateFields }: EmailVerificationProps) => {
  const [timeLeft, setTimeLeft] = useState(0); // Timer for requesting a new OTP
  const [otp, setOtp] = useState("");

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const sendOtp = async () => {
    try {
      const mailResponse: AxiosResponse = await axios.post(
        `${import.meta.env.VITE_SERVER_API_URL}/users/send-otp`,
        { email: email },
        { withCredentials: true }
      );
      console.log("OTP sent:", mailResponse);
    } catch (error) {
      console.error("Error sending OTP:", error);
    }
  };

  const verifyOtp = async () => {
    try {
      const verificationResponse: AxiosResponse = await axios.post(
        `${import.meta.env.VITE_SERVER_API_URL}/users/verify-otp`,
        { email, otp },
        { withCredentials: true }
      );

      if (verificationResponse.data.success) {
        updateFields({ isOtpVerified: true });
        console.log("OTP verified");
      } else {
        console.error("OTP verification failed:", verificationResponse.data.message);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
    }
  };

  const handleResendOTP = () => {
    console.log("Resending OTP...");
    setTimeLeft(60);
    sendOtp();
  };

  useEffect(() => {
    sendOtp(); // Initial OTP send
  }, []);

  useEffect(() => {
    if (otp.length === 6) {
      verifyOtp();
    }
  }, [otp]);

  return (
    <>
      <p className="text-sm text-foreground/60 text-center">
        Enter the 6-digit code we emailed to <b>{email}</b>. If you did not
        receive it, you can request a new one{" "}
        {timeLeft > 0 ? (
          <span>
            in <b>{timeLeft}</b> seconds
          </span>
        ) : (
          <span
            className="text-blue-500 hover:underline cursor-pointer"
            onClick={handleResendOTP}
          >
            Resend OTP
          </span>
        )}
        .
      </p>
      <InputOTP maxLength={6} value={otp} onChange={setOtp}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      <p className="text-sm text-foreground/60 text-center">
        If the email address is incorrect,{" "}
        <span className="text-blue-500 hover:underline cursor-pointer">
          click here
        </span>{" "}
        to change it.
      </p>
    </>
  );
};

export default EmailVerification;
