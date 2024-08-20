import { MdModeEditOutline } from "react-icons/md";
import { FaTag } from "react-icons/fa6";
import useMethodStore from "@/store/MethodStore";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import useProfileStore from "@/store/profileStore";
import axios, { AxiosError, AxiosResponse } from "axios";
import getErrorFromAxios from "@/utils/getErrorFromAxios";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

type Checked = DropdownMenuCheckboxItemProps["checked"];

const ListActionButtons = () => {
  const { toggleModal, setModalContent } = useMethodStore();
  const { profile, tags, setTags } = useProfileStore();
  const theme = profile.profile.theme;
  const [loading, setLoading] = useState(false);
  const [showStatusBar, setShowStatusBar] = useState<Checked>(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        const response: AxiosResponse = await axios.get(
          `${import.meta.env.VITE_SERVER_API_URL}/tags/get/o`,
          { withCredentials: true }
        );

        if (!response.data) {
          toast.error("Failed to fetch tags");
          return;
        }

        setTags(response.data);
      } catch (error) {
        const errorMsg = getErrorFromAxios(error as AxiosError);
        if (errorMsg != undefined) {
          toast.error(errorMsg);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleEditList = () => {
    toggleModal(true);
    setModalContent(<h1>helo</h1>);
  };

  const handleTagChange = (
    tagName: string,
    checked: boolean | "indeterminate"
  ) => {
    switch (tagName) {
      case "Status Bar":
        setShowStatusBar(checked);
        break;
      default:
        break;
    }
  };

  const actionButtons = [
    {
      element: <MdModeEditOutline />,
      action: handleEditList,
    },
    {
      element: (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="bg-transparent hover:bg-transparent hover:text-black border-none"
            >
              <FaTag />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className={`w-56
              ${
                theme !== "light" ? "!bg-black !text-white border-zinc-800" : ""
              }
            `}
          >
            <DropdownMenuLabel>Tags</DropdownMenuLabel>
            <DropdownMenuSeparator
              className={theme !== "light" ? "bg-zinc-800" : ""}
            />
            {loading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
            //   tags?.map((tag, index) => (
            //     <DropdownMenuCheckboxItem
            //       key={index}
            //       checked={showStatusBar === tag}
            //       onChange={(checked) => handleTagChange(tag, checked)}
            //     >
            //       {tag}
            //     </DropdownMenuCheckboxItem>
            //   ))
            <h1>Hello</h1>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="flex justify-center items-center space-x-3">
      {actionButtons?.map((actionButtons, index) => (
        <button
          key={index}
          onClick={actionButtons?.action ? actionButtons.action : () => null}
          className="h-12 w-12 bg-[#00000010] hover:bg-[#00000025] transition-colors flex justify-center items-center rounded-full text-xl"
        >
          {actionButtons.element}
        </button>
      ))}
    </div>
  );
};

export default ListActionButtons;
