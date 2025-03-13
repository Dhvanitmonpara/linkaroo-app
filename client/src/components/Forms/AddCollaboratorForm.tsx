import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { MdAlternateEmail } from "react-icons/md";
import { IoMail } from "react-icons/io5";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import axios, { AxiosError, AxiosResponse } from "axios";
import { Collaborator } from "@/lib/types";
import debounce from "lodash/debounce";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useMemo, useRef, useState } from "react";
import { IoIosCopy } from "react-icons/io";
import { cn } from "@/lib/utils";
import { DropdownMenuItem, DropdownMenuSeparator } from "../ui/dropdown-menu";

function AddCollaboratorForm({ value, setConfirmRequest, setValue, setOpen, confirmRequest }: {
  confirmRequest: boolean;
  setConfirmRequest: (value: boolean) => void;
  value: string;
  setValue: (value: string) => void;
  setOpen: (value: boolean) => void;
}) {
  const [userList, setUserList] = useState<Collaborator[]>([]);
  const [searchByEmail, setSearchByEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sendRequestLoading, setSendRequestLoading] = useState(false);

  const resultRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const inputRef = useRef<HTMLInputElement>(null);

  const searchUsers = debounce(async (user: string) => {
    if (!user) {
      setUserList([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const apiEndpoint = searchByEmail ? "email" : "username";

      const response: AxiosResponse = await axios.patch(
        `${import.meta.env.VITE_SERVER_API_URL}/users/search/${apiEndpoint}`,
        { user },
        { withCredentials: true }
      );

      setUserList(response.data.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.message)
      } else {
        console.error(error);
        toast.error("Error while adding collaborator")
      }
      setUserList([]);
    } finally {
      setLoading(false);
    }
  }, 500);

  useEffect(() => {
    searchUsers(value);
    return () => searchUsers.cancel();
  }, [value, searchUsers]);

  const handleSelect = (user: string) => {
    setConfirmRequest(true);
    setValue(user);
  };

  const handleSendRequest = async () => {
    try {
      setSendRequestLoading(true);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.message)
      } else {
        console.error(error);
        toast.error("Error while adding collaborator")
      }
    } finally {
      setSendRequestLoading(false);
    }
  };

  const handleSearchModeToggle = (isEmailSearch: boolean) => {
    setSearchByEmail(isEmailSearch);
    setOpen(true);
    setValue("");
  };

  const getSharableLink = () => {
    try {
      if (!window.location.href.includes("/c")) {
        toast.error("Please select a list");
        return;
      }
      let link = window.location.href;
      if (link.includes("/link")) link = link.split("link")[0];
      navigator.clipboard.writeText(link);
      setOpen(false);
      toast(
        <div className="flex space-x-2 justify-center items-center">
          <IoIosCopy />
          <span>Link copied to clipboard!</span>
        </div>
      );
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const placeholder = useMemo(
    () => `Search by ${searchByEmail ? "email" : "username"}...`,
    [searchByEmail]
  );

  return (
    <>
      <div className="flex justify-center items-center p-2 space-x-2">
        <div className={cn("bg-zinc-900 text-zinc-200 w-full md:w-fit")}>
          <Input
            ref={inputRef}
            placeholder={placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className={cn(
              "w-full p-2 border rounded",
              "dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700"
            )}
          />
        </div>
        <Button
          onClick={() => handleSearchModeToggle(!searchByEmail)}
          className={`w-10 flex justify-center p-0 items-center dark:text-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 bg-zinc-100 hover:bg-zinc-200 text-zinc-950`}
        >
          {searchByEmail ? <MdAlternateEmail /> : <IoMail />}
        </Button>
      </div>
      {value ? (
        <>
          <DropdownMenuSeparator />
          <ScrollArea>
            <div className="p-2">
              {loading ? (
                <div className="flex items-center justify-center p-2">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </div>
              ) : userList.length === 0 ? (
                <div className={cn("p-2 text-center", "text-zinc-200")}>
                  No data found
                </div>
              ) : confirmRequest ? (
                <div>
                  <Button
                    onClick={handleSendRequest}
                    className={`w-full flex justify-center p-0 items-center dark:text-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 bg-zinc-100 hover:bg-zinc-200 text-zinc-950`}
                  >
                    {sendRequestLoading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "Send request"
                    )}
                  </Button>
                </div>
              ) : (
                userList.map((user, index) => (
                  <DropdownMenuItem
                    key={user.email}
                    ref={(el) => (resultRefs.current[index] = el)}
                    className={cn(
                      "flex items-center p-2 cursor-pointer rounded-sm",
                      "dark:text-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 bg-zinc-100 hover:bg-zinc-200 text-zinc-950"
                    )}
                    onClick={(e) => {
                      e.preventDefault();
                      handleSelect(searchByEmail ? user.email : user.username);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter")
                        handleSelect(searchByEmail ? user.email : user.username);
                    }}
                  >
                    {searchByEmail ? user.email : `@${user.username}`}
                  </DropdownMenuItem>
                ))
              )}
            </div>
          </ScrollArea>
        </>
      ) : (
        <>
          <div className="grid w-full grid-cols-12 justify-center items-center dark:text-zinc-600 text-zinc-300">
            <span className="col-span-5">
              <hr className="dark:border-zinc-600 border-zinc-300" />
            </span>
            <span className="col-span-2 flex justify-center items-center text-xs">
              OR
            </span>
            <span className="col-span-5">
              <hr className="dark:border-zinc-600 border-zinc-300" />
            </span>
          </div>
          <div className="w-full h-full p-2 space-y-2">
            <Button
              onClick={getSharableLink}
              className="w-full flex justify-center p-0 items-center dark:text-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 bg-zinc-100 hover:bg-zinc-200 text-zinc-950"
            >
              Get a sharable link
            </Button>
          </div>
        </>
      )}
    </>
  );
}

export default AddCollaboratorForm;
