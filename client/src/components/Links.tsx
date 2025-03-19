import { LinkCard, CollectionActionButtons, Tag, ResponsiveDialog } from "@/components";
import useMethodStore from "@/store/MethodStore";
import useProfileStore from "@/store/profileStore";
import axios, { AxiosError, AxiosResponse } from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { BiSolidPencil } from "react-icons/bi";
import convertMongoDBDate from "@/utils/convertMongoDBDate";
import { Button } from "./ui/button";
import { CreateLinkBar, CreateLinkForm } from "./Forms";
import { removeUsernameTag } from "@/utils/toggleUsernameInTag";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { backgroundImageUrls } from "@/lib/constants/constants";
import { BsXLg } from "react-icons/bs";
import useLinkStore from "@/store/linkStore";
import useCollectionsStore from "@/store/collectionStore";
import IconPicker from "./general/IconPicker";
import { FaPlus } from "react-icons/fa";
import { cn } from "@/lib/utils";
import formatLinks from "@/utils/formatLinks";
import DashboardWelcomeScreen from "./DashboardWelcomeScreen";

const Links = () => {
  const [loading, setLoading] = useState(false);
  const [isLinkFormOpen, setIsLinkFormOpen] = useState(false);
  const location = useLocation().pathname;

  const { links, cachedLinks, setLinks, addCachedLinkCollection, setCurrentCollectionItem, currentCollectionItem } = useLinkStore()
  const { collections } = useCollectionsStore()
  const { profile } = useProfileStore();
  const { currentCardColor, setPrevPath } = useMethodStore();

  const { font } = profile;
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
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
      if (error instanceof AxiosError) {
        toast.error(error.message)
      } else {
        console.error(error);
        toast.error("Error while saving changes");
      }
    } finally {
      toast.dismiss(toastId);
    }
  };

  useEffect(() => {
    (async () => {
      if (location.includes("/c")) {
        try {
          setLoading(true);
          const collectionId = location.split("/")[3];

          const cache = cachedLinks.filter((collection) => collection.collectionId === collectionId)[0];

          const currentListRes = collections.find(
            (collection) => collection._id === collectionId
          )
          if (!currentListRes) {
            navigate("/dashboard")
            return
          }
          setCurrentCollectionItem(currentListRes);

          if (cache) {
            setLinks(cache.links);
          } else {
            const response: AxiosResponse = await axios.get(
              `${import.meta.env.VITE_SERVER_API_URL}/links/${collectionId}`,
              { withCredentials: true }
            );

            if (!response.data.data) {
              toast.error("Failed to fetch collection details");
              return;
            }

            const formattedLinks = formatLinks(response.data.data)
            setLinks(formattedLinks);
            addCachedLinkCollection({ collectionId, links: formattedLinks });
          }
        } catch (error) {
          if (error instanceof AxiosError) {
            if (error.response?.status === 404) {
              return
            }
            toast.error(error.message)
          } else {
            console.error(error);
            toast.error("Error while fetching collection details");
          }
        } finally {
          setLoading(false);
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCardColor, location, setLinks, setCurrentCollectionItem, addCachedLinkCollection, navigate]);

  const tags: string[] = [];

  currentCollectionItem?.tags?.forEach((tag) => {
    const tagname = removeUsernameTag(tag.tagname);
    if (tagname != undefined) {
      tags.push(tagname);
    }
  });

  const getItemType = (type: string, currentCollectionItem?: { type?: string }) =>
    ["movies", "books", "tv-shows", "banners"].includes(currentCollectionItem?.type || type)
      ? "banners"
      : ["music", "playlists", "video-games", "food", "sports", "bookmarks", "cards"].includes(type)
        ? "cards"
        : "todos";

  const itemType = currentCollectionItem ? getItemType(currentCollectionItem?.type) : "todos";

  const handleChangeIcon = (icon: string) => {
    if (!currentCollectionItem) return
    const collection = currentCollectionItem
    collection.icon = icon
    setCurrentCollectionItem(collection)
  }

  if (loading) {
    return (
      <div
        className={`xl:px-0 lg:px-0 lg:pr-5 px-5 h-full select-none lg:col-span-3 xl:col-span-5 pr-5`}
      >
        <div className="md:h-[calc(100vh-5rem)] h-[calc(100vh-8rem)] lg:h-[calc(100vh-4.5rem)] overflow-y-scroll w-full space-y-2 no-scrollbar">
          <div className="dark:text-white h-full flex justify-center items-center">
            <Loader2 className="animate-spin" />
          </div>
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
    if (collections.length > 0) {
      navigate(`/dashboard/c/${collections[0]._id}`, { replace: true })
      return null
    } else {
      return <DashboardWelcomeScreen />
    }
  }

  return (
    <div
      className={`lg:pl-0 px-5 h-full select-none lg:col-span-3 xl:col-span-5 pr-5`}
    >
      <div className={`md:h-[calc(100vh-5rem)] lg:px-0 px-4 h-[calc(100vh-8rem)] lg:h-[calc(100vh-4.5rem)] overflow-y-scroll w-full space-y-2 no-scrollbar ${font}`}>
        <div className="lg:h-2"></div>
        <div className="h-110 w-full py-2">
          <div
            className="group h-2/6 w-full relative overflow-hidden rounded-t-md"
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
                  <DropdownMenuTrigger disabled={saveChangesLoading} className={`h-12 w-12 ${dropdownOpen || saveChangesLoading ? "opacity-100" : "opacity-0 group-hover:opacity-100"} bg-[#00000030] hover:bg-[#00000060] disabled:bg-[#00000030] transition-all flex justify-center items-center rounded-full text-xl`}>
                    {dropdownOpen ? <BsXLg /> : (saveChangesLoading ? <Loader2 className="animate-spin" /> : <BiSolidPencil />)}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className={`w-96 p-2 dark:bg-zinc-900 dark:text-white dark:border-zinc-800`}
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
          <div className="w-full h-4/6 rounded-b-md dark:text-zinc-300 py-4 px-8 dark:bg-zinc-800">
            <div className="min-h-20 flex flex-col justify-start">
              <div className="py-3">
                <IconPicker activeIcon={currentCollectionItem.icon} defaultLoadedIcons={20} setActiveIcon={handleChangeIcon} />
              </div>
              <div className="flex justify-between items-center w-full">
                <h1 className="text-2xl font-semibold">
                  {currentCollectionItem?.title}
                </h1>
                <CollectionActionButtons />
              </div>
              <div className="text-xs text-zinc-400/90 space-x-2">
                <span>@{currentCollectionItem?.createdBy?.username}</span>
                <span>
                  {currentCollectionItem?.createdAt &&
                    convertMongoDBDate(currentCollectionItem?.createdAt)}
                </span>
              </div>
            </div>
            <div className="pb-4 pt-6 space-y-4">
              <p className="text-sm text-zinc-300/70 line-clamp-2 h-10">{currentCollectionItem?.description}</p>
              <div className="flex space-x-1">
                {tags.length > 0 &&
                  tags.map((tag, index) => (
                    <Tag
                      key={index}
                      text={tag}
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>
        {links.length > 0 ? (
          <>
            <div
              className={`grid ${itemType === "todos" && "grid-cols-1 lg:grid-cols-2"} ${(itemType === "banners" || itemType === "cards") && "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"} gap-2`}
            >
              <ResponsiveDialog
                open={isLinkFormOpen}
                onOpenChange={setIsLinkFormOpen}
                prebuildForm={profile.useFullTypeFormAdder}
                className={`${profile.useFullTypeFormAdder ? "sm:max-w-2xl" : "md:p-0 bg-transparent border-none md:max-w-2xl"}`}
                title="Add New Link"
                trigger={
                  <div className={cn(
                    `flex justify-start items-center text-zinc-300 text-start`,
                    itemType === "todos" && `${links.length % 2 === 0 ? "lg:col-span-2" : "lg:col-span-1"}`,
                    (itemType === "banners" || itemType === "cards") && `bg-zinc-900 hover:bg-zinc-800/80 flex justify-center items-center flex-col space-y-4 cursor-pointer rounded-md w-full`,
                  )}>
                    {itemType === "todos" ? <p className="py-3 px-6 flex justify-normal items-center space-x-2 border-1 border-zinc-800 bg-zinc-900 hover:bg-zinc-800/80 cursor-pointer rounded-md w-full">
                      <span>
                        <FaPlus />
                      </span>
                      <span className="pt-1">Add a new link...</span>
                    </p> :
                      <>
                        <span>
                          <FaPlus />
                        </span>
                        <span className="pt-1">Add a new link...</span>
                      </>
                    }
                  </div>
                }
                showCloseButton={false}
                description="Add a new link to your collection"
              >
                {profile.useFullTypeFormAdder
                  ? <CreateLinkForm
                    afterSubmit={() => setIsLinkFormOpen(false)}
                    collectionTitle={currentCollectionItem?.title}
                  />
                  : <div className="w-full flex-1 overflow-auto py-4">
                    <CreateLinkBar
                      afterSubmit={() => setIsLinkFormOpen(false)}
                      collectionTitle={currentCollectionItem?.title}
                    />
                  </div>
                }
              </ResponsiveDialog>
              {links
                ?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((link) => (
                  <LinkCard
                    key={link._id}
                    id={link._id}
                    title={link.title}
                    color={currentCardColor}
                    image={link.image}
                    type={itemType}
                    link={link.link}
                    isChecked={link.isChecked}
                  />
                ))}
            </div>
            <div className="lg:h-2 h-16"></div>
          </>
        ) : (
          <div className="flex justify-center flex-col gap-4 items-center w-full h-48 lg:h-96">
            <span
              className={`dark:text-zinc-200 text-zinc-800`}
            >
              You don't have any links on this collection.
            </span>
            <ResponsiveDialog
              open={isLinkFormOpen}
              onOpenChange={setIsLinkFormOpen}
              title="Add New Link" description="Add a new link to your collection" trigger={
                <Button
                  className="bg-zinc-800 text-zinc-100 hover:bg-zinc-700/80"
                  onClick={() => {
                    setPrevPath(location);
                  }}
                >
                  Add a Link
                </Button>
              }>
              <CreateLinkForm
                collectionTitle={currentCollectionItem?.title}
              />
            </ResponsiveDialog>
          </div>
        )}
      </div>
    </div>
  );
};

export default Links;
