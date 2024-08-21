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
    const fetchTags = async () => {
      try {
        setLoading(true);

        const [userTagResponse, listTagResponse] = await Promise.all([
          axios.get(`${import.meta.env.VITE_SERVER_API_URL}/tags/get/o`, {
            withCredentials: true,
          }),
          axios.get(
            `${
              import.meta.env.VITE_SERVER_API_URL
            }/tags/get/list/66be0acb50d560b6994114b0`,
            { withCredentials: true }
          ),
        ]);

        if (!userTagResponse.data.data || !listTagResponse.data.data) {
          toast.error("Failed to fetch tags");
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
        toast.error(errorMsg || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, [setTags]);

  const handleEditList = () => {
    toggleModal(true);
    setModalContent(<h1>Hello</h1>);
  };

  const handleSaveChanges = async () => {
    try {
      setLoading(true);

      const tagIds = checkedTags
        .filter((tag) => tag.isChecked)
        .map((tag) => tag._id);

        console.log(tagIds)

      const saveResponse: AxiosResponse = await axios.patch(
        `${
          import.meta.env.VITE_SERVER_API_URL
        }/tags/66be0acb50d560b6994114b0/customize`,
        { tagArray: tagIds },
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
            <div
              className="h-12 w-12 bg-transparent hover:bg-transparent border-none flex justify-center items-center rounded-full text-xl"
              aria-label="Tag Options"
            >
              <FaTag />
            </div>
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
              <div className="w-full h-28 flex justify-center items-center">
                <Loader2 className="animate-spin" size={16} />
              </div>
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
                  className={`mt-2 w-full ${
                    theme !== "light"
                      ? "text-zinc-200 bg-zinc-800 hover:bg-zinc-700"
                      : "bg-zinc-100 hover:bg-zinc-200 text-zinc-950"
                  }`}
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
          onClick={actionButton.action}
          className="h-12 w-12 bg-[#00000010] hover:bg-[#00000025] transition-colors flex justify-center items-center rounded-full text-xl"
        >
          {actionButton.element}
        </button>
      ))}
    </div>
  );
};

export default ListActionButtons;
