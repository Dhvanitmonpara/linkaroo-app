import { Input } from "./ui/input";
import { IoMdAdd } from "react-icons/io";
import { IoFilterOutline } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CreateDocForm, CreateListForm } from "./Forms";
import useMethodStore from "@/store/MethodStore";
import useProfileStore from "@/store/profileStore";
import { useEffect, useState } from "react";
import CommandMenu from "./CommandMenu";
import NotificationCard from "./NotificationCard";

const Header = () => {
  const { toggleModal, setModalContent } = useMethodStore();
  const { profile } = useProfileStore();
  const { theme } = profile.profile;

  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <nav className="lg:h-20 h-[4.5rem] lg:py-5 pt-4 pb-[1rem] flex space-x-2 lg:px-0 px-4">
        <Input
          onClick={() => setOpen(true)}
          className="dark:bg-zinc-800 dark:text-white dark:border-zinc-600"
          placeholder="Create or Search something..."
        />

        <DropdownMenu>
          <DropdownMenuTrigger className="w-12 lg:flex hidden justify-center items-center dark:bg-zinc-800 dark:hover:bg-zinc-600 dark:text-white rounded-sm border-2 dark:border-zinc-700 border-zinc-200 hover:bg-zinc-200">
            <IoMdAdd />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className={
              theme !== "light" ? "!bg-black !text-white border-zinc-800" : ""
            }
          >
            <DropdownMenuItem
              onClick={() => {
                toggleModal(true);
                setModalContent(
                  <CreateListForm toggleModal={toggleModal} theme={theme} />
                );
              }}
            >
              List
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                toggleModal(true);
                setModalContent(
                  <CreateDocForm toggleModal={toggleModal} theme={theme} />
                );
              }}
            >
              Doc
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="w-12 flex justify-center items-center dark:bg-zinc-800 dark:hover:bg-zinc-600 dark:text-white rounded-sm border-2 dark:border-zinc-700 border-zinc-200 hover:bg-zinc-200">
          <IoFilterOutline />
        </div>
        <Popover>
          <PopoverTrigger className="w-12 h-full lg:flex hidden">
            <div className="w-full h-full justify-center items-center dark:bg-zinc-800 dark:hover:bg-zinc-600 dark:text-white rounded-sm border-2 dark:border-zinc-700 border-zinc-200 hover:bg-zinc-200">
              <IoMdNotificationsOutline />
            </div>
          </PopoverTrigger>
          <PopoverContent
            className={`${
              theme == "dark"
                ? "bg-zinc-900 border-zinc-700 text-zinc-100"
                : "bg-zinc-200 border-zinc-300 text-zinc-950"
            } space-y-2 overflow-y-scroll h-[32rem]`}
          >
            <NotificationCard buttonMethods={{onAccept: () => {}, onDismiss: () => {}}} notification={{title: "Connection req", description: "@tanishka sent you conection req", time: "27 sep saturday"}}/>
          </PopoverContent>
        </Popover>
      </nav>
      <CommandMenu open={open} setOpen={setOpen} />
    </>
  );
};

export default Header;
