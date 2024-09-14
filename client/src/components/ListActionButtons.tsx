import { BiSolidPencil } from "react-icons/bi";
import { FaTag } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import { RiDeleteBinFill } from "react-icons/ri";
import useMethodStore from "@/store/MethodStore";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
import { PiDotsThreeOutlineFill } from "react-icons/pi";
import { Button } from "@/components/ui/button";
import { FormEventHandler, useEffect, useState } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import toast, { Toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { fetchedTagType } from "@/lib/types";
import useProfileStore from "@/store/profileStore";
import { removeUsernameTag } from "@/utils/toggleUsernameInTag";
import { useNavigate, useParams } from "react-router-dom";
import useListStore from "@/store/listStore";
import useDocStore from "@/store/docStore";
import { CreateDocForm, EditListForm } from "./Forms";
import { Input } from "./ui/input";
import { handleAxiosError } from "@/utils/handlerAxiosError";
import { AddCollaborator } from "./ActionButtons";
import { FaLock } from "react-icons/fa";
import { FaLockOpen } from "react-icons/fa";
import { useMediaQuery } from "react-responsive";

type Checked = boolean;

type checkedTagsType = fetchedTagType & {
  isChecked?: Checked;
};

type ListActionButtonsProps = {
  listTitle: string | undefined;
};

const ListActionButtons = ({ listTitle }: ListActionButtonsProps) => {
  const { toggleModal, setModalContent, setPrevPath } = useMethodStore();
  const { profile, setTags } = useProfileStore();
  const { removeListItem, updateListTags, toggleIsPublic } = useListStore();
  const { setDocs, currentListItem, setCurrentListItem, removeCachedDocList } = useDocStore();
  const theme = profile.theme;
  const [loading, setLoading] = useState(false);
  const [saveChangesLoading, setSaveChangesLoading] = useState(false);
  const [checkedTags, setCheckedTags] = useState<checkedTagsType[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [newTagInput, setNewTagInput] = useState(false);
  const [newTagSubmitLoading, setNewTagSubmitLoading] = useState(false);

  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery({ query: "(max-width: 1024px)" });
  const { listId } = useParams();

  useEffect(() => {
    (async () => {
      if (listId !== undefined) {
        try {
          setLoading(true);

          const [userTagResponse, listTagResponse] = await Promise.all([
            axios.get(`${import.meta.env.VITE_SERVER_API_URL}/tags/get/o`, {
              withCredentials: true,
            }),
            axios.get(
              `${import.meta.env.VITE_SERVER_API_URL}/tags/get/list/${listId}`,
              { withCredentials: true }
            ),
          ]);

          if (!userTagResponse.data.data || !listTagResponse.data.data) {
            toast.error("Failed to fetch tags");
            return;
          }

          setTags(userTagResponse.data.data);

          const intersection: checkedTagsType[] = userTagResponse.data.data.map(
            (tag: checkedTagsType) => ({
              ...tag,
              isChecked: listTagResponse.data.data.some(
                (userTag: fetchedTagType) => userTag.tagname === tag.tagname
              ),
            })
          );

          setCheckedTags(intersection);
        } catch (error) {
          handleAxiosError(error as AxiosError, navigate);
        } finally {
          setLoading(false);
        }
      }
    })();
  }, [setTags, listId]);

  const handleEditList = () => {
    setPrevPath(location.pathname);
    toggleModal(true);
    setModalContent(<EditListForm theme={theme} toggleModal={toggleModal} />);
  };

  const HandleAddNewTag: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const newTagName = formData.get("title")?.toString();

    if (!newTagName) {
      toast.error("Tag name cannot be empty");
      return;
    }

    try {
      setNewTagSubmitLoading(true);

      const createTagResponse: AxiosResponse = await axios.post(
        `${import.meta.env.VITE_SERVER_API_URL}/tags`,
        { tag: newTagName },
        { withCredentials: true }
      );

      if (!createTagResponse.data.success) {
        toast.error("Failed to create new tag");
        return;
      }

      const newTag = createTagResponse.data.data;
      setCheckedTags((prevTags) => [
        ...prevTags,
        { ...newTag, isChecked: true },
      ]);

      setNewTagInput(false);
      toast.success("Tag created successfully");
    } catch (error) {
      handleAxiosError(error as AxiosError, navigate);
    } finally {
      setNewTagSubmitLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    try {
      setSaveChangesLoading(true);

      const tagIds = checkedTags
        .filter((tag) => tag.isChecked)
        .map((tag) => tag._id);

      const saveResponse: AxiosResponse = await axios.patch(
        `${import.meta.env.VITE_SERVER_API_URL}/tags/${listId}/customize`,
        { tagArray: tagIds },
        { withCredentials: true }
      );

      if (!saveResponse.data.success) {
        toast.error("Failed to save changes");
      }

      const listTags = checkedTags.filter((tag) => tag.isChecked === true);
      const updatedList = { ...saveResponse.data.data, tags: listTags };

      updateListTags(updatedList);

      setDropdownOpen(false);
      toast.success("Changes saved successfully");
    } catch (error) {
      handleAxiosError(error as AxiosError, navigate);
    } finally {
      setSaveChangesLoading(false);
    }
  };

  const handleToggleIsPublic = async () => {
    let loaderId = "";

    toast.loading((t) => {
      loaderId = t.id;
      return "Updating list...";
    });

    if (!currentListItem) {
      toast.error("List not found");
      return;
    }
    try {
      const list = await axios.patch(
        `${import.meta.env.VITE_SERVER_API_URL}/lists/status/${listId}`,
        {},
        { withCredentials: true }
      );

      if (!list) {
        toast.error("Failed to update list");
        return;
      }

      toggleIsPublic(currentListItem);
    } catch (error) {
      handleAxiosError(error as AxiosError, navigate);
    } finally {
      toast.dismiss(loaderId);
    }
  };

  const handleCheckboxChange = (tag: checkedTagsType, checked: boolean) => {
    setCheckedTags((state) =>
      state.map((t) => {
        if (t.tagname === tag.tagname) {
          return { ...t, isChecked: checked };
        }
        return t;
      })
    );
  };

  const handleDeleteList = async (toastId: string) => {
    const loadingId = Date.now().toString();
    try {
      toast.dismiss(toastId);
      toast.loading("Deleting list...", {
        id: loadingId,
      });

      const deleteDBResponse: AxiosResponse = await axios.delete(
        `${import.meta.env.VITE_SERVER_API_URL}/lists/o/${listId}`,
        { withCredentials: true }
      );

      if (!deleteDBResponse) {
        toast.error("Failed to delete list");
        return;
      }

      if (listId !== undefined) {
        removeListItem(listId);
      } else {
        toast.error("List id not found");
        return;
      }

      setDocs([]);
      removeCachedDocList(listId);
      toast.success("List deleted successfully");
      setLoading(false);
    } catch (error) {
      handleAxiosError(error as AxiosError, navigate);
    } finally {
      navigate("/")
      setCurrentListItem(null)
      toast.dismiss(loadingId);
    }
  };

  {
    currentListItem?.isPublic;
  }

  const actionButtons = [
    {
      element: (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div
              className="h-12 w-12 bg-transparent hover:bg-transparent border-none flex justify-center items-center rounded-full text-xl"
              aria-label="Tag Options"
            >
              {currentListItem?.isPublic ? <FaLockOpen /> : <FaLock />}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className={`w-56 ${theme !== "light"
                ? "!bg-black !text-zinc-200 border-zinc-800"
                : ""
              } p-4 space-y-2`}
          >
            <span className="text-sm text-zinc-200">
              Are you sure to make your list{" "}
              {currentListItem?.isPublic ? "private" : "public"}?
            </span>
            <div className="flex gap-2 w-full justify-center items-center">
              <DropdownMenuItem
                onClick={() => {
                  handleToggleIsPublic();
                }}
                className="w-full bg-zinc-800 h-10 flex justify-center items-center"
              >
                <span>Yes</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="w-full bg-zinc-800 h-10 flex justify-center items-center">
                No
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      action: () => { },
      tooltip: "toggle card visibility",
    },
    {
      element: <AddCollaborator />,
      action: () => { },
      tooltip: "Add User",
    },
    {
      element: (
        <div className="flex justify-center items-center !text-xl">
          <FaPlus />
        </div>
      ),
      action: () => {
        setPrevPath(location.pathname);
        toggleModal(true);
        setModalContent(
          <CreateDocForm
            theme={theme}
            toggleModal={toggleModal}
            listTitle={listTitle}
          />
        );
      },
      tooltip: "Add New Doc",
    },
    {
      element: (
        <div className="flex justify-center items-center !text-xl">
          <BiSolidPencil />
        </div>
      ),
      action: handleEditList,
      tooltip: "Edit List",
    },
    {
      element: (
        <DropdownMenu
          open={dropdownOpen}
          onOpenChange={() => {
            setDropdownOpen(!dropdownOpen);
            setNewTagInput(false);
          }}
          modal={false} // Keeps dropdown within the context of the parent
        >
          <DropdownMenuTrigger asChild>
            <div
              className="h-12 w-12 bg-transparent hover:bg-transparent border-none flex justify-center items-center rounded-full text-xl"
              aria-label="Tag Options"
            >
              <FaTag />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className={`w-56 ${theme !== "light" ? "!bg-black !text-white border-zinc-800" : ""
              }`}
            onCloseAutoFocus={(event) => {
              event.preventDefault(); // Prevents auto focus when closing the dropdown
            }}
            onPointerDownOutside={(event) => {
              if (
                event.target instanceof HTMLElement &&
                !event.target.closest("input")
              ) {
                setDropdownOpen(false);
              }
            }}
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
                {newTagInput ? (
                  <form
                    className="flex justify-center items-center space-x-1"
                    onSubmit={HandleAddNewTag}
                    onKeyDown={(event) => event.stopPropagation()} // Stop event propagation when typing
                  >
                    <Input
                      id="title"
                      name="title"
                      type="text"
                      placeholder="Enter title"
                      className={`${theme !== "light" ? "bg-zinc-800" : "bg-zinc-200"
                        } border-none border-spacing-0`}
                      onFocus={(event) => event.stopPropagation()} // Ensure focus stays on the input
                    />
                    {newTagSubmitLoading ? (
                      <div className="flex justify-center items-center h-full w-12">
                        <Loader2 className="animate-spin" size={16} />
                      </div>
                    ) : (
                      <Button
                        type="submit"
                        className={`w-12 px-2 ${theme !== "light"
                            ? "text-zinc-200 bg-zinc-800 hover:bg-zinc-700"
                            : "bg-zinc-100 hover:bg-zinc-200 text-zinc-950"
                          }`}
                      >
                        <FaPlus />
                      </Button>
                    )}
                  </form>
                ) : (
                  <Button
                    onClick={() => setNewTagInput(true)}
                    className={`w-full px-2 ${theme !== "light"
                        ? "text-zinc-200 bg-zinc-950 hover:bg-zinc-800"
                        : "bg-zinc-100 hover:bg-zinc-200 text-zinc-950"
                      }`}
                  >
                    <span className="flex w-full justify-start items-center space-x-[0.65rem]">
                      <FaPlus />{" "}
                      <span className="font-semibold">Create a new tag</span>
                    </span>
                  </Button>
                )}
                <DropdownMenuSeparator
                  className={theme !== "light" ? "bg-zinc-800" : ""}
                />
                <DropdownMenuGroup>
                  {checkedTags.map((tag, index) => (
                    <DropdownMenuCheckboxItem
                      key={index}
                      checked={tag.isChecked}
                      onSelect={(e) => e.preventDefault()} // Prevent dropdown from closing
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(tag, checked)
                      }
                    >
                      {removeUsernameTag(tag.tagname)}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuGroup>
                <DropdownMenuSeparator
                  className={theme !== "light" ? "bg-zinc-800" : ""}
                />
                <Button
                  onClick={handleSaveChanges}
                  className={`mt-2 w-full ${theme !== "light"
                      ? "text-zinc-200 bg-zinc-800 hover:bg-zinc-700"
                      : "bg-zinc-100 hover:bg-zinc-200 text-zinc-950"
                    }`}
                  disabled={saveChangesLoading}
                >
                  {saveChangesLoading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      tooltip: "Edit tags",
    },
    {
      element: <RiDeleteBinFill />,
      action: () => {
        toast((t: Toast) => {
          return (
            <div>
              <h1>Are you sure you want to delete this list?</h1>
              <div className="flex justify-center mt-4">
                <Button
                  onClick={() => {
                    handleDeleteList(t.id);
                  }}
                  className="w-24 text-zinc-50 font-semibold bg-red-500 hover:bg-red-600"
                >
                  Yes
                </Button>
                <Button
                  onClick={() => {
                    toast.dismiss(t.id);
                  }}
                  className="ml-4 w-24 font-semibold bg-zinc-200 hover:bg-zinc-300"
                >
                  No
                </Button>
              </div>
            </div>
          );
        });
      },
      tooltip: "Delete Tag",
    },
  ];

  return (
    <div className="flex justify-center items-center">
      <div className="hidden md:flex justify-center items-center space-x-3 !relative">
        {actionButtons.map((actionButton, index) => (
          <button
            key={index}
            onClick={actionButton.action}
            className="h-12 w-12 bg-[#6d6d6d20] hover:bg-[#6d6d6d50] transition-colors flex justify-center items-center rounded-full text-xl"
          >
            {actionButton.element}
          </button>
          // <TooltipProvider key={index}>
          //   <Tooltip>
          //     <TooltipTrigger asChild>
          //       <button
          //         onClick={actionButton.action}
          //         className="h-12 w-12 bg-[#00000010] hover:bg-[#00000025] transition-colors flex justify-center items-center rounded-full text-xl"
          //         // variant="outline"
          //       >
          //         {actionButton.element}
          //       </button>
          //     </TooltipTrigger>
          //     <TooltipContent>
          //       <p>{actionButton.tooltip}</p>
          //     </TooltipContent>
          //   </Tooltip>
          // </TooltipProvider>
        ))}
      </div>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <button className="md:hidden h-12 w-12 bg-[#6d6d6d20] hover:bg-[#6d6d6d50] transition-colors flex justify-center items-center rounded-full text-xl">
              <PiDotsThreeOutlineFill />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {actionButtons?.map((actionButton, index) => (
              <DropdownMenuItem
                key={index}
                className="flex justify-start items-center space-x-2"
              >
                {/* <span className="!text-md">{actionButton.element}</span> */}
                <span>{actionButton.tooltip}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ListActionButtons;