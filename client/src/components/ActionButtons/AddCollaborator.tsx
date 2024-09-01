import useProfileStore from "@/store/profileStore";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { IoMdPersonAdd } from "react-icons/io";
import axios, { AxiosError, AxiosResponse } from "axios";
import { handleAxiosError } from "@/utils/handlerAxiosError";
import { useNavigate } from "react-router-dom";
import { Collaborator } from "@/lib/types";
import toast from "react-hot-toast";
import debounce from "lodash/debounce"; // Import debounce directly

const AddCollaborator = () => {
  const [userInput, setUserInput] = useState<null | string>(null);
  const [userList, setUserList] = useState<Collaborator[]>([]);
  const [selectedUser, setSelectedUser] = useState<null | Collaborator>(null);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1); // -1 means no item is focused

  const { profile } = useProfileStore();
  const theme = profile.profile.theme;

  const navigate = useNavigate();

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

      // Cleanup the debounce function on component unmount or when user changes
      return () => {
        debouncedSearch.cancel();
      };
    } else {
      setUserList([]); // Clear userList when input is cleared
    }
  }, [userInput, navigate]);

  const collaboratorSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedUser) {
      console.log('Selected user:', selectedUser);
      // Handle the selected user submission here
    } else {
      toast.error("Please select a user before submitting.");
    }
  };

  const handleUserSelect = (user: Collaborator) => {
    setSelectedUser(user);
    console.log(`Selected user: ${user.username} (${user.email})`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      setFocusedIndex((prevIndex) =>
        prevIndex < userList.length - 1 ? prevIndex + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      setFocusedIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : userList.length - 1
      );
    } else if (e.key === 'Enter' && focusedIndex !== -1) {
      handleUserSelect(userList[focusedIndex]);
    }
  };

  useEffect(() => {
    if (focusedIndex !== -1 && userList[focusedIndex]) {
      setSelectedUser(userList[focusedIndex]);
    }
  }, [focusedIndex, userList]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex justify-center items-center h-full w-full cursor-pointer">
          <IoMdPersonAdd />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={`w-56 ${
          theme !== "light" ? "!bg-black !text-white border-zinc-800" : ""
        }`}
        onCloseAutoFocus={(event) => {
          event.preventDefault(); // Prevents auto focus when closing the dropdown
        }}
      >
        <form onSubmit={collaboratorSubmitHandler}>
          <Input
            id="user"
            name="user"
            type="text"
            autoComplete="off"
            placeholder="Enter username or email"
            className={`${
              theme !== "light" ? "bg-zinc-800" : "bg-zinc-200"
            } border-none border-spacing-0`}
            onFocus={(event) => event.stopPropagation()}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown} // Add this to handle arrow keys and Enter
          />
          {userList.length > 0 &&
            userList.map((user, index) => (
              <DropdownMenuItem key={user._id} asChild>
                <div
                  className={`flex flex-col !items-start justify-start cursor-pointer ${
                    index === focusedIndex ? 'bg-gray-200 text-zinc-950' : ''
                  }`}
                  onClick={() => handleUserSelect(user)}
                >
                  <span>@{user.username}</span>
                  <span className="text-gray-400">{user.email}</span>
                </div>
              </DropdownMenuItem>
            ))}
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AddCollaborator;
