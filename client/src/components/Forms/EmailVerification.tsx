import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

type EmailVerificationProps = {
  otp: string;
  updateFields: (fields: Partial<EmailVerificationProps>) => void;
};

const EmailVerification = ({ otp, updateFields }: EmailVerificationProps) => {
  return (
    <div className="h-4/5 flex flex-col space-y-6 w-96 justify-center items-center">
      <InputOTP maxLength={6} value={otp} onChange={(e) => updateFields({ otp: e })}>
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
    </div>
  );
};

export default EmailVerification;
