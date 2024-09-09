import { MdHome } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";
import { IoPerson } from "react-icons/io5";
import { IoMdAdd, IoMdNotifications } from "react-icons/io";
import "./HorizontalTabs.css";
import { useLocation, NavLink } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useProfileStore from "@/store/profileStore";
import useMethodStore from "@/store/MethodStore";
import { CreateDocForm, CreateListForm, SettingsForm } from "../Forms";
import DrawerMenu from "../DrawerMenu";
import { Button } from "../ui/button";
import { DrawerClose } from "../ui/drawer";

export default function HorizontalTabs() {
  const { profile } = useProfileStore();
  const { theme } = profile;
  const { toggleModal, setModalContent, setPrevPath } = useMethodStore();
  const location = useLocation().pathname;

  return (
    <div className="flex md:justify-between justify-evenly dark:bg-zinc-800 w-full px-5 bg-zinc-200 h-full md:px-24 sm:px-16 sm:!rounded-t-xl items-center sm:w-6/12">
      <NavLink
        to="/list"
        className={({ isActive }) =>
          `menu-label !text-3xl !w-auto ${isActive ? "!text-white" : ""}`
        }
      >
        <MdHome />
      </NavLink>

      <DrawerMenu
        title="Create"
        trigger={
          <label
            htmlFor="create-tab"
            className="menu-label !text-3xl bg-transparent !w-auto"
          >
            <FaPlus />
          </label>
        }
      >
        <div className="w-full px-2 flex flex-col">
          <DrawerClose>
            <Button
              className="w-full flex justify-normal bg-zinc-900 hover:bg-zinc-800 text-zinc-200"
              onClick={() => {
                setModalContent(
                  <CreateListForm theme={theme} toggleModal={toggleModal} />
                );
                toggleModal(true);
              }}
            >
              <IoMdAdd />
              <span className="pl-2">List</span>
            </Button>
          </DrawerClose>
          <DrawerClose>
            <Button
              className="w-full flex justify-normal bg-zinc-900 hover:bg-zinc-800 text-zinc-200"
              onClick={() => {
                setModalContent(
                  <CreateDocForm theme={theme} toggleModal={toggleModal} />
                );
                toggleModal(true);
              }}
            >
              <IoMdAdd />
              <span className="pl-2">Card</span>
            </Button>
          </DrawerClose>
        </div>
      </DrawerMenu>

      <NavLink
        to="notifications"
        className={({ isActive }) =>
          `menu-label !text-3xl !w-auto ${isActive ? "!text-white" : ""}`
        }
      >
        <IoMdNotifications />
      </NavLink>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <label
            htmlFor="profile-tab"
            className="menu-label !text-2xl !w-auto h-auto m-0 p-0"
          >
            <IoPerson />
          </label>
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
              setPrevPath(location);
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
              setPrevPath(location);
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
              setPrevPath(location);
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
    </div>
  );
}
