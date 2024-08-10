import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectValue,
} from "@/components/ui/select";
import { themeType } from "@/lib/types";
import { ReactNode } from "react";

type HeaderProps = {
  theme: string | undefined;
  setIsModalOpen: (isOpen: boolean) => void;
  setModalContent: (content: string | ReactNode) => void;
  themeHandler: (theme: themeType) => void;
};

const ProfileCard = ({
  theme,
  setIsModalOpen,
  setModalContent,
  themeHandler,
}: HeaderProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="w-full dark:text-white py-3 px-6 rounded-md focus:outline-none dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700">
        Dhvanit Monpara
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
            setIsModalOpen(true);
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
            setIsModalOpen(true);
            setModalContent(
              <div className="flex h-full w-full flex-col justify-center p-5 items-center">
                <h1 className="dark:text-white text-4xl pb-11">Settings</h1>
                <div className="flex justify-between w-full">
                  <span className="dark:text-white">Themes:</span>
                  <Select
                    onValueChange={(value: themeType) => {
                      themeHandler(value);
                    }}
                  >
                    <SelectTrigger className="dark:text-white max-w-36">
                      <SelectValue placeholder="Change theme" />
                    </SelectTrigger>
                    <SelectContent
                      className={
                        theme != "light"
                          ? "!bg-black !text-white border-zinc-800"
                          : ""
                      }
                    >
                      <SelectGroup>
                        <SelectLabel>Themes</SelectLabel>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="black">Black</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-between w-full">
                  <span className="dark:text-white">Fonts:</span>
                  <Select
                    onValueChange={(value: themeType) => {
                      themeHandler(value);
                    }}
                  >
                    <SelectTrigger className="dark:text-white max-w-36">
                      <SelectValue placeholder="Change theme" />
                    </SelectTrigger>
                    <SelectContent
                      className={
                        theme != "light"
                          ? "!bg-black !text-white border-zinc-800"
                          : ""
                      }
                    >
                      <SelectGroup>
                        <SelectLabel>Fonts</SelectLabel>
                        <SelectItem value="light">sans</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="black">Black</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            );
          }}
        >
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem
          className="py-2"
          onClick={() => {
            setIsModalOpen(true);
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
