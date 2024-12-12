import { LinkCard, ListActionButtons, Tag } from "@/components";
import useMethodStore from "@/store/MethodStore";
import useProfileStore from "@/store/profileStore";
import axios, { AxiosError, AxiosResponse } from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { BiSolidPencil } from "react-icons/bi";
import { handleAxiosError } from "@/utils/handlerAxiosError";
import convertMongoDBDate from "@/utils/convertMongoDBDate";
import { Button } from "./ui/button";
import { CreateDocForm, CreateListForm } from "./Forms";
import { removeUsernameTag } from "@/utils/toggleUsernameInTag";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { backgroundImageUrls } from "@/lib/constants";
import { BsXLg } from "react-icons/bs";
import useLinkStore from "@/store/linkStore";
import useCollectionsStore from "@/store/collectionStore";

const Docs = () => {
  const { toggleModal } = useMethodStore();
  const [loading, setLoading] = useState(false);
  const location = useLocation().pathname;

  const { links, cachedLinks, setLinks, addCachedLinkCollection, setCurrentCollectionItem, currentCollectionItem } = useLinkStore()
  const { collections } = useCollectionsStore()
  const { profile } = useProfileStore();
  const { theme, font } = profile;
  const { currentCardColor, setPrevPath, setModalContent } = useMethodStore();
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  // const [uploadImage, setUploadImage] = useState(false);
  const [saveChangesLoading, setSaveChangesLoading] = useState(false);

  // TODO: create a dropdown along with images and custom image function
  const handleSaveChanges = (
    e: Event
  ) => {
    let toastId = "";
    try {
      setSaveChangesLoading(true)
      toastId = toast.loading("Changing the list banner...");
      console.log(e);
    } catch (error) {
      handleAxiosError(error as AxiosError, navigate);
    } finally {
      toast.dismiss(toastId);
    }
  };

  useEffect(() => {
    (async () => {
      // if (location.pathname.includes("/lists") && prevPath !== location.pathname) {
      if (location.includes("/lists")) {
        try {
          setLoading(true);
          const collectionId = location.split("/")[2];

          const cache = cachedLinks.filter((list) => list.collectionId === collectionId)[0];

          if (cache) {
            setLinks(cache.links);
          } else {
            const response: AxiosResponse = await axios.get(
              `${import.meta.env.VITE_SERVER_API_URL}/cards/${collectionId}`,
              { withCredentials: true }
            );

            if (!response.data.data) {
              toast.error("Failed to fetch list details");
              return;
            }
            setLinks(response.data.data);
            addCachedLinkCollection({ collectionId, links: response.data.data });
          }

          const currentListRes = await collections.filter(
            (collection) => collection._id === collectionId
          )[0];
          setCurrentCollectionItem(currentListRes);
        } catch (error) {
          handleAxiosError(error as AxiosError, navigate);
        } finally {
          setLoading(false);
        }
      }
    })();
  }, [collections, currentCardColor, location, setLinks, setCurrentCollectionItem]);

  const tags: string[] = [];

  currentCollectionItem?.tags?.forEach((tag) => {
    const tagname = removeUsernameTag(tag.tagname);
    if (tagname != undefined) {
      tags.push(tagname);
    }
  });

  if (loading) {
    return (
      <div className="md:h-[calc(100vh-5rem)] h-[calc(100vh-8rem)] lg:h-[calc(100vh-4.5rem)] overflow-y-scroll w-full space-y-2 no-scrollbar">
        <div className="dark:text-white h-full flex justify-center items-center">
          <Loader2 className="animate-spin" />
        </div>
      </div>
    );
  }

  const coverImageStyle = {
    backgroundImage: `url('${currentCollectionItem?.coverImage}')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  if (!currentCollectionItem?._id) {
    return (
      <div>
        <div className="md:h-[calc(100vh-5rem)] h-[calc(100vh-8rem)] lg:h-[calc(100vh-4.5rem)] overflow-y-scroll w-full flex flex-col justify-center items-center space-y-6 p-4">
          <h1 className="text-3xl font-bold text-center dark:text-white">
            Welcome to Your Document Space
          </h1>
          <p className="text-lg text-center max-w-2xl dark:text-gray-300">
            It looks like you haven't selected a list yet. To get started,
            create a new list or select an existing one from the sidebar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={() => navigate("/lists")}
              className={`${theme !== "light"
                ? "bg-zinc-900 hover:bg-zinc-800 text-zinc-200"
                : "bg-zinc-300 hover:bg-zinc-400 px-6 py-2"
                } `}
            >
              View Your Lists
            </Button>
            <Button
              onClick={() => {
                setPrevPath(location);
                toggleModal(true);
                setModalContent(
                  <CreateListForm toggleModal={toggleModal} theme={theme} />
                );
              }}
              className={`${theme !== "light"
                ? "bg-zinc-900 hover:bg-zinc-800 text-zinc-200"
                : "bg-zinc-300 hover:bg-zinc-400 px-6 py-2"
                } `}
            >
              Create New List
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (links.length == 0) {
    return (
      <div
        className={`md:h-[calc(100vh-5rem)] select-none h-[calc(100vh-8rem)] overflow-y-hidden lg:h-[calc(100vh-4.5rem)]  w-full space-y-2 no-scrollbar ${font}`}
      >
        <div className="lg:h-2"></div>
        <div className="h-96 w-full py-2">
          <div
            className="group h-3/6 w-full relative overflow-hidden rounded-t-md"
            style={coverImageStyle}
          >
            <div className="h-full w-full bg-black bg-opacity-40 text-zinc-200 p-4">
              <div className="flex justify-end items-center">{/*  */}</div>
            </div>
          </div>
          <div className="w-full h-3/6 rounded-b-md dark:text-zinc-300 p-4 dark:bg-neutral-800">
            <div className="h-20 flex flex-col justify-start">
              <div className="flex justify-between items-center w-full">
                <h1 className="text-2xl font-semibold">
                  {currentCollectionItem?.title}
                </h1>
                <ListActionButtons listTitle={currentCollectionItem?.title} />
              </div>
              <div className="text-xs space-x-2">
                <span>@{currentCollectionItem?.createdBy?.username}</span>
                <span>
                  {currentCollectionItem?.createdAt &&
                    convertMongoDBDate(currentCollectionItem?.createdAt)}
                </span>
              </div>
            </div>
            <div className="pt-4">
              <p>{currentCollectionItem?.description}</p>
            </div>
          </div>
        </div>
        <div className="flex justify-center flex-col gap-4 items-center w-full h-2/6">
          <span
            className={`${theme !== "light" ? "text-zinc-200" : "text-zinc-800"
              } `}
          >
            You don't have any documents on this list.
          </span>
          <Button
            onClick={() => {
              setPrevPath(location);
              toggleModal(true);
              setModalContent(
                <CreateDocForm
                  theme={theme}
                  toggleModal={toggleModal}
                  listTitle={currentCollectionItem?.title}
                />
              );
            }}
            className={`${theme !== "light"
              ? "bg-zinc-900 hover:bg-zinc-800 text-zinc-200"
              : "bg-zinc-300 hover:bg-zinc-400"
              } px-6 py-2`}
          >
            Add a Link
          </Button>
        </div>
        <div className="lg:h-2 h-16"></div>
      </div>
    );
  }

  return (
    <div className="md:h-[calc(100vh-5rem)] lg:px-0 px-4 h-[calc(100vh-8rem)] lg:h-[calc(100vh-4.5rem)] overflow-y-scroll w-full space-y-2 no-scrollbar">
      <div className="lg:h-2"></div>
      <div className="h-96 w-full py-2">
        <div
          className="group h-3/6 w-full relative overflow-hidden rounded-t-md"
          style={coverImageStyle}
        >
          <div className="h-full w-full bg-black bg-opacity-40 text-zinc-200 p-4">
            <div className="flex justify-end items-center">
              <DropdownMenu
                open={dropdownOpen}
                onOpenChange={() => {
                  setDropdownOpen(!dropdownOpen);
                }}
                modal={false} // Keeps dropdown within the context of the parent
              >
                <DropdownMenuTrigger disabled={saveChangesLoading} className={`h-12 w-12 ${dropdownOpen ? "opacity-100" : "opacity-0 group-hover:opacity"}-100 bg-[#00000030] hover:bg-[#00000060] transition-all flex justify-center items-center rounded-full text-xl`}>
                  {dropdownOpen ? <BsXLg /> : (saveChangesLoading ? <Loader2 className="animate-spin" /> : <BiSolidPencil />)}
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className={`w-96 p-2 ${theme !== "light"
                    ? "!bg-black !text-white border-zinc-800"
                    : ""
                    }`}
                  onCloseAutoFocus={(event) => {
                    event.preventDefault()
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
                  {loading ? (
                    <div className="w-full h-28 flex justify-center items-center">
                      <Loader2 className="animate-spin" size={16} />
                    </div>
                  ) : (
                    <DropdownMenuRadioGroup className="grid grid-cols-3 gap-1">
                      {backgroundImageUrls.map((link, index) => (
                        <DropdownMenuRadioItem
                          isShowCheckbox={false}
                          isFullControl
                          value={link}
                          key={index}
                          onSelect={handleSaveChanges}
                          className="flex justify-center items-center data-[checked]:border-4 border-zinc-200 w-full h-24 cursor-default transition-colors duration-200 hover:brightness-110"
                        >
                          <img
                            className="w-full h-24 object-cover" // Fit the image inside the container
                            src={link}
                            alt={`Background ${index}`}
                          />
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        <div className="w-full h-3/6 rounded-b-md dark:text-zinc-300 p-4 dark:bg-neutral-800">
          <div className="h-20 flex flex-col justify-start">
            <div className="flex justify-between items-center w-full">
              <h1 className="text-2xl font-semibold">
                {currentCollectionItem?.title}
              </h1>
              <ListActionButtons listTitle={currentCollectionItem?.title} />
            </div>
            <div className="text-xs space-x-2">
              <span>@{currentCollectionItem?.createdBy?.username}</span>
              <span>
                {currentCollectionItem?.createdAt &&
                  convertMongoDBDate(currentCollectionItem?.createdAt)}
              </span>
            </div>
          </div>
          <div className="pt-4 space-y-4">
            <p>{currentCollectionItem?.description}</p>
            <div className="flex space-x-1">
              {tags.length > 0 &&
                tags.map((tag, index) => (
                  <Tag
                    isBlackEnable={theme === "black"}
                    key={index}
                    text={tag}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
      <div
        className={`grid grid-cols-1 gap-2 ${location.includes("/doc") ? "" : "lg:grid-cols-2"
          }`}
      >
        {links?.map((link) => (
          <LinkCard
            key={link._id}
            id={link._id}
            title={link.title}
            color={theme == "black" ? "bg-black" : currentCardColor}
            link={link.link}
            isChecked={link.isChecked}
            currentListId={currentCollectionItem?._id}
            toggleModal={toggleModal}
          />
        ))}
      </div>
      <div className="lg:h-2 h-16"></div>
    </div>
  );
};

export default Docs;