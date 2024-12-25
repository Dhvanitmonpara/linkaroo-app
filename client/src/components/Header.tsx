import { Input } from "./ui/input";
import { IoMdAdd } from "react-icons/io";
import { IoFilterOutline } from "react-icons/io5";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoSearchSharp } from "react-icons/io5";
import { CreateCollectionForm, CreateLinkForm } from "./Forms";
import useMethodStore from "@/store/MethodStore";
import useProfileStore from "@/store/profileStore";
import { useEffect, useState } from "react";
import CommandMenu from "./CommandMenu";
import { Link, NavLink } from "react-router-dom";
import ProfileCard from "./ProfileCard";
import Notifications from "./Notifications";
import ResponsiveDialog from "./ResponsiveDialog";

const Header = () => {
  const { setPrevPath } = useMethodStore();
  const { profile } = useProfileStore();
  const { theme } = profile;

  const [creationTab, setCreationTab] = useState("collection");
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
      <nav className="lg:h-[4.5rem] h-16 lg:py-5 pt-4 pb-[1rem] flex justify-between items-center space-x-2 px-5 lg:px-20 border-b-[1px] border-zinc-700 select-none">
        <Link
          to="/"
          className="text-zinc-300 transition-colors cursor-pointer text-2xl font-helvetica font-semibold hover:text-white flex space-x-2 justify-center items-center"
        >
          <img
            src="/linkaroo.png"
            alt="Linkaroo-logo"
            width="24px"
            className="h-[24px] active:animate-spin"
          />
          <span className="hidden sm:inline">Linkaroo</span>
        </Link>
        <div className="lg:h-20 h-[4.5rem] lg:py-5 pt-4 pb-[1rem] flex space-x-2 md:w-2/5">
          <div className="w-full relative">
            <Input
              onClick={() => setOpen(true)}
              className="dark:bg-zinc-900 dark:text-white hidden md:inline-block dark:border-zinc-800"
              placeholder="Create or Search something..."
            />
            <div className="absolute top-2 right-2 border-1 bg-zinc-900 border-zinc-800 text-zinc-300 w-fit py-1 px-2 text-xs rounded-md">
              ⌘K
            </div>
          </div>
          <ResponsiveDialog
            title={`${creationTab === "collection" ? "Create new Collection" : "Add new Link"}`}
            trigger={<button
              className="w-12 transition-colors duration-200 lg:flex hidden justify-center items-center dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-white rounded-sm border-2 dark:border-zinc-800 border-zinc-200 hover:bg-zinc-200"
              onClick={() => {
                setPrevPath(location.pathname);
              }}
            >
              <IoMdAdd />
            </button>} description={`${creationTab === "collection" ? "Create a new collection" : "Add a new link"} by filling all the required fields`} cancelText="Cancel">
            <Tabs onValueChange={(value) => setCreationTab(value)} value={creationTab} className="w-[400px]">
              <TabsList className="w-full mb-4">
                <TabsTrigger className="w-full" value="collection">Collection</TabsTrigger>
                <TabsTrigger className="w-full" value="link">Link</TabsTrigger>
              </TabsList>
              <TabsContent value="collection">
                <CreateCollectionForm theme={theme} />
              </TabsContent>
              <TabsContent value="link">
                <CreateLinkForm theme={theme} />
              </TabsContent>
            </Tabs>
          </ResponsiveDialog>
          <div
            onClick={() => setOpen(true)}
            className="md:w-12 cursor-pointer transition-colors duration-200 w-10 text-xl md:text-base md:hidden flex justify-center items-center md:dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-zinc-300 rounded-sm md:border-2 md:dark:border-zinc-800 md:border-zinc-200 hover:bg-zinc-200"
          >
            <IoSearchSharp />
          </div>
          <div className="md:w-12 cursor-pointer transition-colors duration-200 w-10 text-xl md:text-base flex justify-center items-center md:dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-white rounded-sm md:border-2 md:dark:border-zinc-800 md:border-zinc-200 hover:bg-zinc-200">
            <IoFilterOutline />
          </div>
          <Popover>
            <PopoverTrigger className="md:w-12 cursor-pointer transition-colors duration-200 w-10 text-xl md:text-base hidden lg:flex">
              <div className="w-full h-full flex justify-center items-center text-zinc-400 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-white rounded-sm border-2 dark:border-zinc-800 border-zinc-200 hover:bg-zinc-200">
                <IoMdNotificationsOutline />
              </div>
            </PopoverTrigger>
            <PopoverContent
              className={`${theme == "dark" || theme == "black"
                ? "bg-zinc-900 border-zinc-700 text-zinc-100"
                : "bg-zinc-200 border-zinc-300 text-zinc-950"
                } space-y-2 overflow-y-scroll h-[32rem] p-0`}
            >
              <Notifications />
            </PopoverContent>
          </Popover>
        </div>
        <div className="text-zinc-400 md:flex justify-center items-center hidden space-x-7 font-semibold">
          <NavLink to="/" className={({ isActive }) => (`${isActive ? "text-zinc-100" : ""} hover:text-zinc-100 cursor-pointer transition-colors`)}>
            Home
          </NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => (`${isActive ? "text-zinc-100" : ""} hover:text-zinc-100 cursor-pointer transition-colors`)}>
            Dashboard
          </NavLink>
          {/* <NavLink to="pinned" className={({isActive})=>(`${isActive ? "text-zinc-100" : ""} hover:text-zinc-100 cursor-pointer transition-colors`)}>
            Pinned
          </NavLink> */}
          <NavLink to="/inbox" className={({ isActive }) => (`${isActive ? "text-zinc-100" : ""} hover:text-zinc-100 cursor-pointer transition-colors`)}>
            Inbox
          </NavLink>
          <div className="hidden lg:inline-block">
            <ProfileCard />
          </div>
        </div>
      </nav>
      <CommandMenu open={open} setOpen={setOpen} />
    </>
  );
};

export default Header;
