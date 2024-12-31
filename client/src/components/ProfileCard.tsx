import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useProfileStore from "@/store/profileStore";
import { SettingsForm } from "./Forms";
import useMethodStore from "@/store/MethodStore";
import toast from "react-hot-toast";
import { Button } from "./ui/button";
import { handleAxiosError } from "@/utils/handlerAxiosError";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { DrawerClose } from "./ui/drawer";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTrigger } from "./ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { ReactNode, useState } from "react";

const ProfileCard = () => {

  const [open, setIsOpen] = useState(false)

  const { setPrevPath } = useMethodStore();
  const { profile } = useProfileStore();
  const { setModalContent } = useMethodStore();
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
        className="dark:bg-black dark:text-white dark:border-zinc-800 !w-64 mt-1"
      >
        {/* <DropdownMenuItem className="py-2" onClick={() => {}}> */}
        <div className="flex justify-start items-center px-2 py-4">
          <img
            className="rounded-full h-12 w-12 object-cover"
            src={profile.avatarImage}
            alt="Profile pic"
          />
          <div className="ml-3 text-start">
            <p className="text-sm dark:text-zinc-200">{profile.fullName}</p>
            <span className="text-xs text-zinc-500 dark:text-gray-300">
              {profile.email}
            </span>
          </div>
        </div>
        {/* </DropdownMenuItem> */}

        <DropdownMenuItem
          className="py-2"
          onClick={(e) => {
            e.preventDefault();
            setPrevPath(location.pathname);
            setModalContent(
              <div className="dark:text-white p-5 flex justify-center items-center space-y-3">
                <h1 className="text-3xl">Profile</h1>
                {/* Add form fields here */}
              </div>
            );
          }}
        >
          Profile
        </DropdownMenuItem>

        <DialogContainer
          trigger="Settings"
          title="Settings"
          description="Are you sure you want to logout?"
        >
          <SettingsForm />
        </DialogContainer>

        <DialogContainer
          trigger="Feedback"
          title="Logout"
          description="Are you sure you want to logout?"
        >
          <div className="dark:text-white p-5 flex justify-center items-center space-y-3">
            <h1 className="text-3xl">Feedback</h1>
            {/* Add form fields here */}
          </div>
        </DialogContainer>

        <DialogContainer
          trigger="Logout"
          title="Logout"
          description="Are you sure you want to logout?"
        >
          <div>
            <h1>Are you sure you want to delete this list?</h1>
            <div className="flex justify-center mt-4">
              <Button
                onClick={handleLogout}
                className="w-24 text-zinc-50 font-semibold bg-red-500 hover:bg-red-600"
              >
                Yes
              </Button>
              <DrawerClose
                className="ml-4 w-24 font-semibold dark:bg-zinc-800 dark:hover:bg-zinc-800/60 bg-zinc-200 hover:bg-zinc-300"
              >
                No
              </DrawerClose>
            </div>
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
      <DialogTrigger className="p-2 text-sm text-start hover:bg-zinc-800 w-full rounded-sm cursor-pointer">
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-96">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}