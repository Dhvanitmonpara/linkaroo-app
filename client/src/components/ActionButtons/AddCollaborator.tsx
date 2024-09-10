import { useState, useEffect } from "react";
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
import axios, { AxiosError, AxiosResponse } from "axios";
import { handleAxiosError } from "@/utils/handlerAxiosError";
import { useNavigate } from "react-router-dom";
import { Collaborator } from "@/lib/types";
import toast from "react-hot-toast";
import debounce from "lodash/debounce";
import useProfileStore from "@/store/profileStore";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const AddCollaborator = () => {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const [userList, setUserList] = useState<Collaborator[]>([]);

  const { profile } = useProfileStore();
  const theme = profile.theme;
  const navigate = useNavigate();

  useEffect(() => {
    if (value !== null) {
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

      debouncedSearch(value);

      return () => {
        debouncedSearch.cancel();
      };
    } else {
      setUserList([]);
    }
  }, [value, navigate]);

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div
            className="h-full w-full flex justify-center items-center"
            onClick={() => setOpen(!open)}
          >
            <IoMdPersonAdd />
          </div>
        </PopoverTrigger>
        <PopoverContent className={`w-[200px] p-0 ${theme !== "light" ? "bg-zinc-900 !text-zinc-200 !border-zinc-700" : ""}`}>
          <Command className={`${theme !== "light" ? "bg-zinc-900 !text-zinc-200 !border-zinc-700" : ""}`}>
            <CommandInput placeholder="Search framework..." />
            <CommandList className="border-zinc-700">
              <CommandEmpty>No framework found.</CommandEmpty>
              <CommandGroup>
                {userList.map((user) => (
                  <CommandItem
                    key={user._id}
                    value={user.email}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === user.email || user.username ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {user.email}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default AddCollaborator;
