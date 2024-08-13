import { Input } from "./ui/input";
import { IoMdAdd } from "react-icons/io";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectValue,
} from "@/components/ui/select";
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
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  type handleListCreationType = {
    title: string;
    description: string;
    theme: string;
  };

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
                <div className="dark:text-white p-5 flex flex-col justify-center items-center space-y-3">
                  <h1 className="text-3xl">Add List</h1>
                  <form
                    action="post"
                    className="h-4/5 flex flex-col space-y-6 w-96 justify-center items-center"
                    onSubmit={handleSubmit(handleListCreation)}
                  >
                    <div className="w-full space-y-2">
                      <label htmlFor="username-or-email">Title</label>
                      <Input
                        id="title"
                        type="text"
                        placeholder="Enter title"
                        className="dark:bg-zinc-700 bg-zinc-200"
                        {...register("title", {
                          required: true,
                        })}
                      />
                    </div>
                    <div className="w-full space-y-2">
                      <label htmlFor="username-or-email">Description</label>
                      <Input
                        id="title"
                        type="text"
                        placeholder="Enter title"
                        className="dark:bg-zinc-700 bg-zinc-200"
                        {...register("description", {
                          required: true,
                        })}
                      />
                    </div>
                    <div className="w-full space-y-2">
                      <span>Theme</span>
                      <Select
                        {...register("theme")}
                        onValueChange={(value: string) => {
                          console.log(value);
                        }}
                      >
                        <SelectTrigger className="dark:text-white dark:bg-zinc-700 max-w-96">
                          <SelectValue placeholder="Change theme" />
                        </SelectTrigger>
                        <SelectContent
                          className={
                            theme != "light"
                              ? "!bg-zinc-900 !text-white border-zinc-800"
                              : ""
                          }
                        >
                          <SelectGroup>
                            <SelectLabel>Themes</SelectLabel>
                            <SelectItem defaultChecked value="default">
                              Default
                            </SelectItem>
                            <SelectItem value="bg-emerald-400">
                              Emerald
                            </SelectItem>
                            <SelectItem value="bg-orange-400">
                              Orange
                            </SelectItem>
                            <SelectItem value="bg-red-400">Red</SelectItem>
                            <SelectItem value="bg-purple-400">
                              Purple
                            </SelectItem>
                            <SelectItem value="bg-pink-400">Pink</SelectItem>
                            <SelectItem value="bg-indigo-400">
                              Indigo
                            </SelectItem>
                            <SelectItem value="bg-teal-400">Teal</SelectItem>
                            <SelectItem value="bg-cyan-400">Cyan</SelectItem>
                            <SelectItem value="bg-amber-400">Amber</SelectItem>
                            <SelectItem value="bg-violet-400">
                              Violet
                            </SelectItem>
                            <SelectItem value="bg-yellow-400">
                              Yellow
                            </SelectItem>
                            <SelectItem value="bg-green-400">Green</SelectItem>
                            <SelectItem value="bg-blue-400">Blue</SelectItem>
                            <SelectItem value="bg-rose-400">Rose</SelectItem>
                            <SelectItem value="bg-sky-400">Sky</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-full space-y-2">
                      <span>Font</span>
                      <Select
                        onValueChange={(value: string) => {
                          console.log(value);
                        }}
                      >
                        <SelectTrigger className="dark:text-white dark:bg-zinc-700 max-w-96">
                          <SelectValue placeholder="Space mono" />
                        </SelectTrigger>
                        <SelectContent
                          className={
                            theme != "light"
                              ? "!bg-zinc-900 !text-white border-zinc-800"
                              : ""
                          }
                        >
                          <SelectGroup>
                            <SelectLabel>Fonts</SelectLabel>
                            <SelectItem defaultChecked value="space-mono">
                              Space mono
                            </SelectItem>
                            <SelectItem value="arial">Arial</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    {loading ? (
                      <Button
                        disabled
                        className="dark:bg-zinc-700 dark:hover:bg-zinc-600 hover:bg-zinc-300 text-zinc-900 bg-zinc-200 w-full dark:text-white cursor-wait"
                      >
                        <Loader2 className="mr-2 h-4 w-4 animate-spin dark:text-white" />{" "}
                        Please wait
                      </Button>
                    ) : (
                      <Button className="dark:bg-zinc-700 bg-zinc-200 font-semibold text-zinc-950 dark:text-white hover:bg-zinc-300 dark:hover:bg-zinc-600 w-full">
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
