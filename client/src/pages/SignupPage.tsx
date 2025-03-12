import { SignedOut, SignUp, useAuth } from "@clerk/clerk-react"
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function SignUpPage() {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (isSignedIn) {
      navigate("/");
    }
  }, [isSignedIn, navigate]);
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <SignedOut>
        <SignUp />
      </SignedOut>
    </div>
  )
}

export default SignUpPage