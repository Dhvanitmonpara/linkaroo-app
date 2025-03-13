import { colorOptions } from "@/lib/types.tsx";
import { FiArrowUpRight } from "react-icons/fi";
import { BiListPlus } from "react-icons/bi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import toast from "react-hot-toast";
import axios, { AxiosError } from "axios";
import useCollectionsStore from "@/store/collectionStore";
import useLinkStore from "@/store/linkStore";
import CustomCheckbox from "./ui/CustomCheckbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";

type LinkCardProps = {
  id: string;
  title: string;
  color: colorOptions;
  link: string;
  isChecked: boolean;
  currentCollectionId: string | undefined;
};

const LinkCard = ({
  id,
  title,
  color,
  link,
  currentCollectionId,
  isChecked,
}: LinkCardProps) => {
  const { addCachedLinkItem, toggleIsChecked } = useLinkStore()
  const { collections, removeInboxLinkItem } = useCollectionsStore();

  const openLink = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    e.stopPropagation(); // Prevent the modal from opening
    window.open(link, "_blank");
  };

  const cardClass = `${color} block w-full !text-zinc-300 border-zinc-800 !bg-zinc-900 border-[1px] select-none group hover:!bg-zinc-800/80 relative px-5 h-14 flex-col transition-all duration-300 rounded-md flex justify-center items-center`;

  const addToListHandler = async (collectionId: string) => {
    let loaderId = "";
    try {
      loaderId = toast.loading("Adding to list...");
      const existingList = collections.find((collection) => collection._id === collectionId);
      if (!existingList) {
        toast.error("List not found");
        return;
      }

      const response = await axios.patch(
        `${import.meta.env.VITE_SERVER_API_URL}/cards/move-card`,
        {
          cardId: id,
          collectionId: existingList._id,
        },
        { withCredentials: true }
      );

      if (response.status !== 200) {
        toast.error("Failed to move to list");
        return;
      }

      toast.success(`${title} moved to ${existingList.title} successfully`);
      removeInboxLinkItem(id);
      addCachedLinkItem(collectionId, response.data.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.message)
      } else {
        console.error(error);
        toast.error("Error while executing request");
      }
    } finally {
      toast.dismiss(loaderId);
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <Dialog>
          <DialogTrigger className={cardClass}>
            <h2
              className={`font-semibold decoration-2 cursor-pointer text-lg flex justify-start items-center w-full space-x-6 ${""}`}
            >
              <CustomCheckbox color={color} id={id} title={title} defaultChecked={isChecked} onToggle={() => {
                toggleIsChecked(id, isChecked)
              }} />
              {location.pathname === "/inbox" && (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    onClick={(e) => e.stopPropagation()}
                    className={`md:opacity-0 absolute text-xl right-16 opacity-100 ${color === "bg-black"
                      ? "hover:bg-[#b2b2b220]"
                      : "hover:bg-[#00000020]"
                      } active:scale-95 rounded-full p-2 group-hover:opacity-100 transition-all ease-in-out duration-300`}
                  >
                    <BiListPlus />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className={
                      color === "bg-black"
                        ? "!bg-black !text-white border-zinc-800"
                        : ""
                    }
                  >
                    {collections.length > 0 ? (
                      collections.map((collection) => (
                        <DropdownMenuItem
                          key={collection._id}
                          onClick={(e) => {
                            e.stopPropagation();
                            addToListHandler(collection._id);
                          }}
                        >
                          {collection.title}
                        </DropdownMenuItem>
                      ))
                    ) : (
                      <div className="h-14 flex justify-center items-center">
                        No collections
                      </div>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              <span
                onClick={openLink}
                className={`md:opacity-0 absolute right-6 opacity-100 hover:bg-[#b2b2b220] active:scale-95 rounded-full p-2 group-hover:opacity-100 transition-all ease-in-out duration-300`}
              >
                <FiArrowUpRight />
              </span>
            </h2>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{link}</DialogDescription>
            </DialogHeader>
            <p>Hello</p>
          </DialogContent>
        </Dialog>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Edit</ContextMenuItem>
        <ContextMenuItem>Open link</ContextMenuItem>
        <ContextMenuItem>Mark as completed</ContextMenuItem>
        <ContextMenuItem>Move to</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default LinkCard;
