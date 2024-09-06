import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useProfileStore from "@/store/profileStore";
import { SettingsForm } from "./Forms";
import useMethodStore from "@/store/MethodStore";

const ProfileCard = () => {
  const { setPrevPath } = useMethodStore();
  const { profile } = useProfileStore();
  const theme = profile.theme;
  const { toggleModal, setModalContent } = useMethodStore();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="!w-14 dark:text-white flex justify-center items-center rounded-md focus:outline-none">
        <img
          className="rounded-full h-10 w-10 object-cover border-zinc-700 border-2 hover:border-zinc-200 transition-colors"
          src={profile.avatarImage}
          alt="Profile pic"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={`
          ${
            theme != "light" ? "!bg-black !text-white border-zinc-800" : ""
          } !w-64 mt-1
        `}
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
          onClick={() => {
            setPrevPath(location.pathname);
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
            setPrevPath(location.pathname);
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
            setPrevPath(location.pathname);
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
