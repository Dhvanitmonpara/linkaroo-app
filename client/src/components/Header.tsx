import { Input } from "./ui/input";
import { IoMdAdd } from "react-icons/io";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreateDocForm, CreateListForm } from "./Forms";
import useMethodStore from "@/store/MethodStore";
import useProfileStore from "@/store/profileStore";

const Header = () => {
  const { toggleModal, setModalContent } = useMethodStore();
  const { profile } = useProfileStore();
  const { theme } = profile;

  return (
    <nav className="h-20 py-5 flex space-x-2 md:px-0 px-4">
      <Input
        className="dark:bg-zinc-800 dark:text-white dark:border-zinc-600"
        placeholder="Create or Search something..."
      />

      <DropdownMenu>
        <DropdownMenuTrigger className="w-12 flex justify-center items-center dark:bg-zinc-800 dark:hover:bg-zinc-600 dark:text-white rounded-sm border-2 border-zinc-700">
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
    </nav>
  );
};

export default Header;
