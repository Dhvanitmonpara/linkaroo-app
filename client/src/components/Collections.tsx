import { fetchedCollectionType } from "@/lib/types";
import useMethodStore from "@/store/MethodStore";
import useProfileStore from "@/store/profileStore";
import { handleAxiosError } from "@/utils/handlerAxiosError";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton"
import useCollectionsStore from "@/store/collectionStore";
import { IoMdAdd } from "react-icons/io";
import CollectionGridCard from "./CollectionGridCard";
import CollectionListCard from "./general/CollectionListCard";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { IoGrid } from "react-icons/io5";
import { FaThList } from "react-icons/fa";

type CollectionsProps = {
  className?: string;
  extraElementClassNames?: string
}
type CollectionView = "list" | "grid";
const tabTriggerClass =
  "bg-zinc-900 text-zinc-300 !h-10 !w-10 data-[state=active]:text-zinc-300 data-[state=active]:bg-zinc-800 h-full";

const Collections = ({ className, extraElementClassNames }: CollectionsProps) => {
  const [loading, setLoading] = useState(true);
  const [collectionView, setCollectionView] = useState<CollectionView>("list");
  const { setCollections, collections, setInbox } = useCollectionsStore();
  const { toggleModal } = useMethodStore();
  const { profile } = useProfileStore();
  const { theme, font } = profile;
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      if (profile._id !== "") {
        try {
          setLoading(true);

          if (!collections.length) {
            const response: AxiosResponse = await axios({
              method: "GET",
              url: `${import.meta.env.VITE_SERVER_API_URL}/collections/u`,
              withCredentials: true,
            });

            if (!response) {
              toast.error("Failed to fetch user's collections.");
              return;
            }
            const allCollections = response.data.data;
            const inboxCollection = allCollections.find((collection: fetchedCollectionType) => collection.isInbox === true);
            const regularCollections = allCollections.filter((collection: fetchedCollectionType) => collection.isInbox === false);

            setCollections(regularCollections);
            setInbox(inboxCollection)
          }
        } catch (error) {
          handleAxiosError(error as AxiosError, navigate);
        } finally {
          setLoading(false);
        }
      }
    })();
  }, [setCollections]);

  if (loading) {
    return (
      <div className={`col-span-2 relative lg:px-0 px-4 space-y-3 overflow-y-scroll no-scrollbar h-[calc(100vh-4.5rem)] md:h-auto lg:h-[calc(100vh-4.5rem)] md:space-x-0 md:space-y-2 md:p-4 !gap-2 md:justify-start md:items-start 2xl:grid-cols-1 ${className}`}>
        <Skeleton className={`w-full h-64`} />
        <Skeleton className={`w-full h-64`} />
        <Skeleton className={`w-full h-64`} />
      </div>
    );
  }

  if (collections.length == 0) {
    return (
      <div className={`dark:text-zinc-200 select-none text-zinc-900 h-[calc(100vh-4.5rem)] lg:h-[calc(100vh-5rem)] w-full flex justify-center items-center ${className}`}>
        No Collections found. Please create a new one.
      </div>
    );
  }

  return (
    <>
      <div className={`col-span-2 relative lg:px-0 px-4 space-y-3 overflow-y-scroll no-scrollbar border-r-[1px] !pr-2 border-zinc-700 h-[calc(100vh-4.5rem)] md:h-auto lg:h-[calc(100vh-4.5rem)] md:space-x-0 md:space-y-2 md:p-4 !gap-2 md:justify-start md:items-start 2xl:grid-cols-1 ${className}`}>
        <div className={`h-2 md:hidden ${extraElementClassNames}`}></div>
        <h2 className="pt-8 pb-3 flex justify-between items-center">
          <span className="text-zinc-100 text-2xl">
            Collections
          </span>
          <div className="flex items-center">
            <Tabs
              defaultValue="list"
              onValueChange={(value) => setCollectionView(value as CollectionView)}
              className="w-fit"
            >
              <TabsList className="bg-zinc-900">
                <TabsTrigger
                  className={tabTriggerClass}
                  value="grid"
                  aria-label="Grid View"
                >
                  <IoGrid />
                </TabsTrigger>
                <TabsTrigger
                  className={tabTriggerClass}
                  value="list"
                  aria-label="List View"
                >
                  <FaThList />
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <IoMdAdd />
          </div>
        </h2>
        {collectionView === "grid" ? collections.map((collections, index) => (
          <CollectionGridCard
            key={index}
            id={collections._id}
            title={collections.title}
            description={collections.description}
            tagname={collections.tags}
            collaborators={collections.collaborators}
            createdBy={collections.createdBy}
            theme={collections.theme}
            font={font}
            isBlackMode={theme == "black" ? true : false}
            toggleModal={toggleModal}
          />
        )) : collections.map((collections, index) => (
          <CollectionListCard
            key={index}
            id={collections._id}
            title={collections.title}
            description={collections.description}
            tagname={collections.tags}
            collaborators={collections.collaborators}
            createdBy={collections.createdBy}
            theme={collections.theme}
            font={font}
            isBlackMode={theme == "black" ? true : false}
            toggleModal={toggleModal}
          />
        ))}
        <div className="lg:h-2 h-16 md:hidden"></div>
      </div>
    </>
  );
};

export default Collections;
