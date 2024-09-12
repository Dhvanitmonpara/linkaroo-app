import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IoMdPersonAdd, IoIosCopy } from "react-icons/io";
import axios, { AxiosError, AxiosResponse } from "axios";
import { handleAxiosError } from "@/utils/handlerAxiosError";
import { useNavigate } from "react-router-dom";
import { Collaborator } from "@/lib/types";
import debounce from "lodash/debounce";
import useProfileStore from "@/store/profileStore";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
// import { FaUserCircle } from "react-icons/fa";
import { MdAlternateEmail } from "react-icons/md";
// import { FaGoogle } from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import toast from "react-hot-toast";

const AddCollaborator: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [userList, setUserList] = useState<Collaborator[]>([]);
  const [searchByEmail, setSearchByEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const { profile } = useProfileStore();
  const theme = profile.theme;
  const navigate = useNavigate();
  const resultRefs = useRef<(HTMLDivElement | null)[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const searchUsers = useCallback(
    debounce(async (user: string) => {
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
        setSelectedIndex(-1);
      } catch (error) {
        handleAxiosError(error as AxiosError, navigate);
        setUserList([]);
      } finally {
        setLoading(false);
      }
    }, 500),
    [navigate, searchByEmail]
  );

  useEffect(() => {
    searchUsers(value);
    return () => searchUsers.cancel();
  }, [value, searchUsers]);

  const handleSelect = (email: string) => {
    setValue(email);
    setOpen(false);
  };

  const handleSearchModeToggle = (isEmailSearch: boolean) => {
    setSearchByEmail(isEmailSearch);
    setOpen(true);
    setValue("");
  };

  const getSharableLink = () => {
    if (!window.location.href.includes("lists")) {
      toast.error("Please select a list");
      return;
    }
    let link = window.location.href;
    if (link.includes("docs")) link = link.split("doc")[0];
    navigator.clipboard.writeText(link);
    setOpen(false);
    toast(
      <div className="flex space-x-2 justify-center items-center">
        <IoIosCopy />
        <span>Link copied to clipboard!</span>
      </div>
    );
  };

  return (
    <DropdownMenu open={open} onOpenChange={() => setOpen(!open)} modal={false}>
      <DropdownMenuTrigger asChild>
        <div className="h-full w-full flex justify-center items-center cursor-pointer">
          <IoMdPersonAdd />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={cn(
          "w-[200px] p-0",
          theme !== "light" && "bg-zinc-900 text-zinc-200 border-zinc-700"
        )}
      >
        <div className="flex justify-center items-center p-2 space-x-2">
          <div className={cn(theme !== "light" && "bg-zinc-900 text-zinc-200")}>
            <Input
              ref={inputRef}
              placeholder={`Search by ${
                searchByEmail ? "email" : "username"
              }...`}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className={cn(
                "w-full p-2 border rounded",
                theme !== "light" && "bg-zinc-800 text-zinc-200 border-zinc-700"
              )}
            />
          </div>
          <Button
            onClick={() => handleSearchModeToggle(!searchByEmail)}
            className={`w-10 flex justify-center p-0 items-center ${
              theme !== "light"
                ? "text-zinc-200 bg-zinc-800 hover:bg-zinc-700"
                : "bg-zinc-100 hover:bg-zinc-200 text-zinc-950"
            }`}
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
                  <DropdownMenuItem className="flex items-center justify-center p-2">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </DropdownMenuItem>
                ) : userList.length === 0 ? (
                  <DropdownMenuItem
                    className={cn(
                      "p-2 text-center",
                      theme !== "light" ? "text-zinc-200" : "text-black"
                    )}
                  >
                    No data found
                  </DropdownMenuItem>
                ) : (
                  userList.map((user, index) => (
                    <DropdownMenuItem
                      key={user.email}
                      ref={(el) => (resultRefs.current[index] = el)}
                      className={cn(
                        "flex items-center p-2 cursor-pointer rounded-sm",
                        selectedIndex === index
                          ? "bg-zinc-100 text-black"
                          : theme !== "light"
                          ? "bg-zinc-900 text-zinc-200 hover:bg-zinc-800"
                          : "bg-white text-black hover:bg-gray-100"
                      )}
                      onClick={() => handleSelect(user.email)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSelect(user.email);
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
          <div className="w-full h-full p-2 space-y-2">
            <Button
              onClick={getSharableLink}
              className={`w-full flex justify-center p-0 items-center ${
                theme !== "light"
                  ? "text-zinc-200 bg-zinc-800 hover:bg-zinc-700"
                  : "bg-zinc-100 hover:bg-zinc-200 text-zinc-950"
              }`}
            >
              Get a sharable link
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AddCollaborator;
