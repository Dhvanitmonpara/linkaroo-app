import { SignedOut, SignIn, useAuth } from "@clerk/clerk-react"
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (isSignedIn) {
      navigate("/dashboard");
    }
  }, [isSignedIn, navigate]);
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <SignedOut>
        <SignIn />
      </SignedOut>
    </div>
  )
}

export default LoginPage