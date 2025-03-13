import { BiSolidPencil } from "react-icons/bi";
import { RiDeleteBinFill } from "react-icons/ri";
import useMethodStore from "@/store/MethodStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PiDotsThreeOutlineFill } from "react-icons/pi";
import { useEffect, useState } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import toast from "react-hot-toast";
import { fetchedTagType } from "@/lib/types";
import useProfileStore from "@/store/profileStore";
import { useNavigate, useParams } from "react-router-dom";
import { EditListForm } from "./Forms";
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
import HandleTagForm from "./Forms/HandleTagForm";

type Checked = boolean;

export type checkedTagsType = fetchedTagType & {
  isChecked?: Checked;
};

const CollectionActionButtons = () => {
  const { setPrevPath } = useMethodStore();
  const { setTags } = useProfileStore();
  const { removeCollectionsItem, toggleIsPublic } = useCollectionsStore();
  const { setLinks, currentCollectionItem, setCurrentCollectionItem, removeCachedLinkCollection } = useLinkStore()
  const [loading, setLoading] = useState(false);
  const [checkedTags, setCheckedTags] = useState<checkedTagsType[]>([]);

  const navigate = useNavigate();
  const { collectionId } = useParams();

  useEffect(() => {
    (async () => {
      if (collectionId !== undefined) {
        try {
          setLoading(true);

          const [userTagResponse, listTagResponse] = await Promise.all([
            axios.get(`${import.meta.env.VITE_SERVER_API_URL}/tags/get/o`, {
              withCredentials: true,
            }),
            axios.get(
              `${import.meta.env.VITE_SERVER_API_URL}/tags/get/collections/${collectionId}`,
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
          if (error instanceof AxiosError) {
            toast.error(error.message)
          } else {
            console.error(error);
            toast.error("Error while fetching collections")
          }
        } finally {
          setLoading(false);
        }
      }
    })();
  }, [setTags, collectionId, navigate]);

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
        `${import.meta.env.VITE_SERVER_API_URL}/lists/status/${collectionId}`,
        {},
        { withCredentials: true }
      );

      if (!list) {
        toast.error("Failed to update list");
        return;
      }

      toggleIsPublic(currentCollectionItem);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.message)
      } else {
        console.error(error);
        toast.error("Error while toggle is public")
      }
    } finally {
      toast.dismiss(loaderId);
    }
  };

  const handleDeleteCollection = async () => {
    const loadingId = Date.now().toString();
    try {
      toast.loading("Deleting list...", {
        id: loadingId,
      });

      const deleteDBResponse: AxiosResponse = await axios.delete(
        `${import.meta.env.VITE_SERVER_API_URL}/collections/o/${collectionId}`,
        { withCredentials: true }
      );

      if (!deleteDBResponse) {
        toast.error("Failed to delete list");
        return;
      }

      if (collectionId !== undefined) {
        removeCollectionsItem(collectionId);
      } else {
        toast.error("List id not found");
        return;
      }

      setLinks([]);
      removeCachedLinkCollection(collectionId);
      toast.success("List deleted successfully");
      setLoading(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.message)
      } else {
        console.error(error);
        toast.error("Error while deleting collection")
      }
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
          className="px-4 mx-auto"
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
      element: <HandleTagForm
        loading={loading}
        checkedTags={checkedTags}
        setCheckedTags={setCheckedTags}
      />,
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