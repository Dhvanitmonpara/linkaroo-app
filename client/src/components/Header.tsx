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
import { CreateListForm } from "./Forms";

type HeaderProps = {
  theme: themeType | undefined;
  setIsModalOpen: (isOpen: boolean) => void;
  setModalContent: (content: string | ReactNode) => void;
};

const Header = ({ theme, setIsModalOpen, setModalContent }: HeaderProps) => {
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
              setIsModalOpen(true);
              setModalContent(
                <CreateListForm setIsModalOpen={setIsModalOpen} theme={theme} />
              );
            }}
          >
            List
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setIsModalOpen(true);
              setModalContent(
                <div className="dark:text-white">
                  <h1>Add Card</h1>
                  {/* Add form fields here */}
                </div>
              );
            }}
          >
            Card
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
};

export default Header;
