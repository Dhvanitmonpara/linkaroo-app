import React, { useState, useEffect, useCallback } from "react";
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
import { IoMdPersonAdd } from "react-icons/io";
import axios, { AxiosError } from "axios";
import { handleAxiosError } from "@/utils/handlerAxiosError";
import { useNavigate } from "react-router-dom";
import { Collaborator } from "@/lib/types";
import toast from "react-hot-toast";
import debounce from "lodash/debounce";
import useProfileStore from "@/store/profileStore";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const AddCollaborator: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [userList, setUserList] = useState<Collaborator[]>([]);
  const [loading, setLoading] = useState(false);

  const { profile } = useProfileStore();
  const theme = profile.theme;
  const navigate = useNavigate();

  const searchUsers = useCallback(
    debounce(async (user: string) => {
      if (!user) {
        setUserList([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await axios.patch<{ data: Collaborator[] }>(
          `${import.meta.env.VITE_SERVER_API_URL}/users/search`,
          { user },
          { withCredentials: true }
        );

        console.log("API response:", response.data); // Debug log
        setUserList(response.data.data);
      } catch (error) {
        console.error("Error fetching users:", error);
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

  const handleSelect = (currentValue: string) => {
    console.log("Selected value:", currentValue); // Debug log
    setValue(currentValue === value ? "" : currentValue);
    setOpen(false);
  };

  console.log("Rendering with userList:", userList); // Debug log

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
        <Command
          className={cn(
            theme !== "light" && "bg-zinc-900 text-zinc-200 border-zinc-700"
          )}
        >
          <CommandInput
            placeholder="Search for a user..."
            value={value}
            onValueChange={(newValue) => {
              console.log("Input value changed:", newValue); // Debug log
              setValue(newValue);
            }}
          />
          <CommandList>
            <CommandEmpty>No users found.</CommandEmpty>
            <CommandGroup>
              {loading ? (
                <CommandItem disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </CommandItem>
              ) : (
                userList.map((user) => (
                  <CommandItem
                    key={user._id}
                    value={user.email}
                    onSelect={handleSelect}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === user.email ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {user.email}
                  </CommandItem>
                ))
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default AddCollaborator;
