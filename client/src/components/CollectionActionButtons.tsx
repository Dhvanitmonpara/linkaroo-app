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
import { PiDotsThreeOutlineFill } from "react-icons/pi";
import { Button } from "@/components/ui/button";
import { FormEventHandler, useEffect, useState } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { fetchedTagType } from "@/lib/types";
import useProfileStore from "@/store/profileStore";
import { removeUsernameTag } from "@/utils/toggleUsernameInTag";
import { useNavigate, useParams } from "react-router-dom";
import { EditListForm } from "./Forms";
import { Input } from "./ui/input";
import { handleAxiosError } from "@/utils/handlerAxiosError";
import { FaLock } from "react-icons/fa";
import { FaLockOpen } from "react-icons/fa";
import useLinkStore from "@/store/linkStore";
import useCollectionsStore from "@/store/collectionStore";
import TooltipContainer from "./general/Tooltip";
import ResponsiveDialog from "./ResponsiveDialog";
import DrawerMenu from "./DrawerMenu";
import { DrawerClose } from "./ui/drawer";
import AddCollaboratorForm from "./Forms/AddCollaboratorForm";
import { IoMdPersonAdd } from "react-icons/io";
import { cn } from "@/lib/utils";

type Checked = boolean;

type checkedTagsType = fetchedTagType & {
  isChecked?: Checked;
};

const CollectionActionButtons = () => {
  const { setPrevPath } = useMethodStore();
  const { setTags } = useProfileStore();
  const { removeCollectionsItem, updateCollectionsTags, toggleIsPublic } = useCollectionsStore();
  const { setLinks, currentCollectionItem, setCurrentCollectionItem, removeCachedLinkCollection } = useLinkStore()
  const [loading, setLoading] = useState(false);
  const [saveChangesLoading, setSaveChangesLoading] = useState(false);
  const [checkedTags, setCheckedTags] = useState<checkedTagsType[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [newTagInput, setNewTagInput] = useState(false);
  const [newTagSubmitLoading, setNewTagSubmitLoading] = useState(false);

  const navigate = useNavigate();
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
              `${import.meta.env.VITE_SERVER_API_URL}/tags/get/collections/${listId}`,
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
  }, [setTags, listId, navigate]);

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

      updateCollectionsTags(updatedList);

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

    if (!currentCollectionItem) {
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

      toggleIsPublic(currentCollectionItem);
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

  const handleDeleteCollection = async () => {
    const loadingId = Date.now().toString();
    try {
      toast.loading("Deleting list...", {
        id: loadingId,
      });

      const deleteDBResponse: AxiosResponse = await axios.delete(
        `${import.meta.env.VITE_SERVER_API_URL}/collections/o/${listId}`,
        { withCredentials: true }
      );

      if (!deleteDBResponse) {
        toast.error("Failed to delete list");
        return;
      }

      if (listId !== undefined) {
        removeCollectionsItem(listId);
      } else {
        toast.error("List id not found");
        return;
      }

      setLinks([]);
      removeCachedLinkCollection(listId);
      toast.success("List deleted successfully");
      setLoading(false);
    } catch (error) {
      handleAxiosError(error as AxiosError, navigate);
    } finally {
      navigate("/")
      setCurrentCollectionItem(null)
      toast.dismiss(loadingId);
    }
  };

  {
    currentCollectionItem?.isPublic;
  }

  const actionButtons = [
    {
      element: (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger className="hidden md:flex" asChild>
              <div
                className="h-12 w-12 bg-transparent hover:bg-transparent border-none flex justify-center items-center rounded-full text-xl"
                aria-label="Tag Options"
              >
                {currentCollectionItem?.isPublic ? <FaLockOpen /> : <FaLock />}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className={`w-56 !bg-black !text-zinc-200 border-zinc-800 p-4 space-y-2`}
            >
              <span className="text-sm text-zinc-200">
                Are you sure to make your Collection{" "}
                {currentCollectionItem?.isPublic ? "private" : "public"}?
              </span>
              <div className="flex gap-2 w-full justify-center items-center">
                <DropdownMenuItem
                  onClick={() => {
                    handleToggleIsPublic();
                  }}
                  className="w-full cursor-pointer bg-red-500 hover:!bg-red-500/70 h-10 hover:!text-zinc-50 flex justify-center items-center"
                >
                  <span>Yes</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="w-full cursor-pointer bg-zinc-800 hover:!bg-zinc-800/70 hover:!text-zinc-50 h-10 flex justify-center items-center">
                  No
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <DrawerMenu triggerClassNames="md:hidden w-full" trigger={<div
            className="space-x-2 md:space-x-0 w-full bg-transparent hover:bg-transparent border-none flex items-center rounded-full text-xl"
            aria-label="Tag Options"
          >
            <span className="h-12 w-12 flex justify-center items-center">
              {currentCollectionItem?.isPublic ? <FaLockOpen /> : <FaLock />}
            </span>
            <span className="text-lg">Make this collection {currentCollectionItem?.isPublic ? "private" : "public"}</span>
          </div>}>
            <div className="px-4 flex flex-col gap-2">
              <button className="w-full block font-semibold py-2 px-4 rounded-md bg-red-500 hover:bg-red-600">Make it {currentCollectionItem?.isPublic ? "private" : "public"}</button>
              <DrawerClose asChild>
                <button className="w-full block font-semibold py-2 px-4 rounded-md bg-zinc-300 hover:bg-zinc-400 dark:bg-zinc-800 dark:hover:bg-zinc-700">Cancel</button>
              </DrawerClose>
            </div>
          </DrawerMenu>
        </>
      ),
      action: () => { },
      tooltip: `Make this collection ${currentCollectionItem?.isPublic ? "private" : "public"}`,
    },
    {
      element: <AddCollaborator />,
      action: () => { },
      tooltip: "Add Collaborators",
    },
    {
      element: (
        <ResponsiveDialog
          title="Edit collection"
          className="px-4 md:px-0"
          trigger={
            <div className="flex space-x-2 items-center w-full md:w-fit">
              <span className="flex justify-center items-center w-12 h-12 !text-xl">
                <BiSolidPencil />
              </span>
              <span className="md:hidden">Edit Collection</span>
            </div>
          }
          description="Edit your collection details"
          cancelText="Cancel"
        >
          <EditListForm />
        </ResponsiveDialog>
      ),
      action: () => {
        setPrevPath(location.pathname);
      },
      tooltip: "Edit Collection",
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
            className={`w-56 !bg-black !text-white border-zinc-800`}
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
              className="bg-zinc-800"
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
                      className={`bg-zinc-800 border-none border-spacing-0`}
                      onFocus={(event) => event.stopPropagation()} // Ensure focus stays on the input
                    />
                    {newTagSubmitLoading ? (
                      <div className="flex justify-center items-center h-full w-12">
                        <Loader2 className="animate-spin" size={16} />
                      </div>
                    ) : (
                      <Button
                        type="submit"
                        className={`w-12 px-2 dark:text-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 bg-zinc-100 hover:bg-zinc-200 text-zinc-950`}
                      >
                        <FaPlus />
                      </Button>
                    )}
                  </form>
                ) : (
                  <Button
                    onClick={() => setNewTagInput(true)}
                    className={`w-full px-2 dark:text-zinc-200 dark:bg-zinc-950 dark:hover:bg-zinc-800 bg-zinc-100 hover:bg-zinc-200 text-zinc-950`}
                  >
                    <span className="flex w-full justify-start items-center space-x-[0.65rem]">
                      <FaPlus />{" "}
                      <span className="font-semibold">Create a new tag</span>
                    </span>
                  </Button>
                )}
                <DropdownMenuSeparator
                  className={"bg-zinc-800"}
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
                  className={"bg-zinc-800"}
                />
                <Button
                  onClick={handleSaveChanges}
                  className={`mt-2 w-full dark:text-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 bg-zinc-100 hover:bg-zinc-200 text-zinc-950`}
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
      element: <>
        <DropdownMenu>
          <DropdownMenuTrigger className="hidden md:flex" asChild>
            <div
              className="h-12 w-12 bg-transparent hover:bg-transparent border-none flex justify-center items-center rounded-full text-xl"
              aria-label="Tag Options"
            >
              <RiDeleteBinFill />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className={`w-56 !bg-black !text-zinc-200 border-zinc-800 p-4 space-y-2`}
          >
            <span className="text-sm text-zinc-200">
              Are you sure you want to delete this Collection?
            </span>
            <div className="flex gap-2 w-full justify-center items-center">
              <DropdownMenuItem
                onClick={() => {
                  handleToggleIsPublic();
                }}
                className="w-full cursor-pointer bg-red-500 hover:!bg-red-500/70 h-10 hover:!text-zinc-50 flex justify-center items-center"
              >
                <span onClick={handleDeleteCollection}>Yes</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="w-full cursor-pointer bg-zinc-800 hover:!bg-zinc-800/70 hover:!text-zinc-50 h-10 flex justify-center items-center">
                No
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        <DrawerMenu triggerClassNames="md:hidden w-full" trigger={<div
          className="space-x-2 md:space-x-0 w-full bg-transparent hover:bg-transparent border-none flex items-center rounded-full text-xl"
          aria-label="Tag Options"
        >
          <span className="h-12 w-12 flex justify-center items-center">
            <RiDeleteBinFill />
          </span>
          <span className="text-lg">Delete collection</span>
        </div>}>
          <div className="px-4 flex flex-col gap-2">
            <button className="w-full block font-semibold py-2 px-4 rounded-md bg-red-500 hover:bg-red-600">Delete</button>
            <DrawerClose asChild>
              <button className="w-full block font-semibold py-2 px-4 rounded-md bg-zinc-300 hover:bg-zinc-400 dark:bg-zinc-800 dark:hover:bg-zinc-700">Cancel</button>
            </DrawerClose>
          </div>
        </DrawerMenu>
      </>,
      action: () => { },
      tooltip: "Delete Collection",
    },
  ];

  return (
    <div className="flex justify-center items-center">
      <div className="hidden md:flex justify-center items-center space-x-3 !relative">
        {actionButtons.map((actionButton, index) => (
          <TooltipContainer tooltip={actionButton.tooltip} key={index}>
            <button
              onClick={actionButton.action}
              className="h-12 w-12 bg-[#6d6d6d20] hover:bg-[#6d6d6d50] transition-colors flex justify-center items-center rounded-full text-xl"
            >
              {actionButton.element}
            </button>
          </TooltipContainer>
        ))}
      </div>
      <div>
        <DrawerMenu contentClassName="px-4 !pt-0" title="Collection options" trigger={<button className="md:hidden h-12 w-12 bg-[#6d6d6d20] hover:bg-[#6d6d6d50] transition-colors flex justify-center items-center rounded-full text-xl">
          <PiDotsThreeOutlineFill />
        </button>}>
          <div className="flex flex-col font-helvetica space-y-1 rounded-2xl overflow-hidden">
            {actionButtons?.map((actionButton, index) => (
              <button
                onSelect={e => {
                  e.preventDefault();
                  actionButton.action ? actionButton.action() : null
                }}
                key={index}
                className="flex flex-col p-2 dark:bg-zinc-800 dark:hover:bg-zinc-700/70 bg-zinc-100 hover:bg-zinc-200 w-full"
              >
                {actionButton.element}
              </button>
            ))}
          </div>
        </DrawerMenu>
      </div>
    </div>
  );
};

export default CollectionActionButtons;

// Add Collaborator
const AddCollaborator: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const [confirmRequest, setConfirmRequest] = useState(false);

  const { profile } = useProfileStore();
  const theme = profile.theme;

  return (
    <>
      <DropdownMenu
        open={open}
        onOpenChange={() => {
          setOpen(!open);
          setConfirmRequest(false);
          setValue("");
        }}
        modal={false}
      >
        <DropdownMenuTrigger className="hidden md:flex" asChild>
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
          <AddCollaboratorForm
            confirmRequest={confirmRequest}
            setConfirmRequest={setConfirmRequest}
            value={value}
            setOpen={setOpen}
            setValue={setValue}
          />
        </DropdownMenuContent>
      </DropdownMenu>
      <DrawerMenu triggerClassNames="md:hidden" trigger={<div
        className="space-x-2 w-full md:space-x-0 bg-transparent hover:bg-transparent border-none flex items-center rounded-full text-xl"
        aria-label="Tag Options"
      >
        <span className="flex md:hidden justify-center items-center h-12 w-12">
          <IoMdPersonAdd />
        </span>
        <span className="text-lg">Add Collaborators</span>
      </div>}>
        <div className="px-4 flex flex-col gap-2">
          <AddCollaboratorForm
            confirmRequest={confirmRequest}
            setConfirmRequest={setConfirmRequest}
            value={value}
            setOpen={setOpen}
            setValue={setValue}
          />
        </div>
      </DrawerMenu>
    </>
  );
};