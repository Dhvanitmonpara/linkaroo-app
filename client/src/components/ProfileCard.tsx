import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useProfileStore from "@/store/profileStore";
import { SettingsForm } from "./Forms";
import toast from "react-hot-toast";
import { Button } from "./ui/button";
import { handleAxiosError } from "@/utils/handlerAxiosError";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTrigger } from "./ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { ReactNode, useState } from "react";
import ProfileForm from "./Forms/ProfileForm";
import FeedbackForm from "./Forms/FeedbackForm";

const ProfileCard = () => {

  const [open, setIsOpen] = useState(false)

  const { profile } = useProfileStore();
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_API_URL}/users/logout`,
        {},
        { withCredentials: true }
      );
      if (response.status === 200) {
        toast.success("Logout successful");
        navigate("/login");
      }
    } catch (error) {
      handleAxiosError(error as AxiosError, navigate);
    } finally {
      // 
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger className="!w-14 dark:text-white flex justify-center items-center rounded-md focus:outline-none">
        <img
          className="rounded-full h-10 w-10 object-cover border-zinc-700 border-2 hover:border-zinc-200 transition-colors"
          src={profile.avatarImage}
          alt="Profile pic"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="dark:bg-black dark:text-white dark:border-zinc-800 !w-64 space-y-1 p-2 mt-1"
      >
        <div className="flex justify-start items-center select-none cursor-pointer px-3 py-3 bg-zinc-800/70 hover:bg-zinc-800 rounded-sm">
          <img
            className="rounded-full h-10 w-10 object-cover"
            src={profile.avatarImage}
            alt="Profile pic"
          />
          <div className="ml-3 text-start">
            <h5 className="text-sm dark:text-zinc-200 font-semibold cursor-pointer">{profile.fullName}</h5>
            <p className="text-xs text-zinc-500 dark:text-gray-400 cursor-pointer">
              {profile.email}
            </p>
          </div>
        </div>

        <DialogContainer
          trigger="Profile"
          title="Profile"
          description="Edit your profile"
        >
          <ProfileForm />
        </DialogContainer>

        <DialogContainer
          trigger="Settings"
          title="Settings"
          description="Are you sure you want to logout?"
        >
          <SettingsForm />
        </DialogContainer>

        <DialogContainer
          trigger="Feedback"
          title="Feedback"
          description="Report a bug or Suggest a feature."
        >
          <FeedbackForm />
        </DialogContainer>

        <DialogContainer
          trigger="Logout"
          title="Are you sure you want to logout?"
          description="Your account will be deleted if there is no activity found for 60 days."
        >
          <div className="flex justify-center">
            <Button
              onClick={handleLogout}
              className="w-full rounded-sm text-zinc-50 font-semibold bg-red-500 hover:bg-red-600"
            >
              Yes
            </Button>
            <DialogClose
              className="ml-1.5 rounded-sm w-full font-semibold dark:bg-zinc-800 dark:hover:bg-zinc-800/60 bg-zinc-200 hover:bg-zinc-300"
            >
              No
            </DialogClose>
          </div>
        </DialogContainer>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileCard;

const DialogContainer = ({ children, trigger, title, description }: {
  children: ReactNode;
  trigger: string;
  title: string;
  description: string
}) => {
  return (
    <Dialog
    >
      <DialogTrigger className="p-3 text-sm text-start bg-zinc-800/70 hover:bg-zinc-800 w-full rounded-sm cursor-pointer">
        {trigger}
      </DialogTrigger>
      <DialogContent aria-hidden className="sm:max-w-96">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}