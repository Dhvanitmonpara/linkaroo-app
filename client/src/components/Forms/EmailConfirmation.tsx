import { Input } from "../ui/input";

type EmailSignupProps = {
  email: string;
  updateFields: (fields: Partial<EmailSignupProps>) => void;
};

const EmailConfirmation = ({
  email,
  updateFields,
}: EmailSignupProps) => {
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
    </>
  );
};

export default EmailConfirmation;
