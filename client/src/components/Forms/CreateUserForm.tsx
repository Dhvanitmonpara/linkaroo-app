import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function CreateUserForm() {

  const navigate = useNavigate()
  const { user, isLoaded, isSignedIn } = useUser()

  useEffect(() => {
    const createUserHandler = async () => {
      try {
        if (!isLoaded) return

        const email = user?.primaryEmailAddress?.emailAddress;
        if (!email) {
          navigate("/auth/signin")
          return
        }

        const res = await axios({
          method: "POST",
          data: {
            email: user?.primaryEmailAddress?.emailAddress,
            username: user?.username,
            clerkId: user?.id
          },
          url: `${import.meta.env.VITE_SERVER_API_URL}/users`,
          withCredentials: true,
        });

        if (res.status !== 201) {
          toast.error('Failed to create user')
          return
        }

        navigate("/")
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 400) {
            toast("User already exists");
            navigate("/");
            return;
          }
          toast.error(error.response?.data?.message || "Error while creating user");
        } else {
          console.error(error);
          toast.error("Error while creating user");
        }
      }
    }
    createUserHandler()
  }, [isLoaded, isSignedIn, user]);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      navigate("/auth/signin");
      return;
    }
  }, [isLoaded, isSignedIn, navigate]);

  return (
    <div className='h-screen w-screen flex justify-center items-center flex-col'>
      <h3 className='font-bold text-2xl'>Setting up your account</h3>
      <Loader2 className="animate-spin text-2xl mt-6" />
    </div>
  )
}

export default CreateUserForm