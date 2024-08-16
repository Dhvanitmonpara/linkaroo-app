import { MdHome } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";
import { IoPerson } from "react-icons/io5";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import "./HorizontalTabs.css";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useProfileStore from "@/store/profileStore";
import useMethodStore from "@/store/MethodStore";
import { CreateDocForm, CreateListForm } from "../Forms";

export default function HorizontalTabs() {
  const { profile } = useProfileStore();
  const { theme } = profile;
  const { toggleModal, setModalContent } = useMethodStore();

  const navigate = useNavigate();
  return (
    <RadioGroup
      onValueChange={(value) => {
        if (value === "list") {
          navigate(`/${value}`);
        }
      }}
      defaultValue="list"
      className="flex md:justify-between justify-evenly dark:bg-zinc-800 w-full px-14 bg-zinc-200 h-full md:px-24 sm:px-16 md:rounded-t-xl items-center sm:w-6/12"
    >
      <RadioGroupItem
        defaultChecked={true}
        value="list"
        id="list-tab"
        className="radio-item"
      />
      <label htmlFor="list-tab" className="menu-label text-xl !w-auto">
        <MdHome />
      </label>

      {/* <RadioGroupItem value="create" id="create-tab" className="radio-item" /> */}
      <label htmlFor="create-tab" className="menu-label text-lg !w-auto">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <FaPlus />
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
                  <CreateListForm setIsModalOpen={toggleModal} theme={theme} />
                );
              }}
            >
              List
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                toggleModal(true);
                setModalContent(
                  <CreateDocForm setIsModalOpen={toggleModal} theme={theme} />
                );
              }}
            >
              Doc
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </label>

      <RadioGroupItem value="profile" id="profile-tab" className="radio-item" />
      <label htmlFor="profile-tab" className="menu-label !text-base !w-auto">
        <IoPerson />
      </label>
    </RadioGroup>
  );
}
