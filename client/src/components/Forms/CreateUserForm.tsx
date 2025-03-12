import { useUser } from '@clerk/clerk-react';
import axios, { AxiosError } from 'axios';
import { useEffect } from 'react'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function CreateUserForm() {

  const navigate = useNavigate()
  const { user, isLoaded, isSignedIn } = useUser()

  useEffect(() => {
    const createUserHandler = async () => {
      try {
        if (!isLoaded) {
          if (!isSignedIn) {
            navigate("/auth/signin")
          }
          return
        }
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

        return res.data
      } catch (error) {
        if (error instanceof AxiosError) {
          if(error.status === 400){
            toast("User already exists")
            navigate("/")
            return
          }
          toast.error(error.message)
        } else {
          console.error(error);
          toast.error("Error while creating user")
        }
      }
    }
    createUserHandler()
  }, [isLoaded, isSignedIn, navigate, user?.id, user?.primaryEmailAddress?.emailAddress, user?.username])

  return (
    <div>createUserForm</div>
  )
}

export default CreateUserForm