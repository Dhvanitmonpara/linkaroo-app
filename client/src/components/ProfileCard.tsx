import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@/store/profileStore";
import { ReactNode } from "react";
import { SettingsForm } from "./Forms";
import { themeType } from "@/lib/types";

type HeaderProps = {
  theme: themeType | undefined;
  profile: User;
  toggleModal: (isOpen: boolean) => void;
  setModalContent: (content: string | ReactNode) => void;
};

const ProfileCard = ({
  theme,
  toggleModal,
  setModalContent,
  profile,
}: HeaderProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="w-full dark:text-white py-2 px-6 rounded-md focus:outline-none dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700">
        <div className="flex">
          <img
            className="rounded-full h-12 w-12 object-cover"
            src={profile.avatarImage}
            alt="Profile pic"
          />
          <div className="ml-3 text-start">
            <p className="text-sm dark:text-zinc-200">{profile.fullName}</p>
            <span className="text-xs text-zinc-400 dark:text-gray-300">
              {profile.email}
            </span>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={`
          ${
            theme != "light" ? "!bg-black !text-white border-zinc-800" : ""
          } !w-[26vw] mt-1
        `}
      >
        <DropdownMenuItem
          className="py-2"
          onClick={() => {
            toggleModal(true);
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
        <DropdownMenuItem
          className="py-2"
          onClick={() => {
            toggleModal(true);
            setModalContent(
              <SettingsForm theme={theme} toggleModal={toggleModal} />
            );
          }}
        >
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem
          className="py-2"
          onClick={() => {
            toggleModal(true);
            setModalContent(
              <div className="dark:text-white p-5 flex justify-center items-center space-y-3">
                <h1 className="text-3xl">Feedback</h1>
                {/* Add form fields here */}
              </div>
            );
          }}
        >
          Feedback
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileCard;
