import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FaPlus } from "react-icons/fa6";
import { IoMdPersonAdd } from "react-icons/io";
import axios, { AxiosError, AxiosResponse } from "axios";
import { handleAxiosError } from "@/utils/handlerAxiosError";
import { useNavigate } from "react-router-dom";
import { Collaborator } from "@/lib/types";
import toast from "react-hot-toast";
import debounce from "lodash/debounce";
import useProfileStore from "@/store/profileStore";
import useDocStore from "@/store/docStore";

const AddCollaborator = () => {
  const [userInput, setUserInput] = useState<null | string>(null);
  const [userList, setUserList] = useState<Collaborator[]>([]);
  const [selectedUser, setSelectedUser] = useState<null | Collaborator>(null);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isAddNewFunctionActive, setIsAddNewFunctionActive] = useState(false);

  const { profile } = useProfileStore();
  const theme = profile.theme;
  const navigate = useNavigate();
  const { currentListItem } = useDocStore();

  useEffect(() => {
    if (userInput !== null) {
      const debouncedSearch = debounce(async (user: string) => {
        try {
          const response: AxiosResponse = await axios.patch(
            `${import.meta.env.VITE_SERVER_API_URL}/users/search`,
            { user: user },
            { withCredentials: true }
          );

          if (response.data && Array.isArray(response.data.data)) {
            setUserList(response.data.data);
          } else {
            toast.error("Failed to retrieve a valid user list.");
            setUserList([]);
          }
        } catch (error) {
          handleAxiosError(error as AxiosError, navigate);
          setUserList([]);
        }
      }, 300);

      debouncedSearch(userInput);

      return () => {
        debouncedSearch.cancel();
      };
    } else {
      setUserList([]);
    }
  }, [userInput, navigate]);

  const handleUserSelect = (user: Collaborator) => {
    setSelectedUser(user);
    setUserInput(null);
    inputRef.current?.focus();
    toast.success(`Selected user: ${user.username} (${user.email})`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      setFocusedIndex((prevIndex) =>
        prevIndex < userList.length - 1 ? prevIndex + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      setFocusedIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : userList.length - 1
      );
    } else if (e.key === "Enter" && focusedIndex !== -1) {
      handleUserSelect(userList[focusedIndex]);
    } else if (e.key === "Escape") {
      setUserInput(null);
      setFocusedIndex(-1);
    }
  };

  useEffect(() => {
    if (focusedIndex !== -1 && userList[focusedIndex]) {
      setSelectedUser(userList[focusedIndex]);
    }
  }, [focusedIndex, userList]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="h-full w-full flex justify-center items-center">
          <IoMdPersonAdd />
        </div>
      </PopoverTrigger>
      <PopoverContent
        className={`w-56 p-2 ${
          theme !== "light" ? "!bg-black !text-white border-zinc-800" : ""
        }`}
      >
        {isAddNewFunctionActive ? (
          <>
            <div
              className="w-[200px] justify-between flex items-center cursor-pointer p-2 border rounded"
              onClick={() => inputRef.current?.focus()}
            >
              {selectedUser
                ? `${selectedUser.username} (${selectedUser.email})`
                : "Select or type..."}
              <IoMdPersonAdd className="ml-2 h-4 w-4 shrink-0" />
            </div>
            <Command>
              <CommandInput
                ref={inputRef}
                placeholder="Search or type..."
                value={userInput || ""}
                onValueChange={(value) => setUserInput(value)}
                onKeyDown={handleKeyDown}
                autoFocus
              />
              <CommandList>
                <CommandEmpty>No user found.</CommandEmpty>
                <CommandGroup>
                  {userList.map((user, index) => (
                    <CommandItem
                      key={user._id}
                      onSelect={() => handleUserSelect(user)}
                      className={`flex flex-col cursor-pointer p-2 ${
                        index === focusedIndex
                          ? "bg-blue-500 text-white"
                          : "bg-white text-black"
                      }`}
                    >
                      <span>@{user.username}</span>
                      <span className="text-gray-400">{user.email}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </>
        ) : (
          <Button
            onClick={() => setIsAddNewFunctionActive(true)}
            className={`w-full px-2 ${
              theme !== "light"
                ? "text-zinc-200 bg-zinc-950 hover:bg-zinc-800"
                : "bg-zinc-100 hover:bg-zinc-200 text-zinc-950"
            }`}
          >
            <span className="flex w-full justify-start items-center space-x-[0.65rem]">
              <FaPlus /> <span className="font-semibold">Add Collaborator</span>
            </span>
          </Button>
        )}
        <hr className="my-1 border-t-[0.5px] !border-gray-800" />
        <div className="space-x-2">
          {currentListItem && currentListItem.collaborators.length > 0 ? (
            currentListItem.collaborators.map((collaborator) => (
              <div className="flex justify-normal items-center w-full h-11 hover:bg-zinc-200 hover:text-zinc-900 p-2 rounded-sm">
                {collaborator.username}
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-200 flex justify-center items-center w-full h-16">
              No collaborators found
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AddCollaborator;
