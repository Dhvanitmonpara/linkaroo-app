import { Input } from "./ui/input";
import { IoMdAdd } from "react-icons/io";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ReactNode } from "react";
import { themeType } from "@/lib/types";
import { CreateDocForm, CreateListForm } from "./Forms";
import useMethodStore from "@/store/MethodStore";

type HeaderProps = {
  theme: themeType | undefined;
  setModalContent: (content: string | ReactNode) => void;
};

const Header = ({ theme, setModalContent }: HeaderProps) => {
  const {toggleModal} = useMethodStore()
  return (
    <nav className="h-20 py-5 flex space-x-2">
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
            theme != "light" ? "!bg-black !text-white border-zinc-800" : ""
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
