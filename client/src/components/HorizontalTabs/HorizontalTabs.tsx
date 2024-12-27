import { MdHome } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";
import { IoPerson } from "react-icons/io5";
import { IoMdNotifications } from "react-icons/io";
import "./HorizontalTabs.css";
import { useLocation, NavLink, useNavigate } from "react-router-dom";
import useProfileStore from "@/store/profileStore";
import useMethodStore from "@/store/MethodStore";
import { CreateLinkForm, CreateCollectionForm, SettingsForm } from "../Forms";
import DrawerMenu from "../DrawerMenu";
import { Button } from "../ui/button";
import { DrawerClose } from "../ui/drawer";
import { IoList } from "react-icons/io5";
import { PiCardsBold } from "react-icons/pi";
import { IoMdSettings } from "react-icons/io";
import { MdFeedback } from "react-icons/md";
import { FaInfoCircle } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";
import toast from "react-hot-toast";
import { handleAxiosError } from "@/utils/handlerAxiosError";
import axios, { AxiosError } from "axios";
import { FaInbox } from "react-icons/fa6";

export default function HorizontalTabs() {
  const { profile } = useProfileStore();
  const { toggleModal, setModalContent, setPrevPath } = useMethodStore();
  const location = useLocation().pathname;
  const navigate = useNavigate();

  const handleLogout = async () => {
    let loaderId = "";
    toast.loading((t) => {
      loaderId = t.id;
      return "Logging out...";
    });
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
      toast.dismiss(loaderId);
    }
  };

  return (
    <div className="flex md:justify-between justify-evenly dark:bg-zinc-800 w-full px-5 bg-zinc-200 h-full md:px-12 sm:px-2 sm:!rounded-t-xl items-center sm:w-6/12">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `menu-label !text-3xl !w-auto ${isActive ? "!text-white" : ""}`
        }
      >
        <MdHome />
      </NavLink>

      <NavLink
        to="/inbox"
        className={({ isActive }) =>
          `menu-label !text-2xl !w-auto ${isActive ? "!text-white" : ""}`
        }
      >
        <FaInbox />
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
                  <CreateCollectionForm />
                );
                toggleModal(true);
              }}
            >
              <IoList />
              <span className="pl-2">List</span>
            </Button>
          </DrawerClose>
          <DrawerClose>
            <Button
              className="w-full flex justify-normal bg-zinc-900 hover:bg-zinc-800 text-zinc-200"
              onClick={() => {
                setModalContent(
                  <CreateLinkForm  />
                );
                toggleModal(true);
              }}
            >
              <PiCardsBold />
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

      <DrawerMenu
        title="Profile"
        trigger={
          <label
            htmlFor="create-tab"
            className="menu-label !text-3xl bg-transparent !w-auto"
          >
            <img
              className="rounded-full !h-8 !w-8 object-cover border-zinc-700 border-2 hover:border-zinc-200 transition-colors"
              src={profile.avatarImage}
              alt="Profile pic"
            />
          </label>
        }
      >
        <div className="w-full px-2 flex flex-col">
          <DrawerClose>
            <Button
              className="w-full flex justify-normal bg-zinc-900 hover:bg-zinc-800 text-zinc-200"
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
              <IoPerson />
              <span className="pl-3">Profile</span>
            </Button>
          </DrawerClose>
          <DrawerClose>
            <Button
              className="w-full flex justify-normal bg-zinc-900 hover:bg-zinc-800 text-zinc-200"
              onClick={() => {
                setPrevPath(location);
                toggleModal(true);
                setModalContent(
                  <SettingsForm toggleModal={toggleModal} />
                );
              }}
            >
              <IoMdSettings />
              <span className="pl-3">Settings</span>
            </Button>
          </DrawerClose>
          <DrawerClose>
            <Button
              className="w-full flex justify-normal bg-zinc-900 hover:bg-zinc-800 text-zinc-200"
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
              <MdFeedback />
              <span className="pl-3">Feedback</span>
            </Button>
          </DrawerClose>
          <DrawerClose>
            <Button
              className="w-full flex justify-normal bg-zinc-900 hover:bg-zinc-800 text-zinc-200"
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
              <FaInfoCircle />
              <span className="pl-3">About Us</span>
            </Button>
          </DrawerClose>
          <DrawerClose>
            <DrawerMenu
              title="logout"
              trigger={
                <Button className="w-full flex justify-normal bg-zinc-900 hover:bg-zinc-800 text-zinc-200">
                  <IoLogOut />
                  <span className="pl-3">Logout</span>
                </Button>
              }
            >
              <div className="w-full px-2 flex flex-col">
                <DrawerClose>
                  <Button
                    onClick={handleLogout}
                    className="w-full flex justify-normal bg-zinc-900 hover:bg-zinc-800 text-zinc-200"
                  >
                    <IoLogOut />
                    <span className="pl-3">Yes</span>
                  </Button>
                </DrawerClose>

                <DrawerClose>
                  <Button className="w-full flex justify-normal bg-zinc-900 hover:bg-zinc-800 text-zinc-200">
                    <IoLogOut />
                    <span className="pl-3">No</span>
                  </Button>
                </DrawerClose>
              </div>
            </DrawerMenu>
          </DrawerClose>
        </div>
      </DrawerMenu>
    </div>
  );
}
