import { colorOptions } from "@/lib/types.tsx";
import { useNavigate } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";
import useMethodStore from "@/store/MethodStore";
import { useMediaQuery } from "react-responsive";
// import { Checkbox } from "./ui/checkbox";
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
import { handleAxiosError } from "@/utils/handlerAxiosError";
import axios, { AxiosError } from "axios";
import useCollectionsStore from "@/store/collectionStore";
import useLinkStore from "@/store/linkStore";
import TaskBox from "./ui/TaskBox";

type LinkCardProps = {
  id: string;
  title: string;
  color: colorOptions;
  link: string;
  isChecked: boolean;
  currentCollectionId: string | undefined;
  toggleModal: (isOpen: boolean) => void;
};

const LinkCard = ({
  id,
  title,
  color,
  link,
  currentCollectionId,
  isChecked,
  toggleModal,
}: LinkCardProps) => {
  const navigate = useNavigate();
  const { setModalContent, setPrevPath } = useMethodStore();
  const { addCachedLinkItem, toggleIsChecked } = useLinkStore()
  const { collections, removeInboxLinkItem } = useCollectionsStore();
  const isSmallScreen = useMediaQuery({ query: "(max-width: 1024px)" });

  const handleNavigate = (collectionId?: string) => {
    if (location.pathname.includes("/links")) {
      navigate(`/collections/${collectionId || currentCollectionId}/links/${id}`);
    } else {
      navigate(`links/${id}`);
    }
  };

  const openModal = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    toggleModal(true);
    e.stopPropagation();
    setPrevPath(location.pathname);
    handleNavigate(currentCollectionId);
    setModalContent(<div className="text-5xl text-white">Hello</div>);
  };

  const openLink = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    e.stopPropagation(); // Prevent the modal from opening
    window.open(link, "_blank");
  };

  const cardClass = `${color} !text-zinc-300 border-zinc-800 !bg-zinc-900 border-[1px] select-none group hover:!bg-zinc-800/80 relative px-5 h-14 flex-col transition-all duration-300 rounded-md flex justify-center items-center`;

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
      handleAxiosError(error as AxiosError, navigate);
    } finally {
      toast.dismiss(loaderId);
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className={cardClass}>
          <h2
            onClick={(e) => {
              e.stopPropagation();
              if (isSmallScreen) {
                openModal(e);
              } else {
                handleNavigate();
              }
            }}
            className={`font-semibold decoration-2 cursor-pointer text-lg flex justify-start items-center w-full space-x-6 ${""}`}
          >
            <TaskBox id={id} defineMaxWidth={location.pathname.includes("/links") ? "max-w-[39rem]" : "max-w-[31rem]"} title={title} key={id} defaultChecked={isChecked} onToggle={() => {
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
              className={`md:opacity-0 absolute right-6 opacity-100 ${color === "bg-black"
                ? "hover:bg-[#b2b2b220]"
                : "hover:bg-[#00000020]"
                } active:scale-95 rounded-full p-2 group-hover:opacity-100 transition-all ease-in-out duration-300`}
            >
              <FiArrowUpRight />
            </span>
          </h2>
        </div>
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
