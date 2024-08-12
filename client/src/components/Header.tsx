import { Input } from "./ui/input";
import { IoMdAdd } from "react-icons/io";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

type HeaderProps = {
  theme: string | undefined;
  setIsModalOpen: (isOpen: boolean) => void;
  setModalContent: (content: string | ReactNode) => void;
};

const Header = ({ theme, setIsModalOpen, setModalContent }: HeaderProps) => {
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit } = useForm<handleListCreationType>();

  const handleListCreation = async (data: { title: string }) => {
    try {
      setLoading(true);
      console.log(data)
    } catch (error) {
      console.log(error);
    }
  };

  type handleListCreationType = {
    title: string;
  }

  return (
    <nav className="h-20 py-5 flex space-x-2">
      <Input
        className="dark:bg-zinc-800 dark:text-white dark:border-zinc-600"
        placeholder="Search something..."
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
                <div className="dark:text-white p-5 flex justify-center items-center space-y-3">
                  <h1 className="text-3xl">Add List</h1>
                  <form
                    action="post"
                    className="h-4/5 flex flex-col space-y-6 w-96 justify-center items-center"
                    onSubmit={handleSubmit(handleListCreation)}
                  >
                    <div className="w-full space-y-2">
                      <label htmlFor="username-or-email">
                        Title
                      </label>
                      <Input
                        id="title"
                        type="text"
                        placeholder="Enter Username or Email"
                        className="bg-slate-800"
                        {...register("title", {
                          required: true,
                        })}
                      />
                    </div>

                    {loading ? (
                      <Button
                        disabled
                        className="bg-slate-800 hover:bg-slate-700 w-full cursor-wait"
                      >
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                        wait
                      </Button>
                    ) : (
                      <Button className="bg-slate-800 text-white hover:bg-slate-700 w-full">
                        Login
                      </Button>
                    )}
                  </form>
                </div>
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
