import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IoMdPersonAdd } from "react-icons/io";
import axios, { AxiosError, AxiosResponse } from "axios";
import { handleAxiosError } from "@/utils/handlerAxiosError";
import { useNavigate } from "react-router-dom";
import { Collaborator } from "@/lib/types";
import toast from "react-hot-toast";
import debounce from "lodash/debounce";
import useProfileStore from "@/store/profileStore";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";

const AddCollaborator: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [userList, setUserList] = useState<Collaborator[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1); // To track which item is focused

  const { profile } = useProfileStore();
  const theme = profile.theme;
  const navigate = useNavigate();
  const resultRefs = useRef<(HTMLDivElement | null)[]>([]); // Refs for result items
  const inputRef = useRef<HTMLInputElement>(null); // Ref for input

  const searchUsers = useCallback(
    debounce(async (user: string) => {
      if (!user) {
        setUserList([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response: AxiosResponse = await axios.patch(
          `${import.meta.env.VITE_SERVER_API_URL}/users/search`,
          { user },
          { withCredentials: true }
        );

        setUserList(response.data.data);
        setSelectedIndex(-1); // Reset selected index
      } catch (error) {
        handleAxiosError(error as AxiosError, navigate);
        setUserList([]);
        toast.error("Failed to retrieve users.");
      } finally {
        setLoading(false);
      }
    }, 500),
    [navigate]
  );

  useEffect(() => {
    searchUsers(value);
    return () => searchUsers.cancel();
  }, [value, searchUsers]);

  const handleSelect = (email: string) => {
    setValue(email);
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      // Move focus to the first result
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, userList.length - 1));
      resultRefs.current[selectedIndex + 1]?.focus();
    } else if (e.key === "ArrowUp") {
      // Move focus up, or back to input
      e.preventDefault();
      if (selectedIndex === 0) {
        inputRef.current?.focus();
      } else {
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
        resultRefs.current[selectedIndex - 1]?.focus();
      }
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      handleSelect(userList[selectedIndex].email); // Select the highlighted user
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="h-full w-full flex justify-center items-center cursor-pointer">
          <IoMdPersonAdd />
        </div>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          "w-[200px] p-0",
          theme !== "light" && "bg-zinc-900 text-zinc-200 border-zinc-700"
        )}
      >
        <div
          className={cn(
            "p-2",
            theme !== "light" && "bg-zinc-900 text-zinc-200"
          )}
        >
          <Input
            type="text"
            placeholder="Search for a user..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            ref={inputRef}
            className={cn(
              "w-full p-2 border rounded",
              theme !== "light" && "bg-zinc-800 text-zinc-200 border-zinc-700"
            )}
          />
        </div>
        <ScrollArea>
          <div className="p-2">
            {loading ? (
              <div className="flex items-center justify-center p-2">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </div>
            ) : (
              userList.map((user, index) => (
                <div
                  key={user.email}
                  ref={(el) => (resultRefs.current[index] = el)} 
                  tabIndex={-1} // Make it focusable
                  className={cn(
                    "flex items-center p-2 cursor-pointer outline-none rounded-sm",
                    selectedIndex === index
                      ? "bg-zinc-100 text-black" 
                      : theme !== "light"
                      ? "!bg-zinc-900 text-zinc-200 hover:bg-zinc-800"
                      : "bg-white text-black hover:bg-gray-100"
                  )}
                  onClick={() => handleSelect(user.email)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleSelect(user.email)
                  }
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === user.email ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {user.email}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default AddCollaborator;
