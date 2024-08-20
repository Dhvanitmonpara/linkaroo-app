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
import axios, { AxiosError, AxiosResponse } from "axios";
import getErrorFromAxios from "@/utils/getErrorFromAxios";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { fetchedTagType } from "@/lib/types";
import useProfileStore from "@/store/profileStore";
import { removeUsernameTag } from "@/utils/toggleUsernameInTag";

type Checked = boolean;

type checkedTagsType = fetchedTagType & {
  isChecked?: Checked;
};

const ListActionButtons = () => {
  const { toggleModal, setModalContent } = useMethodStore();
  const { profile, setTags } = useProfileStore();
  const theme = profile.profile.theme;
  const [loading, setLoading] = useState(false);
  const [checkedTags, setCheckedTags] = useState<checkedTagsType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const userTagResponse: AxiosResponse = await axios.get(
          `${import.meta.env.VITE_SERVER_API_URL}/tags/get/o`,
          { withCredentials: true }
        );

        if (!userTagResponse.data.data) {
          toast.error("Failed to fetch user tags");
          return;
        }

        const listTagResponse: AxiosResponse = await axios.get(
          `${import.meta.env.VITE_SERVER_API_URL}/tags/get/list/66be0acb50d560b6994114b0`,
          { withCredentials: true }
        );

        if (!listTagResponse.data.data) {
          toast.error("Failed to fetch list tags");
          return;
        }

        setTags(userTagResponse.data.data);

        const intersection: checkedTagsType[] = listTagResponse.data.data.map(
          (tag: checkedTagsType) => ({
            ...tag,
            isChecked: userTagResponse.data.data.some(
              (userTag: fetchedTagType) => userTag.tagname === tag.tagname
            ),
          })
        );

        setCheckedTags(intersection);
      } catch (error) {
        const errorMsg = getErrorFromAxios(error as AxiosError);
        if (errorMsg != undefined) {
          toast.error(errorMsg);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEditList = () => {
    toggleModal(true);
    setModalContent(<h1>Hello</h1>);
  };

  const handleSaveChanges = async () => {
    try {
      setLoading(true);

      const saveResponse: AxiosResponse = await axios.post(
        `${import.meta.env.VITE_SERVER_API_URL}/tags/update/list`,
        checkedTags,
        { withCredentials: true }
      );

      if (saveResponse.data.success) {
        toast.success("Changes saved successfully");
      } else {
        toast.error("Failed to save changes");
      }
    } catch (error) {
      const errorMsg = getErrorFromAxios(error as AxiosError);
      if (errorMsg != undefined) {
        toast.error(errorMsg);
      }
    } finally {
      setLoading(false);
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
            className={`w-56 ${
              theme !== "light" ? "!bg-black !text-white border-zinc-800" : ""
            }`}
          >
            <DropdownMenuLabel>Tags</DropdownMenuLabel>
            <DropdownMenuSeparator
              className={theme !== "light" ? "bg-zinc-800" : ""}
            />
            {loading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <>
                {checkedTags.map((tag, index) => (
                  <DropdownMenuCheckboxItem
                    key={index}
                    checked={tag.isChecked}
                    onCheckedChange={(checked) => {
                      setCheckedTags((state) =>
                        state.map((t) => {
                          if (t.tagname === tag.tagname) {
                            return { ...t, isChecked: checked };
                          }
                          return t;
                        })
                      );
                    }}
                  >
                    {removeUsernameTag(tag.tagname)}
                  </DropdownMenuCheckboxItem>
                ))}
                <DropdownMenuSeparator
                  className={theme !== "light" ? "bg-zinc-800" : ""}
                />
                <Button
                  onClick={handleSaveChanges}
                  className="mt-2 w-full"
                  disabled={loading}
                >
                  Save Changes
                </Button>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="flex justify-center items-center space-x-3">
      {actionButtons.map((actionButton, index) => (
        <button
          key={index}
          onClick={actionButton.action ? actionButton.action : () => null}
          className="h-12 w-12 bg-[#00000010] hover:bg-[#00000025] transition-colors flex justify-center items-center rounded-full text-xl"
        >
          {actionButton.element}
        </button>
      ))}
    </div>
  );
};

export default ListActionButtons;
